// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRkbBqHnTdoEuI7O3mSYKuPaDWOoaVmAA",
  authDomain: "eroxtest-b2bfd.firebaseapp.com",
  projectId: "eroxtest-b2bfd",
  storageBucket: "gs://eroxtest-b2bfd.appspot.com",
  messagingSenderId: "560762280807",
  appId: "1:560762280807:web:6d39cb8c2d55ef9e442dc2",
  measurementId: "G-NXMLX0RS8X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create references to storage and Firestore
const storage = getStorage(app);
const db = getFirestore(app); // Initialize Firestore

// Export the initialized app (not firebase)
export { storage, db };
