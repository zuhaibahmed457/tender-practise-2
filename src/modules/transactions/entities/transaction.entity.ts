import { extend } from 'dayjs';
import { Bid } from 'src/modules/bid/entities/bid.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  DISPUTED = 'disputed',
  REFUNDED = 'refunded',
}

@Entity('transaction')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount_charged: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bid_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  platform_amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ nullable: true })
  failure_reason?: string;

  @Column({ nullable: true })
  stripe_payment_intent_id?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Bid)
  @JoinColumn({ name: 'bid_id' })
  bid: Bid;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
