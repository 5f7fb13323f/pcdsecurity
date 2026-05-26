// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// Uzupełnij poniższe dane z Firebase Console:
// https://console.firebase.google.com/
// Projekt → Ustawienia projektu → Twoje aplikacje → Web
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCOcbE2ChioDYXE9SOTrGoegQfAbpkuYhU",
  authDomain: "workshop2605a.firebaseapp.com",
  projectId: "workshop2605a",
  storageBucket: "workshop2605a.firebasestorage.app",
  messagingSenderId: "207378954403",
  appId: "1:207378954403:web:b12eece1400db5d4622716"
};



// ============================================================
// INICJALIZACJA FIREBASE
// ============================================================
firebase.initializeApp(FIREBASE_CONFIG);

const db = firebase.firestore();
const auth = firebase.auth();

// ============================================================
// KONFIGURACJA STORAGE (dla plików/zdjęć do zadań)
// ============================================================
// Storage jest opcjonalny - pliki można uploadować jako Base64
// lub przez zewnętrzne linki. Jeśli chcesz używać Firebase Storage,
// odkomentuj poniższe i dodaj SDK firebase-storage-compat.js do HTML.
// const storage = firebase.storage();
