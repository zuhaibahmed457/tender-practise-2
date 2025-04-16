import { DataSource, QueryRunner } from "typeorm";
export declare class TransactionManagerService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    executeInTransaction<T>(operation: (queryRunner: QueryRunner) => Promise<T>): Promise<T>;
}
