# MedFlow EMR Application (Premium v2.0)

This project is a high-end, multi-tenant Electronic Medical Records (EMR) system built with **React** (Vite), **Express.js**, and **PostgreSQL**. It features a robust multi-tenant architecture with role-based access control (RBAC) and a premium glassmorphic UI.

## 🚀 Project Documentation
We have reconciled our documentation into three primary authoritative guides:

- **[Scope & Requirements](docs/SCOPE_AND_REQUIREMENTS.md)**: Product definition, functional specs, and business scope.
- **[Technical Design](docs/TECHNICAL_DESIGN.md)**: Architecture, data flow diagrams, database schema, and implementation handbook.
- **[User Manual](docs/USER_MANUAL.md)**: Step-by-step role-based workflows and AI assistant guide.
- **[Testing Guide](docs/TESTING_GUIDE.md)**: UAT workflow validation and infrastructure checklists.

---

## 🏗️ Core Technology Stack

- **Frontend**: React 18, Vanilla CSS (Premium Glassmorphism), Vite.
- **Backend**: Express.js REST API.
- **Database**: PostgreSQL (Fully implemented repository layer).
- **Session**: JWT-based stateless authentication with BCrypt hashing.

---

## 🛠️ Development Setup

1. **Install dependencies**:
   ```powershell
   npm install
   ```

2. **Database Configuration**:
   - Ensure you have a `.env` file with `DATABASE_URL` and `JWT_SECRET`.
   - Use `npm run fix-passwords` if transitioning from legacy hash formats.

3. **Run locally**:
   ```powershell
   npm run dev
   ```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:4000/api`

---

## 🔑 Access Credentials

| Role | Tenant | Email | Password |
|------|--------|-------|----------|
| Superadmin | — | superadmin@emr.local | Admin@123 |
| Admin | Selva Care | anita@sch.local | Anita@123 |
| Doctor | Selva Care | rajesh@sch.local | Rajesh@123 |
| Patient | Selva Care | meena@sch.local | Meena@123 |

---

## 📦 System Modules

- **Dashboard**: Real-time glassmorphic metrics and clinical overview.
- **EMR (Clinical Workspace)**: Dual-pane consultation ledger with longitudinal journal.
- **Appointments**: Grid-based scheduling and walk-in queue management.
- **Pharmacy & Inventory**: Stock visual intelligence and focused dispensation.
- **Billing**: Branded invoice generation and payment registry.
- **HR & Employees**: Shift management and leave tracking.
- **Superadmin**: Global tenant lifecycle and platform monitoring.

---
*Note: This system is fully integrated with a production-grade PostgreSQL repository. Legacy mock JSON data has been deprecated.*
