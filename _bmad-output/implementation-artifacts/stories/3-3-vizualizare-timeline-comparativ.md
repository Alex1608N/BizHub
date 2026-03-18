# User Story 3-3: Vizualizare Timeline comparativ

**Status:** Ready for Dev
**Epic:** Epic 3: Audit & Transparență (Local Integrity)
**Description:** Ca administrator/manager, doresc să vizualizez un istoric cronologic al tuturor acțiunilor de audit într-un mod comparativ (Old vs New), pentru a înțelege exact cine și ce a modificat în sistem.

## Acceptance Criteria
1.  **Pagină Audit:** Crearea rutei `/audit` accesibilă din Sidebar (doar pentru ADMIN/MANAGER).
2.  **Vizualizare Cronologică:** Afișarea logurilor în ordine invers cronologică (cele mai noi primele).
3.  **Informații Cheie:** Afișarea: Utilizator, Acțiune (CREATE/UPDATE/DELETE), Tabel, Timestamp.
4.  **Comparare Date:** Transformarea JSON-ului brut în câmpuri lizibile. Pentru UPDATE, să se vadă clar ce s-a schimbat (ex: Stoc: 5 -> 10).
5.  **Design Local-First:** Interfață rapidă, folosind componentele existente (Tailwind + Lucide Icons).

## Implementation Steps
- [ ] Crearea Server Action-ului `getAuditLogs()` în `src/app/actions/audit.ts`.
- [ ] Adăugarea rutei `src/app/(dashboard)/audit/page.tsx`.
- [ ] Crearea componentei `AuditTimeline.tsx` pentru afișarea datelor.
- [ ] Integrarea link-ului "Audit Trail" în Sidebar-ul din `layout.tsx`.
