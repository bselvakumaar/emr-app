import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateId, formatNow, readDb, updateDb, tenantSlice } from './lib/store.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

const permissions = {
  Superadmin: ['superadmin', 'dashboard', 'reports'],
  Admin: ['dashboard', 'patients', 'appointments', 'emr', 'billing', 'inventory', 'employees', 'reports', 'admin'],
  Doctor: ['dashboard', 'patients', 'appointments', 'emr', 'reports'],
  Nurse: ['dashboard', 'patients', 'appointments', 'emr'],
  'Front Office': ['dashboard', 'patients', 'appointments'],
  Billing: ['dashboard', 'billing', 'reports'],
  Inventory: ['dashboard', 'inventory', 'reports'],
  Patient: ['dashboard', 'appointments', 'patients']
};

const appointmentStatuses = new Set(['requested', 'scheduled', 'checked_in', 'completed', 'cancelled', 'no_show']);

function requireTenant(req, res, next) {
  const tenantId = req.query.tenantId || req.body.tenantId;
  if (!tenantId) {
    return res.status(400).json({ error: 'tenantId is required' });
  }
  req.tenantId = tenantId;
  return next();
}

function appendAudit(db, { tenantId, userId, action }) {
  const user = db.users.find((u) => u.id === userId);
  db.auditLogs.push({
    id: generateId('log'),
    tenantId,
    userId,
    userName: user?.name || 'system',
    action,
    when: formatNow()
  });
}

function validateAppointmentCommon(draft, { tenantId, patientId, providerId, start, end }) {
  if (!tenantId || !patientId || !providerId || !start || !end) {
    return 'Missing required fields';
  }
  if (new Date(end) <= new Date(start)) {
    return 'End must be after start';
  }

  const patient = draft.patients.find((p) => p.id === patientId && p.tenantId === tenantId);
  if (!patient) {
    return 'Patient not found for tenant';
  }

  const provider = draft.users.find((u) => u.id === providerId && u.tenantId === tenantId);
  if (!provider) {
    return 'Provider not found for tenant';
  }

  return null;
}

function monthlyBuckets(rows, dateField, valueField) {
  const map = {};
  rows.forEach((row) => {
    const value = row[dateField];
    if (!value) {
      return;
    }
    const month = String(value).slice(0, 7);
    if (!map[month]) {
      map[month] = { month, count: 0, amount: 0 };
    }
    map[month].count += 1;
    map[month].amount += Number(row[valueField] || 0);
  });
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'emr-api', now: new Date().toISOString() });
});

app.post('/api/login', (req, res) => {
  const { tenantId, email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  const db = readDb();
  let user = null;

  if (tenantId === 'superadmin') {
    user = db.users.find((u) => u.role === 'Superadmin' && u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid superadmin credentials' });
    }
    return res.json({
      token: `mock-${user.id}`,
      user,
      tenantId: null,
      role: user.role
    });
  }

  if (!tenantId) {
    return res.status(400).json({ error: 'tenantId is required for tenant login' });
  }

  user = db.users.find(
    (u) => u.tenantId === tenantId && u.email.toLowerCase() === String(email).toLowerCase() && u.isActive
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  updateDb((draft) => {
    appendAudit(draft, { tenantId, userId: user.id, action: 'auth.login success' });
  });

  return res.json({
    token: `mock-${user.id}`,
    user,
    tenantId,
    role: user.role
  });
});

app.get('/api/tenants', (_req, res) => {
  const db = readDb();
  res.json(db.tenants);
});

app.post('/api/tenants', (req, res) => {
  const { name, code, subdomain, primaryColor, accentColor } = req.body;
  if (!name || !code || !subdomain) {
    return res.status(400).json({ error: 'name, code, subdomain required' });
  }

  const db = updateDb((draft) => {
    draft.tenants.push({
      id: generateId('t'),
      name,
      code,
      subdomain,
      theme: { primary: primaryColor || '#0f5a6e', accent: accentColor || '#f57f17' },
      features: { inventory: true, telehealth: false },
      status: 'active'
    });
  });

  res.status(201).json(db.tenants[db.tenants.length - 1]);
});

app.get('/api/users', (req, res) => {
  const { tenantId } = req.query;
  const db = readDb();
  if (!tenantId) {
    return res.json(db.users);
  }
  res.json(db.users.filter((u) => u.tenantId === tenantId));
});

app.post('/api/users', (req, res) => {
  const { tenantId, name, email, role, patientId } = req.body;
  if (!tenantId || !name || !email || !role) {
    return res.status(400).json({ error: 'tenantId, name, email, role required' });
  }

  const db = updateDb((draft) => {
    draft.users.push({
      id: generateId('u'),
      tenantId,
      name,
      email,
      role,
      patientId: patientId || null,
      isActive: true
    });
  });

  res.status(201).json(db.users[db.users.length - 1]);
});

app.get('/api/bootstrap', requireTenant, (req, res) => {
  const db = readDb();
  const tenant = db.tenants.find((t) => t.id === req.tenantId);
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  const data = tenantSlice(db, req.tenantId);
  data.walkins = db.walkins.filter((x) => x.tenantId === req.tenantId);
  data.employees = db.employees.filter((x) => x.tenantId === req.tenantId);
  data.employeeLeaves = db.employeeLeaves.filter((x) => x.tenantId === req.tenantId);

  const userId = req.query.userId;
  const activeUser = userId ? db.users.find((u) => u.id === userId && u.tenantId === req.tenantId) : null;

  if (activeUser?.role === 'Patient' && activeUser.patientId) {
    const patientId = activeUser.patientId;
    data.patients = data.patients.filter((p) => p.id === patientId);
    data.appointments = data.appointments.filter((a) => a.patientId === patientId);
    data.encounters = data.encounters.filter((e) => e.patientId === patientId);
    data.invoices = data.invoices.filter((i) => i.patientId === patientId);
  }

  return res.json({
    tenant,
    ...data,
    permissions
  });
});

app.get('/api/superadmin/overview', (_req, res) => {
  const db = readDb();
  const tenantStats = db.tenants.map((tenant) => ({
    tenantId: tenant.id,
    tenantName: tenant.name,
    users: db.users.filter((u) => u.tenantId === tenant.id).length,
    patients: db.patients.filter((p) => p.tenantId === tenant.id).length,
    appointments: db.appointments.filter((a) => a.tenantId === tenant.id).length,
    revenue: db.invoices
      .filter((i) => i.tenantId === tenant.id)
      .reduce((sum, inv) => sum + Number(inv.paid || 0), 0)
  }));

  res.json({
    tenants: tenantStats,
    totals: {
      tenants: db.tenants.length,
      users: db.users.length,
      patients: db.patients.length,
      appointments: db.appointments.length
    }
  });
});

app.post('/api/patients', (req, res) => {
  const {
    tenantId,
    userId,
    firstName,
    lastName,
    dob,
    gender,
    phone,
    email,
    address,
    bloodGroup,
    emergencyContact,
    insurance,
    chronicConditions,
    allergies,
    surgeries,
    familyHistory
  } = req.body;

  if (!tenantId || !firstName || !lastName) {
    return res.status(400).json({ error: 'tenantId, firstName, lastName are required' });
  }

  const db = updateDb((draft) => {
    const tenant = draft.tenants.find((t) => t.id === tenantId);
    const currentCount = draft.patients.filter((p) => p.tenantId === tenantId).length;
    const patient = {
      id: generateId('p'),
      tenantId,
      mrn: `${tenant.code}-${currentCount + 1001}`,
      firstName,
      lastName,
      dob,
      gender,
      phone,
      email: email || '',
      address: address || '',
      bloodGroup: bloodGroup || '',
      emergencyContact: emergencyContact || '',
      insurance: insurance || '',
      medicalHistory: {
        chronicConditions: chronicConditions || '',
        allergies: allergies || '',
        surgeries: surgeries || '',
        familyHistory: familyHistory || ''
      },
      caseHistory: [],
      medications: [],
      prescriptions: [],
      recommendations: [],
      feedbacks: [],
      testReports: [],
      createdAt: new Date().toISOString()
    };
    draft.patients.push(patient);
    appendAudit(draft, { tenantId, userId, action: `patient.create ${patient.mrn}` });
  });

  res.status(201).json(db.patients[db.patients.length - 1]);
});

app.patch('/api/patients/:id/clinical', (req, res) => {
  const { id } = req.params;
  const { tenantId, userId, section, payload } = req.body;

  if (!tenantId || !section || !payload) {
    return res.status(400).json({ error: 'tenantId, section, payload required' });
  }

  const validSections = new Set(['caseHistory', 'medications', 'prescriptions', 'recommendations', 'feedbacks', 'testReports']);
  if (!validSections.has(section)) {
    return res.status(400).json({ error: 'Invalid clinical section' });
  }

  let patient = null;
  updateDb((draft) => {
    patient = draft.patients.find((p) => p.id === id && p.tenantId === tenantId);
    if (!patient) {
      return;
    }
    patient[section].push(payload);
    appendAudit(draft, { tenantId, userId, action: `patient.${section}.add ${id}` });
  });

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  return res.json(patient);
});

app.get('/api/patients/:id/print/:docType', (req, res) => {
  const { id, docType } = req.params;
  const { tenantId } = req.query;
  if (!tenantId) {
    return res.status(400).json({ error: 'tenantId required' });
  }

  const db = readDb();
  const patient = db.patients.find((p) => p.id === id && p.tenantId === tenantId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  if (docType === 'invoice') {
    const invoices = db.invoices.filter((i) => i.tenantId === tenantId && i.patientId === id);
    return res.json({
      title: 'Patient Invoice Statement',
      patient,
      rows: invoices
    });
  }

  if (docType === 'health-record') {
    return res.json({
      title: 'Patient Health Record',
      patient,
      rows: [
        ...patient.caseHistory,
        ...patient.medications,
        ...patient.prescriptions,
        ...patient.recommendations
      ]
    });
  }

  if (docType === 'test-reports') {
    return res.json({
      title: 'Patient Test Reports',
      patient,
      rows: patient.testReports
    });
  }

  return res.status(400).json({ error: 'Invalid docType' });
});

app.post('/api/walkins', (req, res) => {
  const { tenantId, userId, name, phone, reason } = req.body;
  if (!tenantId || !name || !phone) {
    return res.status(400).json({ error: 'tenantId, name, phone required' });
  }

  const db = updateDb((draft) => {
    draft.walkins.push({
      id: generateId('w'),
      tenantId,
      name,
      phone,
      reason,
      createdAt: new Date().toISOString(),
      status: 'waiting'
    });
    appendAudit(draft, { tenantId, userId, action: 'walkin.create' });
  });

  res.status(201).json(db.walkins[db.walkins.length - 1]);
});

app.post('/api/walkins/:id/convert', (req, res) => {
  const { id } = req.params;
  const { tenantId, userId, dob, gender } = req.body;
  if (!tenantId) {
    return res.status(400).json({ error: 'tenantId required' });
  }

  let patient = null;
  updateDb((draft) => {
    const walkin = draft.walkins.find((w) => w.id === id && w.tenantId === tenantId);
    if (!walkin) {
      return;
    }

    const tenant = draft.tenants.find((t) => t.id === tenantId);
    const currentCount = draft.patients.filter((p) => p.tenantId === tenantId).length;
    const [firstName, ...rest] = walkin.name.split(' ');

    patient = {
      id: generateId('p'),
      tenantId,
      mrn: `${tenant.code}-${currentCount + 1001}`,
      firstName,
      lastName: rest.join(' ') || '.',
      dob: dob || '',
      gender: gender || '',
      phone: walkin.phone,
      email: '',
      address: '',
      bloodGroup: '',
      emergencyContact: '',
      insurance: '',
      medicalHistory: { chronicConditions: '', allergies: '', surgeries: '', familyHistory: '' },
      caseHistory: [],
      medications: [],
      prescriptions: [],
      recommendations: [],
      feedbacks: [],
      testReports: [],
      createdAt: new Date().toISOString()
    };

    draft.patients.push(patient);
    walkin.status = 'converted';
    walkin.patientId = patient.id;
    appendAudit(draft, { tenantId, userId, action: `walkin.convert ${id}` });
  });

  if (!patient) {
    return res.status(404).json({ error: 'Walkin not found' });
  }
  return res.status(201).json(patient);
});

app.post('/api/appointments', (req, res) => {
  const { tenantId, userId, patientId, providerId, start, end, reason } = req.body;

  const validationError = validateAppointmentCommon(readDb(), { tenantId, patientId, providerId, start, end });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const db = updateDb((draft) => {
    const item = {
      id: generateId('a'),
      tenantId,
      patientId,
      providerId,
      start,
      end,
      reason,
      source: 'staff',
      status: 'scheduled'
    };
    draft.appointments.push(item);
    appendAudit(draft, { tenantId, userId, action: `appointment.create ${item.id}` });
  });

  res.status(201).json(db.appointments[db.appointments.length - 1]);
});

app.post('/api/appointments/self', (req, res) => {
  const { tenantId, userId, patientId, providerId, start, end, reason } = req.body;

  const dbSnapshot = readDb();
  const validationError = validateAppointmentCommon(dbSnapshot, { tenantId, patientId, providerId, start, end });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (userId) {
    const user = dbSnapshot.users.find((u) => u.id === userId && u.tenantId === tenantId);
    if (user?.role === 'Patient' && user.patientId && user.patientId !== patientId) {
      return res.status(403).json({ error: 'Patient can only self-book their own appointment' });
    }
  }

  const db = updateDb((draft) => {
    const item = {
      id: generateId('a'),
      tenantId,
      patientId,
      providerId,
      start,
      end,
      reason,
      source: 'self',
      status: 'requested'
    };
    draft.appointments.push(item);
    appendAudit(draft, { tenantId, userId, action: `appointment.self_requested ${item.id}` });
  });

  res.status(201).json(db.appointments[db.appointments.length - 1]);
});

app.patch('/api/appointments/:id/status', (req, res) => {
  const { tenantId, userId, status } = req.body;
  const { id } = req.params;
  if (!tenantId || !status) {
    return res.status(400).json({ error: 'tenantId and status are required' });
  }
  if (!appointmentStatuses.has(status)) {
    return res.status(400).json({ error: 'Invalid appointment status' });
  }

  let updated = null;
  updateDb((draft) => {
    const item = draft.appointments.find((a) => a.id === id && a.tenantId === tenantId);
    if (!item) {
      return;
    }

    if (status === 'checked_in' && !['scheduled'].includes(item.status)) {
      return;
    }
    if (status === 'completed' && !['checked_in', 'scheduled'].includes(item.status)) {
      return;
    }

    item.status = status;
    updated = item;

    if (status === 'completed') {
      const linked = draft.encounters.find(
        (e) => e.tenantId === tenantId && e.patientId === item.patientId && e.status === 'open'
      );
      if (linked) {
        linked.status = 'closed';
      }
    }
    appendAudit(draft, { tenantId, userId, action: `appointment.${status} ${id}` });
  });

  if (!updated) {
    return res.status(404).json({ error: 'Appointment not found or invalid transition' });
  }
  return res.json(updated);
});

app.patch('/api/appointments/:id/reschedule', (req, res) => {
  const { tenantId, userId, start, end, reason } = req.body;
  const { id } = req.params;

  if (!tenantId || !start || !end) {
    return res.status(400).json({ error: 'tenantId, start and end are required' });
  }
  if (new Date(end) <= new Date(start)) {
    return res.status(400).json({ error: 'End must be after start' });
  }

  let updated = null;
  updateDb((draft) => {
    const item = draft.appointments.find((a) => a.id === id && a.tenantId === tenantId);
    if (!item) {
      return;
    }
    item.start = start;
    item.end = end;
    item.reason = reason || item.reason;
    item.status = item.source === 'self' ? 'requested' : 'scheduled';
    updated = item;
    appendAudit(draft, { tenantId, userId, action: `appointment.rescheduled ${id}` });
  });

  if (!updated) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  return res.json(updated);
});

app.post('/api/encounters', (req, res) => {
  const { tenantId, userId, patientId, providerId, type, complaint, diagnosis, notes } = req.body;
  if (!tenantId || !patientId || !providerId || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = updateDb((draft) => {
    const encounter = {
      id: generateId('e'),
      tenantId,
      patientId,
      providerId,
      type,
      complaint,
      diagnosis,
      notes,
      visitDate: new Date().toISOString().slice(0, 10),
      status: 'open'
    };
    draft.encounters.push(encounter);
    appendAudit(draft, { tenantId, userId, action: `encounter.create ${encounter.id}` });
  });

  res.status(201).json(db.encounters[db.encounters.length - 1]);
});

app.post('/api/invoices', (req, res) => {
  const { tenantId, userId, patientId, description, amount, taxPercent } = req.body;
  if (!tenantId || !patientId || amount == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = updateDb((draft) => {
    const tenant = draft.tenants.find((t) => t.id === tenantId);
    const invoiceCount = draft.invoices.filter((x) => x.tenantId === tenantId).length + 1;
    const subtotal = Number(amount);
    const tax = subtotal * (Number(taxPercent || 0) / 100);
    const total = subtotal + tax;
    const invoice = {
      id: generateId('inv'),
      tenantId,
      patientId,
      number: `${tenant.code}-INV-${String(invoiceCount).padStart(4, '0')}`,
      description,
      subtotal,
      tax,
      total,
      paid: 0,
      status: 'issued',
      createdAt: new Date().toISOString()
    };
    draft.invoices.push(invoice);
    appendAudit(draft, { tenantId, userId, action: `invoice.issue ${invoice.number}` });
  });

  res.status(201).json(db.invoices[db.invoices.length - 1]);
});

app.patch('/api/invoices/:id/pay', (req, res) => {
  const { tenantId, userId } = req.body;
  const { id } = req.params;
  if (!tenantId) {
    return res.status(400).json({ error: 'tenantId required' });
  }

  let updated = null;
  updateDb((draft) => {
    const invoice = draft.invoices.find((x) => x.id === id && x.tenantId === tenantId);
    if (!invoice) {
      return;
    }
    invoice.paid = invoice.total;
    invoice.status = 'paid';
    updated = invoice;
    appendAudit(draft, { tenantId, userId, action: `invoice.paid ${invoice.number}` });
  });

  if (!updated) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  return res.json(updated);
});

app.post('/api/inventory-items', (req, res) => {
  const { tenantId, userId, code, name, category, stock, reorder } = req.body;
  if (!tenantId || !code || !name) {
    return res.status(400).json({ error: 'tenantId, code and name are required' });
  }

  const db = updateDb((draft) => {
    const item = {
      id: generateId('i'),
      tenantId,
      code,
      name,
      category,
      stock: Number(stock || 0),
      reorder: Number(reorder || 0)
    };
    draft.inventory.push(item);
    appendAudit(draft, { tenantId, userId, action: `inventory.create ${item.code}` });
  });

  res.status(201).json(db.inventory[db.inventory.length - 1]);
});

app.patch('/api/inventory-items/:id/stock', (req, res) => {
  const { tenantId, userId, delta } = req.body;
  const { id } = req.params;
  if (!tenantId || Number.isNaN(Number(delta))) {
    return res.status(400).json({ error: 'tenantId and numeric delta are required' });
  }

  let updated = null;
  updateDb((draft) => {
    const item = draft.inventory.find((x) => x.id === id && x.tenantId === tenantId);
    if (!item) {
      return;
    }
    item.stock = Math.max(0, Number(item.stock) + Number(delta));
    updated = item;
    appendAudit(draft, {
      tenantId,
      userId,
      action: `inventory.${Number(delta) > 0 ? 'receipt' : 'issue'} ${item.code}`
    });
  });

  if (!updated) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }
  return res.json(updated);
});

app.post('/api/employees', (req, res) => {
  const { tenantId, name, code, department, designation, joinDate, shift, salary } = req.body;
  if (!tenantId || !name || !code) {
    return res.status(400).json({ error: 'tenantId, name, code required' });
  }

  const db = updateDb((draft) => {
    draft.employees.push({
      id: generateId('emp'),
      tenantId,
      name,
      code,
      department,
      designation,
      joinDate,
      shift,
      salary: Number(salary || 0),
      leaveBalance: 12
    });
  });

  res.status(201).json(db.employees[db.employees.length - 1]);
});

app.post('/api/employees/:id/leaves', (req, res) => {
  const { id } = req.params;
  const { tenantId, from, to, type } = req.body;
  if (!tenantId || !from || !to || !type) {
    return res.status(400).json({ error: 'tenantId, from, to, type required' });
  }

  const db = updateDb((draft) => {
    draft.employeeLeaves.push({
      id: generateId('lv'),
      tenantId,
      employeeId: id,
      from,
      to,
      type,
      status: 'Pending'
    });
  });

  res.status(201).json(db.employeeLeaves[db.employeeLeaves.length - 1]);
});

app.get('/api/reports/summary', requireTenant, (req, res) => {
  const db = readDb();
  const { tenantId } = req;

  const appointments = db.appointments.filter((x) => x.tenantId === tenantId);
  const invoices = db.invoices.filter((x) => x.tenantId === tenantId);
  const employees = db.employees.filter((x) => x.tenantId === tenantId);

  const monthlyAppointments = monthlyBuckets(appointments, 'start', 'paid');
  const monthlyRevenue = monthlyBuckets(invoices, 'createdAt', 'paid');
  const totalTax = invoices.reduce((sum, x) => sum + Number(x.tax || 0), 0);

  res.json({
    periodical: {
      dailyAppointments: appointments.filter((a) => String(a.start).slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
      openAppointments: appointments.filter((a) => ['requested', 'scheduled', 'checked_in'].includes(a.status)).length,
      pendingInvoices: invoices.filter((i) => i.status !== 'paid').length
    },
    monthlyComparison: {
      appointments: monthlyAppointments,
      revenue: monthlyRevenue
    },
    tax: {
      applicable: totalTax > 0,
      totalTax
    },
    hr: {
      employees: employees.length,
      salaryOutflow: employees.reduce((sum, e) => sum + Number(e.salary || 0), 0)
    }
  });
});

app.patch('/api/tenants/:id/settings', (req, res) => {
  const { id } = req.params;
  const { userId, displayName, primaryColor, accentColor, featureInventory, featureTelehealth } = req.body;

  let tenant = null;
  updateDb((draft) => {
    const t = draft.tenants.find((x) => x.id === id);
    if (!t) {
      return;
    }
    if (displayName) {
      t.name = displayName;
    }
    t.theme = {
      primary: primaryColor || t.theme.primary,
      accent: accentColor || t.theme.accent
    };
    t.features = {
      inventory: Boolean(featureInventory),
      telehealth: Boolean(featureTelehealth)
    };
    tenant = t;
    appendAudit(draft, { tenantId: id, userId, action: 'tenant.settings.update' });
  });

  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }
  return res.json(tenant);
});

app.get('/api/realtime-tick', requireTenant, (req, res) => {
  const { tenantId } = req;
  updateDb((draft) => {
    const scheduled = draft.appointments.filter((a) => a.tenantId === tenantId && ['scheduled', 'checked_in'].includes(a.status));
    if (scheduled.length) {
      const pick = scheduled[Math.floor(Math.random() * scheduled.length)];
      if (new Date(pick.start).getTime() < Date.now() + 60 * 60 * 1000) {
        pick.status = 'completed';
        appendAudit(draft, { tenantId, userId: null, action: `realtime.appointment.completed ${pick.id}` });
        return;
      }
    }

    const items = draft.inventory.filter((x) => x.tenantId === tenantId && Number(x.stock) > 0);
    if (items.length) {
      const item = items[Math.floor(Math.random() * items.length)];
      item.stock -= 1;
      appendAudit(draft, { tenantId, userId: null, action: `realtime.inventory.issue ${item.code}` });
    }
  });

  const db = readDb();
  res.json(tenantSlice(db, tenantId));
});

app.listen(PORT, () => {
  console.log(`EMR API listening on http://localhost:${PORT}`);
});
