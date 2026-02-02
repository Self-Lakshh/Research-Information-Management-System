// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAve6jyQSidiYuQz0cPNXjNkukc1bm8Xhg",
  authDomain: "spsu-rims.firebaseapp.com",
  projectId: "spsu-rims",
  storageBucket: "spsu-rims.firebasestorage.app",
  messagingSenderId: "764168914427",
  appId: "1:764168914427:web:d7ab7d5406095933f1775e",
  measurementId: "G-PSRQYEWRY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);