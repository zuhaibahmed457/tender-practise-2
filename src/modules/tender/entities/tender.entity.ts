import { Address } from 'src/modules/address/entities/address.entity';
import { Bid } from 'src/modules/bid/entities/bid.entity';
import { Industry } from 'src/modules/industry/entities/industry.entity';
import { Media } from 'src/modules/media/entities/media.entity';
import { ReviewRating } from 'src/modules/review-rating/entities/review-rating.entity';
import { Size } from 'src/modules/sizes/entities/size.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TenderStatus {
  DRAFT = 'draft', // when saved
  PENDING_APPROVAL = 'pending_approval', // when clicked on published
  APPROVED = 'approved', // when admin approves
  REJECTED = 'rejected', // when admin rejects
  IN_ACTIVE = 'in_active', // when admin deactivates (allowed only when the tender is approved)
  IN_TRANSACTION = 'in_transaction', // a bid is being accepted
  IN_PROGRESS = 'in_progress', // when a bid is accepted
  DELIVERED = 'delivered', // WHEN THE TENDER IS DELIVERED
  RECEIVED = 'received', // WHEN THE TENDER IS RECEIVED
}

@Entity('tender')
export class Tender extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  bid_deadline: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  tender_budget_amount: number;

  @ManyToOne(() => Size, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'size_id' })
  size: Size;

  @ManyToMany(() => Industry, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'tender_industries',
    joinColumn: {
      name: 'tender_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'industry_id',
      referencedColumnName: 'id',
    },
  })
  industries: Industry[];

  @Column({
    type: 'enum',
    enum: TenderStatus,
    default: TenderStatus.DRAFT,
  })
  tender_status: TenderStatus;

  @Column()
  transporter_required: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  transportation_budget_amount: number;

  @Column({ default: false })
  is_archived: boolean;

  @Column({ nullable: true })
  quantity: number;

  @ManyToOne(() => Address, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'pickup_address_id' })
  pickup_address: Address;

  @ManyToOne(() => Address, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'dropoff_address_id' })
  dropoff_address: Address;

  @OneToMany(() => Media, (media) => media.tender)
  medias: Media[];

  @OneToOne(() => Media, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'tender_image_id' })
  tender_image: Media;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @OneToMany(()=> ReviewRating, (reviews) => reviews.tender)
  reviews_rating: ReviewRating[]

  @OneToMany(() => Bid, (bid) => bid.tender)
  bids: Bid[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
