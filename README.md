# EMR Application (React + Express)

This project is now structured as a React frontend with an API-ready Express backend using mock JSON persistence.

## Structure

- `client/`: React UI (Vite)
- `server/`: Express API + file-backed mock data
- `server/data/db.json`: Mock datastore
- `database/schema.sql`: PostgreSQL schema for Neon (`emr` schema)

## Run

Install dependencies:

```powershell
npm install
```

Start frontend + backend together:

```powershell
npm run dev
```

- React UI: `http://localhost:5173`
- API: `http://localhost:4000/api`

## Login-first Workflow

Use tenant + email login on the first screen:

- Superadmin: Tenant `Platform Superadmin`, Email `superadmin@emr.local`
- Tenant Admin: Tenant `Selva Care Hospital`, Email `anita@sch.local`
- Patient: Tenant `Selva Care Hospital`, Email `meena@sch.local`

Build frontend:

```powershell
npm run build
```

## Backend API (mock)

- `GET /api/health`
- `POST /api/login`
- `GET /api/tenants`
- `POST /api/tenants`
- `GET /api/users?tenantId=...`
- `POST /api/users`
- `GET /api/bootstrap?tenantId=...`
- `GET /api/superadmin/overview`
- `GET /api/reports/summary?tenantId=...`
- `GET /api/realtime-tick?tenantId=...`
- `POST /api/patients`
- `PATCH /api/patients/:id/clinical`
- `GET /api/patients/:id/print/:docType?tenantId=...`
- `POST /api/appointments`
- `POST /api/appointments/self`
- `PATCH /api/appointments/:id/status`
- `PATCH /api/appointments/:id/reschedule`
- `POST /api/walkins`
- `POST /api/walkins/:id/convert`
- `POST /api/encounters`
- `POST /api/invoices`
- `PATCH /api/invoices/:id/pay`
- `POST /api/inventory-items`
- `PATCH /api/inventory-items/:id/stock`
- `POST /api/employees`
- `POST /api/employees/:id/leaves`
- `PATCH /api/tenants/:id/settings`

## Implemented UI Modules

- Dashboard
- Superadmin
- Patients
  - Formal health profile
  - Case history, medication, prescription, recommendations, feedbacks, test reports
  - Print invoice / health record / test reports
- Appointments
  - Staff scheduling + workflow statuses (`requested`, `scheduled`, `checked_in`, `completed`, `cancelled`, `no_show`)
  - Patient self-appointment request flow
  - Walk-in entry and conversion to patient
- EMR (encounters)
- Billing
- Inventory
- Employees (HR, shifts, salary, leave)
- Reports
- Admin (tenant settings + tenant user creation)

## Notes

- Multi-tenant context, tenant theming, and RBAC are active in UI and API payloads.
- Current backend is mock JSON storage to keep fast iteration.
- You can later swap `server/data/db.json` operations with PostgreSQL repository calls while keeping the API contract stable.
