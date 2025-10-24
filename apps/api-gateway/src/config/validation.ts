import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  AUTH_SERVICE_URL: Joi.string().uri().required(),
  TASKS_SERVICE_URL: Joi.string().uri().required(),
  NOTIFICATIONS_SERVICE_URL: Joi.string().uri().required(),
  JWT_ACCESS_PUBLIC_KEY: Joi.string().min(32).required(),
  RABBITMQ_URL: Joi.string().uri().required()
});
