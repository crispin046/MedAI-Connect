

export interface PatientData {
  age: string;
  symptoms: string;
  vitals: string;
  history: string;
}

export interface GroundingSource {
    uri: string;
    title: string;
    type: 'web' | 'maps';
}

export interface TriageResult {
  possibleConditions: string[];
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  referralPriority: 'Urgent' | 'Semi-Urgent' | 'Routine';
  triageExplanation: string;
  recommendedNextSteps: string[];
  sources?: GroundingSource[];
}

export interface SavedRecord {
  id: string;
  patientData: PatientData;
  triageResult: TriageResult;
  timestamp: string;
}

export interface Referral {
  id: string;
  patientData: PatientData;
  triageResult: TriageResult;
  status: 'Pending Review' | 'Review Complete';
  doctorNotes?: string;
  recordedMessageUrl?: string;
  timestamp: string;
  assignedDoctor: Doctor;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp?: string;
  };
  bio?: string;
  languages?: string[];
}


export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  sources?: GroundingSource[];
}

export type AnalysisType = 'quick' | 'detailed';