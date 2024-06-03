// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getPerformance, trace } from 'firebase/performance';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIacI9VXWEbOJUPpiXDaFFm7oqnLFbtdw",
  authDomain: "consultback-4244e.firebaseapp.com",
  projectId: "consultback-4244e",
  storageBucket: "consultback-4244e.appspot.com",
  messagingSenderId: "265344756473",
  appId: "1:265344756473:web:1db49a70e04d7c5e36d028",
  measurementId: "G-EZGTNYEEFM",
  databaseURL: "https://consultback-4244e-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);
const performance = getPerformance(app);
export { auth, db , realtimeDb,performance, trace};