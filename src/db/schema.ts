import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const utilizatori = sqliteTable('utilizatori', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nume: text('nume').notNull(),
  email: text('email').notNull().unique(),
  parola_hash: text('parola_hash').notNull(),
  rol: text('rol', { enum: ['ADMIN', 'MANAGER', 'ANGAJAT', 'CONTABIL'] }).notNull().default('ANGAJAT'),
});

export const companii = sqliteTable('companii', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nume: text('nume').notNull(),
  cui: text('cui').unique(),
  adresa: text('adresa'),
  logo_url: text('logo_url'),
});

export const categorii = sqliteTable('categorii', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nume: text('nume').notNull().unique(),
  descriere: text('descriere'),
});

export const unitati = sqliteTable('unitati', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nume: text('nume').notNull().unique(),
  simbol: text('simbol').notNull().unique(), // ex: Buc, Kg, L
});

export const sesiuni = sqliteTable('sesiuni', {
  id: text('id').primaryKey(), // UUID token
  user_id: integer('user_id').notNull().references(() => utilizatori.id),
  data_expirare: integer('data_expirare', { mode: 'timestamp' }).notNull(),
});
