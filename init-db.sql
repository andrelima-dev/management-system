CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "email" character varying(255) NOT NULL UNIQUE,
  "password_hash" character varying(255) NOT NULL,
  "display_name" character varying(120),
  "role" character varying(20) DEFAULT 'member',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "refresh_tokens" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "token_hash" character varying(255) NOT NULL UNIQUE,
  "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "revoked_at" TIMESTAMP WITH TIME ZONE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "user_id" uuid NOT NULL,
  CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id"),
  CONSTRAINT "FK_refresh_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "tasks" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" character varying NOT NULL,
  "description" text,
  "due_date" TIMESTAMP WITH TIME ZONE,
  "priority" character varying(20) DEFAULT 'medium',
  "status" character varying(20) DEFAULT 'todo',
  "created_by_id" uuid NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "task_assignees" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "task_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  CONSTRAINT "PK_task_assignees_id" PRIMARY KEY ("id"),
  CONSTRAINT "FK_task_assignees_task" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "task_history" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "task_id" uuid NOT NULL,
  "performed_by_id" uuid,
  "action" character varying(60) NOT NULL,
  "metadata" jsonb,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "PK_task_history_id" PRIMARY KEY ("id"),
  CONSTRAINT "FK_task_history_task" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "notifications" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "type" character varying(50) NOT NULL,
  "message" text NOT NULL,
  "related_task_id" uuid,
  "is_read" boolean DEFAULT false,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "PK_notifications_id" PRIMARY KEY ("id")
);
