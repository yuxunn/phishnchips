import { initializeApp } from "firebase/app";
//@ts-ignore
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
// insert api key here
  };  

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);        
export const db = getFirestore(app);
export const storage = getStorage(app);
