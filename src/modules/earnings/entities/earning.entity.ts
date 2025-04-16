import { Bid } from 'src/modules/bid/entities/bid.entity';
import { Tender } from 'src/modules/tender/entities/tender.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EarningsStatus {
  PAID = 'PAID',
  REVERSED = 'REVERSED',
}

@Entity('earning')
export class Earning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_earned: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  platform_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bid_amount: number;

  @Column({ nullable: true })
  stripe_transfer_payment_intent_id?: string;

  @ManyToOne(() => Transaction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Bid)
  @JoinColumn({ name: 'bid_id' })
  bid: Bid;

  @ManyToOne(() => Tender)
  @JoinColumn({ name: 'tender_id' })
  tender: Tender;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: EarningsStatus,
    default: EarningsStatus.PAID,
  })
  status: EarningsStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
