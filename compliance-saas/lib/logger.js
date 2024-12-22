// Logging for audit trails
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'audit.log' }),
  ],
});

export const logChange = (message) => {
  logger.info(message);
};
