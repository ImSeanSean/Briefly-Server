// src/db/schema.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

//Account
export const accounts = sqliteTable('accounts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull(),             
    password: text('password').notNull(),     
});  

//List
export const lists = sqliteTable('lists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), 
  account_id: integer('account_id').references(() => accounts.id).notNull(),
});

//Transactions
export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  amount: integer('amount').notNull(),
  list_id: integer('list_id').references(() => lists.id).notNull(),
});
