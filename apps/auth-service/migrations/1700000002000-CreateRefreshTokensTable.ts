import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRefreshTokensTable1700000002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
      })
    );

    await queryRunner.createIndex(
      'refresh_tokens',
      new TableIndex({
        name: 'refresh_tokens_token_hash_idx',
        columnNames: ['token_hash'],
        isUnique: true
      })
    );

    await queryRunner.createForeignKey(
      'refresh_tokens',
      new TableForeignKey({
        name: 'FK_refresh_tokens_user',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('refresh_tokens', 'FK_refresh_tokens_user');
    await queryRunner.dropIndex('refresh_tokens', 'refresh_tokens_token_hash_idx');
    await queryRunner.dropTable('refresh_tokens');
  }
}
