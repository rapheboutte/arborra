// Scheduler for recurring tasks
import cron from 'node-cron';

export const scheduleTask = (cronExpression, taskFunction) => {
  cron.schedule(cronExpression, taskFunction);
};
