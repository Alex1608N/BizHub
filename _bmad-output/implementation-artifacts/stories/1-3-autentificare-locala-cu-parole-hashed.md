---
id: "1-3-autentificare-locala-cu-parole-hashed"
title: "Autentificare Locală cu Parole Hashed"
epic: "Epic 1: Fundația Locală & Schema de Date"
status: "ready-for-dev"
author: "BMad Master"
date: "2026-03-11"
---

# Story 1.3: Autentificare Locală cu Parole Hashed

## Context
Ca un Utilizator, vreau să mă pot loga folosind un nume de utilizator și o parolă stocate securizat local, astfel încât identitatea mea să fie verificată.

## Cerințe Tehnice
- **Securitate:** Hash-uirea parolelor folosind `bcrypt` sau `argon2`.
- **Sesiuni:** Gestionarea sesiunilor local (ex: NextAuth.js cu adaptor Drizzle sau implementare custom de cookie-uri securizate).
- **Middleware:** Protejarea rutelor private prin Middleware în Next.js.
- **Formulare:** Pagina de Login creată cu Shadcn UI și Zod pentru validare.

## Criterii de Acceptare
1. [ ] Pagina de login este accesibilă la `/login`.
2. [ ] Parola introdusă este verificată corect față de hash-ul din baza de date SQLite.
3. [ ] Utilizatorul este redirecționat către dashboard la logarea cu succes.
4. [ ] Rutele protejate nu sunt accesibile fără o sesiune validă.
5. [ ] Sesiunea este stocată securizat local.

## Instrucțiuni pentru Dev Agent
1. Implementează logica de hashing în `src/lib/auth-utils.ts`.
2. Configurează un sistem de autentificare (NextAuth.js este recomandat pentru simplitate).
3. Creează pagina de login utilizând componentele Shadcn UI.
4. Adaugă `middleware.ts` pentru a restricționa accesul la `/dashboard` și alte rute private.
5. Testează fluxul de login cu un utilizator existent în DB.
