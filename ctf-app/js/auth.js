// ============================================================
// AUTH MODULE
// ============================================================

const DEFAULT_ADMIN_LOGIN = 'admin';
const DEFAULT_ADMIN_PASS = 'NieMaHasla2026@#$';

// Session storage keys
const SESSION_KEY = 'ctf_session';

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setSession(data) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function requireAuth(allowedRoles) {
  const session = getSession();
  if (!session) {
    window.location.href = '/index.html';
    return null;
  }
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    window.location.href = '/index.html';
    return null;
  }
  return session;
}

async function loginWithCredentials(login, password) {
  // Lookup user in Firestore
  const snap = await db.collection('users')
    .where('login', '==', login)
    .limit(1)
    .get();

  if (snap.empty) throw new Error('invalid');

  const doc = snap.docs[0];
  const data = doc.data();

  // Simple hash compare (passwords stored as SHA-256 hex)
  const hash = await sha256(password);
  if (data.passwordHash !== hash) throw new Error('invalid');

  return { id: doc.id, login: data.login, role: data.role, displayName: data.displayName || data.login };
}

// SHA-256 using Web Crypto API
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function togglePassword(inputId) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

// Toast notifications
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✗', info: 'ℹ' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, duration);
}

// Confirm dialog
function showConfirm(message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="max-width:400px">
      <div class="modal-header"><span class="modal-title">⚠ Potwierdzenie</span></div>
      <div class="modal-body"><p style="color:var(--text2);line-height:1.6">${message}</p></div>
      <div class="modal-footer">
        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">${t('cancel')}</button>
        <button class="btn-danger" id="confirm-yes">${t('confirm')}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#confirm-yes').onclick = () => { overlay.remove(); onConfirm(); };
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// Lightbox
function openLightbox(src) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<img src="${src}" alt="preview">`;
  lb.onclick = () => lb.remove();
  document.body.appendChild(lb);
}
