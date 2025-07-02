// Configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

export const firebaseConfig = {
    apiKey: "AIzaSyAQhByPedPc75PkQhIoVdLxmnzBRM6s0Zc",
    authDomain: "login-edfd9.firebaseapp.com",
    databaseURL: "https://login-edfd9-default-rtdb.firebaseio.com",
    projectId: "login-edfd9",
    storageBucket: "login-edfd9.firebasestorage.app",
    messagingSenderId: "732697358933",
    appId: "1:732697358933:web:506c5fd6153647683edadc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);