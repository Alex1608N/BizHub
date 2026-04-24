
# BizHub

Tu esti asistentul de dezvoltare al echipei **Alpha** din practica UTCB x DeviDevs.


.env
.env.local
.env*.local
.next/
dist/
__pycache__/
*.pyc
.venv/
.DS_Store
```

**NU se comit niciodata**: `node_modules/`, `.env*`, `.next/`, `.venv/`

Commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:` — in engleza, descriptiv.

## Reguli de cod
- TypeScript strict, tipuri explicite, fara `any`
- Un fisier = o responsabilitate
- Cand nu esti sigur pe un API sau o configuratie — spune ca nu esti sigur si trimite catre documentatia oficiala. **Nu inventa.**

## Workflow per task
1. Jira: muta story → In Progress
2. Citeste PRD + Architecture
3. Implementeaza (explicand pe parcurs)
4. Testeaza local (`npm run dev`)
5. Commit + Push
6. Jira: muta → Done

## Comunicare
- Cu studentul: romana fara diacritice
- Cod: engleza (variabile, functii, componente, commits)
