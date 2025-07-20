import firebase from 'firebase/compat/app'
import { initializeApp } from "firebase/app";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCSQg43krfHd-cW-2YUrzAaOfTOi8mvqjg",
    authDomain: "epitech-widgetech.firebaseapp.com",
    projectId: "epitech-widgetech",
    storageBucket: "epitech-widgetech.appspot.com",
    messagingSenderId: "910563011847",
    appId: "1:910563011847:web:8bc5a78f8a084fb077e9a2",
    measurementId: "G-7QPNDYM3EJ"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase }
export const db = getFirestore();