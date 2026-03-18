# User Story 4-3: Raport Valoric de Stoc

**Status:** Ready for Dev
**Epic:** Epic 4: Raportare & Exporturi Locale
**Description:** Ca Manager, doresc să văd valoarea totală a stocului (Cantitate x Preț de achiziție), pentru a înțelege valoarea capitalului blocat în marfă la orice moment.

## Acceptance Criteria
1.  **Afișare Dashboard:** Valoarea totală să apară clar în Dashboard-ul principal.
2.  **Detaliere pe Categorii:** Posibilitatea de a vedea valoarea stocului defalcată pe categoriile de produse.
3.  **Acuratețe:** Calculul trebuie să reflecte stocul real din SQLite la momentul accesării.
4.  **UI:** Utilizarea unui card informativ ("Stock Value") cu formatare monetară (RON).

## Implementation Steps
- [ ] Crearea unui query SQL eficient pentru calculul `sum(stock * price)`.
- [ ] Implementarea unei funcții în `src/app/actions/products.ts` pentru acest raport.
- [ ] Adăugarea widget-ului în pagina de Dashboard.
- [ ] Adăugarea unui grafic simplu (opțional) pentru distribuția pe categorii.
