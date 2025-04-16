import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Tender } from '../../tender/entities/tender.entity';

export enum BidStatus {
  CREATED = 'created',
  IN_TRANSACTION = 'in_transaction',
  ACCEPTED = 'accepted',
}

@Entity()
export class Bid extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  delivery_date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('integer', { default: 0 })
  priority: number; // used for setting priority of bids

  @Column({
    type: 'enum',
    enum: BidStatus,
    default: BidStatus.CREATED,
  })
  status: BidStatus;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'bidder_id' })
  bidder: User;

  @ManyToOne(() => Tender, (tender) => tender.id)
  @JoinColumn({ name: 'tender_id' })
  tender: Tender;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
