import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC74fMrZNsdHcw8d_ARB8yZjA3Mx9scMfs",
  authDomain: "paaskejakten.firebaseapp.com",
  projectId: "paaskejakten",
  storageBucket: "paaskejakten.appspot.com",
  messagingSenderId: "502027333519",
  appId: "1:502027333519:web:fd2ce889f904c63765a5fa",
  measurementId: "G-F0E3EVSM25",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({
  ignoreUndefinedProperties: true,
});
const db = firebase.firestore();
const storage = firebase.storage().ref();
const auth = firebase.auth();
let googleAuthProvider = new firebase.auth.GoogleAuthProvider();
let facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

export { storage, db, auth, googleAuthProvider, facebookAuthProvider };
