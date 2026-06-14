# BizHub 🏢💼

BizHub is a comprehensive, multi-tenant enterprise management platform designed to streamline business operations for small to medium-sized enterprises. Built with a modern tech stack, it provides businesses with tools for employee management, inventory/catalog tracking, automated time sheets (punch-in/out), real-time sales reporting, and AI-driven business insights.

---

## 🚀 Key Features

*   **Multi-Tenancy**: Complete data isolation between registered companies.
*   **Role-Based Access Control (RBAC)**: Secure access levels tailored for **Admin**, **Manager**, **Angajat (Employee)**, and **Contabil (Accountant)**.
*   **Catalog & Inventory**: Manage products, categories, stock levels, and custom measurement units.
*   **Sales & Transactions**: Record sales, generate reports, and export documents to PDF, Excel, and CSV formats.
*   **Time & Attendance (Pontaj)**: Quick punch-in/out and breaks tracking for employees.
*   **Audit Logging**: Automatic JSONB-based tracking of all critical database operations (Create, Update, Delete).
*   **AI Insights**: Native integration with Google Gemini AI to analyze dashboard metrics, inventory logs, and financial performance.
*   **E2E Testing**: Comprehensive automated testing suite powered by Playwright.

---

## 🛠️ Technology Stack

*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & React 19
*   **Styling**: [TailwindCSS v4](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/) (Icons)
*   **Database**: PostgreSQL hosted on [Supabase](https://supabase.com/)
*   **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/) (using `postgres` client)
*   **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth)
*   **AI Engine**: [Google Generative AI (Gemini API)](https://ai.google.dev/)
*   **Export Tools**: `exceljs` (Excel generation), `jspdf` & `jspdf-autotable` (PDF exports), `papaparse` (CSV processing)
*   **Testing**: [Playwright](https://playwright.dev/) for End-to-End browser automation

---

## 🗄️ Database Architecture (Drizzle Schema)

BizHub's PostgreSQL relational model is designed around the following tables (defined in `src/db/schema.ts`):

```mermaid
erDiagram
    COMPANII ||--o{ UTILIZATORI : employs
    COMPANII ||--o{ PRODUSE : inventories
    COMPANII ||--o{ CATEGORII : classifies
    COMPANII ||--o{ UNITATI : measures
    COMPANII ||--o{ AUDIT_LOGS : records
    COMPANII ||--o{ INVITATII : invites
    COMPANII ||--o{ PONTAJ : tracks
    COMPANII ||--o{ VANZARI : registers

    UTILIZATORI ||--o{ INVITATII : sends
    UTILIZATORI ||--o{ PONTAJ : logs
    UTILIZATORI ||--o{ VANZARI : performs
    UTILIZATORI ||--o{ AUDIT_LOGS : generates

    PRODUSE ||--o{ VANZARI_DETALII : contains
    VANZARI ||--o{ VANZARI_DETALII : detail
```

### Core Entities:
*   **`companii`**: Business profiles holding company details (CUI, IBAN, Address, logo, phone, email).
*   **`utilizatori`**: System users mapping directly to Supabase Auth IDs, marked with roles (`ADMIN`, `MANAGER`, `ANGAJAT`, `CONTABIL`).
*   **`produse`**: Inventory items with integer pricing (in cents to prevent rounding errors), category/unit associations, and current stock.
*   **`categorii` & `unitati`**: Internal classifications for products and inventory management.
*   **`audit_logs`**: System logs tracking changes in `produse`, `categorii` etc. Storing `date_vechi` (previous state) and `date_noi` (new state) using JSONB.
*   **`invitatii`**: Invitation tokens managing pending registrations within a company.
*   **`pontaj`**: Time tracking records tracking `START`, `END`, `PAUZA_START`, and `PAUZA_STOP`.
*   **`vanzari` & `vanzari_detalii`**: Tracking invoices, transactions, items bought, and historical unit prices.

---

## 👥 User Roles & Permissions

*   **ADMIN**: Global system administrator, manages platform-wide companies and configurations.
*   **MANAGER**: Company owner/manager. Can edit company profile, invite employees, manage catalog items, adjust stock levels, record sales, and view audit logs.
*   **ANGAJAT (Employee)**: Standard staff member. Can view product catalogs, log shifts (Pontaj), and register sales. Cannot view financial company analytics or audit logs.
*   **CONTABIL (Accountant)**: Can view dashboard metrics, sales registers, and export documents. Cannot edit products or manage employees.

---

## ⚙️ Environment Configuration

To run BizHub locally, create a `.env` file in the root directory and configure the following environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# PostgreSQL Connection (Drizzle)
DATABASE_URL=postgresql://postgres:password@your_supabase_db_host:5432/postgres

# AI Integration
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🏃 Getting Started (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Migration & Seeding
BizHub uses Drizzle Kit to sync local models to Supabase PostgreSQL.

*   Generate migrations:
    ```bash
    npm run db:generate
    ```
*   Push schema directly to Supabase:
    ```bash
    npm run db:push
    ```
*   Populate initial mock data (optional):
    ```bash
    npm run db:seed
    ```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

BizHub includes a robust browser testing setup to validate auth flows, inventory updates, and multi-tenant constraints.

*   Run all E2E tests:
    ```bash
    npm run test:e2e
    ```
*   Run tests in interactive UI mode:
    ```bash
    npm run test:e2e:ui
    ```

---

## 🌐 Deployment (Vercel)

BizHub is optimized for zero-configuration deployment on **Vercel**.

### Configuration Steps:
1. **Link Repository**: Import the project repository into your Vercel Dashboard.
2. **Environment Variables**: Configure the environment variables in your Vercel Project Settings (under Settings > Environment Variables):
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
   * `DATABASE_URL` (ensure connection pooling `?pgbouncer=true` is appended to the connection string if needed for Serverless scaling)
   * `GEMINI_API_KEY`
3. **Build & Development Settings**:
   * **Framework Preset**: Next.js
   * **Build Command**: `next build` (Vercel will build and optimize the Edge/Serverless functions automatically)
   * **Output Directory**: Default (`.next`)


---

## 📂 Project Structure

```

├── drizzle/                 # Generated database migration files
├── public/                  # Static assets (images, logos, icons)
├── tests/                   # Playwright E2E test scripts
├── src/
│   ├── app/                 # Next.js App Router (Pages, Layouts, Server Actions)
│   │   ├── (dashboard)/     # Authenticated dashboard views (Catalog, Firm, Users, Audit)
│   │   ├── actions/         # Server Actions grouped by domain (auth, products, sales, etc.)
│   │   ├── login/           # User authentication
│   │   └── register/        # Company registration & onboarding
│   ├── components/          # Reusable UI components (Shared layout, Modals, Forms)
│   ├── db/                  # Drizzle ORM setup (schema.ts, db.ts connection, seed scripts)
│   └── lib/                 # Utility files, Supabase client initialization, AI helpers
```

---

## 📝 Commit Standard

We follow structured commit messages:
*   `feat:` - New features
*   `fix:` - Bug fixes
*   `docs:` - Documentation changes
*   `refactor:` - Code rewrites without feature or fix changes
*   `chore:` - Maintenance tasks (dependencies, configuration updates)

Example: `feat: implement punch-in dashboard button for employees`
