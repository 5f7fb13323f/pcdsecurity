# CyberBrew CTF Platform

Platforma CTF dla warsztatów Cybersecurity — dwuetapowy scenariusz ICS/OT.

---

## 📁 Struktura plików

```
ctf-app/
├── index.html              ← Strona główna (login admina + lista wydarzeń)
├── setup.html              ← Inicjalizacja bazy danych (uruchom RAZ)
├── firestore.rules         ← Reguły bezpieczeństwa Firebase
├── css/
│   └── main.css            ← Wszystkie style
├── js/
│   ├── firebase-config.js  ← ← ← UZUPEŁNIJ SWOJE DANE FIREBASE
│   ├── i18n.js             ← Tłumaczenia PL/EN
│   ├── auth.js             ← Moduł autentykacji
│   ├── tasks-data.js       ← Dane 15 zadań CTF
│   ├── admin.js            ← Logika panelu admina
│   └── participant.js      ← Logika panelu uczestnika
└── pages/
    ├── admin.html          ← Panel administratora
    ├── participant.html    ← Panel uczestnika
    └── scoreboard.html     ← Tabela wyników (standalone)
```

---

## 🚀 Konfiguracja Firebase (krok po kroku)

### 1. Utwórz projekt Firebase

1. Wejdź na [https://console.firebase.google.com](https://console.firebase.google.com)
2. Kliknij **"Add project"** → podaj nazwę np. `cyberbrew-ctf`
3. Wyłącz Google Analytics (opcjonalne) → **"Create project"**

### 2. Utwórz bazę danych Firestore

1. W lewym menu: **Build → Firestore Database**
2. Kliknij **"Create database"**
3. Wybierz **"Start in test mode"** (zmienimy reguły później)
4. Wybierz region np. `europe-west3` (Frankfurt)
5. Kliknij **"Enable"**

### 3. Zarejestruj aplikację webową

1. W lewym menu kliknij ikonę ⚙ (Project settings)
2. Przewiń do sekcji **"Your apps"**
3. Kliknij ikonę `</>` (Web)
4. Podaj nazwę aplikacji np. `CTF Web`
5. **Nie zaznaczaj** Firebase Hosting (używamy GitHub Pages)
6. Kliknij **"Register app"**
7. Skopiuj konfigurację — zobaczysz coś takiego:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "cyberbrew-ctf.firebaseapp.com",
  projectId: "cyberbrew-ctf",
  storageBucket: "cyberbrew-ctf.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. Uzupełnij plik konfiguracyjny

Otwórz `js/firebase-config.js` i zastąp wartości swoimi:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",           // ← wklej swoje
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### 5. Ustaw reguły Firestore

1. W Firebase Console: **Firestore Database → Rules**
2. Zastąp domyślne reguły zawartością pliku `firestore.rules`
3. Kliknij **"Publish"**

### 6. Wgraj na GitHub Pages

1. Utwórz nowe repozytorium na GitHub
2. Wgraj wszystkie pliki do repozytorium
3. Wejdź w **Settings → Pages**
4. Source: **Deploy from a branch** → `main` → `/ (root)`
5. Poczekaj chwilę — aplikacja będzie dostępna pod `https://TWOJA-NAZWA.github.io/REPO/`

### 7. Zainicjuj bazę danych

1. Wejdź na `https://TWOJA-STRONA.github.io/setup.html`
2. Poczekaj na inicjalizację — powinno pojawić się ✓ dla każdego kroku
3. Zostanie utworzone domyślne konto admin:
   - Login: `admin`
   - Hasło: `NieMaHasla2026@#$`

---

## 🔐 Pierwsze logowanie

1. Wejdź na stronę główną
2. Zaloguj się jako `admin` / `NieMaHasla2026@#$`
3. W panelu admin przejdź do **Ustawienia** i zmień hasło!

---

## 📋 Przebieg warsztatów

### Przed warsztatami:

1. Zaloguj się jako admin
2. **Utwórz wydarzenie** (Events → Utwórz wydarzenie)
3. **Dodaj uczestników** (Users → Dodaj użytkownika, rola: Uczestnik)
4. **Przypisz uczestników** do wydarzenia (Events → Zarządzaj → Uczestnicy → Przypisz)
5. Opcjonalnie: dodaj obrazki i pliki do zadań (Events → Zarządzaj → Zadania → Edytuj)

### Podczas warsztatów:

- Uczestnicy logują się przez `pages/participant.html`
- Rozwiązują zadania wpisując flagi w formacie `FLAG{...}`
- Scoreboard live dostępny pod `pages/scoreboard.html?event=ID_WYDARZENIA`
- Admin widzi wszystkie odpowiedzi i może przeglądać zadania

### Po warsztatach:

- Admin klika **"Zakończ wydarzenie"**
- Uczestnicy widzą poprawne odpowiedzi i swoje wyniki
- Scoreboard pozostaje dostępny

---

## 📦 Pliki do zadań (obrazki, logi)

Najłatwiejsze opcje:
- **Google Drive**: Wgraj plik → Udostępnij (Anyone with link) → Skopiuj URL
  - Dla podglądu: `https://drive.google.com/uc?id=FILE_ID`
- **GitHub**: Wgraj do repozytorium → użyj raw URL
- **Dropbox**: Wgraj → Udostępnij → zmień `?dl=0` na `?raw=1`

---

## 🔒 Bezpieczeństwo

> Ta aplikacja używa **hashowania SHA-256** dla haseł i otwartych reguł Firestore.
> Jest odpowiednia dla środowisk warsztatowych/edukacyjnych.
> NIE używaj jej do przechowywania wrażliwych danych produkcyjnych.

---

## 📊 Punktacja domyślna

| Zadania | Punkty |
|---------|--------|
| 1, 2, 4, 5, 6, 7, 8, 9, 11, 14 | 100 pts |
| 3, 10, 12, 13 | 150 pts |
| 15 | 200 pts |
| **Łącznie** | **1650 pts** |

Admin może zmienić punktację per zadanie w panelu zarządzania wydarzeniem.
