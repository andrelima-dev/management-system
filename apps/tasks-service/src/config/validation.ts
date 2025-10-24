import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3002),
  DATABASE_URL: Joi.string().uri().required(),
  RABBITMQ_URL: Joi.string().uri().required(),
  RABBITMQ_TASKS_EXCHANGE: Joi.string().default('tasks.events')
});
