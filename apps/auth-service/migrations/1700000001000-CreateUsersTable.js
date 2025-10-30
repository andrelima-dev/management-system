"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersTable1700000001000 = void 0;
const typeorm_1 = require("typeorm");
class CreateUsersTable1700000001000 {
    async up(queryRunner) {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '255',
                    isNullable: false
                },
                {
                    name: 'password_hash',
                    type: 'varchar',
                    length: '255',
                    isNullable: false
                },
                {
                    name: 'display_name',
                    type: 'varchar',
                    length: '120',
                    isNullable: false
                },
                {
                    name: 'role',
                    type: 'varchar',
                    length: '20',
                    isNullable: false,
                    default: "'member'"
                },
                {
                    name: 'created_at',
                    type: 'TIMESTAMP WITH TIME ZONE',
                    isNullable: false,
                    default: 'now()'
                },
                {
                    name: 'updated_at',
                    type: 'TIMESTAMP WITH TIME ZONE',
                    isNullable: false,
                    default: 'now()'
                }
            ]
        }));
        await queryRunner.createIndex('users', new typeorm_1.TableIndex({
            name: 'users_email_unique',
            columnNames: ['email'],
            isUnique: true
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex('users', 'users_email_unique');
        await queryRunner.dropTable('users');
    }
}
exports.CreateUsersTable1700000001000 = CreateUsersTable1700000001000;
//# sourceMappingURL=1700000001000-CreateUsersTable.js.map