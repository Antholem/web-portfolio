// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3eK5dutUBa4Yiat88Ua6lGunPzZiDvLo",
    authDomain: "web-portfolio-projects.firebaseapp.com",
    projectId: "web-portfolio-projects",
    storageBucket: "web-portfolio-projects.firebasestorage.app",
    messagingSenderId: "136806660749",
    appId: "1:136806660749:web:39f501543e1325cb30c0c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
