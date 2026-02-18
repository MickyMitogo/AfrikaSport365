// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, setDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWPPtQnRvGTK8wuYevr14LjgVxjzzYFyQ",
    authDomain: "afrikasport365-ea689.firebaseapp.com",
    projectId: "afrikasport365-ea689",
    storageBucket: "afrikasport365-ea689.firebasestorage.app",
    messagingSenderId: "881902071508",
    appId: "1:881902071508:web:b952a1f76166cd17491541"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Helper functions for Firestore operations

// Get next sequential ID for news
export async function getNextNewsId(collectionName = 'noticias') {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        let maxId = 10; // Start from 10 since you had 1-10 before

        querySnapshot.forEach((doc) => {
            const docId = parseInt(doc.id);
            if (!isNaN(docId) && docId > maxId) {
                maxId = docId;
            }
        });

        return (maxId + 1).toString();
    } catch (error) {
        console.error("Error getting next news ID:", error);
        throw error;
    }
}

export async function addNews(newsData, collectionName = 'noticias') {
    try {
        const newId = await getNextNewsId(collectionName);
        await setDoc(doc(db, collectionName, newId), {
            ...newsData,
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return newId;
    } catch (error) {
        console.error("Error adding news:", error);
        throw error;
    }
}

export async function updateNews(newsId, newsData, collectionName = 'noticias') {
    try {
        const newsRef = doc(db, collectionName, String(newsId));
        await updateDoc(newsRef, {
            ...newsData,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error updating news:", error);
        throw error;
    }
}

export async function deleteNews(newsId, collectionName = 'noticias') {
    try {
        await deleteDoc(doc(db, collectionName, String(newsId)));
    } catch (error) {
        console.error("Error deleting news:", error);
        throw error;
    }
}

export async function getNewsByCategory(category, collectionName = 'noticias') {
    try {
        const q = query(collection(db, collectionName), where("category", "==", String(category)));
        const querySnapshot = await getDocs(q);
        const news = [];
        querySnapshot.forEach((doc) => {
            news.push({ id: doc.id, ...doc.data() });
        });
        return news;
    } catch (error) {
        console.error("Error getting news by category:", error);
        throw error;
    }
}

export async function getAllNews(collectionName = 'noticias') {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const news = [];
        querySnapshot.forEach((doc) => {
            news.push({ id: doc.id, ...doc.data() });
        });
        return news;
    } catch (error) {
        console.error("Error getting all news:", error);
        throw error;
    }
}

export async function uploadImage(file, pathOrId, collectionType = 'noticias') {
    try {
        // Allow custom paths (e.g., "eventos/123/image") or auto-generate from ID
        const fileName = pathOrId.includes('/') ?
            pathOrId :
            `${collectionType}/${pathOrId}/${file.name}`;

        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

// ============================================================================
// EVENTOS-SPECIFIC FUNCTIONS
// ============================================================================

export async function addEvent(eventData) {
    try {
        const newId = await getNextNewsId('eventos');
        await setDoc(doc(db, 'eventos', newId), {
            ...eventData,
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return newId;
    } catch (error) {
        console.error("Error adding event:", error);
        throw error;
    }
}

export async function updateEvent(eventId, eventData) {
    try {
        const eventRef = doc(db, 'eventos', String(eventId));
        await updateDoc(eventRef, {
            ...eventData,
            updatedAt: new Date()
        });
        return eventId;
    } catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
}

export async function deleteEvent(eventId) {
    try {
        await deleteDoc(doc(db, 'eventos', String(eventId)));
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
}

export async function getAllEvents() {
    try {
        const querySnapshot = await getDocs(collection(db, 'eventos'));
        const events = [];
        querySnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() });
        });
        return events;
    } catch (error) {
        console.error("Error getting all events:", error);
        throw error;
    }
}

// Auth helpers
export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function logoutUser() {
    return signOut(auth);
}

export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}
