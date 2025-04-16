import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Industry } from 'src/modules/industry/entities/industry.entity';

@Entity('user_industries')
export class UserIndustries extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.user_industries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Industry, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;

  @CreateDateColumn()
  created_at: Date;
}
