# Story 2-2: Înregistrarea mișcărilor de stoc

**Status:** Ready-for-Dev
**Epic:** Epic 2: Gestiunea Catalogului și Stocului
**Priority:** High

## Description
Ca angajat, doresc să înregistrez intrările și ieșirile de marfă pentru fiecare produs, astfel încât stocul să fie corect în timp real. Orice mișcare de stoc trebuie să actualizeze valoarea `stoc` din tabelul `produse`.

## Acceptance Criteria
1. [ ] Interfață simplă (buton/formular) în pagina de catalog sau produs pentru "Adaugă Stoc" și "Scoate Stoc".
2. [ ] Validare: Nu se poate scoate mai mult stoc decât există (stocul nu poate fi negativ).
3. [ ] Actualizarea atomică a bazei de date (SQLite) pentru a preveni inconsistențele.
4. [ ] Introducerea unei cantități și, opțional, a unui scurt comentariu pentru mișcare.
5. [ ] (Pre-condiție pentru Epic 3) Pregătirea logicii pentru a trimite datele către motorul de audit.

## Technical Tasks
1. Crearea unui Server Action `recordStockMovement` în `src/app/actions/products.ts`.
2. Implementarea butoanelor "+" și "-" în tabelul de catalog sau într-un modal de detalii.
3. Adăugarea logicii de validare pentru stoc insuficient.
4. Testarea manuală a incrementării și decrementării stocului.
