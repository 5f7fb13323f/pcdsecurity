const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCOcbE2ChioDYXE9SOTrGoegQfAbpkuYhU",
  authDomain: "workshop2605a.firebaseapp.com",
  projectId: "workshop2605a",
  storageBucket: "workshop2605a.firebasestorage.app",
  messagingSenderId: "207378954403",
  appId: "1:207378954403:web:b12eece1400db5d4622716"
};

firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();
const auth = firebase.auth();
