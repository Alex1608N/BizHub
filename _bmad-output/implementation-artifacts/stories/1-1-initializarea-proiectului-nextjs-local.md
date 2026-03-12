---
id: "1-1-initializarea-proiectului-nextjs-local"
title: "Inițializarea Proiectului Next.js Local"
epic: "Epic 1: Fundația Locală & Schema de Date"
status: "done"
author: "BMad Master"
date: "2026-03-06"
---

# Story 1.1: Inițializarea Proiectului Next.js Local

## Context
Ca un Dezvoltator, vreau să inițializez un proiect curat Next.js 15 cu Tailwind CSS și Drizzle ORM, astfel încât să am o fundație solidă local-first pentru aplicație.

## Cerințe Tehnice
- **Framework:** Next.js 15 (App Router, TypeScript).
- **Styling:** Tailwind CSS + Shadcn UI (configurat pentru componente locale).
- **Bază de Date:** SQLite (via `better-sqlite3` sau `libsql` local).
- **ORM:** Drizzle ORM.
- **Configurare:** Fișier local `practica.db` în rădăcina proiectului.

## Criterii de Acceptare
1. [x] Proiectul Next.js 15 este creat și rulează local.
2. [x] Tailwind CSS este funcțional și configurat corect.
3. [x] Drizzle ORM este instalat și conectat la `practica.db`.
4. [x] Există un fișier de configurare `drizzle.config.ts`.
5. [x] Comanda `npm run dev` pornește aplicația fără erori.

## Instrucțiuni pentru Dev Agent
1. Rulează `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes`.
2. Instalează pachetele necesare: `npm install drizzle-orm better-sqlite3 zod`.
3. Instalează pachetele de dezvoltare: `npm install -D drizzle-kit @types/better-sqlite3`.
4. Creează folderul `src/db` și configurează conexiunea SQLite.
5. Adaugă scripturile de migrare în `package.json`.
