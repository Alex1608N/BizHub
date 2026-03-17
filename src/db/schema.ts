import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

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
  adresa: text('adresa'),
  logo_url: text('logo_url'),
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

export const audit_logs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tabel_afectat: text('tabel_afectat').notNull(),
  coloana: text('coloana'),
  valoare_veche: text('valoare_veche'),
  valoare_noua: text('valoare_noua'),
  utilizator_id: integer('utilizator_id').references(() => utilizatori.id),
  data_creare: integer('data_creare', { mode: 'timestamp' }).notNull().default(new Date()),
  motiv: text('motiv'),
});

export const auditLogsRelations = relations(audit_logs, ({ one }) => ({
  user: one(utilizatori, {
    fields: [audit_logs.utilizator_id],
    references: [utilizatori.id],
  }),
}));
