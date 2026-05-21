// ============================================================
// LANDING PAGE
// ============================================================

async function loginAdmin() {
  const login = document.getElementById('admin-login').value.trim();
  const password = document.getElementById('admin-password').value;
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  errEl.classList.add('hidden');
  if (!login || !password) {
    errEl.textContent = t('err_required');
    errEl.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  btn.querySelector('span').textContent = t('loading');

  try {
    const user = await loginWithCredentials(login, password);
    if (user.role !== 'admin') {
      // Redirect participant to participant page
      setSession(user);
      window.location.href = 'pages/participant.html';
      return;
    }
    setSession(user);
    window.location.href = 'pages/admin.html';
  } catch (e) {
    errEl.textContent = t('err_login');
    errEl.classList.remove('hidden');
    btn.disabled = false;
    btn.querySelector('span').textContent = t('login_btn');
  }
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('admin-password')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') loginAdmin();
  });
  document.getElementById('admin-login')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') loginAdmin();
  });

  // Load active events
  loadPublicEvents();

  // If already logged in, redirect
  const session = getSession();
  if (session) {
    if (session.role === 'admin') window.location.href = 'pages/admin.html';
    else window.location.href = 'pages/participant.html';
  }
});

async function loadPublicEvents() {
  const container = document.getElementById('events-list');
  try {
    const snap = await db.collection('events').orderBy('createdAt', 'desc').get();
    container.innerHTML = '';
    if (snap.empty) {
      container.innerHTML = `<div class="no-events">> No events found</div>`;
      return;
    }
    snap.forEach(doc => {
      const ev = { id: doc.id, ...doc.data() };
      const card = document.createElement('div');
      card.className = `event-card ${ev.status === 'finished' ? 'finished' : ''}`;
      const dateStr = ev.date || (ev.createdAt?.toDate ? ev.createdAt.toDate().toLocaleDateString(currentLang === 'pl' ? 'pl-PL' : 'en-US') : '');
      const statusLabel = ev.status === 'finished' ? t('event_finished') : t('event_active');
      const statusClass = ev.status === 'finished' ? 'finished' : 'active';
      card.innerHTML = `
        <div class="event-name">${ev.name}</div>
        <div class="event-meta">${dateStr ? `📅 ${dateStr}` : ''}</div>
        <span class="event-status ${statusClass}">${statusLabel}</span>`;
      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = `<div class="no-events">> ${t('err_generic')}</div>`;
  }
}
