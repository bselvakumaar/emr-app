# Technical Architecture & Design Document (TAD)

## 1. Executive Overview

The MedFlow EMR follows a **Multi-Tenant SaaS (Software as a Service)** architecture. It utilizes a **Single-Page Application (SPA)** frontend communicating with a **Stateless REST API** backend, backed by a relational **SQL Database**.

The core architectural principle is **Tenant Isolation at the Application Layer**. All database queries are scoped by a `tenant_id` to enforce data separation within a shared schema.

---

## 2. High-Level Architecture Diagram
*(Conceptual representation - see `DATA_FLOW_DIAGRAMS.md` for detailed Mermaid charts)*

**Client (Browser)** -> **Internet/CDN (Netlify)** -> **API Gateway (Express)** -> **Service Layer** -> **Repository Layer** -> **Database (PostgreSQL)**

---

## 3. Technology Stack

### 3.1 Frontend (Client)
- **Framework**: React 18 (Vite build tool)
- **Language**: JavaScript (ES6+)
- **State Management**: React `useState`/`useEffect` (Component-level state) + Top-Level `App.jsx` Props (Global store)
- **Routing**: Internal view-state management (Single Page)
- **Styling**: Essential CSS (Responsive Flex/Grid system)
- **HTTP Client**: `fetch` API wrapper (with JWT injection)

### 3.2 Backend (Server)
- **Runtime**: Node.js (Express.js)
- **Language**: JavaScript (ES Modules)
- **Security**:
  - `helmet`: HTTP headers
  - `cors`: Cross-Origin Resource Sharing
  - `bcryptjs`: Password hashing
  - `jsonwebtoken`: Stateless authentication
- **Database Interface**: `pg` (node-postgres)
- **Architecture Pattern**: Controller-Service-Repository

### 3.3 Database
- **Engine**: PostgreSQL 15+ (Neon / Render)
- **Schema**: Shared Schema (Single Database, Tables partitioned logically by `tenant_id`)
- **Key Tables**: `tenants`, `users`, `patients`, `encounters`, `invoices`, `inventory_items`

---

## 4. Component Design

### 4.1 Frontend Components
- **`App.jsx`**: Main controller. Handles Auth check, Routing, Global State (User, Tenant).
- **`AppLayout.jsx`**: Responsive shell. Sidebar (Desktop/Mobile), Header, User Menu.
- **`api.js`**: Central API service. Handles token storage, request interception, error logging.
- **Pages**:
  - `PatientsPage`: Master Patient Index, Registration Form.
  - `EmrPage`: Clinical workstation (SOAP notes, Rx).
  - `AppointmentsPage`: Calendar & Queue management.
  - `BillingPage`: Invoice generation & Payment history.

### 4.2 Backend Modules
- **`index.js`**: Application entry point. Route definitions and middleware application.
- **`middleware/auth.middleware.js`**:
  - `authenticate`: Verifies JWT signature.
  - `requireRole`: Checks user permission.
  - `requireTenant`: Ensures request is scoped to valid tenant.
- **`db/repository.js`**: Data Access Layer. Contains all SQL queries.
  - **Pattern**: Function-based exports (e.g., `getPatients`, `createEncounter`).
  - **Safety**: Uses Parameterized Queries ($1, $2) to prevent SQL Injection.

---

## 5. Security Architecture

### 5.1 Authentication Flow
1. **Login**: Client sends `email`, `password`, `tenantId`.
2. **Verification**: Server hashes input password and compares with DB hash.
3. **Token Issue**: Server signs a JWT containing `userId`, `tenantId`, `role`.
4. **Session**: Client stores JWT. All subsequent requests include `Authorization: Bearer <token>`.

### 5.2 Data Isolation Strategy (Multi-Tenancy)
- Every table (except `tenants`) has a **compulsory `tenant_id` foreign key**.
- The Repository Layer functions **must accept `tenantId`** as a parameter.
- **Enforcement**: API Middleware extracts `tenantId` from the verified JWT and passes it to the repository. The client cannot spoof this ID.

### 5.3 Input Validation
- Client-side: HTML5 form validation (`required`, `type="email"`).
- Server-side: API endpoints validate payloads before DB insertion.

---

## 6. Scalability & Performance

### 6.1 Database Optimization
- **Indexing**: Indexes on `tenant_id` (high cardinality), `email`, `mrn` for fast lookups.
- **Connection Pooling**: `pg-pool` manages database connections to handle concurrent requests efficiently.
- **Stateless API**: The backend is stateless, allowing for horizontal scaling (serverless funtions or multiple containers).

### 6.2 Frontend Optimization
- **Lazy Loading**: (Planned) Code-splitting for heavy modules like Reports/Charts.
- **Debouncing**: Search inputs (Patient Search) are debounced to reduce API load.
- **Optimistic UI**: (Planned) Immediate UI updates before server confirmation for interactions like "Mark as Paid".

---

## 7. Deployment Strategy

### 7.1 Production Environment
- **Hosting**: Netlify (Frontend + Serverless Functions) or Render (Unified Service).
- **Database**: Managed PostgreSQL (Neon Tech).
- **CI/CD**: Git-based deployment triggers.

### 7.2 Configuration
- Environment Variables (`.env`):
  - `DATABASE_URL`: Connection string.
  - `JWT_SECRET`: Signing key.
  - `NODE_ENV`: production/development toggle.
