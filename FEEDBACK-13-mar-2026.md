# Audit Echipe — 13 Martie 2026 (pre-Sedinta 7)

Audit proaspăt, 2h înainte de ședință. Date live din Git + Jira.

**Stack cerut:** Next.js + Tailwind CSS. **Faza actuală: LOCAL** — SQLite/Drizzle/local auth sunt OK acum. Supabase/Vercel/Render = după MVP.

**Cum se remediază problemele:** Nicu explică ce e greșit și de ce → studentul deschide Gemini CLI și îi dă promptul → Gemini implementează → student face commit + push.

---

## Ranking General — Sprint 2 (ziua 8/14)

| Rank | Echipa | Git (de ieri) | Jira S2 | Stack | Risc |
|------|--------|--------------|---------|-------|------|
| 1 | **Delta (WardrobeAI)** | +6 commits, 29 total | 7/7 Done ✅ | Next.js ✓ | Mic |
| 2 | **Alpha (BizHub)** | +3 commits, 13 total | 4/4 Done ✅ | Next.js ✓ | Mediu |
| 3 | **Beta (Secure rPPG)** | 0 commits noi | 1/3 Done | Zero web ✗ | Critic |
| 4 | **Gamma (TravelDeal)** | 0 commits noi | Sprint 1 activ ❗ | Vite ✗ | Critic |

---

## Delta — WardrobeAI (Luca-Stefan Catrina + Marius Oprea)

**Repo:** github.com/Lwcka/Practica_DeviDevs | 29 commits total, +6 de ieri | 2.0 MB ✓

### Progres de la sedinta 6

**Ce au făcut (impresionant):**
- `chore: repository cleanup (remove test files and ignore sqlite db)` — au rezolvat problema cu dev.db ✓
- `feat: implement Magic Snap and Gallery upload with real-time Quality Gate`
- `feat: implement FastAPI AI Engine for background removal and link with frontend`
- `feat: implement Closet Grid with SQLite integration and item deletion`
- `docs: update GEMINI.md with Delta team specific workflow and Monorepo structure`

**Jira Sprint 2: 7/7 Done**
- WA-4: Init Next.js ✓
- WA-10: Auth locală ✓
- WA-11: Design System ✓
- WA-12: Storage & Data Contracts ✓
- WA-13: Camera Interface & Quality Gate ✓
- WA-14: AI Image Segmentation (FastAPI) ✓
- WA-15: Closet Grid & SQLite Item Schema ✓

### Probleme rămase

**Marius Oprea: 0 commits vizibili** — 29 commits, toate par de la Luca. Dacă Marius nu contribuie, nu are cum să fie evaluat la final.

**Remediere:** Marius primește un task concret în ședință (ex: o pagină nouă sau o componentă). Deschide Gemini CLI, îi descrie task-ul, implementează, face commit cu propriul cont Git.

### La ședință
- Laudă progresul — e cel mai bun din toate echipele
- Demo live: Magic Snap, Closet Grid, AI engine
- Verifică Git log cu Marius față în față. Dacă nu are commits, iese din ședință cu un task activ.

---

## Alpha — BizHub (Felix-Ioan Condrat + Alexandru Negoita)

**Repo:** github.com/Alex1608N/practica | 13 commits total, +3 de ieri | 2.0 MB

### Progres de la sedinta 6

**Ce au făcut:**
- `feat(db): implement schema, migrations and auto-setup for Story 1.2`
- `feat(auth): implement local authentication system with bcrypt and sessions`
- `feat(db): implement database seeding for Admin and Units (Story 1.4)`

**Jira Sprint 2: 4/4 Done**
- BH-4: Init Next.js ✓
- BH-10: Schema de Date & DB Auto-Setup ✓
- BH-11: Autentificare Locală cu Parole Hashed ✓
- BH-13: Seed Admin și Date de Bază ✓

### Probleme rămase

**1. BMAD toolkit (~8.6 MB, 1,191 fișiere) încă în repo**
Folderele `.agent/`, `.clinerules/`, `.gemini/`, `_bmad/` sunt boilerplate generat automat de BMAD la instalare — nu sunt documentele voastre, nu au nicio valoare în repo. Îngreunează repo-ul și creează confuzie.

**Prompt Gemini:** *"Vreau să scot din Git tracking folderele .agent/, .clinerules/, .gemini/ și _bmad/ care sunt boilerplate BMAD nefolosit. Ajută-mă să le elimin din repo și să le adaug în .gitignore."*

**2. Problema de viziune: codul ≠ Jira**
Codul implementează un ERP (gestiune stocuri, facturi, unități) dar pe Jira proiectul se numește "BizHub — local business networking platform". Sunt două produse complet diferite. Asta înseamnă că ori planificarea, ori implementarea e greșită — una din două.

**Remediere:** Decizie în ședință, nu Gemini. Ce e produsul vostru? Odată decis, cel care face documentele actualizează PRD + Jira să fie aliniate.

**3. Felix: 3 commits, Alexandru: 8**
Trebuie împărțit clar: cine face frontend, cine face backend. Fiecare lucrează pe zona lui.

**Prompt Gemini (Felix):** *"Sunt pe frontend pentru BizHub. Avem autentificarea și schema gata. Ajută-mă să construiesc pagina de dashboard — un layout cu sidebar și zona principală, fără date reale deocamdată."*

### La ședință
- Decizie urgentă: ERP sau networking? Nu se continuă codul până nu e clar.
- Felix iese din ședință cu un task activ pe frontend.

---

## Beta — Secure rPPG (Gabriel-Stefan Mitrache, solo)

**Repo:** github.com/gabifrez/Secure_rPPG | 6 commits total, 0 de ieri | 16.5 MB

### Progres de la sedinta 6

**Zero commits noi.** Nicio mișcare în Git de la audit-ul de ieri.

**Jira Sprint 2:**
- HP-10: "Ce am făcut până acum" — Done *(documentare Python)*
- HP-11: "Documentare rPPG" — In Progress
- HP-4: Init Next.js — **To Do**

### Probleme rămase

**1. Nu există nicio parte web în repo**
Proiectul de practică e o aplicație web. Algoritmul Python e impresionant, dar nu e deliverable-ul. Fără Next.js, nu există aplicație. HP-4 e pe To Do de când s-a creat sprint-ul.

**Prompt Gemini:** *"Am un repo cu cod Python pentru detecție cardiacă prin cameră. Trebuie să adaug și o aplicație web Next.js cu TypeScript și Tailwind. Creează structura proiectului web într-un folder /web, separat de codul Python."*

**2. 16.5 MB repo** — .venv comis în history. Nu blochează dezvoltarea acum, dar va trebui curățat înainte de deploy.

### La ședință
- Conversație directă: ce s-a întâmplat, de ce zero progres?
- Gabriel face inițializarea web în ședință, pe loc, cu Gemini CLI.

---

## Gamma — TravelDeal (Alexandru Duta-Lapusneanu + Amalia-Georgiana Manolache)

**Repo:** github.com/AlexDuta838/productBrief | 20 commits total, 0 de ieri | 42.9 MB ❗

### Progres de la sedinta 6

**Zero commits noi.** Nicio mișcare în Git.

**Jira: PROBLEMĂ CRITICĂ**
- Sprint 1 e încă "active" (trebuia să se termine pe 6.03 — acum e 13.03!)
- Sprint 2 nu a fost pornit niciodată
- Sunt cu o săptămână în urmă față de toate celelalte echipe pe Jira

**Stack: DEVIAT**
- `vite.config` detectat — nu au migrat pe Next.js
- 42.9 MB — node_modules din history vechi

### Probleme rămase

**1. Sprint 1 neînchis + Sprint 2 nepornit**
Jira nu reflectă realitatea. Nu se poate face Sprint Review și nu există niciun task activ trackuit. **Nicu rezolvă asta în ședință** — nu e treaba studentului, e admin Jira.

**2. Stack greșit: Vite în loc de Next.js**
Au un UI funcțional construit pe Vite. Problema: Vite nu face parte din stack-ul cerut și nu e compatibil cu arhitectura la care vor ajunge (API routes, SSR, etc.). Trebuie migrat.

**De ce contează:** Vite e un bundler pentru SPA-uri. Next.js e un framework full-stack. Când vor adăuga backend (API routes, auth, server components), Vite nu le permite. E mai simplu să migreze acum decât să refacă totul în Sprint 4.

**Prompt Gemini (Alexandru):** *"Am o aplicație TravelDeal construită cu Vite + React. Trebuie să migrez pe Next.js cu TypeScript și Tailwind, păstrând componentele existente. Ajută-mă să fac migrarea pas cu pas."*

**3. Amalia: 1 commit total din 20**
Dacă la final de practică Amalia are 1-2 commits, nu poate fi evaluată. Nu e o problemă de mâine — e o problemă care se acumulează.

**Remediere:** Amalia primește task clar în ședință pe o componentă sau pagină nouă. Deschide Gemini CLI, implementează, face commit cu propriul cont.

**Prompt Gemini (Amalia):** *"Lucrez pe TravelDeal, o aplicație de travel deals. Avem deja un dashboard cu intenții de călătorie. Ajută-mă să construiesc o pagină de profil utilizator cu câmpuri pentru nume, email și preferințe de destinație."*

### La ședință — acțiuni imediate
1. **Nicu**: închide Sprint 1 + pornește Sprint 2 pe Jira pentru Gamma
2. **Alexandru**: migrare Vite → Next.js în ședință cu Gemini CLI
3. **Amalia**: task concret + primul commit serios în ședință

---

## Probleme Comune (actualizate 13.03)

### 1. Beta + Gamma: Zero parte web
Ambele echipe nu au Next.js. Se rezolvă în ședința de azi cu Gemini CLI.

### 2. Membri invizibili în Git
- **Gamma**: Amalia — 1 commit total
- **Delta**: Marius — 0 commits vizibili
- **Alpha**: Felix — 3 commits vs Alexandru 8

Toți trei primesc task concret în ședință și ies cu cel puțin un commit propriu.

### 3. Gamma: Jira în urmă cu un sprint
Nicu rezolvă la ședință.

### 4. Repo bloat
- **Beta**: 16.5 MB (.venv în history) — de curățat înainte de deploy
- **Gamma**: 42.9 MB (node_modules în history) — de curățat înainte de deploy

---

## Agenda Ședință 7 (13 Martie)

### Deschidere (5 min)
- Anunț audit: Delta + Alpha au lucrat, Beta + Gamma zero progres de ieri.

### Demo echipe (20 min, 5 min/echipă — de la cel mai bun)
1. **Delta** — demo live: Magic Snap, Closet Grid, AI engine
2. **Alpha** — demo auth + DB. Decizie urgentă: ce e produsul (ERP vs networking)?
3. **Beta** — Gabriel: de ce zero progres, plan concret
4. **Gamma** — Alexandru: de ce zero progres, migrare Next.js

### Hands-on (30 min)
- **Beta**: inițializare web cu Gemini CLI, în ședință
- **Gamma**: migrare Vite → Next.js cu Gemini CLI, Amalia primește task și face commit
- **Alpha**: decizie viziune produs, Felix primește task frontend
- **Delta**: Marius primește task și face commit, plan Sprint 3
- **Nicu**: închide Sprint 1 Gamma + pornește Sprint 2 pe Jira

### Sprint 3 preview (10 min)
- Sprint 3: 20 Mar - 3 Apr — CRUD real, pagini principale, UI funcțional
- Fiecare echipă generează 3-4 stories cu Gemini CLI

### Închidere (5 min)
- Verificare Git + Jira în 48h (15.03)
- Marius + Amalia + Felix: commits vizibile până la ședința 8

---

## To-do Nicu (la/după ședință)

- [ ] Gamma: închide Sprint 1 pe Jira, pornește Sprint 2
- [ ] Verifică Git log Marius (Delta) — `git log --oneline --author="Marius"` pe repo
- [ ] Decizie cu Alpha: ERP sau networking? Aliniere docs + Jira
