import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZg1X3zEsYMhTjNKTUwHs68x9y7iLoYeg",
    authDomain: "portfolio-admin-console-4717d.firebaseapp.com",
    projectId: "portfolio-admin-console-4717d",
    storageBucket: "portfolio-admin-console-4717d.firebasestorage.app",
    messagingSenderId: "911921992394",
    appId: "1:911921992394:web:9e32f1a9c9e6f253f8da33",
    measurementId: "G-P3WGM02GGQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
