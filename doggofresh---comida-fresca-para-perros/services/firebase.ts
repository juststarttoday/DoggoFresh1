// services/firebase.ts

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// ATENCIÓN: Estas son variables de entorno.
// NO escribas tus claves directamente aquí en el código que subes a GitHub.
// Deberás configurarlas en el entorno donde despliegues tu app (ej. Cloudflare Pages).
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// --- !! VALIDACIÓN DE CONFIGURACIÓN !! ---
if (!firebaseConfig.apiKey) {
    throw new Error("¡ERROR DE CONFIGURACIÓN DE FIREBASE! Las variables de entorno de Firebase no están definidas. Asegúrate de configurarlas en tu entorno de despliegue (ej. Cloudflare Pages).");
}

// Initialize Firebase using compat library
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Exportar los servicios para ser usados en la aplicación
export const auth = firebase.auth();
export const db = firebase.firestore();