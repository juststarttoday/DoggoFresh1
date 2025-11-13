// FIX: Use a namespace import for firebase/app to address the module resolution error.
import * as firebase from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ATENCIÓN: Estas son variables de entorno.
// NO escribas tus claves directamente aquí en el código que subes a GitHub.
// Deberás configurarlas en el entorno donde despliegues tu app (ej. Cloudflare Pages).
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "dummy-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy-domain.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "dummy-project-id",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy-bucket.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy-sender-id",
  appId: process.env.VITE_FIREBASE_APP_ID || "dummy-app-id",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "dummy-measurement-id"
};


// --- !! VALIDACIÓN DE CONFIGURACIÓN !! ---
if (firebaseConfig.apiKey === 'dummy-key') {
    console.warn("Firebase config is using dummy keys. Authentication will fail until configured properly in your deployment environment.");
}

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Exportar los servicios para ser usados en la aplicación
export const auth = getAuth(app);
export const db = getFirestore(app);