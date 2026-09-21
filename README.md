# RentConnect – Tenant & House Owner Management System

A modern, responsive full-stack web application that connects **house owners** and **tenants**. Owners list and manage properties, review rental requests, track rent and maintenance, and post notices. Tenants search and browse homes, apply, pay rent, and raise maintenance complaints. Admins oversee the whole platform.

![Stack](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Express](https://img.shields.io/badge/Express-4-000) ![Prisma](https://img.shields.io/badge/Prisma-5-2d3748) ![SQLite](https://img.shields.io/badge/SQLite-local-003b57) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + TypeScript + Vite, React Router, Tailwind CSS, Recharts, lucide-react, Axios |
| Backend | Node.js + Express (ESM), JWT auth, bcrypt, Zod validation |
| Database | SQLite via Prisma ORM (easy local dev — no external DB required) |
| Auth | JWT (Bearer tokens) with role-based authorization (Owner / Tenant / Admin) |

## Features

### Three roles
- **House Owner** – register/login, create & manage property listings (with multiple images and full details), view tenant applications, accept/reject requests, view current tenants, track rent payments, manage maintenance complaints, post announcements.
- **Tenant** – register/login, profile, search & filter available properties, view full details & images, send rental requests, track application status, view rental agreement, pay/record monthly rent, view payment history, submit & track maintenance complaints, receive notifications.
- **Admin** – dashboard with platform statistics, manage users, manage & approve/remove listings, monitor rental requests & complaints.

### Highlights
- Role-based dashboards with **cards, charts (bar/area/pie), and tables**.
- Property **search with filters**: location, min/max rent, bedrooms, bathrooms, furnishing, property type, amenities.
- Full **rental request workflow**: Pending → Accepted/Rejected/Cancelled, auto-creating a lease + first rent invoice on acceptance.
- **Rent management** with per-tenant rent tables (Paid / Pending / Overdue) and payment history.
- **Maintenance complaints** (Open / In Progress / Resolved) and a **notifications** system tied to every workflow.
- Beautiful, fully responsive UI.

## Project Structure

```
/workspace
├── server/            # Express + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma   # Data model
│   │   └── seed.js         # Sample data
│   └── src/
│       ├── index.js        # App entry
│       ├── lib/            # prisma, auth, notify helpers
│       ├── middleware/     # JWT auth + role guards
│       └── routes/         # auth, users, properties, requests, leases, payments, complaints, notifications, announcements, stats
└── client/            # React + Vite + Tailwind SPA
    └── src/
        ├── components/     # Layout, StatCard, PropertyCard, UI primitives
        ├── lib/            # api client, auth context, formatters
        └── pages/          # landing, auth, tenant/, owner/, admin/
```

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 22)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env          # already present in this repo
npm run setup                 # prisma generate + db push + seed
npm run dev                   # starts API on http://localhost:4000
```

`npm run setup` runs three steps you can also run individually:
```bash
npm run prisma:generate       # generate Prisma client
npm run prisma:push           # create the SQLite schema (server/prisma/dev.db)
npm run seed                  # load sample owners, tenants, properties, etc.
```

### 2. Frontend

```bash
cd client
npm install
npm run dev                   # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend at `http://localhost:4000`, so just open **http://localhost:5173**.

## Demo Accounts

All demo accounts use the password **`password123`**. The login page has one-click buttons to fill them in.

| Role | Email |
| --- | --- |
| Owner | `owner@rentconnect.com` |
| Tenant | `tenant@rentconnect.com` |
| Admin | `admin@rentconnect.com` |

Additional seeded owners (`marcus@`, `priya@`) and tenants (`david@`, `sara@`, `james@`) all share the same password.

## Environment Variables (`server/.env`)

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="rentconnect-dev-secret-change-me"
PORT=4000
CLIENT_ORIGIN="http://localhost:5173"
```

## API Overview

Base URL: `http://localhost:4000/api`

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET/POST/PUT/DELETE /properties`, `GET /properties/mine`, `PATCH /properties/:id/approval`
- `GET/POST /requests`, `GET /requests/mine|received`, `PATCH /requests/:id/status`
- `GET /leases/mine|tenants`, `PATCH /leases/:id/end`
- `GET/POST /payments`, `GET /payments/mine|received`, `PATCH /payments/:id/pay`
- `GET/POST /complaints`, `GET /complaints/mine|received`, `PATCH /complaints/:id/status`
- `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`
- `GET/POST/DELETE /announcements`, `GET /announcements/mine|feed`
- `GET /stats/owner|tenant|admin`

## Notes
- The SQLite database file (`server/prisma/dev.db`) is git-ignored; run `npm run setup` to regenerate it.
- Re-running `npm run seed` resets the sample data.
- Property images use Unsplash URLs; owners can add their own image URLs when creating/editing a property.
