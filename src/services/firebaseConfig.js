import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAK4sOV0uRsz0WBAi4BgW4KK6vzDZ1K2Dg",
  authDomain: "delivery-app-f6dcc.firebaseapp.com",
  projectId: "delivery-app-f6dcc",
  storageBucket: "delivery-app-f6dcc.firebasestorage.app",
  messagingSenderId: "371500472502",
  appId: "1:371500472502:web:920b29f4d41acb0c106e17",
  measurementId: "G-X8T0WZJKEH"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with Persistence
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

const db = getFirestore(app);

export { auth, db };
