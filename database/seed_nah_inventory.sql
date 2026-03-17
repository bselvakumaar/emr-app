-- New Age Hospital (NAH) Inventory and Pharmacy Data
-- Creates realistic inventory levels, low stock alerts, and pharmacy metrics

BEGIN;

-- =====================================================
-- NAH PHARMACY INVENTORY (100+ items for realistic metrics)
-- =====================================================
INSERT INTO emr.inventory (tenant_id, item_name, item_code, category, current_stock, min_stock_level, max_stock_level, unit_cost, supplier, last_restocked, created_at)
VALUES
-- Emergency Medications
('20000000-0000-0000-0000-000000000001','Epinephrine Auto-Injector','MED001','Emergency Medications',45,20,100,75.50,'Emergency Pharma',CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Nitroglycerin Tablets','MED002','Emergency Medications',120,50,200,15.25,'Emergency Pharma',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Albuterol Inhaler','MED003','Emergency Medications',85,30,150,45.00,'Emergency Pharma',CURRENT_DATE - INTERVAL '7 days',NOW()),
('20000000-0000-0000-0000-000000000001','Aspirin 325mg','MED004','Emergency Medications',500,200,1000,8.50,'Emergency Pharma',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Atropine Injection','MED005','Emergency Medications',25,10,50,125.75,'Emergency Pharma',CURRENT_DATE - INTERVAL '10 days',NOW()),

-- Pain Management
('20000000-0000-0000-0000-000000000001','Morphine Sulfate','PAIN001','Pain Management',65,20,100,85.50,'PainCare Pharma',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Fentanyl Citrate','PAIN002','Pain Management',35,15,75,250.00,'PainCare Pharma',CURRENT_DATE - INTERVAL '6 days',NOW()),
('20000000-0000-0000-0000-000000000001','Oxycodone 5mg','PAIN003','Pain Management',120,40,200,65.25,'PainCare Pharma',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Hydrocodone/APAP','PAIN004','Pain Management',200,60,300,45.75,'PainCare Pharma',CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Tramadol 50mg','PAIN005','Pain Management',150,50,250,35.50,'PainCare Pharma',CURRENT_DATE - INTERVAL '2 days',NOW()),

-- Antibiotics
('20000000-0000-0000-0000-000000000001','Amoxicillin 500mg','ANT001','Antibiotics',450,150,600,12.75,'AntiBiotic Corp',CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Ciprofloxacin 500mg','ANT002','Antibiotics',280,80,400,25.50,'AntiBiotic Corp',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Azithromycin 250mg','ANT003','Antibiotics',320,100,500,35.25,'AntiBiotic Corp',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Doxycycline 100mg','ANT004','Antibiotics',180,60,300,28.75,'AntiBiotic Corp',CURRENT_DATE - INTERVAL '6 days',NOW()),
('20000000-0000-0000-0000-000000000001','Clindamycin 300mg','ANT005','Antibiotics',95,30,200,65.50,'AntiBiotic Corp',CURRENT_DATE - INTERVAL '5 days',NOW()),

-- Cardiovascular Medications
('20000000-0000-0000-0000-000000000001','Lisinopril 10mg','CARD001','Cardiovascular',380,120,500,15.25,'CardioCare Pharma',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Metoprolol 50mg','CARD002','Cardiovascular',420,150,600,18.50,'CardioCare Pharma',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Amlodipine 5mg','CARD003','Cardiovascular',350,100,500,22.75,'CardioCare Pharma',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Atorvastatin 20mg','CARD004','Cardiovascular',520,200,800,35.50,'CardioCare Pharma',CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Warfarin 5mg','CARD005','Cardiovascular',85,25,150,45.25,'CardioCare Pharma',CURRENT_DATE - INTERVAL '7 days',NOW()),

-- Diabetes Medications
('20000000-0000-0000-0000-000000000001','Metformin 500mg','DIAB001','Diabetes',680,200,1000,12.50,'DiabCare Pharma',CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Insulin Glargine','DIAB002','Diabetes',120,40,200,185.75,'DiabCare Pharma',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Insulin Lispro','DIAB003','Diabetes',95,30,150,195.50,'DiabCare Pharma',CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Glipizide 5mg','DIAB004','Diabetes',280,80,400,25.25,'DiabCare Pharma',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Empagliflozin 10mg','DIAB005','Diabetes',150,50,250,125.75,'DiabCare Pharma',CURRENT_DATE - INTERVAL '6 days',NOW()),

-- Psychiatric Medications
('20000000-0000-0000-0000-000000000001','Sertraline 50mg','PSYCH001','Psychiatric',420,150,600,35.25,'MentalHealth Pharma',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Escitalopram 10mg','PSYCH002','Psychiatric',380,120,500,42.50,'MentalHealth Pharma',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Lorazepam 1mg','PSYCH003','Psychiatric',85,25,150,65.75,'MentalHealth Pharma',CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Quetiapine 25mg','PSYCH004','Psychiatric',120,40,200,85.50,'MentalHealth Pharma',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Lithium Carbonate','PSYCH005','Psychiatric',45,15,100,95.25,'MentalHealth Pharma',CURRENT_DATE - INTERVAL '7 days',NOW()),

-- Pediatric Medications
('20000000-0000-0000-0000-000000000001','Acetaminophen Children','PED001','Pediatric',280,100,400,8.25,'KidsCare Pharma',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Ibuprofen Children','PED002','Pediatric',350,120,500,10.50,'KidsCare Pharma',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Amoxicillin Suspension','PED003','Pediatric',180,60,300,22.75,'KidsCare Pharma',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Albuterol Nebulizer','PED004','Pediatric',120,40,200,35.50,'KidsCare Pharma',CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric Electrolyte','PED005','Pediatric',450,150,600,15.75,'KidsCare Pharma',CURRENT_DATE - INTERVAL '1 day',NOW()),

-- Surgical Supplies
('20000000-0000-0000-0000-000000000001','Surgical Gloves Size 7','SURG001','Surgical Supplies',850,200,1200,25.50,'SurgiSupply Co',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Surgical Gloves Size 8','SURG002','Surgical Supplies',920,250,1500,25.50,'SurgiSupply Co',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Surgical Masks','SURG003','Surgical Supplies',2500,500,5000,2.25,'SurgiSupply Co',CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Sterile Gauze Pads','SURG004','Surgical Supplies',1200,300,2000,15.75,'SurgiSupply Co',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Surgical Drapes','SURG005','Surgical Supplies',450,100,800,85.50,'SurgiSupply Co',CURRENT_DATE - INTERVAL '6 days',NOW()),

-- Laboratory Supplies
('20000000-0000-0000-0000-000000000001','Blood Collection Tubes','LAB001','Laboratory',1800,500,3000,3.25,'LabSupply Corp',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Urine Collection Cups','LAB002','Laboratory',2200,600,4000,1.75,'LabSupply Corp',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Gloves Latex','LAB003','Laboratory',1500,400,2500,18.50,'LabSupply Corp',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Lab Coats','LAB004','Laboratory',85,20,150,45.75,'LabSupply Corp',CURRENT_DATE - INTERVAL '7 days',NOW()),
('20000000-0000-0000-0000-000000000001','Microscope Slides','LAB005','Laboratory',1200,300,2000,8.25,'LabSupply Corp',CURRENT_DATE - INTERVAL '5 days',NOW()),

-- Diagnostic Imaging Supplies
('20000000-0000-0000-0000-000000000001','X-Ray Film','RAD001','Radiology',450,100,800,25.75,'RadSupply Co',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Contrast Media','RAD002','Radiology',85,25,150,185.50,'RadSupply Co',CURRENT_DATE - INTERVAL '6 days',NOW()),
('20000000-0000-0000-0000-000000000001','Ultrasound Gel','RAD003','Radiology',280,80,400,35.25,'RadSupply Co',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Lead Aprons','RAD004','Radiology',25,10,50,285.75,'RadSupply Co',CURRENT_DATE - INTERVAL '15 days',NOW()),
('20000000-0000-0000-0000-000000000001','Radiation Badges','RAD005','Radiology',120,40,200,45.50,'RadSupply Co',CURRENT_DATE - INTERVAL '10 days',NOW()),

-- Medical Equipment
('20000000-0000-0000-0000-000000000001','Blood Pressure Cuffs','EQUIP001','Equipment',65,20,100,125.50,'MedEquip Corp',CURRENT_DATE - INTERVAL '8 days',NOW()),
('20000000-0000-0000-0000-000000000001','Stethoscopes','EQUIP002','Equipment',35,15,75,185.75,'MedEquip Corp',CURRENT_DATE - INTERVAL '12 days',NOW()),
('20000000-0000-0000-0000-000000000001','Thermometers Digital','EQUIP003','Equipment',120,40,200,25.50,'MedEquip Corp',CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pulse Oximeters','EQUIP004','Equipment',45,15,75,285.25,'MedEquip Corp',CURRENT_DATE - INTERVAL '7 days',NOW()),
('20000000-0000-0000-0000-000000000001','Infusion Pumps','EQUIP005','Equipment',25,10,50,1250.75,'MedEquip Corp',CURRENT_DATE - INTERVAL '10 days',NOW()),

-- Wound Care Supplies
('20000000-0000-0000-0000-000000000001','Sterile Dressings','WOUND001','Wound Care',850,200,1200,15.75,'WoundCare Supplies',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Antiseptic Solution','WOUND002','Wound Care',1200,300,2000,12.50,'WoundCare Supplies',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Medical Tape','WOUND003','Wound Care',2500,500,4000,8.25,'WoundCare Supplies',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Sutures Assorted','WOUND004','Wound Care',450,100,800,65.50,'WoundCare Supplies',CURRENT_DATE - INTERVAL '6 days',NOW()),
('20000000-0000-0000-0000-000000000001','Wound Irrigation','WOUND005','Wound Care',680,200,1000,22.75,'WoundCare Supplies',CURRENT_DATE - INTERVAL '3 days',NOW()),

-- IV Supplies
('20000000-0000-0000-0000-000000000001','IV Catheters 18G','IV001','IV Supplies',1200,300,2000,8.50,'IVSupply Corp',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','IV Catheters 20G','IV002','IV Supplies',1500,400,2500,8.50,'IVSupply Corp',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','IV Tubing Sets','IV003','IV Supplies',850,200,1200,15.75,'IVSupply Corp',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','IV Solution Bags','IV004','IV Supplies',2200,500,4000,25.50,'IVSupply Corp',CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','IV Poles','IV005','IV Supplies',35,10,75,185.75,'IVSupply Corp',CURRENT_DATE - INTERVAL '8 days',NOW()),

-- Respiratory Supplies
('20000000-0000-0000-0000-000000000001','Oxygen Masks','RESP001','Respiratory',450,100,800,35.25,'RespSupply Co',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Nasal Cannulas','RESP002','Respiratory',1200,300,2000,12.50,'RespSupply Co',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Oxygen Tubing','RESP003','Respiratory',850,200,1200,18.75,'RespSupply Co',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Nebulizer Kits','RESP004','Respiratory',280,80,400,45.50,'RespSupply Co',CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','CPAP Masks','RESP005','Respiratory',85,25,150,125.75,'RespSupply Co',CURRENT_DATE - INTERVAL '7 days',NOW()),

-- Nutrition Supplies
('20000000-0000-0000-0000-000000000001','Enteral Formula','NUTR001','Nutrition',450,150,800,85.50,'NutriCare Corp',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Feeding Tubes','NUTR002','Nutrition',280,80,400,65.25,'NutriCare Corp',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','IV Nutrition Bags','NUTR003','Nutrition',120,40,200,185.75,'NutriCare Corp',CURRENT_DATE - INTERVAL '6 days',NOW()),
('20000000-0000-0000-0000-000000000001','Oral Supplements','NUTR004','Nutrition',680,200,1000,35.50,'NutriCare Corp',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Baby Formula','NUTR005','Nutrition',350,100,600,45.75,'NutriCare Corp',CURRENT_DATE - INTERVAL '3 days',NOW()),

-- Hospital Bed Supplies
('20000000-0000-0000-0000-000000000001','Bed Sheets','BED001','Bed Supplies',1200,300,2000,25.50,'HospitalSupply Co',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pillow Cases','BED002','Bed Supplies',1500,400,2500,15.75,'HospitalSupply Co',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Blankets','BED003','Bed Supplies',450,100,800,65.50,'HospitalSupply Co',CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Mattress Protectors','BED004','Bed Supplies',280,80,400,125.75,'HospitalSupply Co',CURRENT_DATE - INTERVAL '7 days',NOW()),
('20000000-0000-0000-0000-000000000001','Bed Pans','BED005','Bed Supplies',850,200,1200,35.25,'HospitalSupply Co',CURRENT_DATE - INTERVAL '4 days',NOW()),

-- Patient Care Supplies
('20000000-0000-0000-0000-000000000001','Patient Gowns','PATCARE001','Patient Care',2200,500,4000,18.50,'PatientCare Co',CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Bedpans','PATCARE002','Patient Care',450,100,800,25.75,'PatientCare Co',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Urinals','PATCARE003','Patient Care',680,200,1000,15.25,'PatientCare Co',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Emesis Basins','PATCARE004','Patient Care',1200,300,2000,8.50,'PatientCare Co',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Walker Bags','PATCARE005','Patient Care',350,100,600,45.75,'PatientCare Co',CURRENT_DATE - INTERVAL '5 days',NOW()),

-- Cleaning Supplies
('20000000-0000-0000-0000-000000000001','Disinfectant Spray','CLEAN001','Cleaning',850,200,1200,12.50,'CleanSupply Co',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Hand Sanitizer','CLEAN002','Cleaning',2200,500,4000,8.25,'CleanSupply Co',CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Medical Waste Bags','CLEAN003','Cleaning',3500,1000,6000,3.50,'CleanSupply Co',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Surface Wipes','CLEAN004','Cleaning',1800,400,3000,15.75,'CleanSupply Co',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Gloves Disposable','CLEAN005','Cleaning',4500,1000,8000,18.50,'CleanSupply Co',CURRENT_DATE - INTERVAL '1 day',NOW()),

-- Office Supplies
('20000000-0000-0000-0000-000000000001','Medical Chart Forms','OFF001','Office Supplies',2800,500,5000,2.25,'OfficeSupply Co',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Prescription Pads','OFF002','Office Supplies',1200,300,2000,8.50,'OfficeSupply Co',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Patient Folders','OFF003','Office Supplies',850,200,1200,15.75,'OfficeSupply Co',CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Medical Pens','OFF004','Office Supplies',2200,500,4000,3.25,'OfficeSupply Co',CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Label Maker Tape','OFF005','Office Supplies',450,100,800,25.50,'OfficeSupply Co',CURRENT_DATE - INTERVAL '6 days',NOW()),

-- Emergency Response Kit
('20000000-0000-0000-0000-000000000001','Emergency Kit Bag','ERKIT001','Emergency Kits',25,10,50,185.75,'Emergency Kit Co',CURRENT_DATE - INTERVAL '8 days',NOW()),
('20000000-0000-0000-0000-000000000001','Trauma Shears','ERKIT002','Emergency Kits',85,25,150,45.50,'Emergency Kit Co',CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Tourniquets','ERKIT003','Emergency Kits',120,40,200,65.25,'Emergency Kit Co',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Emergency Blankets','ERKIT004','Emergency Kits',450,100,800,35.50,'Emergency Kit Co',CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','First Aid Kits','ERKIT005','Emergency Kits',280,80,400,125.75,'Emergency Kit Co',CURRENT_DATE - INTERVAL '6 days',NOW()),

-- Specialty Items
('20000000-0000-0000-0000-000000000001','Crutches Adjustable','SPEC001','Specialty',45,15,75,125.50,'Specialty Medical',CURRENT_DATE - INTERVAL '10 days',NOW()),
('20000000-0000-0000-0000-000000000001','Walkers Standard','SPEC002','Specialty',35,10,75,185.75,'Specialty Medical',CURRENT_DATE - INTERVAL '8 days',NOW()),
('20000000-0000-0000-0000-000000000001','Wheelchairs Standard','SPEC003','Specialty',15,5,50,850.50,'Specialty Medical',CURRENT_DATE - INTERVAL '15 days',NOW()),
('20000000-0000-0000-0000-000000000001','Compression Stockings','SPEC004','Specialty',280,80,400,65.25,'Specialty Medical',CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Diabetic Supplies Kit','SPEC005','Specialty',120,40,200,125.75,'Specialty Medical',CURRENT_DATE - INTERVAL '6 days',NOW())

ON CONFLICT DO NOTHING;

-- =====================================================
-- NAH BED MANAGEMENT (Realistic bed occupancy)
-- =====================================================
INSERT INTO emr.beds (tenant_id, ward_name, bed_number, bed_type, status, patient_id, assigned_date, created_at)
VALUES
-- ICU Beds (10 total, 8 occupied)
('20000000-0000-0000-0000-000000000001','ICU','ICU-001','ICU','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-IP-001'),CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','ICU','ICU-002','ICU','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-IP-002'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','ICU','ICU-003','ICU','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-IP-003'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','ICU','ICU-004','ICU','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-ER-001'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','ICU','ICU-005','ICU','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-ER-002'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','ICU','ICU-006','ICU','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-ER-003'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','ICU','ICU-007','ICU','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-CHRON-002'),CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','ICU','ICU-008','ICU','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','ICU','ICU-009','ICU','maintenance',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','ICU','ICU-010','ICU','available',NULL,NULL,NOW()),

-- General Ward (60 total, 45 occupied)
('20000000-0000-0000-0000-000000000001','General','GW-001','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-011'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-002','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-012'),CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-003','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-013'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-004','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-014'),CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-005','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-015'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-006','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-016'),CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-007','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-017'),CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-008','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-018'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-009','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-019'),CURRENT_DATE - INTERVAL '6 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-010','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-020'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-011','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-CHRON-001'),CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-012','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-SURG-001'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-013','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-SURG-002'),CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-014','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-GER-001'),CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-015','General','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-GER-002'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-016','General','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-017','General','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-018','General','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-019','General','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','General','GW-020','General','available',NULL,NULL,NOW()),

-- Maternity Ward (15 total, 12 occupied)
('20000000-0000-0000-0000-000000000001','Maternity','MAT-001','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-MAT-001'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-002','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-MAT-002'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-003','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-001'),CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-004','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-002'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-005','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-003'),CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-006','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-004'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-007','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-005'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-008','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-006'),CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-009','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-007'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-010','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-008'),CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-011','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-009'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-012','Maternity','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-010'),CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-013','Maternity','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-014','Maternity','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','Maternity','MAT-015','Maternity','available',NULL,NULL,NOW()),

-- Pediatric Ward (25 total, 18 occupied)
('20000000-0000-0000-0000-000000000001','Pediatric','PED-001','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-PED-001'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-002','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-PED-002'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-003','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-PED-003'),CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-004','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-PED-004'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-005','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-011'),CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-006','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-012'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-007','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-013'),CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-008','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-014'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-009','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-015'),CURRENT_DATE - INTERVAL '5 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-010','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-016'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-011','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-017'),CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-012','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-018'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-013','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-019'),CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-014','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-OPD-020'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-015','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-CHRON-001'),CURRENT_DATE - INTERVAL '6 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-016','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-CHRON-002'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-017','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-SURG-001'),CURRENT_DATE - INTERVAL '4 days',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-018','Pediatric','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-SURG-002'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-019','Pediatric','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-020','Pediatric','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-021','Pediatric','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-022','Pediatric','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-023','Pediatric','available',NULL,NULL,NOW'),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-024','Pediatric','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','Pediatric','PED-025','Pediatric','available',NULL,NULL,NOW()),

-- Emergency Ward (8 total, 6 occupied)
('20000000-0000-0000-0000-000000000001','Emergency','ER-001','Emergency','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-ER-004'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Emergency','ER-002','Emergency','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-ER-005'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Emergency','ER-003','Emergency','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-ER-006'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Emergency','ER-004','Emergency','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-ER-007'),CURRENT_DATE - INTERVAL '1 day',NOW()),
('20000000-0000-0000-0000-000000000001','Emergency','ER-005','Emergency','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-MH-001'),CURRENT_DATE - INTERVAL '3 days',NOW()),
('20000000-0000-0000-0000-000000000001','Emergency','ER-006','Emergency','occupied',(SELECT id FROM emr.patients WHERE tenant_id = '20000000-0000-0000-0000-000000000001' AND mrn = 'NAH-MH-002'),CURRENT_DATE - INTERVAL '2 days',NOW()),
('20000000-0000-0000-0000-000000000001','Emergency','ER-007','Emergency','available',NULL,NULL,NOW()),
('20000000-0000-0000-0000-000000000001','Emergency','ER-008','Emergency','available',NULL,NULL,NOW())

ON CONFLICT DO NOTHING;

COMMIT;
