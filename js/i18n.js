// ============================================================
// TRANSLATIONS (PL / EN)
// ============================================================

const TRANSLATIONS = {
  pl: {
    // Landing
    hero_tag: "// CYBERBEZPIECZEŃSTWO PRZEMYSŁOWE",
    hero_title1: "Browar pod kontrolą",
    hero_title2: "Cyberbezpieczeństwo produkcji",
    hero_desc: "Dwuetapowy scenariusz Capture The Flag z zakresu cyberbezpieczeństwa przemysłowego (ICS/OT). Wciel się w rolę analityka Incident Response i rozwiąż incydent w inteligentnym browarze.",
    active_events: "Aktywne wydarzenia",
    admin_panel: "Panel Administratora",
    username: "Login",
    password: "Hasło",
    login_btn: "Zaloguj się",
    participant_q: "Jesteś uczestnikiem?",
    login_here: "Zaloguj się tutaj",
    footer_text: "PCD Security",
    footer_sub: "Cyberbezpieczeństwo produkcji — CTF Workshop",

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
    event_pending: "Oczekuje na start",
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

    // Narrative stages
    stage1_name: "ETAP 1: Zasłona Dymna",
    stage1_sub: "Atak Replay na Warzelni",
    stage2_name: "ETAP 2: Prawdziwy Cel",
    stage2_sub: "Brewery Incident Response",

    // Nav & bonus
    nav_my_tasks: "Moje zadania",
    context_label: "Kontekst",
    bonus_time_label: "bonus za czas",
    bonus_now: "teraz",
    workshop_started_toast: "🚀 Warsztat rozpoczęty! Powodzenia!",
    event_finished_toast: "Wydarzenie zostało zakończone przez administratora",

    // Waiting screen
    waiting_title: "Czekaj na start",
    waiting_desc: "Administrator zaraz uruchomi warsztat. Bądź gotowy!",
    waiting_hint: "Ta strona odświeży się automatycznie po uruchomieniu",
    bonus_label: "Bonus za szybkość",
    event_pending: "Oczekuje na start",


    // Admin - dynamic strings
    no_events: "Brak wydarzeń",
    no_events_create: "Brak wydarzeń. Utwórz pierwsze wydarzenie.",
    btn_open: "Otwórz",
    btn_manage: "⚙ Zarządzaj",
    create_event_title: "Utwórz wydarzenie",
    btn_create: "+ Utwórz",
    delete_event_confirm: "Czy na pewno chcesz usunąć to wydarzenie? Wszystkie dane zostaną utracone.",
    start_event_confirm: "Uruchomić warsztat? Uczestnicy zobaczą zadania i zacznie się odliczanie czasu dla bonusów punktowych.",
    tab_content: "📝 Treść",
    tab_media: "🖼 Media",
    label_context_pl: "Kontekst (PL)",
    label_context_en: "Context (EN)",
    label_question_pl: "Pytanie (PL)",
    label_question_en: "Question (EN)",
    label_narrative_pl: "Narracja / Intro (PL)",
    label_narrative_en: "Narrative (EN)",
    label_answer: "Odpowiedź (flaga)",
    label_format: "Format (podpowiedź)",
    no_images: "Brak obrazków",
    no_files: "Brak plików",
    global_template_info: "ℹ Zmiany będą stosowane do wszystkich nowych wydarzeń",
    no_participants: "Brak przypisanych uczestników",
    th_login: "Login",
    th_points: "Punkty",
    th_solved_short: "Rozwiązane",
    th_actions: "Akcje",
    select_participant: "-- Wybierz --",
    select_loading: "Ładowanie...",
    already_assigned: "(już przypisany do tego wydarzenia)",
    assigned_other: "(przypisany do innego)",
    unassign_confirm: "Odpiąć uczestnika od tego wydarzenia?",
    btn_unassign: "Odepnij",
    change_pass_title: "Zmień hasło",
    delete_user_confirm: "Usunąć użytkownika",
    task_updated: "Zadanie zaktualizowane!",
    template_saved: "Szablon globalny zapisany!",
    workshop_started: "🚀 Warsztat uruchomiony! Uczestnicy widzą zadania.",
    event_ended_msg: "Wydarzenie zakończone",
    participant_assigned: "Uczestnik przypisany!",
    participant_unassigned: "Uczestnik odpięty",
    event_deleted: "Wydarzenie usunięte",
    // Dashboard labels
    stat_events: "Wydarzeń",
    stat_users: "Użytkowników",
    stat_tasks: "Zadań",
    stat_active_label: "Aktywnych",
    recent_events: "Ostatnie wydarzenia",
    see_all: "Zobacz wszystkie",
    // Task templates page
    nav_task_templates: "Szablon zadań",
    task_templates_title: "Szablon zadań",
    task_templates_subtitle: "Konfiguruj obrazki i pliki raz — każde nowe wydarzenie je odziedziczy automatycznie",
    btn_refresh: "↻ Odśwież",
    template_note: "Zmiany w szablonie globalnym <strong>nie aktualizują</strong> już istniejących wydarzeń — tylko nowo tworzonych.",
    save_template: "💾 Zapisz szablon",
    // Tabs in event detail
    tab_tasks_15: "📋 Zadania (15)",
    tab_participants: "👥 Uczestnicy",
    assigned_participants: "Przypisani uczestnicy",
    btn_assign: "+ Przypisz uczestnika",
    assign_participant_title: "Przypisz uczestnika do wydarzenia",
    select_participant_label: "Wybierz uczestnika",
    btn_do_assign: "+ Przypisz",
    // Login placeholders
    login_placeholder: "twój login",
    btn_back: "← Powrót",

    // Errors
    err_login: "Nieprawidłowy login lub hasło",
    err_required: "To pole jest wymagane",
    err_generic: "Wystąpił błąd. Spróbuj ponownie.",
    err_no_permission: "Brak uprawnień",

    // Scoreboard page
    sb_auto_refresh: "Auto-odświeżanie co 15 sekund",
    sb_last_refresh: "Ostatnie odświeżenie",
    sb_no_data: "Brak uczestników z punktami",
    sb_load_error: "Błąd ładowania danych",
    sb_event_missing: "Brak ID wydarzenia",
    sb_finished: "ZAKOŃCZONE",
    sb_rank: "Miejsce",
    sb_participant: "Uczestnik",
    sb_score: "Wynik",
    sb_solved: "Rozwiązanych",
    sb_refresh: "↻ Odśwież",
    sb_you: "(Ty)",
  },
  en: {
    // Landing
    hero_tag: "// INDUSTRIAL CYBERSECURITY",
    hero_title1: "Brewery Under Attack",
    hero_title2: "Production Cybersecurity",
    hero_desc: "A two-stage Capture The Flag scenario in Industrial Cybersecurity (ICS/OT). Step into the role of an Incident Response analyst and solve a security incident in a smart brewery.",
    active_events: "Active Events",
    admin_panel: "Administrator Panel",
    username: "Username",
    password: "Password",
    login_btn: "Log in",
    participant_q: "Are you a participant?",
    login_here: "Log in here",
    footer_text: "PCD Security",
    footer_sub: "Production Cybersecurity — CTF Workshop",

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
    event_pending: "Pending start",
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

    // Narrative stages
    stage1_name: "STAGE 1: Smoke Screen",
    stage1_sub: "Replay Attack on the Brewery",
    stage2_name: "STAGE 2: The Real Target",
    stage2_sub: "Brewery Incident Response",

    // Nav & bonus
    nav_my_tasks: "Moje zadania",
    context_label: "Kontekst",
    bonus_time_label: "bonus za czas",
    bonus_now: "teraz",
    workshop_started_toast: "🚀 Warsztat rozpoczęty! Powodzenia!",
    event_finished_toast: "Wydarzenie zostało zakończone przez administratora",

    // Nav & bonus
    nav_my_tasks: "My Tasks",
    context_label: "Context",
    bonus_time_label: "time bonus",
    bonus_now: "now",
    workshop_started_toast: "🚀 Workshop started! Good luck!",
    event_finished_toast: "The event has been ended by the administrator",

    // Waiting screen
    waiting_title: "Waiting for start",
    waiting_desc: "The administrator will start the workshop shortly. Get ready!",
    waiting_hint: "This page will refresh automatically when the workshop starts",
    bonus_label: "Speed bonus",
    event_pending: "Pending start",


    // Admin - dynamic strings
    no_events: "No events",
    no_events_create: "No events. Create your first event.",
    btn_open: "Open",
    btn_manage: "⚙ Manage",
    create_event_title: "Create event",
    btn_create: "+ Create",
    delete_event_confirm: "Are you sure you want to delete this event? All data will be lost.",
    start_event_confirm: "Start the workshop? Participants will see the tasks and the time bonus countdown will begin.",
    tab_content: "📝 Content",
    tab_media: "🖼 Media",
    label_context_pl: "Kontekst (PL)",
    label_context_en: "Context (EN)",
    label_question_pl: "Pytanie (PL)",
    label_question_en: "Question (EN)",
    label_narrative_pl: "Narracja / Intro (PL)",
    label_narrative_en: "Narrative (EN)",
    label_answer: "Answer (flag)",
    label_format: "Format (hint)",
    no_images: "No images",
    no_files: "No files",
    global_template_info: "ℹ Changes will apply to all new events",
    no_participants: "No participants assigned",
    th_login: "Username",
    th_points: "Points",
    th_solved_short: "Solved",
    th_actions: "Actions",
    select_participant: "-- Select --",
    select_loading: "Loading...",
    already_assigned: "(already assigned to this event)",
    assigned_other: "(assigned to another event)",
    unassign_confirm: "Remove this participant from the event?",
    btn_unassign: "Remove",
    change_pass_title: "Change password",
    delete_user_confirm: "Delete user",
    task_updated: "Task updated!",
    template_saved: "Global template saved!",
    workshop_started: "🚀 Workshop started! Participants can see the tasks.",
    event_ended_msg: "Event finished",
    participant_assigned: "Participant assigned!",
    participant_unassigned: "Participant removed",
    event_deleted: "Event deleted",
    // Dashboard labels
    stat_events: "Events",
    stat_users: "Users",
    stat_tasks: "Tasks",
    stat_active_label: "Active",
    recent_events: "Recent events",
    see_all: "See all",
    // Task templates page
    nav_task_templates: "Task templates",
    task_templates_title: "Task Templates",
    task_templates_subtitle: "Configure images and files once — every new event will inherit them automatically",
    btn_refresh: "↻ Refresh",
    template_note: "Changes to the global template <strong>do not update</strong> existing events — only newly created ones.",
    save_template: "💾 Save template",
    // Tabs in event detail
    tab_tasks_15: "📋 Tasks (15)",
    tab_participants: "👥 Participants",
    assigned_participants: "Assigned participants",
    btn_assign: "+ Assign participant",
    assign_participant_title: "Assign participant to event",
    select_participant_label: "Select participant",
    btn_do_assign: "+ Assign",
    // Login placeholders
    login_placeholder: "your username",
    btn_back: "← Back",

    // Errors
    err_login: "Invalid username or password",
    err_required: "This field is required",
    err_generic: "An error occurred. Please try again.",
    err_no_permission: "Permission denied",

    // Scoreboard page
    sb_auto_refresh: "Auto-refresh every 15 seconds",
    sb_last_refresh: "Last refresh",
    sb_no_data: "No participants with points yet",
    sb_load_error: "Error loading data",
    sb_event_missing: "Missing event ID",
    sb_finished: "FINISHED",
    sb_rank: "Rank",
    sb_participant: "Participant",
    sb_score: "Score",
    sb_solved: "Solved",
    sb_refresh: "↻ Refresh",
    sb_you: "(You)",
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
  document.querySelectorAll('#btn-pl, #btn-en').forEach(btn => {
    btn.classList.toggle('active', btn.id === `btn-${lang}`);
  });
  // Re-render tasks if participant page
  if (typeof renderTasks === 'function' && tasksData && tasksData.length) renderTasks();
  // Re-render admin tasks if admin page
  if (typeof loadAdminTasks === 'function' && currentEventId) loadAdminTasks(currentEventId);
  // Re-render admin event lists (status badges)
  if (typeof loadEvents === 'function' && document.getElementById('page-events')?.style.display !== 'none') loadEvents();
  if (typeof loadDashboard === 'function' && document.getElementById('page-dashboard')?.style.display !== 'none') loadDashboard();
  // Update event detail meta if open
  if (typeof updateEventDetailMeta === 'function' && currentEventId) updateEventDetailMeta();
}

document.addEventListener('DOMContentLoaded', () => setLang(currentLang));
