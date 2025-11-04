import { db } from './firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import type { User, Pet, Subscription, PaymentMethod, Address, DogProfile } from '../types';

// --- User Profile Functions ---

// Creates or updates a user document in the 'users' collection.
export const saveUser = async (user: User) => {
    const userRef = db.collection('users').doc(user.id);
    const docSnap = await userRef.get();
    if (!docSnap.exists) {
        // User is new, create the document with some initial data
        await userRef.set({
            uid: user.id,
            name: user.name,
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            address: null, // Initialize address as null
        });
        
        // For new users, let's add some placeholder data to demonstrate functionality
        await addInitialUserData(user.id, user.name);
    }
};

// Add initial placeholder data for a new user
const addInitialUserData = async (userId: string, userName: string) => {
    const batch = db.batch();

    const petsData: Omit<Pet, 'id'>[] = [
        { name: `${userName}'s Perro`, breed: 'Mestizo', age: 5, weight: 12 },
    ];

    petsData.forEach(pet => {
        const petRef = db.collection(`users/${userId}/pets`).doc();
        batch.set(petRef, pet);
    });
    
    const subsData: Omit<Subscription, 'id'>[] = [
        { petName: `${userName}'s Perro`, planName: 'Plan Activo de Pollo', status: 'Activa', nextDelivery: '25 de Julio, 2024', price: 59.99, mealsPerWeek: 14 },
    ];

    subsData.forEach(sub => {
        const subRef = db.collection(`users/${userId}/subscriptions`).doc();
        batch.set(subRef, sub);
    });

    const paymentsData: Omit<PaymentMethod, 'id'>[] = [
        { type: 'Visa', last4: '4242', expiry: '12/26' }
    ];

    paymentsData.forEach(pm => {
        const pmRef = db.collection(`users/${userId}/paymentMethods`).doc();
        batch.set(pmRef, pm);
    });

    await batch.commit();
}


export const getUserProfile = async (userId: string): Promise<{name: string, email: string, address: Address} | null> => {
    const userRef = db.collection('users').doc(userId);
    const docSnap = await userRef.get();
    if (docSnap.exists) {
        return docSnap.data() as {name: string, email: string, address: Address};
    }
    return null;
}

export const updateUserProfile = async (userId: string, data: { name: string, email: string, address: Address }) => {
    const userRef = db.collection('users').doc(userId);
    await userRef.update(data);
};

// --- Pet Functions ---

export const getPets = async (userId: string): Promise<Pet[]> => {
    const petsCol = db.collection(`users/${userId}/pets`);
    const snapshot = await petsCol.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet));
};

export const addPet = async (userId: string, petData: Omit<Pet, 'id'>) => {
    const petsCol = db.collection(`users/${userId}/pets`);
    await petsCol.add(petData);
};

export const updatePet = async (userId: string, petId: string, petData: Pet) => {
    const petRef = db.collection(`users/${userId}/pets`).doc(petId);
    await petRef.update(petData);
};

export const deletePet = async (userId: string, petId: string) => {
    const petRef = db.collection(`users/${userId}/pets`).doc(petId);
    await petRef.delete();
};


// --- Subscription Functions ---

export const getSubscriptions = async (userId: string): Promise<Subscription[]> => {
    const subsCol = db.collection(`users/${userId}/subscriptions`);
    const snapshot = await subsCol.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription));
};

export const updateSubscription = async (userId: string, subId: string, subData: Subscription) => {
    const subRef = db.collection(`users/${userId}/subscriptions`).doc(subId);
    await subRef.update(subData);
};


// --- Payment Method Functions ---

export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
    const pmCol = db.collection(`users/${userId}/paymentMethods`);
    const snapshot = await pmCol.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentMethod));
};

export const addPaymentMethod = async (userId: string, pmData: Omit<PaymentMethod, 'id'>) => {
    const pmCol = db.collection(`users/${userId}/paymentMethods`);
    await pmCol.add(pmData);
};

export const updatePaymentMethod = async (userId: string, pmId: string, pmData: PaymentMethod) => {
    const pmRef = db.collection(`users/${userId}/paymentMethods`).doc(pmId);
    await pmRef.update(pmData);
};

export const deletePaymentMethod = async (userId: string, pmId: string) => {
    const pmRef = db.collection(`users/${userId}/paymentMethods`).doc(pmId);
    await pmRef.delete();
};

// --- Quiz Submission Function ---

// Saves the lead and dog profile from the personalization quiz
export const saveQuizSubmission = async (lead: { name: string, email: string }, dogProfile: DogProfile) => {
    const submissionsCol = db.collection('quizSubmissions');
    
    // Create a copy of the profile and remove the File object if it exists, as it cannot be stored in Firestore directly.
    const { medicalDocs, ...storableProfile } = dogProfile;

    await submissionsCol.add({
        ownerName: lead.name,
        ownerEmail: lead.email,
        dogProfile: storableProfile,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
};
