import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { User, UserPaymentMethodStatus } from '../users/entities/user.entity';
import {
  PaymentMethod,
  PaymentMethodType,
} from './entities/payment-method.entity';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllPaymentMethodsDto } from './dto/get-all-payment-methods.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,

    private readonly transactionManagerService: TransactionManagerService,
  ) {}

  async create(
    currentUser: User,
    createPaymentMethodDto: CreatePaymentMethodDto,
  ) {
    if (!currentUser.stripe_customer_id) {
      const stripeCustomer = await this.stripe.customers.create({
        email: currentUser.email,
        name: `${currentUser.first_name} ${currentUser.last_name}`,
      });

      currentUser.stripe_customer_id = stripeCustomer.id;

      await this.usersRepository.save(currentUser);
    }

    const setupIntent = await this.stripe.setupIntents.create({
      customer: currentUser.stripe_customer_id,
      payment_method_types: createPaymentMethodDto.payment_method_types,
    });

    return { setup_intent_client_secret: setupIntent.client_secret };
  }

  async findAll(
    currentUser: User,
    getAllPaymentMethodsDto: GetAllPaymentMethodsDto,
  ) {
    const { page, per_page } = getAllPaymentMethodsDto;

    const query = this.paymentMethodRepository
      .createQueryBuilder('payment_method')
      .where('payment_method.user_id = :id', { id: currentUser.id })
      .orderBy('created_at', 'DESC');

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate<PaymentMethod>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }
    return paymentMethod;
  }

  update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return `This action updates a #${id} paymentMethod`;
  }

  async markDefault({ id }: ParamIdDto, currentUser: User) {
    const payment = await this.paymentMethodRepository.findOne({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!payment) throw new NotFoundException('Payment method not found');

    await this.paymentMethodRepository
      .createQueryBuilder()
      .update(PaymentMethod)
      .set({ is_default: false })
      .where('payment_method.user_id = :userId', { userId: currentUser.id })
      .andWhere('payment_method.id != :id', { id })
      .execute();

    payment.is_default = true;

    await this.paymentMethodRepository.save(payment);

    return payment;
  }

  async remove({ id }: ParamIdDto, currentUser: User) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!paymentMethod) throw new NotFoundException('Payment method not found');

    if (paymentMethod.is_default)
      throw new BadRequestException("you can't delete default payment method");

    return await this.paymentMethodRepository.remove(paymentMethod);
  }

  async savePaymentMethod(paymentMethod: Stripe.PaymentMethod) {
    await this.transactionManagerService.executeInTransaction(
      async (queryRunner) => {
        const user = await queryRunner.manager.findOne(User, {
          where: {
            stripe_customer_id: paymentMethod.customer as string,
          },
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        const newPaymentMethod = queryRunner.manager.create(PaymentMethod, {
          user: user,
          stripe_payment_method_id: paymentMethod.id,
          type: paymentMethod.type as PaymentMethodType,
          last4:
            paymentMethod?.card?.last4 || paymentMethod?.us_bank_account?.last4,
          brand: paymentMethod?.card?.brand,
          expiry_month: paymentMethod?.card?.exp_month,
          expiry_year: paymentMethod?.card?.exp_year,
          bank_name: paymentMethod?.us_bank_account?.bank_name,
        });

        const paymentMethodExists = await queryRunner.manager.findOne(
          PaymentMethod,
          {
            where: {
              user: {
                id: user.id,
              },
            },
          },
        );

        if (!paymentMethodExists) {
          newPaymentMethod.is_default = true;
        }

        user.payment_method_status = UserPaymentMethodStatus.PROVIDED;
        await queryRunner.manager.save(user);

        await queryRunner.manager.save(newPaymentMethod);

        return newPaymentMethod;
      },
    );
  }
}
