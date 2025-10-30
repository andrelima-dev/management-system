"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRefreshTokensTable1700000002000 = void 0;
const typeorm_1 = require("typeorm");
class CreateRefreshTokensTable1700000002000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'refresh_tokens',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'token_hash',
                    type: 'varchar',
                    length: '255',
                    isNullable: false
                },
                {
                    name: 'expires_at',
                    type: 'TIMESTAMP WITH TIME ZONE',
                    isNullable: false
                },
                {
                    name: 'revoked_at',
                    type: 'TIMESTAMP WITH TIME ZONE',
                    isNullable: true
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false
                },
                {
                    name: 'created_at',
                    type: 'TIMESTAMP WITH TIME ZONE',
                    isNullable: false,
                    default: 'now()'
                }
            ]
        }));
        await queryRunner.createIndex('refresh_tokens', new typeorm_1.TableIndex({
            name: 'refresh_tokens_token_hash_idx',
            columnNames: ['token_hash'],
            isUnique: true
        }));
        await queryRunner.createForeignKey('refresh_tokens', new typeorm_1.TableForeignKey({
            name: 'FK_refresh_tokens_user',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE'
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey('refresh_tokens', 'FK_refresh_tokens_user');
        await queryRunner.dropIndex('refresh_tokens', 'refresh_tokens_token_hash_idx');
        await queryRunner.dropTable('refresh_tokens');
    }
}
exports.CreateRefreshTokensTable1700000002000 = CreateRefreshTokensTable1700000002000;
//# sourceMappingURL=1700000002000-CreateRefreshTokensTable.js.map