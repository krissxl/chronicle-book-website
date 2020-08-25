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
  const db = firebase.firestore();
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    const user = auth.currentUser;

    await user.updateProfile({
      displayName: username,
    });

    db.collection('users').doc(user.uid).set({
      name: username,
      entriesNumber: {}
    })

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

export async function addNewEntry(uid, entry) {
  try {
    const db = firebase.firestore()
    const entriesRef = db.collection("entries");
    const userRef = db.collection('users').doc(uid);
    const entryObj = {
      user_id: uid,
      text: entry.text,
      created_at: entry.created_at,
      time: entry.time,
      title: entry.title ? entry.title : "",
      tags: entry.tags ? entry.tags : []
    };
    const dateName = getFullDateName(entry.time);

    const res = await entriesRef.add(entryObj);
    entryObj.id = res.id;

    db.runTransaction(async (transaction) => {
      const user = await transaction.get(userRef)
      if (!user.exists) throw new Error('User with this ID isn\'t exists')
      const userEntries = user.data().entriesCount;

      transaction.update(userRef, {
        entriesCount: { ...userEntries, [dateName]: userEntries[dateName] ? userEntries[dateName] + 1 : 1 }
      })
    })

    return {
      error: false,
      message: "Entry successfully created",
      data: { entry: entryObj },
    };
  } catch (error) {
    return { error: true, message: error.message };
  }
}

export async function getUserEntries(uid, timeStart, timeEnd, startAt = 0) {
  try {
    const entriesRef = firebase.firestore().collection("entries");
    const entriesSnaps = await entriesRef
      .where("user_id", "==", uid)
      .where("time", ">=", timeStart)
      .where("time", "<=", timeEnd)
      .orderBy('time')
      .startAt(startAt)
      .limit(31)
      .get();
    const entries = [];

    entriesSnaps.forEach((entry) => {
      let entryData = entry.data();

      entryData.id = entry.id;
      entryData = formatEntry(entryData);

      entries.unshift(entryData);
    });

    return {
      error: false,
      message: "Entry successfully created",
      data: { entries },
    };
  } catch (error) {
    return { error: true, message: error.message };
  }
}

export async function updateEntry(entryId, newEntry) {
  try {
    const db = firebase.firestore();
    const update = { text: newEntry.text, updated_at: new Date(), time: newEntry.time };
    update.title = newEntry.title ? newEntry.title : "";
    update.tags = newEntry.tags ? newEntry.tags : [];

    const entryRef = db.collection("entries").doc(entryId);
    await entryRef.update(update);
    const entry = await entryRef.get();
    let entryData = entry.data();

    entryData.id = entry.id;
    entryData = formatEntry(entryData)

    return { error: false, message: "Entry successfully updated", data: { entry: entryData } };
  } catch (error) {
    return { error: true, message: error.message };
  }
}

export async function getEntryById(uid, entryId) {
  try {
    const db = firebase.firestore();
    const entry = await db.collection("entries").doc(entryId).get();
    let entryData = entry.data();

    if (entryData.user_id !== uid)
      throw new Error("You are don't have access to entry with this ID");
    if (!entry.exists) throw new Error("Entry with that ID isn't exists");

    entryData.id = entry.id;
    entryData = formatEntry(entryData);

    return {
      error: false,
      message: "Entry successfully fetched",
      data: { entry: entryData },
    };
  } catch (error) {
    return { error: true, message: error.message };
  }
}

export async function deleteEntry(entryId) {
  try {
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(getCurrentUser().uid);
    const entryRef = await db.collection("entries").doc(entryId);

    db.runTransaction(async (transaction) => {
      const entry = await (await transaction.get(entryRef)).data();
      const dateName = getFullDateName(new Date(entry.time.seconds * 1000))

      const user = await transaction.get(userRef)
      if (!user.exists) throw new Error('User with this ID isn\'t exists')
      const userEntries = user.data().entriesCount;

      await transaction.delete(entryRef);
      await transaction.update(userRef, {
        entriesCount: { ...userEntries, [dateName]: userEntries[dateName] ? userEntries[dateName] - 1 : 0 }
      })
    })

    return { error: false, message: "Entry successfully deleted" };
  } catch (error) {
    return { error: true, message: error.message };
  }
}

export async function getUserEntriesCount(uid) {
  try {
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(uid);
    const entriesCount = await (await userRef.get()).data().entriesCount;

    return { error: false, message: "Entries count successfully fetched", data: { entriesCount } };
  } catch (error) {
    return { error: true, message: error.message };
  }
}

function formatEntry(entry) {
  delete entry.user_id;
  entry.created_at = new Date(entry.created_at.seconds * 1000);
  entry.time = new Date(entry.time.seconds * 1000);
  if (entry.updated_at)
    entry.updated_at = new Date(entry.updated_at.seconds * 1000);

  return entry
}

function getFullDateName(date) {
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
}
