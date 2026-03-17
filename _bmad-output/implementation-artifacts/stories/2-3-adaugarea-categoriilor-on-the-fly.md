# Story 2-3: Adăugarea categoriilor "on-the-fly"

**Status:** Backlog
**Epic:** Epic 2: Gestiunea Catalogului și Stocului
**Priority:** Medium

## Description
Ca utilizator, doresc să pot adăuga o categorie nouă direct din formularul de creare a unui produs, fără a fi nevoie să navighez către o pagină separată de management al categoriilor.

## Acceptance Criteria
1. [ ] În formularul de produs, lângă selectorul de categorii, există un buton "+" (Adaugă Categorie).
2. [ ] Apăsarea butonului deschide un mini-formular sau un prompt pentru numele noii categorii.
3. [ ] Categoria nou creată este salvată imediat în baza de date și selectată automat în formularul de produs.
4. [ ] Validare: Numele categoriei trebuie să fie unic.

## Technical Tasks
1. Crearea unui Server Action `addCategory` în `src/app/actions/products.ts`.
2. Actualizarea componentei `ProductForm.tsx` pentru a include interfața de adăugare rapidă.
3. Gestionarea stării de "loading" și "success" pentru noua categorie.
