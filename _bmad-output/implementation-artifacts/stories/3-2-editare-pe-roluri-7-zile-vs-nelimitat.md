# Story 3-2: Editare pe roluri (7 zile vs Nelimitat)

**Status:** Backlog
**Epic:** Epic 3: Motorul de Audit & Transparență
**Priority:** High

## Description
Ca manager, doresc să impun reguli stricte privind modificarea datelor istorice. Angajații pot corecta erorile de introducere doar într-o fereastră de 7 zile, în timp ce managerii au acces nelimitat, pentru a păstra integritatea raportărilor financiare.

## Acceptance Criteria
1. [ ] Verificarea rolului utilizatorului în Server Action-urile de editare.
2. [ ] Dacă rolul este `ANGAJAT`, sistemul verifică dacă timestamp-ul creării înregistrării este mai vechi de 7 zile.
3. [ ] Dacă au trecut mai mult de 7 zile, butonul de Edit este dezactivat sau acțiunea este blocată pe server pentru `ANGAJAT`.
4. [ ] Introducerea unui **motiv obligatoriu** în tabelul de audit pentru orice editare făcută după fereastra inițială (sau pentru orice editare, conform politicii firmei).

## Technical Tasks
1. Implementarea logicii de verificare a timpului în `src/lib/auditEngine.ts` sau direct în Server Actions.
2. Adăugarea câmpului `motiv` în interfața de editare a produsului.
3. Protejarea rutei de server pentru a preveni bypass-ul regulii prin API.
