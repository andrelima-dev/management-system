import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateRefreshTokensTable1700000002000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
