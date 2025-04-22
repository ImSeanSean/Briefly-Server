import { db } from './client';
import { sql } from 'drizzle-orm'; // use drizzle-orm's sql, not 'bun'

async function setupDatabase() {
  // Create `accounts` table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  // Create `lists` table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      account_id INTEGER NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );
  `);

  // Create `transactions` table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      list_id INTEGER NOT NULL,
      FOREIGN KEY (list_id) REFERENCES lists(id)
    );
  `);

  console.log('✅ Database tables created successfully!');
}

setupDatabase().catch(console.error);
