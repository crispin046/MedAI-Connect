import type { Doctor } from '../types';

export const mockDoctors: Doctor[] = [
  {
    id: 'doc_1',
    name: 'Dr. Aisha Bello',
    specialty: 'Pediatrician',
    location: {
      name: 'Lagos, Nigeria',
      latitude: 6.5244,
      longitude: 3.3792,
    },
    contact: {
      email: 'aisha.bello@medconnect.org',
      phone: '+234 800 123 4567',
      whatsapp: '+2348001234567',
    },
    bio: 'Dr. Aisha Bello is a dedicated pediatrician with over 15 years of experience in child healthcare, specializing in infectious diseases and nutrition. She is a passionate advocate for community health initiatives.',
    languages: ['English', 'Yoruba', 'Hausa'],
  },
  {
    id: 'doc_2',
    name: 'Dr. Samuel Kariuki',
    specialty: 'Cardiologist',
    location: {
      name: 'Nairobi, Kenya',
      latitude: -1.2921,
      longitude: 36.8219,
    },
    contact: {
      email: 'samuel.kariuki@medconnect.org',
      phone: '+254 700 987 6543',
      whatsapp: '+2547009876543',
    },
    bio: 'Dr. Samuel Kariuki is a leading cardiologist in East Africa, focusing on preventative care and advanced treatment for cardiovascular diseases. He is known for his patient-centered approach.',
    languages: ['English', 'Swahili'],
  },
  {
    id: 'doc_3',
    name: 'Dr. Fatima Diallo',
    specialty: 'General Physician',
    location: {
      name: 'Dakar, Senegal',
      latitude: 14.7167,
      longitude: -17.4677,
    },
    contact: {
      email: 'fatima.diallo@medconnect.org',
      phone: '+221 77 123 45 67',
      whatsapp: '+221771234567',
    },
    bio: 'Dr. Fatima Diallo has a broad range of experience in general medicine, providing comprehensive care to patients of all ages. She is fluent in multiple languages, making her accessible to a diverse patient population.',
    languages: ['French', 'Wolof', 'English'],
  },
  {
    id: 'doc_4',
    name: 'Dr. Kwame Addo',
    specialty: 'Infectious Disease Specialist',
    location: {
      name: 'Accra, Ghana',
      latitude: 5.6037,
      longitude: -0.1870,
    },
    contact: {
      email: 'kwame.addo@medconnect.org',
      phone: '+233 24 123 4567',
      whatsapp: '+233241234567',
    },
    bio: 'Dr. Kwame Addo is a renowned expert in tropical and infectious diseases. His research on malaria and other regional endemics has been instrumental in shaping public health policies.',
    languages: ['English', 'Twi'],
  },
   {
    id: 'doc_5',
    name: 'Dr. John Okoro',
    specialty: 'General Surgeon',
    location: {
      name: 'Kano, Nigeria',
      latitude: 12.0022,
      longitude: 8.5920,
    },
    contact: {
      email: 'john.okoro@medconnect.org',
      phone: '+234 901 765 4321',
      whatsapp: '+2349017654321',
    },
    bio: 'Dr. John Okoro is a skilled general surgeon with extensive experience in both emergency and elective procedures. He is committed to providing high-quality surgical care in resource-limited settings.',
    languages: ['English', 'Hausa'],
  },
  {
    id: 'doc_6',
    name: 'Dr. Grace Wanjiru',
    specialty: 'Obstetrician/Gynecologist',
    location: {
      name: 'Mombasa, Kenya',
      latitude: -4.0435,
      longitude: 39.6682,
    },
    contact: {
      email: 'grace.wanjiru@medconnect.org',
      phone: '+254 711 223 3445',
      whatsapp: '+2547112233445',
    },
    bio: "Dr. Grace Wanjiru is an OB/GYN focused on maternal and women's health. She has worked extensively with community programs to improve prenatal and postnatal care for mothers in rural areas.",
    languages: ['English', 'Swahili'],
  },
];