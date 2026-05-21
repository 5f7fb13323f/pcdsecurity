// ============================================================
// TRANSLATIONS (PL / EN)
// ============================================================

const TRANSLATIONS = {
  pl: {
    // Landing
    hero_tag: "// INDUSTRIAL CYBERSECURITY",
    hero_title2: "CTF Workshop",
    hero_desc: "Dwuetapowy scenariusz Capture The Flag z zakresu cyberbezpieczeństwa przemysłowego (ICS/OT). Wciel się w rolę analityka Incident Response i rozwiąż incydent w inteligentnym browarze.",
    active_events: "Aktywne wydarzenia",
    admin_panel: "Panel Administratora",
    username: "Login",
    password: "Hasło",
    login_btn: "Zaloguj się",
    participant_q: "Jesteś uczestnikiem?",
    login_here: "Zaloguj się tutaj",
    footer_text: "CyberBrew CTF Platform",
    footer_sub: "ICS/OT Security Workshop",

    // Common
    save: "Zapisz",
    cancel: "Anuluj",
    delete: "Usuń",
    edit: "Edytuj",
    add: "Dodaj",
    close: "Zamknij",
    confirm: "Potwierdź",
    loading: "Ładowanie...",
    yes: "Tak",
    no: "Nie",
    status: "Status",
    actions: "Akcje",
    name: "Nazwa",
    role: "Rola",
    event: "Wydarzenie",
    points: "Punkty",
    solved: "Rozwiązane",
    submit: "Zatwierdź",
    logout: "Wyloguj",
    back: "Powrót",

    // Admin sidebar
    nav_dashboard: "Dashboard",
    nav_events: "Wydarzenia",
    nav_users: "Użytkownicy",
    nav_settings: "Ustawienia",

    // Events
    events_title: "Wydarzenia",
    create_event: "Utwórz wydarzenie",
    event_name: "Nazwa wydarzenia",
    event_desc: "Opis",
    event_date: "Data",
    assign_users: "Przypisz uczestników",
    end_event: "Zakończ wydarzenie",
    end_event_confirm: "Czy na pewno chcesz zakończyć to wydarzenie? Uczestnicy będą mogli zobaczyć wyniki i poprawne odpowiedzi.",
    event_active: "Aktywne",
    event_finished: "Zakończone",
    event_created: "Wydarzenie utworzone!",

    // Users
    users_title: "Użytkownicy",
    add_user: "Dodaj użytkownika",
    user_login: "Login",
    user_password: "Hasło",
    user_role: "Rola",
    role_admin: "Administrator",
    role_participant: "Uczestnik",
    user_created: "Użytkownik utworzony!",
    user_deleted: "Użytkownik usunięty",
    change_password: "Zmień hasło",
    new_password: "Nowe hasło",

    // Tasks
    tasks_title: "Zadania",
    task_num: "Zadanie",
    task_question: "Pytanie",
    task_answer: "Odpowiedź (flaga)",
    task_context: "Kontekst",
    task_points: "Punkty",
    task_images: "Obrazki",
    task_files: "Pliki do pobrania",
    add_image: "Dodaj obrazek",
    add_file: "Dodaj plik",
    correct: "✓ Poprawna odpowiedź!",
    wrong: "✗ Niepoprawna odpowiedź",
    already_solved: "Już rozwiązano",
    review_correct: "✓ Twoja odpowiedź była poprawna",
    review_wrong: "✗ Twoja odpowiedź była niepoprawna",
    correct_answer: "Poprawna odpowiedź:",
    your_answer: "Twoja odpowiedź:",
    no_answer: "Nie odpowiedziano",

    // Scoreboard
    scoreboard: "Tabela wyników",
    rank: "Miejsce",
    participant: "Uczestnik",
    score: "Wynik",
    solved_count: "Rozwiązanych",
    last_solve: "Ostatnia flaga",
    live: "LIVE",

    // Participant
    my_event: "Moje wydarzenie",
    progress: "Postęp",
    flag_placeholder: "FLAG{...}",
    event_ended: "Wydarzenie zakończone — tryb przeglądu",
    no_event: "Nie przypisano do żadnego wydarzenia",

    // Settings
    settings_title: "Ustawienia",
    change_admin_pass: "Zmień hasło administratora",
    current_password: "Aktualne hasło",
    confirm_password: "Potwierdź nowe hasło",
    password_changed: "Hasło zmienione!",
    passwords_mismatch: "Hasła nie są zgodne",

    // Errors
    err_login: "Nieprawidłowy login lub hasło",
    err_required: "To pole jest wymagane",
    err_generic: "Wystąpił błąd. Spróbuj ponownie.",
    err_no_permission: "Brak uprawnień",
  },
  en: {
    // Landing
    hero_tag: "// INDUSTRIAL CYBERSECURITY",
    hero_title2: "CTF Workshop",
    hero_desc: "A two-stage Capture The Flag scenario in Industrial Cybersecurity (ICS/OT). Step into the role of an Incident Response analyst and solve a security incident in a smart brewery.",
    active_events: "Active Events",
    admin_panel: "Administrator Panel",
    username: "Username",
    password: "Password",
    login_btn: "Log in",
    participant_q: "Are you a participant?",
    login_here: "Log in here",
    footer_text: "CyberBrew CTF Platform",
    footer_sub: "ICS/OT Security Workshop",

    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    close: "Close",
    confirm: "Confirm",
    loading: "Loading...",
    yes: "Yes",
    no: "No",
    status: "Status",
    actions: "Actions",
    name: "Name",
    role: "Role",
    event: "Event",
    points: "Points",
    solved: "Solved",
    submit: "Submit",
    logout: "Log out",
    back: "Back",

    // Admin sidebar
    nav_dashboard: "Dashboard",
    nav_events: "Events",
    nav_users: "Users",
    nav_settings: "Settings",

    // Events
    events_title: "Events",
    create_event: "Create event",
    event_name: "Event name",
    event_desc: "Description",
    event_date: "Date",
    assign_users: "Assign participants",
    end_event: "End event",
    end_event_confirm: "Are you sure you want to end this event? Participants will be able to see results and correct answers.",
    event_active: "Active",
    event_finished: "Finished",
    event_created: "Event created!",

    // Users
    users_title: "Users",
    add_user: "Add user",
    user_login: "Username",
    user_password: "Password",
    user_role: "Role",
    role_admin: "Administrator",
    role_participant: "Participant",
    user_created: "User created!",
    user_deleted: "User deleted",
    change_password: "Change password",
    new_password: "New password",

    // Tasks
    tasks_title: "Tasks",
    task_num: "Task",
    task_question: "Question",
    task_answer: "Answer (flag)",
    task_context: "Context",
    task_points: "Points",
    task_images: "Images",
    task_files: "Downloadable files",
    add_image: "Add image",
    add_file: "Add file",
    correct: "✓ Correct answer!",
    wrong: "✗ Wrong answer",
    already_solved: "Already solved",
    review_correct: "✓ Your answer was correct",
    review_wrong: "✗ Your answer was incorrect",
    correct_answer: "Correct answer:",
    your_answer: "Your answer:",
    no_answer: "Not answered",

    // Scoreboard
    scoreboard: "Scoreboard",
    rank: "Rank",
    participant: "Participant",
    score: "Score",
    solved_count: "Solved",
    last_solve: "Last flag",
    live: "LIVE",

    // Participant
    my_event: "My Event",
    progress: "Progress",
    flag_placeholder: "FLAG{...}",
    event_ended: "Event ended — review mode",
    no_event: "Not assigned to any event",

    // Settings
    settings_title: "Settings",
    change_admin_pass: "Change admin password",
    current_password: "Current password",
    confirm_password: "Confirm new password",
    password_changed: "Password changed!",
    passwords_mismatch: "Passwords do not match",

    // Errors
    err_login: "Invalid username or password",
    err_required: "This field is required",
    err_generic: "An error occurred. Please try again.",
    err_no_permission: "Permission denied",
  }
};

let currentLang = localStorage.getItem('ctf_lang') || 'pl';

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) ||
         (TRANSLATIONS['pl'] && TRANSLATIONS['pl'][key]) ||
         key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ctf_lang', lang);
  document.documentElement.setAttribute('data-lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-ph'));
  });
  // Update lang buttons
  document.querySelectorAll('#btn-pl, #btn-en').forEach(btn => {
    btn.classList.toggle('active', btn.id === `btn-${lang}`);
  });
}

// Auto-apply on page load
document.addEventListener('DOMContentLoaded', () => setLang(currentLang));
