# Story 2-1: Managementul catalogului (CRUD)

**Status:** Done
**Epic:** Epic 2: Gestiunea Catalogului și Stocului
**Priority:** High

## Description
Ca manager, doresc să pot vizualiza, adăuga, edita și șterge produse din catalog pentru a menține baza de date la zi. Catalogul trebuie să includă informații despre nume, descriere, preț, stoc, categorie și unitatea de măsură.

## Acceptance Criteria
1. [x] Pagina de catalog afișează o listă (tabel) cu toate produsele existente.
2. [x] Posibilitatea de a adăuga un produs nou printr-un formular (Nume, Descriere, Preț, Categorie, Unitate).
3. [x] Posibilitatea de a edita datele unui produs existent.
4. [x] Posibilitatea de a șterge un produs (cu confirmare).
5. [x] Validare: Numele și prețul sunt obligatorii. Prețul este stocat ca întreg (bani/subdiviziuni) pentru precizie.
6. [x] Integrare cu Drizzle ORM și SQLite pentru toate operațiunile.

## Technical Tasks
1. Crearea rutei `src/app/(dashboard)/catalog/page.tsx` pentru listare.
2. Implementarea Server Actions în `src/app/actions/products.ts` pentru operațiunile CRUD.
3. Crearea componentelor UI (Dialogs/Forms) folosind Shadcn UI (dacă este disponibil) sau componente custom Tailwind.
4. Testarea manuală a fluxului CRUD.
