export const INITIAL_TRANSACTIONS = [
  { id: '0x8f...3b2a', doc: 'UA-MED-8492', clinicianName: 'Dr. Olena Kovalenko', protocol: 'mhGAP Session 4', amount: '$45.00', status: 'SETTLED', date: '2026-03-08', time: '14:22:10' },
  { id: '0x2a...9c1f', doc: 'UA-MED-1104', clinicianName: 'Dr. Serhiy Morozov', protocol: 'Bravemind VR', amount: '$120.00', status: 'SETTLED', date: '2026-03-08', time: '13:45:05' },
  { id: '0x5c...7d8e', doc: 'UA-MED-9932', clinicianName: 'Dr. Iryna Shevchenko', protocol: 'PTSD Initial', amount: '$60.00', status: 'PENDING', date: '2026-03-08', time: '15:10:30' },
  { id: '0x1e...4a5b', doc: 'UA-MED-3321', clinicianName: 'Dr. Dmytro Bondarenko', protocol: 'mhGAP Session 1', amount: '$45.00', status: 'SETTLED', date: '2026-03-08', time: '11:30:00' },
  { id: '0x9d...2f1c', doc: 'UA-MED-5542', clinicianName: 'Dr. Anna Lysenko', protocol: 'CBT Session 2', amount: '$55.00', status: 'SETTLED', date: '2026-03-08', time: '10:15:45' },
];

export const INITIAL_CLINICIANS = [
  { name: 'Dr. Olena Kovalenko', id: 'UA-MED-8492', spec: 'PTSD / Trauma', ver: 'DIIA VERIFIED', sessions: 142, status: 'ACTIVE', advanced: true },
  { name: 'Dr. Serhiy Morozov', id: 'UA-MED-1104', spec: 'CBT / Anxiety', ver: 'НСЗУ VERIFIED', sessions: 89, status: 'ACTIVE' },
  { name: 'Dr. Iryna Shevchenko', id: 'UA-MED-9932', spec: 'Child Psychology', ver: 'DIIA VERIFIED', sessions: 214, status: 'ON LEAVE', advanced: true },
  { name: 'Dr. Dmytro Bondarenko', id: 'UA-MED-3321', spec: 'Military Rehab', ver: 'НСЗУ VERIFIED', sessions: 56, status: 'ACTIVE' },
  { name: 'Dr. Natalia Petrenko', id: 'UA-MED-7721', spec: 'Crisis Intervention', ver: 'DIIA VERIFIED', sessions: 312, status: 'ACTIVE', advanced: true },
  { name: 'Dr. Viktor Melnyk', id: 'UA-MED-4409', spec: 'Addiction Recovery', ver: 'НСЗУ VERIFIED', sessions: 128, status: 'ACTIVE' },
  { name: 'Dr. Maria Sydorenko', id: 'UA-MED-2215', spec: 'Family Therapy', ver: 'DIIA VERIFIED', sessions: 95, status: 'ACTIVE' },
  { name: 'Dr. Oleksandr Tkachuk', id: 'UA-MED-6630', spec: 'Grief Counseling', ver: 'НСЗУ VERIFIED', sessions: 167, status: 'ACTIVE', advanced: true },
  { name: 'Dr. Yulia Boyko', id: 'UA-MED-1122', spec: 'Art Therapy', ver: 'DIIA VERIFIED', sessions: 45, status: 'ACTIVE' },
  { name: 'Dr. Artem Voloshyn', id: 'UA-MED-3344', spec: 'Neuropsychology', ver: 'НСЗУ VERIFIED', sessions: 210, status: 'ACTIVE', advanced: true },
  { name: 'Dr. Olena Zaitseva', id: 'UA-MED-5566', spec: 'Group Therapy', ver: 'DIIA VERIFIED', sessions: 134, status: 'ACTIVE' },
  { name: 'Dr. Ivan Franko', id: 'UA-MED-7788', spec: 'Rehabilitation', ver: 'НСЗУ VERIFIED', sessions: 88, status: 'ACTIVE' },
  { name: 'Dr. Lesya Ukrainka', id: 'UA-MED-9900', spec: 'Clinical Psych', ver: 'DIIA VERIFIED', sessions: 156, status: 'ACTIVE', advanced: true },
];

export const SYMPTOM_DATA = [
  { name: 'Intrusive Thoughts', before: 85, after: 32 },
  { name: 'Avoidance', before: 78, after: 28 },
  { name: 'Hyperarousal', before: 92, after: 41 },
  { name: 'Negative Cognition', before: 88, after: 35 },
  { name: 'Sleep Disturbance', before: 95, after: 44 },
];

export const OUTCOME_TREND = [
  { month: 'Oct', success: 62 },
  { month: 'Nov', success: 65 },
  { month: 'Dec', success: 68 },
  { month: 'Jan', success: 72 },
  { month: 'Feb', success: 75 },
  { month: 'Mar', success: 79 },
];
