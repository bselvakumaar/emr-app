# User Manual & Testing Guide by Role

This document serves as both a **User Manual** for training and a **Testing Guide** (UAT) for validating workflows.

---

## 1. 👨‍⚕️ Doctor / Physician
**Objective**: Manage patient consultations, diagnosis, and prescriptions.

### Workflow & Test Cases
| Feature | Action / Step | Expected Outcome |
|:---|:---|:---|
| **Login** | Log in with Doctor credentials. | Dashboard loads with "My Appointments" and "Queue" visible. |
| **View Queue** | Navigate to **Appointments**. | List of patients checked in for today is visible. |
| **Start Consult** | Click **"Consult"** on a patient card or from the **EMR** list. | **EMR Consultation Screen** opens. History is visible. |
| **Review History** | Scroll to **"Clinical Record Journal"**. | Chronological list of past meds, labs, and findings is displayed. |
| **Vitals & Notes** | Enter BP, Heart Rate, and Chief Complaint. | Fields accept input and validate (e.g., numeric for HR). |
| **Prescribe (CPOE)** | Click **"+ Add Medicine"**. Enter "Paracetamol", "500mg", "1-0-1", "3 days". | Medication row is added to the list. |
| **Finalize** | Click **"Complete Consultation"**. | Encounter saved. Status updates to `Completed`. Print/View Rx button appears. |

---

## 2. 👩‍⚕️ Nurse
**Objective**: Triage patients, record vitals, and administer care.

### Workflow & Test Cases
| Feature | Action / Step | Expected Outcome |
|:---|:---|:---|
| **Intake / Triage** | Go to **Appointments**. Find patient status "Scheduled". | Change status to **"Checked In"**. |
| **Vitals Check** | Open patient record in **MPI**. Click **"Log Entry"** (Clinical Finding). | Record "BP: 120/80, Temp: 98.6". Entry appears in journal. |
| **Inpatient Care** | Navigate to **Inpatient** module. | View list of admitted patients and bed numbers. |
| **Administer Meds** | View active IPD patient. check "Medication Administration Record" (if avail). | Confirm meds given. Log time and dosage. |

---

## 3. 🧪 Lab Support / Technician
**Objective**: Process diagnostic requests and upload results.

### Workflow & Test Cases
| Feature | Action / Step | Expected Outcome |
|:---|:---|:---|
| **View Requests** | Go to **Laboratory** (or EMR pending lists). | View list of test orders (e.g., CBC, Lipid Profile). |
| **Access Patient** | Search patient by Name/MRN in **Patients** view. | Patient record opens. |
| **Log Results** | Use "Log Entry" -> Select **"Diagnostics"**. | Enter test results (e.g., "Hb: 14.5 g/dL"). |
| **Completing** | Save entry. | Result appears in patient's timeline for Doctor to review. |

---

## 4. 💊 Pharmacist
**Objective**: Dispense medications and manage inventory.

### Workflow & Test Cases
| Feature | Action / Step | Expected Outcome |
|:---|:---|:---|
| **Dispense Queue** | Go to **Pharmacy**. | List of final prescriptions from Doctors appears. |
| **Review Rx** | Click a prescription. | View details: Drug, Dosage, Qty. |
| **Stock Check** | Check **Inventory** status for items. | System warns if "Low Stock". |
| **Dispense** | Click **"Dispense"**. | Stock is deducted. Rx status becomes `Dispensed`. Invoice generated (if automated). |

---

## 5. 🏢 Front Office / Reception
**Objective**: Patient registration, appointment booking, and billing initiation.

### Workflow & Test Cases
| Feature | Action / Step | Expected Outcome |
|:---|:---|:---|
| **Registration** | Click **"+ Register New Patient"**. Fill Name, Phone, DOB. | Patient created. MRN generated (e.g., `SCH-1001`). |
| **Booking** | Go to **Appointments**. Click **"New Appointment"**. Select Doctor & Time. | Appointment created. Shows in Doctor's queue. |
| **Walk-in** | Go to **Appointments** -> **Walk-ins**. Add "John Doe". | Walk-in added. Can "Convert" to full patient later. |
| **Billing** | Go to **Billing**. Create Invoice for "Registration Fee". | Invoice created. Can mark as "Paid". |

---

## 6. 💼 Administrator (Hospital Admin)
**Objective**: Manage users, shifts, and facility settings.

### Workflow & Test Cases
| Feature | Action / Step | Expected Outcome |
|:---|:---|:---|
| **User Mgmt** | Go to **Admin** -> **Users**. Click **"Add User"**. | Create new "Doctor" or "Nurse" account. |
| **Settings** | Go to **Admin** -> **Settings**. Change "Accent Color". | Theme updates for all facility users. |
| **Reports** | Go to **Reports**. View "Revenue Report". | Graphs display financial data for the selected period. |

---

## 7. 🛠️ Support Team (IT / Technical)
**Objective**: System maintenance, troubleshooting, and configuration.

### Workflow & Test Cases
| Feature | Action / Step | Expected Outcome |
|:---|:---|:---|
| **Audit Logs** | Access Database / Superadmin view. | Check `audit_logs` table for login/action history. |
| **Tenant Config** | API: `PATCH /api/tenants/:id/settings`. | Update feature flags (e.g., toggle `telehealth: true`). |
| **Integrations** | Check API Health `GET /api/health`. | Response `200 OK`. Database connection active. |

---

## 8. 📊 Management / Auditor
**Objective**: Oversight, compliance, and financial auditing.

### Workflow & Test Cases
| Feature | Action / Step | Expected Outcome |
|:---|:---|:---|
| **Audit Views** | Go to **Reports**. Check "Patient Demographics" & "Revenue". | Accurate aggregate data displayed. |
| **Compliance** | Pick random Patient ID. Review "Clinical Journal". | Verify chart completeness (Vitals, Rx, Notes present). |
| **Staff Performance** | Go to **Employees**. Check "Leaves" and "Shifts". | Verify staffing levels and payroll inputs. |
