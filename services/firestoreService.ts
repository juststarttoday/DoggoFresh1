import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import type { User, Pet, Subscription, PaymentMethod, Address, DogProfile } from '../types';

// --- User Profile Functions ---

// Creates or updates a user document in the 'users' collection.
export const saveUser = async (user: User) => {
    const userRef = doc(db, 'users', user.id);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
        // User is new, create the document with some initial data
        await setDoc(userRef, {
            uid: user.id,
            name: user.name,
            email: user.email,
            createdAt: serverTimestamp(),
            address: null, // Initialize address as null
        });
        
        // For new users, let's add some placeholder data to demonstrate functionality
        await addInitialUserData(user.id, user.name);
    }
};

// Add initial placeholder data for a new user
const addInitialUserData = async (userId: string, userName: string) => {
    const batch = writeBatch(db);

    const petsData: Omit<Pet, 'id'>[] = [
        { name: `${userName}'s Perro`, breed: 'Mestizo', age: 5, weight: 12 },
    ];

    petsData.forEach(pet => {
        const petRef = doc(collection(db, `users/${userId}/pets`));
        batch.set(petRef, pet);
    });
    
    const subsData: Omit<Subscription, 'id'>[] = [
        { petName: `${userName}'s Perro`, planName: 'Plan Activo de Pollo', status: 'Activa', nextDelivery: '25 de Julio, 2024', price: 59.99, mealsPerWeek: 14 },
    ];

    subsData.forEach(sub => {
        const subRef = doc(collection(db, `users/${userId}/subscriptions`));
        batch.set(subRef, sub);
    });

    const paymentsData: Omit<PaymentMethod, 'id'>[] = [
        { type: 'Visa', last4: '4242', expiry: '12/26' }
    ];

    paymentsData.forEach(pm => {
        const pmRef = doc(collection(db, `users/${userId}/paymentMethods`));
        batch.set(pmRef, pm);
    });

    await batch.commit();
}


export const getUserProfile = async (userId: string): Promise<{name: string, email: string, address: Address} | null> => {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data() as {name: string, email: string, address: Address};
    }
    return null;
}

export const updateUserProfile = async (userId: string, data: { name: string, email: string, address: Address }) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
};

// --- Pet Functions ---

export const getPets = async (userId: string): Promise<Pet[]> => {
    const petsCol = collection(db, `users/${userId}/pets`);
    const snapshot = await getDocs(petsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet));
};

export const addPet = async (userId: string, petData: Omit<Pet, 'id'>) => {
    const petsCol = collection(db, `users/${userId}/pets`);
    await addDoc(petsCol, petData);
};

export const updatePet = async (userId: string, petId: string, petData: Pet) => {
    const petRef = doc(db, `users/${userId}/pets`, petId);
    await updateDoc(petRef, petData);
};

export const deletePet = async (userId: string, petId: string) => {
    const petRef = doc(db, `users/${userId}/pets`, petId);
    await deleteDoc(petRef);
};


// --- Subscription Functions ---

export const getSubscriptions = async (userId: string): Promise<Subscription[]> => {
    const subsCol = collection(db, `users/${userId}/subscriptions`);
    const snapshot = await getDocs(subsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription));
};

export const updateSubscription = async (userId: string, subId: string, subData: Subscription) => {
    const subRef = doc(db, `users/${userId}/subscriptions`, subId);
    await updateDoc(subRef, subData);
};


// --- Payment Method Functions ---

export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
    const pmCol = collection(db, `users/${userId}/paymentMethods`);
    const snapshot = await getDocs(pmCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentMethod));
};

export const addPaymentMethod = async (userId: string, pmData: Omit<PaymentMethod, 'id'>) => {
    const pmCol = collection(db, `users/${userId}/paymentMethods`);
    await addDoc(pmCol, pmData);
};

export const updatePaymentMethod = async (userId: string, pmId: string, pmData: PaymentMethod) => {
    const pmRef = doc(db, `users/${userId}/paymentMethods`, pmId);
    await updateDoc(pmRef, pmData);
};

export const deletePaymentMethod = async (userId: string, pmId: string) => {
    const pmRef = doc(db, `users/${userId}/paymentMethods`, pmId);
    await deleteDoc(pmRef);
};

// --- Quiz Submission Function ---

// Saves the lead and dog profile from the personalization quiz
export const saveQuizSubmission = async (lead: { name: string, email: string }, dogProfile: DogProfile) => {
    const submissionsCol = collection(db, 'quizSubmissions');
    
    // Create a copy of the profile and remove the File object if it exists, as it cannot be stored in Firestore directly.
    const { medicalDocs, ...storableProfile } = dogProfile;

    await addDoc(submissionsCol, {
        ownerName: lead.name,
        ownerEmail: lead.email,
        dogProfile: storableProfile,
        createdAt: serverTimestamp(),
    });
};