import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"


// import { getAnalytics } from "firebase/analytics";

// i know that i must use .env file but who cares :)
const firebaseConfig = {
  apiKey: "AIzaSyA8Qoepxh1UAHPsIsWYYAH2UyO7FQwp7EA",
  authDomain: "chat-app-39706.firebaseapp.com",
  projectId: "chat-app-39706",
  storageBucket: "chat-app-39706.appspot.com",
  messagingSenderId: "895969297240",
  appId: "1:895969297240:web:da4a1163bb3be6b0999b2d",
  measurementId: "G-9V5CS55ZFY"
};

const app = initializeApp(firebaseConfig);

export default app;

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);