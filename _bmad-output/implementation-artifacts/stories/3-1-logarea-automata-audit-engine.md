# User Story 3-1: Logarea automată (Audit Engine)

**Status:** Ready for Dev
**Epic:** Epic 3: Audit & Transparență (Local Integrity)
**Description:** Ca administrator/manager, doresc ca orice modificare adusă datelor (produse, stocuri, categorii) să fie înregistrată automat într-un jurnal de audit imuabil, pentru a asigura transparența totală a operațiunilor locale.

## Acceptance Criteria
1.  **Schema DB:** Crearea tabelului `audit_log` în SQLite care să conțină: `id`, `user_id` (cel care a făcut acțiunea), `actiune` (CREATE, UPDATE, DELETE), `tabel` (produsele, stoc, etc), `date_vechi` (JSON), `date_noi` (JSON), `timestamp`.
2.  **Audit Engine:** Implementarea unui utilitar `auditLog(tx, actionData)` care să poată fi apelat în cadrul tranzacțiilor Drizzle.
3.  **Integrare Server Actions:** Orice Server Action existent (adaugare produs, update stoc) trebuie să apeleze automat `auditLog`.
4.  **Imiabilitate:** Jurnalul de audit nu trebuie să poată fi modificat sau șters prin interfața aplicației.

## Implementation Steps
- [ ] Definirea tabelului `audit_log` în `src/db/schema.ts`.
- [ ] Generarea și rularea migrării pentru noul tabel.
- [ ] Crearea utilitarului `src/lib/audit.ts` pentru logare.
- [ ] Actualizarea `src/app/actions/products.ts` pentru a include logarea în tranzacții.
- [ ] Verificarea manuală (sau prin test-db.ts) a salvării log-urilor.
