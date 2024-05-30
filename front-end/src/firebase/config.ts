import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "travelohi-fa05e.firebaseapp.com",
  projectId: "travelohi-fa05e",
  storageBucket: "travelohi-fa05e.appspot.com",
  messagingSenderId: "179715674550",
  appId: "1:179715674550:web:3fef42da026371a6997117"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
