// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// Uzupełnij poniższe dane z Firebase Console:
// https://console.firebase.google.com/
// Projekt → Ustawienia projektu → Twoje aplikacje → Web
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: "TWOJ_API_KEY",
  authDomain: "TWOJ_PROJECT.firebaseapp.com",
  projectId: "TWOJ_PROJECT_ID",
  storageBucket: "TWOJ_PROJECT.firebasestorage.app",
  messagingSenderId: "TWOJ_SENDER_ID",
  appId: "TWOJ_APP_ID"
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
