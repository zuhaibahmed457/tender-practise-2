import { Tender } from 'src/modules/tender/entities/tender.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('review_rating')
export class ReviewRating extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rating: number;

  @Column('text')
  review: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.given_ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'given_by_id' })
  given_by: User;

  @ManyToOne(() => User, (user) => user.received_ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'received_by_id' })
  given_to: User;

  @ManyToOne(() => Tender, (tender) => tender.reviews_rating, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tender_id' })
  tender: Tender;
}
