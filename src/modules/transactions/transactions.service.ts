import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { GetAllTransactionDto } from './dto/get-all-transaction.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class TransactionsService {
  @InjectRepository(Transaction)
  private readonly transactionRepository: Repository<Transaction>;

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  async findAll(getAllTransactionDto: GetAllTransactionDto, currentUser: User) {
    const {
      status,
      organization_id,
      end_date,
      page,
      per_page,
      search,
      start_date,
      role,
      price_max,
      price_min,
    } = getAllTransactionDto;

    if (
      [UserRole.ORGANIZATION, UserRole.TRANSPORTER].includes(
        currentUser.role,
      ) &&
      organization_id &&
      organization_id !== currentUser.id
    ) {
      throw new ForbiddenException(
        'You are not allowed to access transactions of other users.',
      );
    }

    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .leftJoinAndSelect('transaction.bid', 'bid')
      .leftJoinAndSelect('bid.tender', 'tender')
      .leftJoinAndSelect('bid.bidder', 'bidder')
      .where('user.role NOT IN (:...roles)', {
        roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      });

    if (
      [UserRole.ORGANIZATION, UserRole.TRANSPORTER].includes(currentUser.role)
    ) {
      query.andWhere('user.id = :currentUserId', {
        currentUserId: currentUser.id,
      });
    }

    if (organization_id) {
      query.andWhere('transaction.user_id = :userId', {
        userId: organization_id,
      });
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (status) {
      query.andWhere('transaction.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        `(user.first_name || ' ' || user.last_name ILIKE :search OR user.email ILIKE :search OR tender.title ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    if (price_min) {
      query.andWhere('transaction.bid_amount >= :price_min', {
        price_min,
      });
    }

    if (price_max) {
      query.andWhere('transaction.bid_amount <= :price_max', {
        price_max,
      });
    }

    if (start_date) {
      query.andWhere('transaction.created_at >= :start_date', { start_date });
    }

    if (end_date) {
      query.andWhere('transaction.created_at <= :end_date', { end_date });
    }

    query
      .distinctOn(['transaction.created_at'])
      .orderBy('transaction.created_at', 'DESC');

    const paginationOption: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate<Transaction>(query, paginationOption);
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  async getTotalSpending(currentUser: User, organization_id?: string) {
    if (
      currentUser.role === UserRole.ORGANIZATION &&
      (!organization_id || organization_id !== currentUser.id)
    ) {
      throw new ForbiddenException(
        'You do not have permission to view spending for this organization',
      );
    }

    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.total_amount_charged)', 'total_spending')
      .where('transaction.status = :status', {
        status: TransactionStatus.SUCCESS,
      });

    if (organization_id) {
      query.andWhere('transaction.user_id = :organization_id', {
        organization_id,
      });
    }

    const result = await query.getRawOne();

    return {
      total_spending: parseFloat(result.total_spending || 0),
    };
  }
}
