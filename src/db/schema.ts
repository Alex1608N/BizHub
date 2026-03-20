import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const utilizatori = sqliteTable('utilizatori', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nume: text('nume').notNull(),
  email: text('email').notNull().unique(),
  parola_hash: text('parola_hash').notNull(),
  rol: text('rol', { enum: ['ADMIN', 'MANAGER', 'ANGAJAT', 'CONTABIL'] }).notNull().default('ANGAJAT'),
});

export const utilizatoriRelations = relations(utilizatori, ({ many }) => ({
  sesiuni: many(sesiuni),
}));

export const companii = sqliteTable('companii', {
  id: integer('id').primaryKey({ autoIncrement: true }),
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

export const categorii = sqliteTable('categorii', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nume: text('nume').notNull().unique(),
  descriere: text('descriere'),
});

export const categoriiRelations = relations(categorii, ({ many }) => ({
  produse: many(produse),
}));

export const unitati = sqliteTable('unitati', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nume: text('nume').notNull().unique(),
  simbol: text('simbol').notNull().unique(), // ex: Buc, Kg, L
});

export const unitatiRelations = relations(unitati, ({ many }) => ({
  produse: many(produse),
}));

export const produse = sqliteTable('produse', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nume: text('nume').notNull(),
  descriere: text('descriere'),
  pret: integer('pret').notNull().default(0), // pret in bani (ex: 1050 = 10.50 RON)
  stoc: integer('stoc').notNull().default(0),
  categorie_id: integer('categorie_id').references(() => categorii.id),
  unitate_id: integer('unitate_id').references(() => unitati.id),
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

export const sesiuni = sqliteTable('sesiuni', {
  id: text('id').primaryKey(), // UUID token
  user_id: integer('user_id').notNull().references(() => utilizatori.id),
  data_expirare: integer('data_expirare', { mode: 'timestamp' }).notNull(),
});

export const sesiuniRelations = relations(sesiuni, ({ one }) => ({
  user: one(utilizatori, {
    fields: [sesiuni.user_id],
    references: [utilizatori.id],
  }),
}));

export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => utilizatori.id),
  actiune: text('actiune').notNull(), // ex: 'CREATE', 'UPDATE', 'DELETE'
  tabel: text('tabel').notNull(), // ex: 'produse', 'categorii'
  date_vechi: text('date_vechi'), // JSON format string
  date_noi: text('date_noi'), // JSON format string
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now') * 1000)`),
});

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(utilizatori, {
    fields: [auditLogs.user_id],
    references: [utilizatori.id],
  }),
}));
