import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { GetAllTransactionDto } from './dto/get-all-transaction.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async findAll(
    @Query() getAllTransactionDto: GetAllTransactionDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.transactionsService.findAll(
      getAllTransactionDto,
      currentUser,
    );
    return {
      message: 'All Transactions fetch successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
