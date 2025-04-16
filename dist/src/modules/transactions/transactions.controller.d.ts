import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { User } from '../users/entities/user.entity';
import { GetAllTransactionDto } from './dto/get-all-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto): string;
    findAll(getAllTransactionDto: GetAllTransactionDto, currentUser: User): Promise<IResponse>;
    findOne(id: string): string;
    update(id: string, updateTransactionDto: UpdateTransactionDto): string;
    remove(id: string): string;
}
