/**
 * Configuração centralizada para RabbitMQ
 * Utilisada por todos os microserviços
 */

export const RABBITMQ_CONFIG = {
  // URL do RabbitMQ
  url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  
  // Prefixo para todas as filas
  queuePrefix: 'jungle',
};

/**
 * Obtém o nome completo da fila com prefixo
 */
export const getQueueName = (serviceName: string, pattern: string): string => {
  return `${RABBITMQ_CONFIG.queuePrefix}.${serviceName}.${pattern}`;
};

/**
 * Configuração de tentativas de reconexão
 */
export const RABBITMQ_RETRY_CONFIG = {
  maxAttempts: 5,
  delay: 3000, // 3 segundos
  multiplier: 1.5,
} as const;
