export const INITIAL_TRANSACTIONS = [
  {
    id: '0x8a...4b2c',
    doc: 'UA-MED-8492',
    clinicianName: 'Dr. Olena Kovalenko',
    protocol: 'mhGAP Session 4',
    amount: '$85.00',
    status: 'SETTLED',
    date: '2026-03-25',
    time: '11:12:41'
  },
  {
    id: '0x3f...9e1a',
    doc: 'UA-MED-1104',
    clinicianName: 'Dr. Serhiy Morozov',
    protocol: 'Bravemind VR',
    amount: '$120.00',
    status: 'PENDING',
    date: '2026-03-25',
    time: '11:10:05'
  },
  {
    id: '0x7d...2c8f',
    doc: 'UA-MED-9932',
    clinicianName: 'Dr. Iryna Shevchenko',
    protocol: 'PTSD Initial',
    amount: '$65.00',
    status: 'SETTLED',
    date: '2026-03-25',
    time: '10:45:32'
  },
  {
    id: '0x1b...6d4e',
    doc: 'UA-MED-3321',
    clinicianName: 'Dr. Dmytro Bondarenko',
    protocol: 'mhGAP Session 1',
    amount: '$45.00',
    status: 'SETTLED',
    date: '2026-03-25',
    time: '10:30:12'
  }
];

export const INITIAL_CLINICIANS = [
  { id: 'UA-MED-8492', name: 'Dr. Olena Kovalenko', spec: 'PTSD Specialist', ver: 'DIIA_VERIFIED', sessions: 1240, status: 'ACTIVE', advanced: true },
  { id: 'UA-MED-1104', name: 'Dr. Serhiy Morozov', spec: 'VR Therapy', ver: 'DIIA_VERIFIED', sessions: 842, status: 'ACTIVE', advanced: true },
  { id: 'UA-MED-9932', name: 'Dr. Iryna Shevchenko', spec: 'CBT Expert', ver: 'DIIA_VERIFIED', sessions: 2150, status: 'ACTIVE' },
  { id: 'UA-MED-3321', name: 'Dr. Dmytro Bondarenko', spec: 'Crisis Psych', ver: 'DIIA_VERIFIED', sessions: 530, status: 'ACTIVE' },
  { id: 'UA-MED-5542', name: 'Dr. Anna Lysenko', spec: 'Trauma Care', ver: 'DIIA_VERIFIED', sessions: 1120, status: 'ACTIVE', advanced: true },
  { id: 'UA-MED-7721', name: 'Dr. Natalia Petrenko', spec: 'EMDR Specialist', ver: 'DIIA_VERIFIED', sessions: 940, status: 'ACTIVE' },
  { id: 'UA-MED-4409', name: 'Dr. Viktor Melnyk', spec: 'Military Psych', ver: 'DIIA_VERIFIED', sessions: 1860, status: 'ACTIVE', advanced: true }
];

export const SYMPTOM_DATA = [
  { name: 'Week 1', score: 85 },
  { name: 'Week 2', score: 78 },
  { name: 'Week 4', score: 62 },
  { name: 'Week 6', score: 45 },
  { name: 'Week 8', score: 32 },
  { name: 'Week 12', score: 24 }
];

export const OUTCOME_TREND = [
  { month: 'Jan', success: 62 },
  { month: 'Feb', success: 64 },
  { month: 'Mar', success: 68 }
];
