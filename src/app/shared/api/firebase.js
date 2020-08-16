import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

(function () {
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
})();

export async function signUpNewUser(email, password, username) {
  const auth = firebase.auth();
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    const user = auth.currentUser;

    await user.updateProfile({
      displayName: username,
    });

    return {
      error: false,
      message: "User successfully registered",
      data: { user },
    };
  } catch (e) {
    return { error: true, message: e.message, code: e.code };
  }
}

export function getCurrentUser() {
  const auth = firebase.auth();
  console.log(auth.currentUser);
  return auth.currentUser;
}

export async function signIn(email, password) {
  const auth = firebase.auth();
  try {
    await auth.signInWithEmailAndPassword(email, password);
    return {
      error: false,
      message: "User successfully sign in",
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
      code: error.code,
    };
  }
}

export async function signOut() {
  try {
    await firebase.auth().signOut();

    return { error: false, message: "User successfully sign out" };
  } catch (error) {
    return { error: true, message: error.message };
  }
}
