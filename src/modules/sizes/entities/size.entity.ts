import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SizeStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
}

@Entity('size')
export class Size {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  range: string;

  @Column({
    type: 'enum',
    enum: SizeStatus,
    default: SizeStatus.ACTIVE,
  })
  status: SizeStatus;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
