export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: number;
}

export type Gender = 'Male' | 'Female' | 'Unknown';
export type Species = 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Reptile' | 'Fish' | 'Other';

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: Species;
  breed: string;
  age: string;
  gender: Gender;
  weight: string;
  color: string;
  birthday: string;
  microchipId: string;
  medicalNotes: string;
  emergencyContact: string;
  photo: string;
  createdAt: number;
}

export interface Vaccine {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDue: string;
  vet: string;
  notes: string;
}

export interface MedicalHistoryEntry {
  id: string;
  petId: string;
  date: string;
  title: string;
  description: string;
  vet: string;
}

export interface Allergy {
  id: string;
  petId: string;
  name: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  notes: string;
}

export interface WeightEntry {
  id: string;
  petId: string;
  date: string;
  weight: string;
}

export interface VetVisit {
  id: string;
  petId: string;
  date: string;
  clinic: string;
  reason: string;
  cost: string;
  notes: string;
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dose: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
}

export interface FeedingEntry {
  id: string;
  petId: string;
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  water: boolean;
}

export interface GalleryImage {
  id: string;
  petId: string;
  data: string;
  caption: string;
  createdAt: number;
}

export type Mood = 'Happy' | 'Calm' | 'Anxious' | 'Sad' | 'Energetic' | 'Sick';

export interface JournalEntry {
  id: string;
  petId: string;
  date: string;
  title: string;
  body: string;
  mood: Mood;
  photo: string;
  createdAt: number;
}

export type ReminderType = 'Vaccine' | 'Food' | 'Medicine' | 'Vet' | 'Other';

export interface Reminder {
  id: string;
  petId: string;
  ownerId: string;
  title: string;
  type: ReminderType;
  dueDate: string;
  time: string;
  done: boolean;
  notes: string;
}

export interface AppData {
  users: User[];
  pets: Pet[];
  vaccines: Vaccine[];
  medicalHistory: MedicalHistoryEntry[];
  allergies: Allergy[];
  weights: WeightEntry[];
  vetVisits: VetVisit[];
  medications: Medication[];
  feedings: FeedingEntry[];
  gallery: GalleryImage[];
  journal: JournalEntry[];
  reminders: Reminder[];
}
