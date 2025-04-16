import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { GetAllTransactionDto } from './dto/get-all-transaction.dto';
export declare class TransactionsService {
    private readonly transactionRepository;
    create(createTransactionDto: CreateTransactionDto): string;
    findAll(getAllTransactionDto: GetAllTransactionDto, currentUser: User): Promise<import("nestjs-typeorm-paginate").Pagination<Transaction, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne(id: number): string;
    update(id: number, updateTransactionDto: UpdateTransactionDto): string;
    remove(id: number): string;
    getTotalSpending(currentUser: User, organization_id?: string): Promise<{
        total_spending: number;
    }>;
}
