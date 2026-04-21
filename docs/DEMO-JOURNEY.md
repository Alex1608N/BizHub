# 🎬 BizHub - Scenariu Detaliat Demo Day
**Tema Centrală:** "BizHub: Liniște Digitală pentru afaceri în creștere."

---

## 🏗️ 0. Pregătirea Scenariului (Set-up)
*   **Tab-uri deschise:** 
    1. Pagina de Login.
    2. Pagina de Catalog (deja logat ca Elena - Angajat).
    3. Dashboard-ul (deja logat ca Mihai - Manager).
    4. Supabase Dashboard (opțional, pentru întrebări tehnice).
*   **Date obligatorii în DB:**
    *   "Lapte Proaspăt" -> Stoc: 2 bucăți (pentru a declanșa Alerta Roșie).
    *   "Zahăr 1kg" -> Stoc: 45 bucăți (pentru a arăta un stoc sănătos).
    *   Cel puțin 5 loguri de audit generate în ultimele 24h.

---

## 🎭 Actul 1: Problema & Simplitatea (Elena, Angajatul)
**Indicație:** Începeți pe ecranul de Catalog.

*   **Ce spui:** *"Aceasta este Elena. Ea lucrează într-un depozit unde până ieri totul se nota pe caiet. BizHub a fost creat să fie la fel de simplu ca un caiet, dar fără riscul de a pierde date."*
*   **Ce faci:** 
    1. Caută un produs folosind bara de căutare.
    2. Apasă pe **Adaugă Stoc**. Introdu `+100`.
    3. **Momentul cheie:** *"Elena a greșit. Trebuia să adauge doar 10. În loc să intre în panică, face o ieșire de stoc de 90. Observați cât de rapid este procesul."*
*   **Highlight Tehnic (Spune-l):** *"Folosim **Next.js Server Actions** pentru ca interfața să fie instantanee, eliminând timpii de așteptare pentru utilizator."*

---

## 🎭 Actul 2: Controlul & Transparența (Mihai, Managerul)
**Indicație:** Comutați pe tab-ul cu Dashboard-ul de Manager.

*   **Ce spui:** *"În timp ce Elena lucrează, Mihai, managerul firmei, are vizibilitate totală de la distanță. El nu trebuie să sune să întrebe dacă a intrat marfa."*
*   **Ce faci:** 
    1. Arată cardul **"Stock Value"**. Spune: *"Aceasta este valoarea capitalului blocat în marfă, calculată în timp real."*
    2. Arată **Daily Digest**. *"Vedeți aici? Sistemul îi spune lui Mihai că au avut loc 2 mișcări de stoc azi. Fără telefoane, fără stres."*
    3. Mergi la **Timeline Audit**. Arată corecția făcută de Elena. 
    4. **Highlight Tehnic:** *"Acesta este un jurnal de audit imuabil. Orice 'ștersătură' de pe caiet devine aici o urmă digitală clară: cine, ce și când a modificat."*

---

## 🎭 Actul 3: Co-pilotul Inteligent (AI Integration)
**Indicație:** Scroll până la secțiunea de AI Insights.

*   **Ce spui:** *"Marea provocare a unui manager este să știe ce să cumpere și când. Aici intervine BizHub AI."*
*   **Ce faci:** 
    1. Arată secțiunea de **AI Insights**. 
    2. Citește sugestia generată: *"Sistemul observă stocul mic la lapte și sugerează o comandă imediată bazată pe istoricul de consum."*
*   **Highlight Tehnic:** *"Integrăm **Google Gemini 1.5 Flash** printr-un flux de prompt engineering care analizează datele brute de audit și inventar pentru a oferi sugestii de business acționabile."*

---

## 🎭 Actul 4: Validarea Legală (Exporturi)
**Indicație:** Mergi la un produs și generează un PDF.

*   **Ce spui:** *"La final, datele trebuie să iasă din sistem către contabil sau parteneri."*
*   **Ce faci:** 
    1. Descarcă un **PDF (Nota de Recepție)**. Deschide-l.
    2. Arată antetul: *"Datele firmei, IBAN-ul și CUI-ul sunt preluate automat din setări, generând documente profesionale în câteva secunde."*
    3. Arată exportul **Excel** pentru Audit: *"Contabilul primește tot istoricul lunii într-un format gata de procesat."*

---

## ❓ Întrebări Posibile (Pregătire FAQ)

**Q1: Cum asigurați securitatea datelor între firme diferite?**
*   **Răspuns:** *"Folosim o arhitectură **Multi-tenant**. Fiecare rând din baza de date are un `companie_id`, iar Middleware-ul și interogările noastre Drizzle filtrează datele strict la nivel de sesiune, astfel încât un utilizator să nu poată vedea niciodată datele altei firme."*

**Q2: De ce ați ales Supabase/PostgreSQL în loc de SQLite la final?**
*   **Răspuns:** *"Am început cu SQLite pentru viteză în dezvoltare, dar am migrat la **PostgreSQL (Supabase)** pentru a permite accesul concurent al mai multor utilizatori și pentru a avea o bază de date scalabilă în cloud, pregătită pentru producție."*

**Q3: Ce se întâmplă dacă Gemini API dă eroare?**
*   **Răspuns:** *"Aplicația este construită pe principiul 'Graceful Degradation'. Dacă AI-ul nu răspunde, utilizatorul primește un mesaj prietenos, dar funcționalitățile de bază (stoc, audit) rămân 100% operaționale."*

**Q4: Cum gestionați rolurile de utilizator?**
*   **Răspuns:** *"Avem 4 roluri definite (Admin, Manager, Angajat, Contabil). Permisiunile sunt verificate atât în interfață (pentru a ascunde butoane), cât și pe server (pentru a bloca acțiuni neautorizate)."*

---

## 🚨 Planul B (În caz de urgență)
*   **Dacă pică netul:** Spuneți că aplicația este gândită pentru a fi local-first (folosind SQLite-ul de la începutul sprintului ca fallback - *doar dacă e cazul*).
*   **Dacă AI-ul returnează ceva ciudat:** Spuneți că AI-ul învață din date și, cu cât baza de date este mai bogată, cu atât sugestiile devin mai precise.
