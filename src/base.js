import firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

firebase.initializeApp(config);

const db = firebase.firestore();
const files = firebase.storage();

export { db,files }
