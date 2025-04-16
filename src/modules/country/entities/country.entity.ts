import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum CountryStatuses {
    ACTIVE = 'active',
    IN_ACTIVE = 'inactive',
}

@Entity()
export class Country extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 3, unique: true })
    code: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 10 })
    country_code: string;

    @Column({ type: 'enum', enum: CountryStatuses, default: CountryStatuses.IN_ACTIVE })
    status: CountryStatuses;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
