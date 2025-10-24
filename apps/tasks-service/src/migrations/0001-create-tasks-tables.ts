import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTables0001 implements MigrationInterface {
  name = 'CreateTasksTables0001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(160) NOT NULL,
        "description" text,
        "due_date" TIMESTAMP WITH TIME ZONE,
  "priority" character varying(10) NOT NULL DEFAULT 'medium',
        "status" character varying(20) NOT NULL DEFAULT 'todo',
        "created_by_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      'CREATE INDEX "IDX_tasks_status" ON "tasks" ("status")'
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_tasks_priority" ON "tasks" ("priority")'
    );

    await queryRunner.query(`
      CREATE TABLE "task_assignees" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "task_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        CONSTRAINT "PK_task_assignees_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_task_assignees_task" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_task_assignee_unique" ON "task_assignees" ("task_id", "user_id")'
    );

    await queryRunner.query(`
      CREATE TABLE "task_comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "task_id" uuid NOT NULL,
        "author_id" uuid NOT NULL,
        "content" text NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_task_comments_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_task_comments_task" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_task_comments_task" ON "task_comments" ("task_id")'
    );

    await queryRunner.query(`
      CREATE TABLE "task_history" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "task_id" uuid NOT NULL,
        "action" character varying(60) NOT NULL,
        "metadata" jsonb,
        "performed_by_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_task_history_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_task_history_task" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_task_history_task" ON "task_history" ("task_id")'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_task_history_task"');
    await queryRunner.query('DROP TABLE IF EXISTS "task_history"');

    await queryRunner.query('DROP INDEX IF EXISTS "IDX_task_comments_task"');
    await queryRunner.query('DROP TABLE IF EXISTS "task_comments"');

    await queryRunner.query('DROP INDEX IF EXISTS "IDX_task_assignee_unique"');
    await queryRunner.query('DROP TABLE IF EXISTS "task_assignees"');

    await queryRunner.query('DROP INDEX IF EXISTS "IDX_tasks_priority"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_tasks_status"');
    await queryRunner.query('DROP TABLE IF EXISTS "tasks"');
  }
}
