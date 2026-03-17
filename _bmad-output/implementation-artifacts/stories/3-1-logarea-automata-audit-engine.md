# Story 3-1: Logarea automată (Audit Engine)

**Status:** Ready-for-Dev
**Epic:** Epic 3: Motorul de Audit & Transparență
**Priority:** Critical

## Description
Ca administrator de sistem, doresc ca orice modificare a datelor sensibile (produse, stocuri, prețuri) să fie înregistrată automat într-un tabel de audit. Acest lucru asigură trasabilitatea 100% și previne frauda sau erorile neidentificate.

## Acceptance Criteria
1. [ ] Existența tabelului `audit_logs` în baza de date SQLite (ID, tabel_afectat, coloana, valoare_veche, valoare_noua, utilizator_id, timestamp, motiv).
2. [ ] Orice operațiune de tip `UPDATE` sau `DELETE` pe catalogul de produse trebuie să genereze automat intrări în audit.
3. [ ] Orice mișcare de stoc (Story 2-2) trebuie să fie înregistrată în audit cu detalii despre cantitatea modificată.
4. [ ] Sistemul trebuie să stocheze valorile vechi și noi side-by-side pentru o comparare ușoară.

## Technical Tasks
1. Definirea tabelului `audit_logs` în `src/db/schema.ts` și rularea migrărilor.
2. Crearea unui utilitar `auditEngine.ts` în `src/lib/` pentru centralizarea logicii de logare.
3. Integrarea `auditEngine.log()` în toate Server Action-urile relevante din `src/app/actions/products.ts`.
4. Testarea manuală: Efectuarea unei modificări de preț și verificarea tabelului de audit în DB.
