export interface DogProfile {
  name: string;
  age: string;
  breed: string;
  weight: string;
  activityLevel: 'sedentario' | 'moderado' | 'activo' | 'muy_activo';
  allergies: string;
  photo?: string; // base64 string
  medicalDocs?: File;
}

export interface DailyMeal {
  day: string;
  breakfast: string;
  dinner: string;
}

export interface MealPlan {
  profileSummary: string;
  weeklyPlan: DailyMeal[];
  nutritionalJustification: string;
  additionalTips: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export enum AITool {
  ImageAnalyzer = 'Analizador de Fotos',
  VideoAnalyzer = 'Analizador de Videos',
  NutritionQA = 'Preguntas de Nutrición',
  VetFinder = 'Buscar Veterinarias',
}

// --- Types for Authentication & Account Management ---
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>; // Google login
  emailLogin: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

// --- Placeholder types for Account Pages ---
export interface Subscription {
  id: string;
  petName: string;
  planName: string;
  status: 'Activa' | 'Pausada' | 'Cancelada';
  nextDelivery: string;
  price: number;
  mealsPerWeek: number;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
}

export interface Address {
  street: string;
  city: string;
  details: string;
  latitude?: number;
  longitude?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'Visa' | 'Mastercard';
  last4: string;
  expiry: string;
}