# HR, Accounts, and Billing Enhancements

## Overview
New modules have been added to handle Employee Attendance, Financial Accounting, and Enhanced Patient Billing.

## 1. HR & Attendance
- **Module**: Employees
- **Features**:
  - **Employee Master**: manageable list of staff with roles and salaries.
  - **Daily Attendance**: Mark Check-in/Check-out times and status (Present, Absent, etc.).
  - **Leave Management**: Track employee leave requests.

## 2. Accounts Payable & Financials
- **Module**: Accounts Payable (New)
- **Features**:
  - **Record Outflows**: Track operational expenses categorized by type (Salary, Purchase, Maintenance, etc.).
  - **Payment Methods**: Record how expenses are paid (Bank Transfer, Cash, etc.).
  - **Financial Snapshot**: Real-time view of **Inward** (Revenue from Invoices) vs **Outward** (Expenses), giving a net balance.
  - **Payroll Projection**: Estimates monthly salary liability based on active employees.

## 3. Enhanced Billing & Payments
- **Module**: Billing
- **Features**:
  - **Payment Methods**: Now supports selecting payment modes (Cash, Card, UPI, Insurance) when creating an invoice or marking it as paid.
  - **Immediate Payment**: Invoices can be marked as "Paid/Settled" instantly upon creation if a payment method is selected.
  - **Audit Logging**: All payment methods and financial transactions are logged in the audit trail.

## Database Updates
A new migration file `database/migrations/002_finance_hr.sql` has been created. **Please run this SQL script** against your PostgreSQL database to create the necessary `attendance` and `expenses` tables.
