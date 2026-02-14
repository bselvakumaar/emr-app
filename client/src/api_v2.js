/**
 * Frontend API Client with JWT Authentication
 * Updated version for PostgreSQL backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Token management
const TOKEN_KEY = 'emr_auth_token';
const USER_KEY = 'emr_user';
const SESSION_KEY = 'emr_session';

/**
 * Store authentication data in localStorage
 */
export function storeAuth(token, user, session) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Get stored authentication token
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get stored user data
 */
export function getStoredUser() {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

/**
 * Get stored session data
 */
export function getStoredSession() {
  const sessionData = localStorage.getItem(SESSION_KEY);
  return sessionData ? JSON.parse(sessionData) : null;
}

/**
 * Clear authentication data
 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Make an API request with automatic token inclusion
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add JWT token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      clearAuth();
      window.location.href = '/'; // Redirect to login
      throw new Error('Session expired. Please login again.');
    }
    
    // Parse JSON response
    const data = await response.json();
    
    // Handle error responses
    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * API Methods
 */

// =====================================================
// AUTHENTICATION
// =====================================================

export async function login(tenantId, email, password) {
  const data = await apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ tenantId, email, password }),
  });
  
  // Store authentication data
  storeAuth(data.token, data.user, { tenantId: data.tenantId, role: data.role });
  
  return data;
}

export function logout() {
  clearAuth();
  window.location.href = '/';
}

// =====================================================
// HEALTH CHECK
// =====================================================

export async function checkHealth() {
  return await apiRequest('/health');
}

// =====================================================
// TENANTS
// =====================================================

export async function getTenants() {
  return await apiRequest('/tenants');
}

export async function createTenant(data) {
  return await apiRequest('/tenants', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTenantSettings(tenantId, data) {
  return await apiRequest(`/tenants/${tenantId}/settings`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// =====================================================
// USERS
// =====================================================

export async function getUsers(tenantId) {
  const query = tenantId ? `?tenantId=${tenantId}` : '';
  return await apiRequest(`/users${query}`);
}

export async function createUser(data) {
  return await apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// =====================================================
// BOOTSTRAP
// =====================================================

export async function getBootstrapData(tenantId, userId) {
  return await apiRequest(`/bootstrap?tenantId=${tenantId}&userId=${userId}`);
}

// =====================================================
// SUPERADMIN
// =====================================================

export async function getSuperadminOverview() {
  return await apiRequest('/superadmin/overview');
}

// =====================================================
// PATIENTS
// =====================================================

export async function createPatient(data) {
  return await apiRequest('/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function addClinicalRecord(patientId, tenantId, section, payload) {
  return await apiRequest(`/patients/${patientId}/clinical`, {
    method: 'PATCH',
    body: JSON.stringify({ tenantId, section, payload }),
  });
}

export async function getPatientPrintData(patientId, docType, tenantId) {
  return await apiRequest(`/patients/${patientId}/print/${docType}?tenantId=${tenantId}`);
}

// =====================================================
// WALK-INS
// =====================================================

export async function createWalkin(data) {
  return await apiRequest('/walkins', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function convertWalkinToPatient(walkinId, data) {
  return await apiRequest(`/walkins/${walkinId}/convert`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// =====================================================
// APPOINTMENTS
// =====================================================

export async function createAppointment(data) {
  return await apiRequest('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createSelfAppointment(data) {
  return await apiRequest('/appointments/self', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAppointmentStatus(appointmentId, tenantId, status) {
  return await apiRequest(`/appointments/${appointmentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ tenantId, status }),
  });
}

export async function rescheduleAppointment(appointmentId, data) {
  return await apiRequest(`/appointments/${appointmentId}/reschedule`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// =====================================================
// ENCOUNTERS
// =====================================================

export async function createEncounter(data) {
  return await apiRequest('/encounters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// =====================================================
// INVOICES
// =====================================================

export async function createInvoice(data) {
  return await apiRequest('/invoices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function payInvoice(invoiceId, tenantId) {
  return await apiRequest(`/invoices/${invoiceId}/pay`, {
    method: 'PATCH',
    body: JSON.stringify({ tenantId }),
  });
}

// =====================================================
// INVENTORY
// =====================================================

export async function createInventoryItem(data) {
  return await apiRequest('/inventory-items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateInventoryStock(itemId, tenantId, delta) {
  return await apiRequest(`/inventory-items/${itemId}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ tenantId, delta }),
  });
}

// =====================================================
// EMPLOYEES
// =====================================================

export async function createEmployee(data) {
  return await apiRequest('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createEmployeeLeave(employeeId, data) {
  return await apiRequest(`/employees/${employeeId}/leaves`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// =====================================================
// REPORTS
// =====================================================

export async function getReportSummary(tenantId) {
  return await apiRequest(`/reports/summary?tenantId=${tenantId}`);
}

// =====================================================
// REALTIME
// =====================================================

export async function getRealtimeTick(tenantId) {
  return await apiRequest(`/realtime-tick?tenantId=${tenantId}`);
}

// =====================================================
// EXPORT ALL
// =====================================================

export default {
  // Auth
  login,
  logout,
  isAuthenticated,
  getToken,
  getStoredUser,
  getStoredSession,
  clearAuth,
  
  // Health
  checkHealth,
  
  // Tenants
  getTenants,
  createTenant,
  updateTenantSettings,
  
  // Users
  getUsers,
  createUser,
  
  // Bootstrap
  getBootstrapData,
  
  // Superadmin
  getSuperadminOverview,
  
  // Patients
  createPatient,
  addClinicalRecord,
  getPatientPrintData,
  
  // Walk-ins
  createWalkin,
  convertWalkinToPatient,
  
  // Appointments
  createAppointment,
  createSelfAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  
  // Encounters
  createEncounter,
  
  // Invoices
  createInvoice,
  payInvoice,
  
  // Inventory
  createInventoryItem,
  updateInventoryStock,
  
  // Employees
  createEmployee,
  createEmployeeLeave,
  
  // Reports
  getReportSummary,
  
  // Realtime
  getRealtimeTick,
};
