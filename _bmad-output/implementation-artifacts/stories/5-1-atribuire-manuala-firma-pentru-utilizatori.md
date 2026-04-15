# Story: Atribuire manuală firmă pentru utilizatori (Admin)
**ID Jira**: BH-42

## Descriere
Ca Administrator al platformei, vreau să pot asocia manual un utilizator (angajat) unei firme direct din tabelul de utilizatori, pentru a gestiona rapid conturile noi care nu au fost create prin sistemul de invitații.

## Criterii de Acceptare
1. În pagina `/utilizatori`, coloana "Firmă" trebuie să devină un dropdown (select) pentru utilizatorii cu rolul ADMIN.
2. Dropdown-ul trebuie să conțină toate firmele active din baza de date + opțiunea "Nicio firmă".
3. La schimbarea firmei din dropdown, se apelează server action-ul `updateUserDetails` și se actualizează baza de date.
4. După salvare, interfața se actualizează fără refresh (optimistic UI sau revalidate).
5. Operațiunea este logată în `audit_logs`.

## Note Tehnice
- Modificare în `UsersClient.tsx` pentru a permite editarea coloanei `companie_id`.
- Verificare permisiuni pe server action (`session.user.rol === 'ADMIN'`).
