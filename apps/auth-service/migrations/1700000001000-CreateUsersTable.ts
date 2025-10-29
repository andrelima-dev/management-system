import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsersTable1700000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
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
      })
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'users_email_unique',
        columnNames: ['email'],
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'users_email_unique');
    await queryRunner.dropTable('users');
  }
}
