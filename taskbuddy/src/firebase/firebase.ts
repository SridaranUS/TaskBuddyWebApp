
import {initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw6oGbjGZcrScfo80prVHvWi_S-qH_j_0",
  authDomain: "taskbuddy-d67d7.firebaseapp.com",
  projectId: "taskbuddy-d67d7",
  storageBucket: "taskbuddy-d67d7.firebasestorage.app",
  messagingSenderId: "1074758133480",
  appId: "1:1074758133480:web:bb07c6fd1fe0e709f74b5d",
  measurementId: "G-FXGTQMNGF4"
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, firebaseConfig };

