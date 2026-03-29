import { pgTable, text, integer, serial, timestamp, pgEnum, uuid } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const rolEnum = pgEnum('rol', ['ADMIN', 'MANAGER', 'ANGAJAT', 'CONTABIL']);

export const utilizatori = pgTable('utilizatori', {
  id: uuid('id').primaryKey(), // ID de la Supabase Auth
  nume: text('nume').notNull(),
  email: text('email').notNull().unique(),
  rol: rolEnum('rol').notNull().default('ANGAJAT'),
});

export const utilizatoriRelations = relations(utilizatori, ({ many }) => ({
  sesiuni: many(sesiuni),
}));

export const companii = pgTable('companii', {
  id: serial('id').primaryKey(),
  nume: text('nume').notNull(),
  cui: text('cui').unique(),
  reg_com: text('reg_com'), // Registrul Comertului
  adresa: text('adresa'),
  iban: text('iban'),
  banca: text('banca'),
  logo_url: text('logo_url'),
  telefon: text('telefon'),
  email: text('email'),
});

export const categorii = pgTable('categorii', {
  id: serial('id').primaryKey(),
  nume: text('nume').notNull().unique(),
  descriere: text('descriere'),
});

export const categoriiRelations = relations(categorii, ({ many }) => ({
  produse: many(produse),
}));

export const unitati = pgTable('unitati', {
  id: serial('id').primaryKey(),
  nume: text('nume').notNull().unique(),
  simbol: text('simbol').notNull().unique(), // ex: Buc, Kg, L
});

export const unitatiRelations = relations(unitati, ({ many }) => ({
  produse: many(produse),
}));

export const produse = pgTable('produse', {
  id: serial('id').primaryKey(),
  nume: text('nume').notNull(),
  descriere: text('descriere'),
  pret: integer('pret').notNull().default(0), // pret in bani (ex: 1050 = 10.50 RON)
  stoc: integer('stoc').notNull().default(0),
  categorie_id: integer('categorie_id').references(() => categorii.id),
  unitate_id: integer('unitate_id').references(() => unitati.id),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const produseRelations = relations(produse, ({ one }) => ({
  categorie: one(categorii, {
    fields: [produse.categorie_id],
    references: [categorii.id],
  }),
  unitate: one(unitati, {
    fields: [produse.unitate_id],
    references: [unitati.id],
  }),
}));

export const sesiuni = pgTable('sesiuni', {
  id: text('id').primaryKey(), // UUID token
  user_id: uuid('user_id').notNull().references(() => utilizatori.id),
  data_expirare: timestamp('data_expirare', { withTimezone: true }).notNull(),
});

export const sesiuniRelations = relations(sesiuni, ({ one }) => ({
  user: one(utilizatori, {
    fields: [sesiuni.user_id],
    references: [utilizatori.id],
  }),
}));

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').references(() => utilizatori.id),
  actiune: text('actiune').notNull(), // ex: 'CREATE', 'UPDATE', 'DELETE'
  tabel: text('tabel').notNull(), // ex: 'produse', 'categorii'
  date_vechi: text('date_vechi'), // JSON format string
  date_noi: text('date_noi'), // JSON format string
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(utilizatori, {
    fields: [auditLogs.user_id],
    references: [utilizatori.id],
  }),
}));
