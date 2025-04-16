import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Headers,
  Inject,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { GetAllPaymentMethodsDto } from './dto/get-all-payment-methods.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  async create(
    @CurrentUser() currentUser: User,
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<IResponse> {
    const paymentMethod = await this.paymentMethodsService.create(
      currentUser,
      createPaymentMethodDto,
    );

    return {
      message: 'Proceeding to stripe',
      details: paymentMethod,
    };
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async findAll(
    @CurrentUser() currentUser: User,
    @Query() getAllPaymentMethodsDto: GetAllPaymentMethodsDto,
  ): Promise<IResponse> {
    const { items, meta } = await this.paymentMethodsService.findAll(
      currentUser,
      getAllPaymentMethodsDto,
    );

    return {
      message: 'Payment methods fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async findOne(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() CurrentUser: User,
  ) {
    const payment = await this.paymentMethodsService.findOne(
      paramIdDto,
      CurrentUser,
    );

    return {
      message: 'Payment fetched successfully',
      details: payment,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.update(+id, updatePaymentMethodDto);
  }

  @Patch('/mark-default/:id')
  @UseGuards(AuthenticationGuard)
  async markDefault(
    @Param() ParamIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ) {
    const updateDefault = await this.paymentMethodsService.markDefault(
      ParamIdDto,
      currentUser,
    );

    return {
      message: 'Payment method  set to default successfully',
    };
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  async remove(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() CurrentUser: User,
  ) {
    const payment = await this.paymentMethodsService.remove(
      paramIdDto,
      CurrentUser,
    );
    await this.stripe.customers.deleteSource(
      CurrentUser.stripe_customer_id,
      payment.stripe_payment_method_id,
    );
    return {
      message: 'Payment deleted successfully',
    };
  }
}
