// ============================================================
// ADMIN PANEL LOGIC
// ============================================================

let session = null;
let currentEventId = null;
let currentEventData = null;
let currentTasksData = {};

document.addEventListener('DOMContentLoaded', async () => {
  session = requireAuth(['admin']);
  if (!session) return;

  document.getElementById('app').style.display = 'grid';
  document.getElementById('sidebar-username').textContent = session.login;
  document.getElementById('avatar-initials').textContent = session.login[0].toUpperCase();

  await loadDashboard();
  showPage('dashboard');
  setLang(currentLang);
});

function doLogout() {
  clearSession();
  window.location.href = '../index.html';
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
function showPage(page) {
  document.querySelectorAll('.page-section').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const el = document.getElementById(`page-${page}`);
  if (el) el.style.display = 'block';

  const navItem = document.querySelector(`[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  if (page === 'events') loadEvents();
  if (page === 'users') loadUsers();
  if (page === 'task-templates') loadGlobalTasks();
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', b.getAttribute('onclick').includes(tab)));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`tab-${tab}`)?.classList.add('active');
  if (tab === 'participants') loadEventParticipants(currentEventId);
}

// ============================================================
// DASHBOARD
// ============================================================
async function loadDashboard() {
  try {
    const [evSnap, usSnap] = await Promise.all([
      db.collection('events').get(),
      db.collection('users').where('role', '==', 'participant').get()
    ]);
    const activeCount = evSnap.docs.filter(d => d.data().status === 'active').length;
    document.getElementById('stat-events').textContent = evSnap.size;
    document.getElementById('stat-users').textContent = usSnap.size;
    document.getElementById('stat-active').textContent = activeCount;

    // Recent events
    const container = document.getElementById('dash-events-list');
    const recent = evSnap.docs.slice(0, 5);
    if (recent.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="icon">◈</div><p>${t('no_events')}</p></div>`;
      return;
    }
    container.innerHTML = `<table class="data-table">
      <thead><tr><th>${t('name')}</th><th>${t('event_date')}</th><th>${t('status')}</th><th></th></tr></thead>
      <tbody>${recent.map(doc => {
        const ev = doc.data();
        const date = ev.date || '';
        return `<tr>
          <td style="font-weight:600">${ev.name}</td>
          <td>${date}</td>
          <td><span class="badge ${ev.status === 'active' ? 'badge-green' : ev.status === 'pending' ? 'badge-yellow' : 'badge-gray'}">${ev.status === 'active' ? t('event_active') : ev.status === 'pending' ? t('event_pending') : t('event_finished')}</span></td>
          <td><button class="btn-secondary btn-sm" onclick="openEventDetail('${doc.id}')">${t('btn_open')}</button></td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
  } catch (e) { console.error(e); }
}

// ============================================================
// EVENTS
// ============================================================
async function loadEvents() {
  const container = document.getElementById('events-container');
  container.innerHTML = `<div class="loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  try {
    const snap = await db.collection('events').orderBy('createdAt', 'desc').get();
    if (snap.empty) {
      container.innerHTML = `<div class="empty-state"><div class="icon">◈</div><p>${t('no_events_create')}</p></div>`;
      return;
    }
    container.innerHTML = '';
    snap.forEach(doc => {
      const ev = { id: doc.id, ...doc.data() };
      const card = document.createElement('div');
      card.className = 'card';
      card.style.marginBottom = '16px';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <div style="flex:1">
            <div style="font-size:1.1rem;font-weight:700;margin-bottom:4px">${ev.name}</div>
            <div style="font-size:0.8rem;color:var(--text2)">${ev.description || ''}</div>
            <div style="font-size:0.75rem;color:var(--text3);margin-top:4px;font-family:var(--font-mono)">${ev.date || ''}</div>
          </div>
          <span class="badge ${ev.status === 'active' ? 'badge-green' : ev.status === 'pending' ? 'badge-yellow' : 'badge-gray'}">${ev.status === 'active' ? t('event_active') : ev.status === 'pending' ? t('event_pending') : t('event_finished')}</span>
          <div style="display:flex;gap:8px">
            <button class="btn-secondary btn-sm" onclick="openEventDetail('${ev.id}')">${t('btn_manage')}</button>
            <button class="btn-secondary btn-sm" onclick="openScoreboard('${ev.id}')">🏆 Scoreboard</button>
            <button class="btn-danger btn-sm" onclick="deleteEvent('${ev.id}')">🗑</button>
          </div>
        </div>`;
      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger)">${t('err_generic')}</p>`;
  }
}

function openCreateEventModal() {
  const modal = createModal(t('create_event_title'), `
    <div class="form-group">
      <label data-i18n="event_name">Nazwa wydarzenia</label>
      <input type="text" id="ev-name" placeholder="np. Warsztaty Cybersecurity gr.1">
    </div>
    <div class="form-group">
      <label data-i18n="event_desc">Opis</label>
      <textarea id="ev-desc" placeholder="Opcjonalny opis..."></textarea>
    </div>
    <div class="form-group">
      <label data-i18n="event_date">Data</label>
      <input type="date" id="ev-date">
    </div>
  `, [
    { label: t('cancel'), cls: 'btn-secondary', action: 'close' },
    { label: t('btn_create'), cls: 'btn-primary', action: createEvent }
  ]);
  setLang(currentLang);
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('ev-date').value = today;
}

async function createEvent() {
  const name = document.getElementById('ev-name').value.trim();
  const desc = document.getElementById('ev-desc').value.trim();
  const date = document.getElementById('ev-date').value;
  if (!name) { showToast(t('err_required'), 'error'); return; }

  try {
    const evRef = await db.collection('events').add({
      name, description: desc, date, status: 'pending',
      createdAt: new Date().toISOString()
    });

    // Load global task templates (inherit images/files/points)
    const templateSnap = await db.collection('taskTemplates').orderBy('id').get();
    const batch = db.batch();

    if (!templateSnap.empty) {
      // Use saved global templates
      templateSnap.forEach(doc => {
        const ref = db.collection('events').doc(evRef.id).collection('tasks').doc(doc.id);
        batch.set(ref, { ...doc.data() });
      });
    } else {
      // First event ever: use JS defaults + save as global templates
      CTF_TASKS_TEMPLATE.forEach(task => {
        const taskData = { ...task, images: [], files: [], points: task.points };
        batch.set(db.collection('events').doc(evRef.id).collection('tasks').doc(String(task.id)), taskData);
        batch.set(db.collection('taskTemplates').doc(String(task.id)), taskData);
      });
    }
    await batch.commit();

    closeModal();
    showToast(t('event_created'), 'success');
    loadEvents();
    loadDashboard();
  } catch (e) {
    console.error(e);
    showToast(t('err_generic'), 'error');
  }
}

async function deleteEvent(id) {
  showConfirm(t('delete_event_confirm'), async () => {
    try {
      // Delete subcollections
      const tasks = await db.collection('events').doc(id).collection('tasks').get();
      const answers = await db.collection('events').doc(id).collection('answers').get();
      const batch = db.batch();
      tasks.forEach(d => batch.delete(d.ref));
      answers.forEach(d => batch.delete(d.ref));
      batch.delete(db.collection('events').doc(id));
      await batch.commit();
      showToast('Wydarzenie usunięte', 'success');
      loadEvents();
    } catch (e) { showToast(t('err_generic'), 'error'); }
  });
}

async function openEventDetail(eventId) {
  currentEventId = eventId;
  showPage('event-detail');

  const doc = await db.collection('events').doc(eventId).get();
  currentEventData = { id: doc.id, ...doc.data() };

  document.getElementById('detail-event-name').textContent = currentEventData.name;
  document.getElementById('detail-event-meta').textContent =
    `${currentEventData.date || ''} · ${currentEventData.status === 'active' ? t('event_active') : currentEventData.status === 'pending' ? t('event_pending') : t('event_finished')}`;

  const s = currentEventData.status || 'pending';
  document.getElementById('btn-start-event').style.display = (s === 'pending') ? '' : 'none';
  document.getElementById('btn-end-event').style.display = (s === 'active') ? '' : 'none';
  updateEventDetailMeta();

  // Activate event-detail nav item
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  loadAdminTasks(eventId);
}

async function loadAdminTasks(eventId) {
  const container = document.getElementById('admin-tasks-list');
  container.innerHTML = `<div class="loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;

  const snap = await db.collection('events').doc(eventId).collection('tasks').orderBy('id').get();
  container.innerHTML = '';
  currentTasksData = {};
  snap.forEach(doc => { currentTasksData[doc.id] = { ...doc.data() }; });

  snap.forEach(doc => {
    const task = doc.data();
    const isEN = currentLang === 'en';
    container.appendChild(buildAdminTaskCard(task, isEN));
  });
}

function buildAdminTaskCard(task, isEN) {
  const wrap = document.createElement('div');
  wrap.className = 'task-card';
  wrap.id = `admin-task-${task.id}`;

  const stageLabel = isEN ? (task.stageNameEn || task.stageName) : task.stageName;
  const taskName = isEN ? (task.nameEn || task.name) : task.name;

  wrap.innerHTML = `
    <div class="task-header" onclick="toggleAdminTask(${task.id})">
      <div class="task-num">${task.id}</div>
      <div class="task-title-wrap">
        <div class="task-name">${taskName}</div>
        <div class="task-stage">${task.stage} · ${stageLabel}</div>
      </div>
      <span class="task-points">${task.points} pts</span>
      <button class="btn-secondary btn-sm" onclick="event.stopPropagation();openEditTask(${task.id})" style="margin-left:8px">✏ Edytuj</button>
      <span class="task-chevron" id="chev-${task.id}">▼</span>
    </div>
    <div class="task-body" id="task-body-${task.id}" style="display:none">
      ${task.context ? `<div class="task-context">${(isEN ? task.contextEn : task.context).replace(/\n/g,'<br>')}</div>` : ''}
      <div class="task-question">${isEN ? (task.questionEn || task.question) : task.question}</div>
      <div class="task-format">${task.format}</div>
      <div class="admin-answer">✓ ${t('correct_answer')} <strong>${task.answer}</strong></div>
      ${task.images && task.images.length > 0 ? `
        <div class="task-images" style="margin-top:12px">
          ${task.images.map(img => `<img class="task-thumb" src="${img.url}" alt="${img.name}" onclick="openLightbox('${img.url}')">`).join('')}
        </div>` : ''}
      ${task.files && task.files.length > 0 ? `
        <div class="task-files" style="margin-top:8px">
          ${task.files.map(f => `<a href="${f.url}" target="_blank" class="task-file" download="${f.name}">📎 ${f.name}</a>`).join('')}
        </div>` : ''}
    </div>`;
  return wrap;
}

function toggleAdminTask(id) {
  const body = document.getElementById(`task-body-${id}`);
  const chev = document.getElementById(`chev-${id}`);
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  chev.classList.toggle('open', !open);
}

function openEditTask(taskId) {
  const task = currentTasksData[String(taskId)];
  if (!task) return;

  const inp = (id, val, ph='') => `<input type="text" id="${id}" value="${(val||'').replace(/"/g,'&quot;')}" placeholder="${ph}" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:7px 10px;color:var(--text);font-size:0.85rem;margin-bottom:6px">`;
  const ta = (id, val, ph='') => `<textarea id="${id}" placeholder="${ph}" rows="3" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:7px 10px;color:var(--text);font-size:0.85rem;resize:vertical;margin-bottom:6px">${(val||'').replace(/</g,'&lt;')}</textarea>`;

  createModal(`Edytuj zadanie ${taskId}: ${task.name}`, `
    <div class="tabs" style="margin-bottom:16px">
      <button class="tab-btn active" onclick="switchEditTab('content',this)">${t('tab_content')}</button>
      <button class="tab-btn" onclick="switchEditTab('media',this)">${t('tab_media')}</button>
    </div>

    <!-- CONTENT TAB -->
    <div id="edit-tab-content">
      <div class="form-group">
        <label>${t('label_context_pl')}</label>${ta('edit-context', task.context, 'Treść kontekstu po polsku...')}
        <label>${t('label_context_en')}</label>${ta('edit-context-en', task.contextEn, 'Context text in English...')}
      </div>
      <div class="form-group">
        <label>${t('label_question_pl')}</label>${ta('edit-question', task.question, 'Treść pytania po polsku...')}
        <label>${t('label_question_en')}</label>${ta('edit-question-en', task.questionEn, 'Question text in English...')}
      </div>
      <div class="form-group">
        <label>${t('label_narrative_pl')}</label>${ta('edit-narrative', task.narrative, 'Opcjonalna narracja...')}
        <label>${t('label_narrative_en')}</label>${ta('edit-narrative-en', task.narrativeEn, 'Optional narrative...')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label>${t('label_answer')}</label>${inp('edit-answer', task.answer, 'FLAG{...}')}
        </div>
        <div class="form-group">
          <label>${t('label_format')}</label>${inp('edit-format', task.format, 'FLAG{Słowo}')}
        </div>
      </div>
      <div class="form-group">
        <label>${t('task_points')}</label>
        <input type="number" id="edit-points" value="${task.points}" min="0" step="10" style="width:120px;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:7px 10px;color:var(--text);font-size:0.85rem">
      </div>
    </div>

    <!-- MEDIA TAB -->
    <div id="edit-tab-media" style="display:none">
      <div class="form-group">
        <label>${t('task_images')} (URL)</label>
        <div id="images-list">
          ${(task.images || []).map((img, i) => `
            <div style="display:flex;gap:8px;margin-bottom:6px" id="img-row-${i}">
              <input type="text" value="${img.url}" style="flex:1;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="URL obrazka...">
              <button class="btn-danger btn-sm" onclick="document.getElementById('img-row-${i}').remove()">✕</button>
            </div>`).join('')}
        </div>
        <button class="btn-secondary btn-sm" onclick="addImageRow()" style="margin-top:6px">+ Dodaj obrazek</button>
      </div>
      <div class="form-group">
        <label>${t('task_files')} (URL)</label>
        <div id="files-list">
          ${(task.files || []).map((f, i) => `
            <div style="display:flex;gap:8px;margin-bottom:6px" id="file-row-${i}">
              <input type="text" value="${f.url}" style="flex:1;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="URL pliku...">
              <input type="text" value="${f.name}" style="width:140px;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="Nazwa pliku">
              <button class="btn-danger btn-sm" onclick="document.getElementById('file-row-${i}').remove()">✕</button>
            </div>`).join('')}
        </div>
        <button class="btn-secondary btn-sm" onclick="addFileRow()" style="margin-top:6px">+ Dodaj plik</button>
      </div>
      <p style="font-size:0.75rem;color:var(--text3);margin-top:4px">
        💡 Wgraj pliki na Google Drive/Dropbox i wklej publiczny URL.
      </p>
    </div>
  `, [
    { label: t('cancel'), cls: 'btn-secondary', action: 'close' },
    { label: '💾 Zapisz', cls: 'btn-primary', action: () => saveTaskEdit(taskId) }
  ], '680px');
}

function switchEditTab(tab, btn) {
  document.getElementById('edit-tab-content').style.display = tab === 'content' ? 'block' : 'none';
  document.getElementById('edit-tab-media').style.display = tab === 'media' ? 'block' : 'none';
  document.querySelectorAll('#current-modal .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function addImageRow() {
  const list = document.getElementById('images-list');
  const i = list.children.length;
  const row = document.createElement('div');
  row.id = `img-row-${i}`;
  row.style.cssText = 'display:flex;gap:8px;margin-bottom:6px';
  row.innerHTML = `
    <input type="text" style="flex:1;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="URL obrazka...">
    <button class="btn-danger btn-sm" onclick="this.parentElement.remove()">✕</button>`;
  list.appendChild(row);
}

function addFileRow() {
  const list = document.getElementById('files-list');
  const i = list.children.length;
  const row = document.createElement('div');
  row.id = `file-row-${i}`;
  row.style.cssText = 'display:flex;gap:8px;margin-bottom:6px';
  row.innerHTML = `
    <input type="text" style="flex:1;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="URL pliku...">
    <input type="text" style="width:140px;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="Nazwa pliku">
    <button class="btn-danger btn-sm" onclick="this.parentElement.remove()">✕</button>`;
  list.appendChild(row);
}

async function saveTaskEdit(taskId) {
  const points = parseInt(document.getElementById('edit-points').value) || 0;
  const g = id => document.getElementById(id)?.value || '';

  const textFields = {
    context:      g('edit-context'),
    contextEn:    g('edit-context-en'),
    question:     g('edit-question'),
    questionEn:   g('edit-question-en'),
    narrative:    g('edit-narrative'),
    narrativeEn:  g('edit-narrative-en'),
    answer:       g('edit-answer').trim(),
    format:       g('edit-format').trim(),
  };

  // Collect images
  const images = [];
  document.querySelectorAll('#images-list [id^="img-row-"]').forEach(row => {
    const url = row.querySelector('input').value.trim();
    if (url) images.push({ url, name: url.split('/').pop() });
  });

  // Collect files
  const files = [];
  document.querySelectorAll('#files-list [id^="file-row-"]').forEach(row => {
    const inputs = row.querySelectorAll('input');
    const url = inputs[0]?.value.trim();
    const name = inputs[1]?.value.trim() || url?.split('/').pop() || 'file';
    if (url) files.push({ url, name });
  });

  const updateData = { points, images, files, ...textFields };

  try {
    await db.collection('events').doc(currentEventId).collection('tasks').doc(String(taskId)).update(updateData);
    // Also update global template
    try {
      await db.collection('taskTemplates').doc(String(taskId)).update(updateData);
    } catch {
      const taskData = currentTasksData[String(taskId)];
      await db.collection('taskTemplates').doc(String(taskId)).set({ ...taskData, ...updateData });
    }
    currentTasksData[String(taskId)] = { ...currentTasksData[String(taskId)], ...updateData };
    closeModal();
    showToast(t('task_updated'), 'success');
    loadAdminTasks(currentEventId);
  } catch (e) {
    console.error(e);
    showToast(t('err_generic'), 'error');
  }
}

async function startEvent() {
  showConfirm(t('start_event_confirm'), async () => {
    try {
      const startedAt = new Date().toISOString();
      await db.collection('events').doc(currentEventId).update({ status: 'active', startedAt });
      currentEventData.status = 'active';
      currentEventData.startedAt = startedAt;
      document.getElementById('btn-start-event').style.display = 'none';
      document.getElementById('btn-end-event').style.display = '';
      updateEventDetailMeta();
      showToast(t('workshop_started'), 'success');
    } catch (e) { showToast(t('err_generic'), 'error'); }
  });
}

async function endEvent() {
  showConfirm(t('end_event_confirm'), async () => {
    try {
      await db.collection('events').doc(currentEventId).update({ status: 'finished' });
      currentEventData.status = 'finished';
      document.getElementById('btn-end-event').style.display = 'none';
      document.getElementById('btn-start-event').style.display = 'none';
      updateEventDetailMeta();
      showToast(t('event_ended_msg'), 'success');
    } catch (e) { showToast(t('err_generic'), 'error'); }
  });
}

function updateEventDetailMeta() {
  const statusMap = { pending: `⏳ ${t('event_pending')}`, active: `▶ ${t('event_active')}`, finished: `⏹ ${t('event_finished')}` };
  const s = currentEventData.status || 'pending';
  document.getElementById('detail-event-meta').textContent =
    `${currentEventData.date || ''} · ${statusMap[s] || s}`;
}

// ============================================================
// GLOBAL TASK TEMPLATES
// ============================================================
async function loadGlobalTasks() {
  const container = document.getElementById('global-tasks-list');
  if (!container) return;
  container.innerHTML = `<div class="loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;

  try {
    let snap = await db.collection('taskTemplates').orderBy('id').get();

    // If no templates exist yet, initialize from JS defaults
    if (snap.empty) {
      const batch = db.batch();
      CTF_TASKS_TEMPLATE.forEach(task => {
        batch.set(db.collection('taskTemplates').doc(String(task.id)), {
          ...task, images: [], files: [], points: task.points
        });
      });
      await batch.commit();
      snap = await db.collection('taskTemplates').orderBy('id').get();
    }

    container.innerHTML = '';
    const isEN = currentLang === 'en';
    const tasksMap = {};
    snap.forEach(doc => { tasksMap[doc.id] = { ...doc.data() }; });
    snap.forEach(doc => {
      const task = doc.data();
      const taskName = isEN ? (task.nameEn || task.name) : task.name;
      const stageLabel = isEN ? (task.stageNameEn || task.stageName) : task.stageName;
      const wrap = document.createElement('div');
      wrap.className = 'task-card';
      wrap.innerHTML = `
        <div class="task-header" onclick="toggleGlobalTask(${task.id})">
          <div class="task-num">${task.id}</div>
          <div class="task-title-wrap">
            <div class="task-name">${taskName}</div>
            <div class="task-stage">${task.stage} · ${stageLabel}</div>
          </div>
          <span class="task-points">${task.points} pts</span>
          <button class="btn-secondary btn-sm" onclick="event.stopPropagation();openEditGlobalTask(${task.id})" style="margin-left:8px">✏ Edytuj</button>
          <span class="task-chevron" id="gchev-${task.id}">▼</span>
        </div>
        <div class="task-body" id="gtask-body-${task.id}" style="display:none">
          <div class="admin-answer">✓ ${t('correct_answer')} <strong>${task.answer}</strong></div>
          ${task.images && task.images.length > 0 ? `
            <div class="task-images" style="margin-top:12px">
              ${task.images.map(img => `<img class="task-thumb" src="${img.url}" alt="${img.name}" onclick="openLightbox('${img.url}')">`).join('')}
            </div>` : '<div style="color:var(--text3);font-size:0.8rem;margin-top:8px">Brak obrazków</div>'}
          ${task.files && task.files.length > 0 ? `
            <div class="task-files" style="margin-top:8px">
              ${task.files.map(f => `<a href="${f.url}" target="_blank" class="task-file">📎 ${f.name}</a>`).join('')}
            </div>` : '<div style="color:var(--text3);font-size:0.8rem;margin-top:4px">Brak plików</div>'}
        </div>`;
      container.appendChild(wrap);
    });
    // Store for editing
    window._globalTasksMap = tasksMap;
  } catch(e) {
    console.error(e);
    container.innerHTML = `<p style="color:var(--danger)">${t('err_generic')}</p>`;
  }
}

function toggleGlobalTask(id) {
  const body = document.getElementById(`gtask-body-${id}`);
  const chev = document.getElementById(`gchev-${id}`);
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  chev.classList.toggle('open', !open);
}

function openEditGlobalTask(taskId) {
  const task = (window._globalTasksMap || {})[String(taskId)];
  if (!task) return;

  const inp = (id, val, ph='') => `<input type="text" id="${id}" value="${(val||'').replace(/"/g,'&quot;')}" placeholder="${ph}" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:7px 10px;color:var(--text);font-size:0.85rem;margin-bottom:6px">`;
  const ta = (id, val, ph='') => `<textarea id="${id}" placeholder="${ph}" rows="3" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:7px 10px;color:var(--text);font-size:0.85rem;resize:vertical;margin-bottom:6px">${(val||'').replace(/</g,'&lt;')}</textarea>`;

  createModal(`Edytuj szablon globalny — Zadanie ${taskId}`, `
    <div style="background:rgba(46,204,113,0.05);border:1px solid rgba(46,204,113,0.2);border-radius:6px;padding:10px 14px;margin-bottom:12px;font-size:0.8rem;color:var(--accent)">
      ${t('global_template_info')}
    </div>
    <div class="tabs" style="margin-bottom:16px">
      <button class="tab-btn active" onclick="switchGEditTab('content',this)">${t('tab_content')}</button>
      <button class="tab-btn" onclick="switchGEditTab('media',this)">${t('tab_media')}</button>
    </div>
    <div id="gedit-tab-content">
      <div class="form-group">
        <label>${t('label_context_pl')}</label>${ta('gedit-context', task.context, 'Treść kontekstu...')}
        <label>${t('label_context_en')}</label>${ta('gedit-context-en', task.contextEn, 'Context in English...')}
      </div>
      <div class="form-group">
        <label>${t('label_question_pl')}</label>${ta('gedit-question', task.question, 'Treść pytania...')}
        <label>${t('label_question_en')}</label>${ta('gedit-question-en', task.questionEn, 'Question in English...')}
      </div>
      <div class="form-group">
        <label>${t('label_narrative_pl')}</label>${ta('gedit-narrative', task.narrative, 'Opcjonalna narracja...')}
        <label>${t('label_narrative_en')}</label>${ta('gedit-narrative-en', task.narrativeEn, 'Optional narrative...')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label>${t('label_answer')}</label>${inp('gedit-answer', task.answer, 'FLAG{...}')}
        </div>
        <div class="form-group">
          <label>${t('label_format')}</label>${inp('gedit-format', task.format, 'FLAG{Słowo}')}
        </div>
      </div>
      <div class="form-group">
        <label>${t('task_points')}</label>
        <input type="number" id="gedit-points" value="${task.points}" min="0" step="10" style="width:120px;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:7px 10px;color:var(--text);font-size:0.85rem">
      </div>
    </div>
    <div id="gedit-tab-media" style="display:none">
    <div class="form-group">
      <label>${t('task_images')} (URL)</label>
      <div id="gimages-list">
        ${(task.images || []).map((img, i) => `
          <div style="display:flex;gap:8px;margin-bottom:6px" id="gimg-row-${i}">
            <input type="text" value="${img.url}" style="flex:1;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="URL obrazka...">
            <button class="btn-danger btn-sm" onclick="document.getElementById('gimg-row-${i}').remove()">✕</button>
          </div>`).join('')}
      </div>
      <button class="btn-secondary btn-sm" onclick="addGImageRow()" style="margin-top:6px">+ Dodaj obrazek</button>
    </div>
    <div class="form-group">
      <label>${t('task_files')} (URL)</label>
      <div id="gfiles-list">
        ${(task.files || []).map((f, i) => `
          <div style="display:flex;gap:8px;margin-bottom:6px" id="gfile-row-${i}">
            <input type="text" value="${f.url}" style="flex:1;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="URL pliku...">
            <input type="text" value="${f.name}" style="width:140px;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="Nazwa pliku">
            <button class="btn-danger btn-sm" onclick="document.getElementById('gfile-row-${i}').remove()">✕</button>
          </div>`).join('')}
      </div>
      <button class="btn-secondary btn-sm" onclick="addGFileRow()" style="margin-top:6px">+ Dodaj plik</button>
    </div>
  `, [
    { label: t('cancel'), cls: 'btn-secondary', action: 'close' },
    { label: t('save_template'), cls: 'btn-primary', action: () => saveGlobalTask(taskId) }
  ], '640px');
}

function addGImageRow() {
  const list = document.getElementById('gimages-list');
  const i = list.children.length;
  const row = document.createElement('div');
  row.id = `gimg-row-${i}`;
  row.style.cssText = 'display:flex;gap:8px;margin-bottom:6px';
  row.innerHTML = `<input type="text" style="flex:1;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="URL obrazka..."><button class="btn-danger btn-sm" onclick="this.parentElement.remove()">✕</button>`;
  list.appendChild(row);
}

function addGFileRow() {
  const list = document.getElementById('gfiles-list');
  const i = list.children.length;
  const row = document.createElement('div');
  row.id = `gfile-row-${i}`;
  row.style.cssText = 'display:flex;gap:8px;margin-bottom:6px';
  row.innerHTML = `<input type="text" style="flex:1;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="URL pliku..."><input type="text" style="width:140px;background:var(--bg2);border:1px solid var(--border2);border-radius:4px;padding:6px 10px;color:var(--text);font-size:0.8rem" placeholder="Nazwa pliku"><button class="btn-danger btn-sm" onclick="this.parentElement.remove()">✕</button>`;
  list.appendChild(row);
}

function switchGEditTab(tab, btn) {
  document.getElementById('gedit-tab-content').style.display = tab === 'content' ? 'block' : 'none';
  document.getElementById('gedit-tab-media').style.display = tab === 'media' ? 'block' : 'none';
  document.querySelectorAll('#current-modal .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

async function saveGlobalTask(taskId) {
  const points = parseInt(document.getElementById('gedit-points').value) || 0;
  const g = id => document.getElementById(id)?.value || '';

  const textFields = {
    context:     g('gedit-context'),
    contextEn:   g('gedit-context-en'),
    question:    g('gedit-question'),
    questionEn:  g('gedit-question-en'),
    narrative:   g('gedit-narrative'),
    narrativeEn: g('gedit-narrative-en'),
    answer:      g('gedit-answer').trim(),
    format:      g('gedit-format').trim(),
  };

  const images = [];
  document.querySelectorAll('#gimages-list [id^="gimg-row-"]').forEach(row => {
    const url = row.querySelector('input').value.trim();
    if (url) images.push({ url, name: url.split('/').pop() });
  });
  const files = [];
  document.querySelectorAll('#gfiles-list [id^="gfile-row-"]').forEach(row => {
    const inputs = row.querySelectorAll('input');
    const url = inputs[0]?.value.trim();
    const name = inputs[1]?.value.trim() || url?.split('/').pop() || 'file';
    if (url) files.push({ url, name });
  });

  const updateData = { points, images, files, ...textFields };
  try {
    await db.collection('taskTemplates').doc(String(taskId)).update(updateData);
    if (window._globalTasksMap) window._globalTasksMap[String(taskId)] = { ...window._globalTasksMap[String(taskId)], ...updateData };
    closeModal();
    showToast(t('template_saved'), 'success');
    loadGlobalTasks();
  } catch(e) {
    showToast(t('err_generic'), 'error');
  }
}

// ============================================================
// PARTICIPANTS
// ============================================================
async function loadEventParticipants(eventId) {
  const container = document.getElementById('participants-list');
  container.innerHTML = `<div class="loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;

  const snap = await db.collection('users').where('eventId', '==', eventId).where('role', '==', 'participant').get();
  if (snap.empty) {
    container.innerHTML = `<div class="empty-state"><div class="icon">◉</div><p>${t('no_participants')}</p></div>`;
    return;
  }

  // Load answers for score
  const answersSnap = await db.collection('events').doc(eventId).collection('answers').get();
  const scoresByUser = {};
  answersSnap.forEach(doc => {
    const d = doc.data();
    if (!scoresByUser[d.userId]) scoresByUser[d.userId] = { total: 0, solved: 0 };
    if (d.correct) {
      scoresByUser[d.userId].total += (d.points || 0);
      scoresByUser[d.userId].solved++;
    }
  });

  container.innerHTML = `<table class="data-table">
    <thead><tr><th>${t('th_login')}</th><th>${t('th_points')}</th><th>${t('th_solved_short')}</th><th>${t('th_actions')}</th></tr></thead>
    <tbody>${snap.docs.map(doc => {
      const u = doc.data();
      const sc = scoresByUser[doc.id] || { total: 0, solved: 0 };
      return `<tr>
        <td style="font-weight:600">${u.login}</td>
        <td><span style="color:var(--accent2);font-family:var(--font-mono);font-weight:700">${sc.total}</span></td>
        <td>${sc.solved}/15</td>
        <td><button class="btn-danger btn-sm" onclick="removeParticipant('${doc.id}')">${t('btn_unassign')}</button></td>
      </tr>`;
    }).join('')}</tbody>
  </table>`;
}

function openAssignModal() {
  createModal(t('assign_participant_title'), `
    <div class="form-group">
      <label>Wybierz uczestnika</label>
      <select id="assign-user-select"><option value="">Ładowanie...</option></select>
    </div>`, [
    { label: t('cancel'), cls: 'btn-secondary', action: 'close' },
    { label: t('btn_do_assign'), cls: 'btn-primary', action: assignParticipant }
  ]);
  loadUnassignedUsers();
}

async function loadUnassignedUsers() {
  const snap = await db.collection('users').where('role', '==', 'participant').get();
  const sel = document.getElementById('assign-user-select');
  sel.innerHTML = `<option value="">${t('select_participant')}</option>`;
  snap.forEach(doc => {
    const u = doc.data();
    if (!u.eventId || u.eventId === currentEventId) {
      const opt = document.createElement('option');
      opt.value = doc.id;
      opt.textContent = u.login + (u.eventId ? ' (już przypisany do tego wydarzenia)' : '');
      sel.appendChild(opt);
    } else {
      const opt = document.createElement('option');
      opt.value = doc.id;
      opt.textContent = u.login + ` (przypisany do innego)`;
      sel.appendChild(opt);
    }
  });
}

async function assignParticipant() {
  const userId = document.getElementById('assign-user-select').value;
  if (!userId) { showToast(t('err_required'), 'error'); return; }
  try {
    await db.collection('users').doc(userId).update({ eventId: currentEventId });
    closeModal();
    showToast(t('participant_assigned'), 'success');
    loadEventParticipants(currentEventId);
  } catch (e) { showToast(t('err_generic'), 'error'); }
}

async function removeParticipant(userId) {
  showConfirm(t('unassign_confirm'), async () => {
    await db.collection('users').doc(userId).update({ eventId: firebase.firestore.FieldValue.delete() });
    showToast(t('participant_unassigned'), 'success');
    loadEventParticipants(currentEventId);
  });
}

// ============================================================
// USERS
// ============================================================
async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = `<tr><td colspan="4"><div class="loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></td></tr>`;

  const [usersSnap, eventsSnap] = await Promise.all([
    db.collection('users').get(),
    db.collection('events').get()
  ]);
  const eventsMap = {};
  eventsSnap.forEach(d => { eventsMap[d.id] = d.data().name; });

  tbody.innerHTML = '';
  usersSnap.forEach(doc => {
    const u = doc.data();
    if (doc.id === session.id) return; // hide self (admin editing own)
    const evName = u.eventId ? (eventsMap[u.eventId] || u.eventId) : '—';
    const roleBadge = u.role === 'admin' ? 'badge-blue' : 'badge-gray';
    const roleLabel = u.role === 'admin' ? t('role_admin') : t('role_participant');
    tbody.innerHTML += `<tr>
      <td style="font-weight:600;font-family:var(--font-mono)">${u.login}</td>
      <td><span class="badge ${roleBadge}">${roleLabel}</span></td>
      <td style="font-size:0.8rem;color:var(--text2)">${evName}</td>
      <td><div class="actions">
        <button class="btn-secondary btn-sm" onclick="openChangePassModal('${doc.id}', '${u.login}')">🔑 ${t('change_password')}</button>
        <button class="btn-danger btn-sm" onclick="deleteUser('${doc.id}', '${u.login}')">🗑</button>
      </div></td>
    </tr>`;
  });
}

function openAddUserModal() {
  createModal(t('add_user'), `
    <div class="form-group">
      <label data-i18n="user_login">Login</label>
      <input type="text" id="nu-login" placeholder="login...">
    </div>
    <div class="form-group">
      <label data-i18n="user_password">Hasło</label>
      <div class="password-wrap">
        <input type="password" id="nu-pass" placeholder="hasło...">
        <button class="eye-btn" onclick="togglePassword('nu-pass')">👁</button>
      </div>
    </div>
    <div class="form-group">
      <label data-i18n="user_role">Rola</label>
      <select id="nu-role">
        <option value="participant">${t('role_participant')}</option>
        <option value="admin">${t('role_admin')}</option>
      </select>
    </div>
  `, [
    { label: t('cancel'), cls: 'btn-secondary', action: 'close' },
    { label: `+ ${t('add_user')}`, cls: 'btn-primary', action: createUser }
  ]);
  setLang(currentLang);
}

async function createUser() {
  const login = document.getElementById('nu-login').value.trim();
  const pass = document.getElementById('nu-pass').value;
  const role = document.getElementById('nu-role').value;
  if (!login || !pass) { showToast(t('err_required'), 'error'); return; }

  // Check if login exists
  const exists = await db.collection('users').where('login', '==', login).get();
  if (!exists.empty) { showToast('Login już istnieje', 'error'); return; }

  const hash = await sha256(pass);
  await db.collection('users').add({ login, passwordHash: hash, role, displayName: login });
  closeModal();
  showToast(t('user_created'), 'success');
  loadUsers();
}

function openChangePassModal(userId, login) {
  createModal(`${t('change_pass_title')}: ${login}`, `
    <div class="form-group">
      <label>${t('new_password')}</label>
      <div class="password-wrap">
        <input type="password" id="chp-new" placeholder="nowe hasło...">
        <button class="eye-btn" onclick="togglePassword('chp-new')">👁</button>
      </div>
    </div>
  `, [
    { label: t('cancel'), cls: 'btn-secondary', action: 'close' },
    { label: '💾 Zapisz', cls: 'btn-primary', action: async () => {
      const newPass = document.getElementById('chp-new').value;
      if (!newPass) { showToast(t('err_required'), 'error'); return; }
      const hash = await sha256(newPass);
      await db.collection('users').doc(userId).update({ passwordHash: hash });
      closeModal();
      showToast('Hasło zmienione!', 'success');
    }}
  ]);
}

async function deleteUser(id, login) {
  showConfirm(`${t('delete_user_confirm')} <strong>${login}</strong>?`, async () => {
    await db.collection('users').doc(id).delete();
    showToast(t('user_deleted'), 'success');
    loadUsers();
  });
}

// ============================================================
// SETTINGS
// ============================================================
async function changeAdminPassword() {
  const cur = document.getElementById('cur-pass').value;
  const newP = document.getElementById('new-pass').value;
  const conf = document.getElementById('conf-pass').value;
  const msg = document.getElementById('settings-msg');

  if (!cur || !newP || !conf) { showMsg(msg, t('err_required'), 'error'); return; }
  if (newP !== conf) { showMsg(msg, t('passwords_mismatch'), 'error'); return; }

  try {
    const curHash = await sha256(cur);
    const newHash = await sha256(newP);

    // Try by session.id first, fallback to login lookup
    let userDocRef = null;
    let userDocData = null;

    if (session.id) {
      const byId = await db.collection('users').doc(session.id).get();
      if (byId.exists) {
        userDocRef = byId.ref;
        userDocData = byId.data();
      }
    }

    // Fallback: look up by login
    if (!userDocRef) {
      const snap = await db.collection('users').where('login', '==', session.login).limit(1).get();
      if (!snap.empty) {
        userDocRef = snap.docs[0].ref;
        userDocData = snap.docs[0].data();
        // Update session id for future calls
        session.id = snap.docs[0].id;
        setSession(session);
      }
    }

    if (!userDocRef) {
      showMsg(msg, t('err_generic'), 'error'); return;
    }

    if (userDocData.passwordHash !== curHash) {
      showMsg(msg, t('err_login'), 'error'); return;
    }

    await userDocRef.update({ passwordHash: newHash });
    showMsg(msg, t('password_changed'), 'success');
    document.getElementById('cur-pass').value = '';
    document.getElementById('new-pass').value = '';
    document.getElementById('conf-pass').value = '';
  } catch(e) {
    console.error('changeAdminPassword error:', e);
    showMsg(msg, t('err_generic'), 'error');
  }
}

function showMsg(el, text, type) {
  el.className = type === 'error' ? 'error-msg' : 'success-msg';
  el.textContent = text;
}

// ============================================================
// SCOREBOARD (opens in new tab)
// ============================================================
function openScoreboard(eventId) {
  window.open(`scoreboard.html?event=${eventId}`, '_blank');
}

// ============================================================
// MODAL HELPER
// ============================================================
function createModal(title, bodyHtml, buttons, maxWidth = '560px') {
  closeModal();
  const container = document.getElementById('modal-container');
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'current-modal';

  const btnHtml = buttons.map((b, i) => {
    if (b.action === 'close') return `<button class="${b.cls}" onclick="closeModal()">${b.label}</button>`;
    return `<button class="${b.cls}" data-modal-action="${i}">${b.label}</button>`;
  }).join('');

  overlay.innerHTML = `
    <div class="modal" style="max-width:${maxWidth}">
      <div class="modal-header">
        <span class="modal-title">${title}</span>
        <button class="btn-icon" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      <div class="modal-footer">${btnHtml}</div>
    </div>`;

  container.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  // Bind non-close actions using index
  buttons.forEach((b, i) => {
    if (b.action && b.action !== 'close') {
      const btn = overlay.querySelector(`[data-modal-action="${i}"]`);
      if (btn) btn.addEventListener('click', b.action);
    }
  });

  return overlay;
}

function closeModal() {
  document.getElementById('current-modal')?.remove();
}
