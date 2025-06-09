import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
//@ts-ignore
import { initializeAuth } from 'firebase/auth';
//import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getReactNativePersistence } from 'firebase/auth/dist/rn/index.js';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB2rBB9W1YU4SodNmpcked-OEssX1QtljI",
  authDomain: "phishnchips-f55e0.firebaseapp.com",
  projectId: "phishnchips-f55e0",
  storageBucket: "phishnchips-f55e0.firebasestorage.app",
  messagingSenderId: "3771420757",
  appId: "1:3771420757:web:6f674b91ff74efa08844dc"
};


const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
