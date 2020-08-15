import * as firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCo7bOKIuxM6_j_TYNTpAwHmAscD3qr6_Q",
  authDomain: "chronical-book.firebaseapp.com",
  databaseURL: "https://chronical-book.firebaseio.com",
  projectId: "chronical-book",
  storageBucket: "chronical-book.appspot.com",
  messagingSenderId: "693328716328",
  appId: "1:693328716328:web:739f96e8e6556a5ed08b1d",
  measurementId: "G-V9N55QDNPT",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.firestore()
const auth = firebase.auth();

export async function signUpNewUser(email, password, username) {
    await auth.signInWithEmailAndPassword(email, password)
}