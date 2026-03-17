# Story 2-4: Import rapid catalog (CSV)

**Status:** Backlog
**Epic:** Epic 2: Gestiunea Catalogului și Stocului
**Priority:** Low (MVP Essential)

## Description
Ca manager, doresc să import o listă mare de produse dintr-un fișier CSV local, astfel încât să nu pierd timp introducând manual sute de repere.

## Acceptance Criteria
1. [ ] Există un buton "Import CSV" în pagina de catalog.
2. [ ] Utilizatorul poate selecta un fișier `.csv` de pe disk-ul local.
3. [ ] Sistemul parsează CSV-ul și creează produsele, categoriile și unitățile lipsă.
4. [ ] Raport final: "X produse importate cu succes, Y erori".
5. [ ] Formatul CSV suportat: `Nume, Descriere, Pret, Stoc, Categorie, Unitate`.

## Technical Tasks
1. Instalarea unei librării de parsing CSV (ex: `papaparse` sau `csv-parse`).
2. Crearea unui Server Action `importProductsFromCSV`.
3. Implementarea logicii de "Upsert" pentru a evita duplicatele.
4. Adăugarea componentei de File Upload în interfață.
