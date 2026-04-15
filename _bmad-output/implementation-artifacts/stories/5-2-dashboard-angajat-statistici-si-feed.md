# Story: Dashboard Angajat - Statistici activitate și feed echipă
**ID Jira**: BH-43

## Descriere
Ca Angajat, vreau să văd pe Dashboard un grafic cu activitatea mea din ultima săptămână și un flux clar cu modificările făcute de restul echipei, pentru a-mi urmări productivitatea și a fi la curent cu starea stocului.

## Criterii de Acceptare
1. Adăugarea unei componente de tip Chart (grafic cu bare/linii) care arată numărul de acțiuni (audit logs) efectuate de utilizatorul logat în ultimele 7 zile.
2. Afișarea unor statistici rapide: "Total acțiuni azi", "Produse modificate de mine".
3. Componenta `AuditHistory` existentă va evidenția diferit acțiunile proprii vs acțiunile colegilor (ex: tag-uri colorate sau iconițe).
4. Angajatul vede pe dashboard cine a adăugat produse noi sau cine a făcut scăderi de stoc recente în firmă.

## Note Tehnice
- Creare componentă `UserActivityChart.tsx` folosind o librărie de grafice (ex: Recharts sau CSS pure bars).
- Server action nou/extins pentru a prelua doar logs-urile utilizatorului curent: `getUserAuditLogs(userId)`.
