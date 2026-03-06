---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories-all-epics']
inputDocuments: ['prd.md', 'architecture.md']
---

# practica - Planificare Epice (Ediție Locală - Finală)

## Prezentare Generală

Acest document conține descompunerea proiectului **practica** în epice și povești de utilizator (user stories), adaptate pentru o arhitectură **local-first** bazată pe Next.js și SQLite. Scopul este de a oferi o structură clară pentru implementare, menținând integritatea și simplitatea sistemului.

## Inventar Cerințe

### Cerințe Funcționale (Locale)

- **FR1:** Autentificare locală simplă (Roluri: Manager, Angajat, Contabil).
- **FR2:** Administrarea utilizatorilor locali în baza de date locală.
- **FR3:** Gestiune Catalog Produse și mișcări de stoc (Intrări/Ieșiri) în SQLite.
- **FR4:** Import Catalog din fișiere CSV locale.
- **FR5:** Înregistrarea automată a oricărei modificări (cine, ce, când) în `audit_log` local.
- **FR6:** Fereastra de Editare (7 zile) cu motiv obligatoriu, logată în Audit Trail.
- **FR7:** Vizualizare Timeline de Audit și Daily Digest local.
- **FR8:** Exporturi locale PDF/CSV (Facturi, Rapoarte Contabile).

### Cerințe Non-Funcționale (Locale)

- **NFR-S1:** Audit Trail de tip *append-only* în SQLite.
- **NFR-R1:** Tranzacții atomice locale (Better-SQLite3) pentru prevenirea coruperii datelor.
- **NFR-P1:** Timp de răspuns instantaneu (sub 100ms pe orice pagină).

### Cerințe Adiționale (Locale)

- **Tehnologie:** Next.js 15, Drizzle ORM, SQLite (file-based).
- **Interfață:** Tailwind CSS + Shadcn UI (componente locale).
- **Autentificare:** Sesiuni stocate local (Drizzle adapters).

---

## Harta de Acoperire a Cerințelor (FR Coverage Map)

- **FR1 (Autentificare):** Epic 1 - Story 1.3
- **FR2 (Admin Utilizatori):** Epic 1 - Story 1.4 + Story 1.2
- **FR3 (Catalog & Stoc):** Epic 2 - Story 2.1, 2.2
- **FR4 (Import CSV):** Epic 2 - Story 2.4
- **FR5 (Logare Audit):** Epic 3 - Story 3.1
- **FR6 (Editare 7 zile):** Epic 3 - Story 3.2
- **FR7 (Audit Digest & Timeline):** Epic 5 - Story 5.1, 5.3 + Epic 3 - Story 3.3
- **FR8 (Exporturi):** Epic 4 - Story 4.1, 4.2, 4.3

---

## Listă Epice

### Epic 1: Fundația Locală & Schema de Date
*Obiectiv: Configurarea mediului Next.js, SQLite și a tabelelor de bază.*
**FR-uri acoperite:** FR1, FR2.

### Epic 2: Gestiune Stoc & Catalog
*Obiectiv: Implementarea fluxului de catalog produse și mișcări de stoc.*
**FR-uri acoperite:** FR3, FR4.

### Epic 3: Motorul de Audit & Transparență
*Obiectiv: Înregistrarea automată a acțiunilor și logica de Editare controlată.*
**FR-uri acoperite:** FR5, FR6.

### Epic 4: Raportare & Exporturi Locale
*Obiectiv: Generarea documentelor PDF și export CSV/Excel direct pe disk.*
**FR-uri acoperite:** FR8.

### Epic 5: Dashboard Manager & Monitorizare
*Obiectiv: Interfața centralizată pentru control și Daily Digest.*
**FR-uri acoperite:** FR7.

---

## Epic 1: Fundația Locală & Schema de Date

### Story 1.1: Inițializarea Proiectului Next.js Local

**Ca un** Dezvoltator,
**Vreau să** inițializez un proiect curat Next.js 15 cu Tailwind CSS și Drizzle ORM,
**Astfel încât** să am o fundație solidă local-first pentru aplicație.

**Criterii de Acceptare:**
- **Dat fiind** un director de proiect gol.
- **Când** rulez comenzile de inițializare Next.js 15.
- **Atunci** este creat un proiect TypeScript cu Tailwind CSS configurat.
- **Și** Drizzle ORM este instalat și pregătit să folosească fișierul local `practica.db`.

### Story 1.2: Definirea Schemei de Date și Crearea Automată a DB

**Ca un** Administrator de Sistem,
**Vreau ca** aplicația să creeze și să migreze automat fișierul SQLite la prima rulare,
**Astfel încât** să nu fie necesari pași manuali de configurare.

**Criterii de Acceptare:**
- **Dat fiind** definițiile de schemă Drizzle pentru `utilizatori`, `companii`, `categorii`, `unitati` și `sesiuni`.
- **Când** aplicația pornește pentru prima dată.
- **Atunci** fișierul `practica.db` este creat automat dacă nu există.
- **Și** toate tabelele sunt create prin migrare automată.

### Story 1.3: Autentificare Locală cu Parole Hashed

**Ca un** Utilizator,
**Vreau să** mă pot loga folosind un nume de utilizator și o parolă stocate securizat local,
**Astfel încât** identitatea mea să fie verificată.

**Criterii de Acceptare:**
- **Dat fiind** o înregistrare de utilizator existentă.
- **Când** introduc datele corecte în formularul de login.
- **Atunci** parola este verificată față de hash-ul stocat (bcrypt/scrypt).
- **Și** este stabilită o sesiune locală protejată prin Middleware.

### Story 1.4: Script de Seed pentru Admin și Date de Bază

**Ca un** Manager,
**Vreau ca** sistemul să vină cu un cont de Admin și unități de măsură predefinite,
**Astfel încât** să pot începe lucrul imediat.

**Criterii de Acceptare:**
- **Dat fiind** finalizarea primei migrări.
- **Când** aplicația rulează scriptul de seed.
- **Atunci** sunt create unitățile implicite (Buc, Kg, Litri) și utilizatorul `admin`.
- **Și** pot accesa sistemul cu datele implicite.

---

## Epic 2: Gestiune Stoc & Catalog

### Story 2.1: Managementul Catalogului (CRUD)

**Ca un** Utilizator,
**Vreau să** gestionez produsele cu Categorii și Unități de Măsură,
**Astfel încât** inventarul să fie organizat.

**Criterii de Acceptare:**
- **Dat fiind** formularul de creare produs.
- **Când** salvez un produs cu SKU, Categorie și Unitate.
- **Atunci** acesta este salvat în SQLite și apare în listă.

### Story 2.2: Înregistrarea Mișcărilor de Stoc

**Ca un** Angajat,
**Vreau să** înregistrez intrări și ieșiri de marfă,
**Astfel încât** stocul să fie corect în timp real.

**Criterii de Acceptare:**
- **Dat fiind** un produs selectat.
- **Când** adaug sau scad o cantitate.
- **Atunci** stocul este actualizat în baza de date locală.

### Story 2.3: Adăugarea Categoriilor "On-the-fly"

**Ca un** Utilizator,
**Vreau să** adaug o categorie nouă direct din ecranul de produs,
**Astfel încât** să nu pierd timpul navigând în alte meniuri.

**Criterii de Acceptare:**
- **Dat fiind** câmpul de Categorie din formular.
- **Când** apas pe butonul "+" și introduc un nume nou.
- **Atunci** categoria este salvată și selectată automat.

### Story 2.4: Import CSV Local

**Ca un** Manager,
**Vreau să** import produse dintr-un CSV local,
**Astfel încât** să nu introduc manual sute de produse.

**Criterii de Acceptare:**
- **Dat fiind** un fișier CSV valid.
- **Când** este încărcat local.
- **Atunci** produsele sunt create automat în baza de date.

---

## Epic 3: Motorul de Audit & Transparență

### Story 3.1: Logarea Automată (Audit Engine)

**Ca un** Sistem,
**Vreau să** înregistrez orice schimbare în `audit_log`,
**Astfel încât** să am trasabilitate 100%.

**Criterii de Acceptare:**
- **Dat fiind** orice modificare de date (CUD).
- **Când** tranzacția este salvată.
- **Atunci** se creează un log cu vechile și noile valori.

### Story 3.2: Editare pe Roluri (7 zile vs Nelimitat)

**Ca un** Utilizator,
**Vreau ca** permisiunile de editare să fie clare,
**Astfel încât** să existe responsabilitate.

**Criterii de Acceptare:**
- **Dat fiind** o editare.
- **Când** utilizatorul este `ANGAJAT`, editarea este permisă doar în primele 7 zile.
- **Când** utilizatorul este `MANAGER`, editarea este permisă oricând.
- **Atunci** introducerea unui motiv este obligatorie.

### Story 3.3: Vizualizare Timeline Comparativ

**Ca un** Manager,
**Vreau să** văd diferențele side-by-side ale unei editări,
**Astfel încât** să înțeleg ce s-a schimbat.

**Criterii de Acceptare:**
- **Dat fiind** istoricul unui produs.
- **Când** deschid o editare.
- **Atunci** văd valorile vechi și noi evidențiate clar.

---

## Epic 4: Raportare & Exporturi Locale

### Story 4.0: Setări Firmă (Logo & Date Fiscale)

**Ca un** Manager,
**Vreau să** salvez datele firmei mele local,
**Astfel încât** PDF-urile să fie complete.

**Criterii de Acceptare:**
- **Dat fiind** pagina de setări.
- **Când** salvez CUI-ul și încarc Logo-ul.
- **Atunci** datele sunt persistate în SQLite.

### Story 4.1: Generare PDF (Facturi/Avize)

**Ca un** Utilizator,
**Vreau să** scot un PDF local pentru orice tranzacție,
**Astfel încât** să îl pot tipări.

**Criterii de Acceptare:**
- **Dat fiind** o mișcare de stoc.
- **Când** apas pe „Descarcă PDF”.
- **Atunci** fișierul este generat local cu datele firmei.

### Story 4.2: Export Excel (.xlsx) pentru Contabil

**Ca un** Manager,
**Vreau să** export datele în format Excel nativ,
**Astfel încât** contabilul să le poată folosi.

**Criterii de Acceptare:**
- **Dat fiind** un interval de timp.
- **Când** selectez „Export Excel”.
- **Atunci** se generează un fișier `.xlsx` formatat corect.

### Story 4.3: Raport Valoric de Stoc

**Ca un** Manager,
**Vreau să** văd valoarea totală a banilor blocați în marfă,
**Astfel încât** să iau decizii financiare corecte.

**Criterii de Acceptare:**
- **Dat fiind** lista de produse.
- **Atunci** sistemul calculează (Cantitate * Preț) și afișează totalul valoric.

---

## Epic 5: Dashboard Manager & Monitorizare

### Story 5.1: Daily Audit Digest (Ieri în firmă)

**Ca un** Manager,
**Vreau să** am un rezumat al zilei precedente,
**Astfel încât** să nu stau să caut în loguri.

**Criterii de Acceptare:**
- **Dat fiind** prima pagină a Dashboard-ului.
- **Atunci** văd totalul mișcărilor și editările făcute ieri.

### Story 5.2: Alerte Stoc Critic

**Ca un** Manager,
**Vreau să** văd produsele care au scăzut sub minim,
**Astfel încât** să pot face aprovizionarea.

**Criterii de Acceptare:**
- **Dat fiind** Dashboard-ul.
- **Atunci** apare o listă cu produsele sub pragul de alertă.

### Story 5.3: Timeline Activitate (Feed)

**Ca un** Manager,
**Vreau să** văd un feed cu ultimele acțiuni în timp real,
**Astfel încât** să am confirmarea vizuală că totul funcționează.

**Criterii de Acceptare:**
- **Dat fiind** Dashboard-ul.
- **Atunci** se afișează ultimele 10 acțiuni de stoc/audit.
