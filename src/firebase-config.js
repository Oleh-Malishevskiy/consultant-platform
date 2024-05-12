// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
  measurementId: "G-EZGTNYEEFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };