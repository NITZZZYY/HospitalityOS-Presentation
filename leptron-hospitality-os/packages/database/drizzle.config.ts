import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://leptron:leptron_secure_password_2024@localhost:5432/leptron_hospitality_os',
  },
  verbose: true,
  strict: true,
});
