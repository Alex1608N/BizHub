---
id: "1-4-script-de-seed-pentru-admin-si-date-de-baza"
title: "Script de Seed pentru Admin și Date de Bază"
epic: "Epic 1: Fundația Locală & Schema de Date"
status: "ready-for-dev"
author: "BMad Master"
date: "2026-03-11"
---

# Story 1.4: Script de Seed pentru Admin și Date de Bază

## Context
Ca un Manager, vreau ca sistemul să vină cu un cont de Admin și unități de măsură predefinite, astfel încât să pot începe lucrul imediat.

## Cerințe Tehnice
- **Scripting:** Un script de seed (ex: `src/db/seed.ts`) care folosește Drizzle ORM pentru a insera date inițiale.
- **Date Inițiale:** Unități de măsură (Buc, Kg, Litri), un utilizator `admin` cu rol de Manager.
- **Idempotentă:** Scriptul trebuie să poată fi rulat de mai multe ori fără a duplica datele (ex: `onConflictDoNothing()`).

## Criterii de Acceptare
1. [ ] Scriptul de seed poate fi rulat cu succes prin `npm run db:seed`.
2. [ ] Utilizatorul `admin` este creat cu parola implicită hash-uită corect.
3. [ ] Unitățile de măsură (Buc, Kg, Litri) sunt prezente în tabela `unitati`.
4. [ ] Datele sunt vizibile în baza de date după rularea scriptului.

## Instrucțiuni pentru Dev Agent
1. Creează fișierul `src/db/seed.ts`.
2. Implementează inserarea pentru `unitati` și `utilizatori`.
3. Folosește `bcrypt` pentru a seta o parolă inițială pentru utilizatorul admin.
4. Adaugă scriptul în `package.json`.
5. Rulează și verifică datele în SQLite folosind un tool de vizualizare sau interfața de administrare dacă există.
