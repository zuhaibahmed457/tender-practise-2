import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

export enum PaymentMethodType {
  CARD = 'card',
  BANK_ACCOUNT = 'us_bank_account',
}

@Entity('payment_method')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  stripe_payment_method_id: string; // Used for both cards & bank accounts

  @Column({ type: 'enum', enum: PaymentMethodType })
  type: PaymentMethodType;

  @Column({ nullable: true })
  last4: string; // Last 4 digits of card/bank account

  @Column({ nullable: true })
  brand: string; // Only for credit cards (Visa, MasterCard, etc.)

  @Column({ nullable: true })
  expiry_month: number; // Only for cards

  @Column({ nullable: true })
  expiry_year: number; // Only for cards

  @Column({ nullable: true })
  bank_name: string; // Only for bank accounts

  @Column({ default: false })
  is_default: boolean;

  @CreateDateColumn()
  created_at: Date;
}
