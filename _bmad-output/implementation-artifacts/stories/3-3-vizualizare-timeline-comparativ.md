# Story 3-3: Vizualizare Timeline Comparativ

**Status:** Backlog
**Epic:** Epic 3: Motorul de Audit & Transparență
**Priority:** Medium

## Description
Ca manager, doresc să vizualizez istoricul complet al unui produs sub forma unui timeline, evidențiind clar ce s-a schimbat, când și de către cine, pentru a soluționa rapid discrepanțele de inventar.

## Acceptance Criteria
1. [ ] O pagină sau un modal "Istoric Produs" accesibil din tabelul de catalog.
2. [ ] Afișarea unei liste cronologice de evenimente (ex: "Alex a schimbat prețul de la 10 RON la 12 RON acum 2 ore").
3. [ ] Evidențierea vizuală a diferențelor (ex: text tăiat pentru valoarea veche, text verde pentru valoarea nouă).
4. [ ] Filtrare după data sau utilizator în cadrul timeline-ului.

## Technical Tasks
1. Crearea unui Server Action `getProductHistory` care extrage datele din `audit_logs`.
2. Implementarea componentei UI `AuditTimeline.tsx`.
3. Integrarea butonului de vizualizare istoric în rândurile tabelului de produse.
