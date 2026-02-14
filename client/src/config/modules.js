export const moduleMeta = {
  superadmin: { title: 'Superadmin', subtitle: 'Platform-wide control center' },
  dashboard: { title: 'Dashboard', subtitle: 'Operational overview' },
  patients: { title: 'Patients', subtitle: 'Registration and health records' },
  appointments: { title: 'Appointments', subtitle: 'Scheduling, self-booking and walk-ins' },
  emr: { title: 'EMR', subtitle: 'Encounter and charting' },
  billing: { title: 'Billing', subtitle: 'Invoice and payment operations' },
  inventory: { title: 'Inventory', subtitle: 'Stock and reorder tracking' },
  employees: { title: 'Employees', subtitle: 'HR, shift, salary and leave' },
  reports: { title: 'Reports', subtitle: 'Periodical and monthly analytics' },
  admin: { title: 'Admin', subtitle: 'Tenant and user management' }
};

export const fallbackPermissions = {
  Superadmin: ['superadmin', 'dashboard', 'reports'],
  Admin: ['dashboard', 'patients', 'appointments', 'emr', 'billing', 'inventory', 'employees', 'reports', 'admin'],
  Doctor: ['dashboard', 'patients', 'appointments', 'emr', 'reports'],
  Nurse: ['dashboard', 'patients', 'appointments', 'emr'],
  'Front Office': ['dashboard', 'patients', 'appointments'],
  Billing: ['dashboard', 'billing', 'reports'],
  Inventory: ['dashboard', 'inventory', 'reports'],
  Patient: ['dashboard', 'appointments', 'patients']
};
