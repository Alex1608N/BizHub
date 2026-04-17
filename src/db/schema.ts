import { pgTable, text, integer, serial, timestamp, pgEnum, uuid, jsonb, index } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const rolEnum = pgEnum('rol', ['ADMIN', 'MANAGER', 'ANGAJAT', 'CONTABIL']);

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

export const companiiRelations = relations(companii, ({ many }) => ({
  utilizatori: many(utilizatori),
  produse: many(produse),
  categorii: many(categorii),
  unitati: many(unitati),
}));

export const utilizatori = pgTable('utilizatori', {
  id: uuid('id').primaryKey(), // ID de la Supabase Auth
  nume: text('nume').notNull(),
  email: text('email').notNull().unique(),
  rol: rolEnum('rol').notNull().default('ANGAJAT'),
  companie_id: integer('companie_id').references(() => companii.id, { onDelete: 'cascade' }),
}, (table) => ({
  companieIdx: index('utilizatori_companie_idx').on(table.companie_id),
}));

export const utilizatoriRelations = relations(utilizatori, ({ one }) => ({
  companie: one(companii, {
    fields: [utilizatori.companie_id],
    references: [companii.id],
  }),
}));

export const categorii = pgTable('categorii', {
  id: serial('id').primaryKey(),
  nume: text('nume').notNull(),
  descriere: text('descriere'),
  companie_id: integer('companie_id').references(() => companii.id, { onDelete: 'cascade' }),
}, (table) => ({
  companieIdx: index('categorii_companie_idx').on(table.companie_id),
}));

export const categoriiRelations = relations(categorii, ({ many, one }) => ({
  produse: many(produse),
  companie: one(companii, {
    fields: [categorii.companie_id],
    references: [companii.id],
  }),
}));

export const unitati = pgTable('unitati', {
  id: serial('id').primaryKey(),
  nume: text('nume').notNull(),
  simbol: text('simbol').notNull(), // ex: Buc, Kg, L
  companie_id: integer('companie_id').references(() => companii.id, { onDelete: 'cascade' }),
}, (table) => ({
  companieIdx: index('unitati_companie_idx').on(table.companie_id),
}));

export const unitatiRelations = relations(unitati, ({ many, one }) => ({
  produse: many(produse),
  companie: one(companii, {
    fields: [unitati.companie_id],
    references: [companii.id],
  }),
}));

export const produse = pgTable('produse', {
  id: serial('id').primaryKey(),
  nume: text('nume').notNull(),
  descriere: text('descriere'),
  pret: integer('pret').notNull().default(0), // pret in bani (ex: 1050 = 10.50 RON)
  stoc: integer('stoc').notNull().default(0),
  categorie_id: integer('categorie_id').references(() => categorii.id),
  unitate_id: integer('unitate_id').references(() => unitati.id),
  companie_id: integer('companie_id').references(() => companii.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  companieIdx: index('produse_companie_idx').on(table.companie_id),
  categorieIdx: index('produse_categorie_idx').on(table.categorie_id),
}));

export const produseRelations = relations(produse, ({ one }) => ({
  categorie: one(categorii, {
    fields: [produse.categorie_id],
    references: [categorii.id],
  }),
  unitate: one(unitati, {
    fields: [produse.unitate_id],
    references: [unitati.id],
  }),
  companie: one(companii, {
    fields: [produse.companie_id],
    references: [companii.id],
  }),
}));

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').references(() => utilizatori.id),
  companie_id: integer('companie_id').references(() => companii.id, { onDelete: 'cascade' }),
  actiune: text('actiune').notNull(), // ex: 'CREATE', 'UPDATE', 'DELETE'
  tabel: text('tabel').notNull(), // ex: 'produse', 'categorii'
  date_vechi: jsonb('date_vechi'), 
  date_noi: jsonb('date_noi'), 
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  companieIdx: index('audit_logs_companie_idx').on(table.companie_id),
  userIdx: index('audit_logs_user_idx').on(table.user_id),
  timestampIdx: index('audit_logs_timestamp_idx').on(table.timestamp),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(utilizatori, {
    fields: [auditLogs.user_id],
    references: [utilizatori.id],
  }),
  companie: one(companii, {
    fields: [auditLogs.companie_id],
    references: [companii.id],
  }),
}));

export const invitatii = pgTable('invitatii', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  companie_id: integer('companie_id').notNull().references(() => companii.id, { onDelete: 'cascade' }),
  rol: rolEnum('rol').notNull().default('ANGAJAT'),
  status: text('status').notNull().default('PENDING'), // PENDING, ACCEPTED, REJECTED
  inviter_id: uuid('inviter_id').notNull().references(() => utilizatori.id),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  companieIdx: index('invitatii_companie_idx').on(table.companie_id),
  emailIdx: index('invitatii_email_idx').on(table.email),
}));

export const invitatiiRelations = relations(invitatii, ({ one }) => ({
  companie: one(companii, {
    fields: [invitatii.companie_id],
    references: [companii.id],
  }),
  inviter: one(utilizatori, {
    fields: [invitatii.inviter_id],
    references: [utilizatori.id],
  }),
}));

export const pontaj = pgTable('pontaj', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').references(() => utilizatori.id).notNull(),
  companie_id: integer('companie_id').references(() => companii.id, { onDelete: 'cascade' }).notNull(),
  tip: text('tip').notNull(), // 'START', 'END', 'PAUZA_START', 'PAUZA_STOP'
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userTimestampIdx: index('pontaj_user_timestamp_idx').on(table.user_id, table.timestamp),
}));

export const pontajRelations = relations(pontaj, ({ one }) => ({
  user: one(utilizatori, {
    fields: [pontaj.user_id],
    references: [utilizatori.id],
  }),
  companie: one(companii, {
    fields: [pontaj.companie_id],
    references: [companii.id],
  }),
}));

export const vanzari = pgTable('vanzari', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').notNull().references(() => utilizatori.id),
  companie_id: integer('companie_id').notNull().references(() => companii.id, { onDelete: 'cascade' }),
  total: integer('total').notNull().default(0), // Totalul vanzarii in bani
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  companieIdx: index('vanzari_companie_idx').on(table.companie_id),
}));

export const vanzariRelations = relations(vanzari, ({ one, many }) => ({
  user: one(utilizatori, {
    fields: [vanzari.user_id],
    references: [utilizatori.id],
  }),
  companie: one(companii, {
    fields: [vanzari.companie_id],
    references: [companii.id],
  }),
  detalii: many(vanzariDetalii),
}));

export const vanzariDetalii = pgTable('vanzari_detalii', {
  id: serial('id').primaryKey(),
  vanzare_id: integer('vanzare_id').notNull().references(() => vanzari.id),
  produs_id: integer('produs_id').notNull().references(() => produse.id),
  cantitate: integer('cantitate').notNull(),
  pret_unitar: integer('pret_unitar').notNull(), // Pretul la momentul vanzarii
}, (table) => ({
  vanzareIdx: index('vanzari_detalii_vanzare_idx').on(table.vanzare_id),
}));

export const vanzariDetaliiRelations = relations(vanzariDetalii, ({ one }) => ({
  vanzare: one(vanzari, {
    fields: [vanzariDetalii.vanzare_id],
    references: [vanzari.id],
  }),
  produs: one(produse, {
    fields: [vanzariDetalii.produs_id],
    references: [produse.id],
  }),
}));
