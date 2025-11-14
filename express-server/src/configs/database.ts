
import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

const logger = {
  info: (message: string) => console.log(`[database] ${message}`),
  error: (message: string, error?: unknown) => console.error(`[database] ${message}`, error),
};

export const connectDatabase = async (): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('Missing MONGO_URI environment variable');
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB_NAME,
      autoIndex: false,
    });

    logger.info('Connected successfully');

    mongoose.connection.on('disconnected', () => {
      logger.info('Disconnected');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('Connection error', error);
    });

    return connection;
  } catch (error) {
    logger.error('Failed to connect', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  try {
    await mongoose.disconnect();
    logger.info('Disconnected cleanly');
  } catch (error) {
    logger.error('Failed to disconnect', error);
    throw error;
  }
};
