import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://leptron:leptron_secure_password_2024@localhost:5432/leptron_hospitality_os';

async function runMigrations() {
  console.log('Running migrations...');
  
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);
  
  await migrate(db, { migrationsFolder: './src/migrations' });
  
  console.log('Migrations completed successfully!');
  
  await client.end();
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
