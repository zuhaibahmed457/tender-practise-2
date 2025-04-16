import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlatformLabel {
  TENDER_POSTER_FEE = 'tender_poster_fee',
  TENDER_BIDDER_FEE = 'tender_bidder_fee',
}

export enum PlatformFeeType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

@Entity('platform_fees')
export class PlatformFee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PlatformLabel,
  })
  label: PlatformLabel;

  @Column({
    type: 'decimal',
    precision: 13,
    scale: 2,
    default: '0.00',
  })
  fee: number;

  @Column({
    type: 'enum',
    enum: PlatformFeeType,
  })
  type: PlatformFeeType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
