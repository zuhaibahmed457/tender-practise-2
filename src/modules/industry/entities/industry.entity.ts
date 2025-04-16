import { UserIndustries } from 'src/modules/users/entities/user-industries.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum IndustryStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
}

@Entity('industry')
export class Industry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: IndustryStatus,
    default: IndustryStatus.ACTIVE,
  })
  status: IndustryStatus;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => UserIndustries, (userIndustries) => userIndustries.industry)
  user_industries: UserIndustries;
}
