export const moduleMeta = {
  superadmin: { title: 'Superadmin', subtitle: 'Platform-wide control center' },
  dashboard: { title: 'Dashboard', subtitle: 'Operational overview' },
  patients: { title: 'Patients', subtitle: 'Registration and health records' },
  appointments: { title: 'Appointments', subtitle: 'Scheduling, self-booking and walk-ins' },
  emr: { title: 'EMR', subtitle: 'Encounter and charting' },
  inpatient: { title: 'Inpatient', subtitle: 'Admissions and bed management' },
  pharmacy: { title: 'Prescriptions', subtitle: 'Medication dispensing' },
  billing: { title: 'Billing', subtitle: 'Invoice and payment operations' },
  inventory: { title: 'Inventory', subtitle: 'Stock and reorder tracking' },
  employees: { title: 'Employees', subtitle: 'HR, shift, salary and leave' },
  reports: { title: 'Reports', subtitle: 'Periodical and monthly analytics' },
  admin: { title: 'Admin', subtitle: 'Tenant and user management' },
  accounts: { title: 'Accounts Payable', subtitle: 'Expenses and cash flow' },
  lab: { title: 'Laboratory', subtitle: 'Test results and diagnostics' },
  support: { title: 'Support', subtitle: 'Facility assistance and maintenance' }
};

export const fallbackPermissions = {
  Superadmin: ['superadmin', 'dashboard', 'reports'],
  Admin: ['dashboard', 'patients', 'appointments', 'emr', 'inpatient', 'pharmacy', 'billing', 'inventory', 'employees', 'reports', 'accounts', 'admin'],
  Doctor: ['dashboard', 'patients', 'appointments', 'emr', 'inpatient', 'pharmacy', 'reports'],
  Nurse: ['dashboard', 'patients', 'appointments', 'emr', 'inpatient', 'pharmacy'],
  Lab: ['dashboard', 'patients', 'reports'],
  Pharmacy: ['dashboard', 'pharmacy', 'inventory', 'reports'],
  'Support Staff': ['dashboard', 'patients', 'appointments'],
  'Front Office': ['dashboard', 'patients', 'appointments'],
  Billing: ['dashboard', 'billing', 'accounts', 'reports'],
  Inventory: ['dashboard', 'inventory', 'pharmacy', 'reports'],
  Patient: ['dashboard', 'appointments', 'patients']
};
