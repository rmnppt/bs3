import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCipMMIWrcVDKjZzd7bmRvQ_-GISCKrz_M",
  authDomain: "bs3app-dfb63.firebaseapp.com",
  projectId: "bs3app-dfb63",
  storageBucket: "bs3app-dfb63.appspot.com",
  messagingSenderId: "1008841124414",
  appId: "1:1008841124414:web:2d0c58dc8e2cda80e17f6f",
  measurementId: "G-SYR43YSLCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = await getFirestore(app);

export { db };
