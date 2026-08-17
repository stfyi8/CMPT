// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getReactNativePersistence, initializeAuth } from 'firebase/auth';
// Your web app's Firebase configuration
import AsyncStorage from '@react-native-async-storage/async-storage'
import {getFirestore, collection} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyDkGSRpNNTki3NxWt0ksCZPiDl8pok86n0",
  authDomain: "fir-cmpt-e16cd.firebaseapp.com",
  projectId: "fir-cmpt-e16cd",
  storageBucket: "fir-cmpt-e16cd.firebasestorage.app",
  messagingSenderId: "658080649766",
  appId: "1:658080649766:web:fc9deef24b39572ecb4ce7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export const usersRef = collection(db,'users');
export const roomRef = collection(db,'rooms');
