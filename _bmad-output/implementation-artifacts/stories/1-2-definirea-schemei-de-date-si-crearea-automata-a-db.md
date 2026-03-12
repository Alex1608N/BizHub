---
id: "1-2-definirea-schemei-de-date-si-crearea-automata-a-db"
title: "Definirea Schemei de Date și Crearea Automată a DB"
epic: "Epic 1: Fundația Locală & Schema de Date"
status: "completed"
author: "BMad Master"
date: "2026-03-11"
---

# Story 1.2: Definirea Schemei de Date și Crearea Automată a DB

## Context
Ca un Administrator de Sistem, vreau ca aplicația să creeze și să migreze automat fișierul SQLite la prima rulare, astfel încât să nu fie necesari pași manuali de configurare.

## Cerințe Tehnice
- **ORM:** Drizzle ORM cu schema definition în `src/db/schema.ts`.
- **Bază de Date:** SQLite (via `better-sqlite3`).
- **Tabele Core:** `utilizatori`, `companii`, `categorii`, `unitati`, `sesiuni`.
- **Migrări:** Generare automată a migrărilor prin `drizzle-kit generate` și execuție prin `drizzle-kit push` sau script de migrare.

## Criterii de Acceptare
1. [x] Definițiile de schemă Drizzle pentru toate tabelele core sunt prezente în `src/db/schema.ts`.
2. [x] Fișierul `practica.db` este creat automat la pornire dacă nu există.
3. [x] Toate tabelele sunt create prin migrare automată la prima rulare a aplicației sau a unui script de setup.
4. [x] Conexiunea la DB este testată și funcțională.

## Instrucțiuni pentru Dev Agent
1. Creează `src/db/schema.ts` cu tabelele: `utilizatori` (id, nume, parola_hash, rol), `companii`, `categorii`, `unitati`, `sesiuni`.
2. Configurează `drizzle.config.ts` pentru a puncta către schema și fișierul SQLite local.
3. Implementează un script de migrare (ex: `src/db/migrate.ts`) care să fie apelat la pornire sau prin script NPM.
4. Testează crearea tabelelor prin rularea scriptului.
