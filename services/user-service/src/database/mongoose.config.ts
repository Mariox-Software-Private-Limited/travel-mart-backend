import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.LOCAL_MONGO_DB;

if (!uri) {
  console.error('🚨 LOCAL_MONGO_DB is not defined in .env file!');
  process.exit(1);
}

export const mongooseConfig: MongooseModuleOptions = {
  connectionFactory: (connection) => {
    connection.once('open', () => {
      console.log(`✅ Successfully connected to MongoDB at ${uri}`);
    });

    connection.on('error', (error) => {
      console.error(`❌ MongoDB connection error: ${error.message}`);
    });

    connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB connection lost');
    });

    return connection;
  },
};
