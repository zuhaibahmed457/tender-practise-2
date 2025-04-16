import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CompanyTypeStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
}

@Entity('company_type')
export class CompanyType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CompanyTypeStatus,
    default: CompanyTypeStatus.ACTIVE,
  })
  status: CompanyTypeStatus;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
