// ============================================================
// PARTICIPANT PANEL LOGIC
// ============================================================

let session = null;
let eventData = null;
let tasksData = [];
let userAnswers = {};
let eventListener = null;

// Time bonus thresholds (seconds from event start)
// Continuous time bonus — linear decay over 2 hours (7200 seconds)
// Formula: bonus = basePoints × max(0, 1 - elapsed/7200)
// Result: unique bonus for every second, no ties from time alone
// At t=0s:    +100% bonus (2× points)
// At t=600s:  +91.7%
// At t=1800s: +75%
// At t=3600s: +50%
// At t=5400s: +25%
// At t=7200s: +0%
const BONUS_DURATION_SECS = 7200; // 2 hours

function calcBonus(basePoints, startedAt) {
  if (!startedAt) return 0;
  const elapsed = (Date.now() - new Date(startedAt).getTime()) / 1000;
  if (elapsed >= BONUS_DURATION_SECS) return 0;
  const multiplier = 1 - (elapsed / BONUS_DURATION_SECS);
  // Keep 4 decimal places — every second produces a unique value
  return Math.round(basePoints * multiplier * 10000) / 10000;
}

function getBonusLabel(startedAt) {
  if (!startedAt) return '';
  const elapsed = (Date.now() - new Date(startedAt).getTime()) / 1000;
  if (elapsed >= BONUS_DURATION_SECS) return '+0%';
  const pct = Math.round((1 - elapsed / BONUS_DURATION_SECS) * 100);
  const icon = pct >= 80 ? '🔥' : pct >= 50 ? '⚡' : pct >= 25 ? '✓' : '';
  return `+${pct}% ${icon}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  setLang(currentLang);
  session = getSession();
  if (session) {
    if (session.role === 'admin') { window.location.href = 'admin.html'; return; }
    initParticipantApp();
  } else {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('p-pass')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') loginParticipant();
    });
  }
});

async function loginParticipant() {
  const login = document.getElementById('p-login').value.trim();
  const pass = document.getElementById('p-pass').value;
  const errEl = document.getElementById('p-error');
  const btn = document.getElementById('p-login-btn');
  errEl.classList.add('hidden');
  if (!login || !pass) { errEl.textContent = t('err_required'); errEl.classList.remove('hidden'); return; }
  btn.disabled = true;
  btn.querySelector('span').textContent = t('loading');
  try {
    const user = await loginWithCredentials(login, pass);
    if (user.role === 'admin') { setSession(user); window.location.href = 'admin.html'; return; }
    setSession(user);
    session = user;
    document.getElementById('login-screen').style.display = 'none';
    initParticipantApp();
  } catch (e) {
    errEl.textContent = t('err_login');
    errEl.classList.remove('hidden');
    btn.disabled = false;
    btn.querySelector('span').textContent = t('login_btn');
  }
}

function doLogoutParticipant() {
  if (eventListener) eventListener();
  clearSession();
  window.location.href = '../index.html';
}

async function initParticipantApp() {
  document.getElementById('app').style.display = 'grid';
  document.getElementById('p-username').textContent = session.login;
  document.getElementById('p-avatar').textContent = session.login[0].toUpperCase();

  const userDoc = await db.collection('users').doc(session.id).get();
  const userData = userDoc.data();

  if (!userData.eventId) {
    document.getElementById('no-event-msg').style.display = 'flex';
    return;
  }

  const evDoc = await db.collection('events').doc(userData.eventId).get();
  if (!evDoc.exists) { document.getElementById('no-event-msg').style.display = 'flex'; return; }

  eventData = { id: evDoc.id, ...evDoc.data() };

  // Live listener — reacts to status changes (pending→active→finished)
  eventListener = db.collection('events').doc(eventData.id).onSnapshot(async snap => {
    const newData = snap.data();
    const oldStatus = eventData.status || 'pending';
    eventData = { id: snap.id, ...newData };
    const newStatus = newData.status || 'pending';

    if (oldStatus === 'pending' && newStatus === 'active') {
      // Workshop just started — show tasks page fully
      showToast(t('workshop_started_toast'), 'success');
      showParticipantPage('tasks');
      await renderMainView();
    } else if (newStatus === 'finished' && oldStatus !== 'finished') {
      document.getElementById('review-banner').style.display = 'flex';
      renderTasks();
      showToast(t('event_finished_toast'), 'info');
    }
  });

  renderMainView();
  showParticipantPage('tasks');
}

async function renderMainView() {
  const status = eventData.status || 'pending';

  // Make sure tasks page is visible
  document.querySelectorAll('#app .main-content > div').forEach(p => p.style.display = 'none');
  document.getElementById('p-page-tasks').style.display = 'block';

  // Hide all state views first
  document.getElementById('waiting-screen').style.display = 'none';
  document.getElementById('tasks-view').style.display = 'none';
  document.getElementById('no-event-msg').style.display = 'none';

  if (status === 'pending') {
    renderWaitingScreen();
  } else {
    await renderActiveView();
  }
}

function renderWaitingScreen() {
  document.getElementById('waiting-screen').style.display = 'flex';
  document.getElementById('waiting-event-name').textContent = eventData.name;
}

async function renderActiveView() {
  document.getElementById('tasks-view').style.display = 'block';
  document.getElementById('event-banner').style.display = 'flex';
  document.getElementById('ev-banner-name').textContent = eventData.name;
  document.getElementById('ev-banner-meta').textContent = eventData.date || '';

  if (eventData.status === 'finished') {
    document.getElementById('review-banner').style.display = 'flex';
  }

  // Show bonus indicator
  if (eventData.startedAt && eventData.status === 'active') {
    updateBonusIndicator();
    setInterval(updateBonusIndicator, 10000); // update every 10s
  }

  await loadTasksAndAnswers();
}

function updateBonusIndicator() {
  const el = document.getElementById('bonus-indicator');
  if (!el || !eventData.startedAt) return;
  const label = getBonusLabel(eventData.startedAt);
  const elapsed = (Date.now() - new Date(eventData.startedAt).getTime()) / 1000;
  const mins = Math.floor(elapsed / 60);
  const secs = Math.floor(elapsed % 60);
  el.innerHTML = `
    <span style="color:var(--accent4);font-weight:700">${label}</span>
    <span style="color:var(--text3);font-size:0.75rem;margin-left:6px">${t('bonus_time_label')}</span>
    <span style="color:var(--text3);font-family:var(--font-mono);font-size:0.75rem;margin-left:8px">${mins}m ${secs}s</span>`;
}

async function loadTasksAndAnswers() {
  const [tasksSnap, answersSnap] = await Promise.all([
    db.collection('events').doc(eventData.id).collection('tasks').orderBy('id').get(),
    db.collection('events').doc(eventData.id).collection('answers').where('userId', '==', session.id).get()
  ]);
  tasksData = [];
  tasksSnap.forEach(doc => tasksData.push({ ...doc.data() }));
  userAnswers = {};
  answersSnap.forEach(doc => { const d = doc.data(); userAnswers[d.taskId] = d; });
  renderTasks();
  updateScore();
}

function renderTasks() {
  const container = document.getElementById('tasks-container');
  container.innerHTML = '';
  const isEN = currentLang === 'en';
  const isReview = eventData.status === 'finished';
  tasksData.forEach(task => {
    const ans = userAnswers[task.id];
    const isSolved = ans?.correct === true;
    container.appendChild(buildParticipantTaskCard(task, ans, isSolved, isEN, isReview));
  });
}

function buildParticipantTaskCard(task, ans, isSolved, isEN, isReview) {
  const wrap = document.createElement('div');
  wrap.className = `task-card ${isSolved ? 'solved' : ''}`;
  wrap.id = `ptask-${task.id}`;

  const narrative = isEN ? (task.narrativeEn || task.narrative) : task.narrative;
  const context = isEN ? (task.contextEn || task.context) : task.context;
  const question = isEN ? (task.questionEn || task.question) : task.question;
  const stageLabel = isEN ? (task.stageNameEn || task.stageName) : task.stageName;
  const taskName = isEN ? (task.nameEn || task.name) : task.name;
  const statusIcon = isSolved ? '✓' : (ans && !ans.correct ? '✗' : '');
  const statusClass = isSolved ? 'solved-num' : '';

  // Bonus info for solved tasks
  let bonusInfo = '';
  if (isSolved && ans.bonusPoints > 0) {
    bonusInfo = `<span style="color:var(--accent4);font-size:0.8rem;margin-left:8px">+${ans.bonusPoints} bonus</span>`;
  }

  // Input area
  let inputArea = '';
  if (!isReview) {
    if (isSolved) {
      const totalEarned = (ans.points || 0) + (ans.bonusPoints || 0);
      inputArea = `<div style="display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap">
        <span class="flag-input correct" style="padding:10px 14px;font-size:0.9rem">${ans.answer}</span>
        <span style="color:var(--success);font-size:0.9rem">✓ ${t('correct')}</span>
        <span style="color:var(--accent4);font-family:var(--font-mono);font-size:0.85rem">+${totalEarned} pts${ans.bonusPoints > 0 ? ` (${task.points} + ${ans.bonusPoints} bonus)` : ''}</span>
      </div>`;
    } else {
      const prevWrong = ans && !ans.correct;
      // Show current bonus available
      const bonusAvail = eventData.startedAt ? calcBonus(task.points, eventData.startedAt) : 0;
      const bonusPct = eventData.startedAt ? Math.round(Math.max(0, 1 - (Date.now() - new Date(eventData.startedAt).getTime()) / 1000 / BONUS_DURATION_SECS) * 100) : 0;
      const bonusHint = bonusAvail > 0 ? `<span style="color:var(--accent4);font-size:0.78rem">⚡ ${getBonusLabel(eventData.startedAt)} bonus — +${bonusAvail} ${t('bonus_now')}!</span>` : '';
      inputArea = `
        ${bonusHint}
        <div class="flag-input-wrap" style="margin-top:8px">
          <input class="flag-input${prevWrong ? ' wrong' : ''}" id="flag-${task.id}"
            placeholder="${t('flag_placeholder')}" value="${prevWrong ? (ans.answer || '') : ''}">
          <button class="btn-primary" style="width:auto;padding:10px 18px" onclick="submitFlag(${task.id})">
            ${t('submit')}
          </button>
        </div>
        <div class="flag-result" id="flag-result-${task.id}">
          ${prevWrong ? `<span class="wrong">✗ ${t('wrong')}</span>` : ''}
        </div>`;
    }
  } else {
    // Review mode
    const wasCorrect = ans?.correct;
    const userAns = ans?.answer || t('no_answer');
    const totalEarned = wasCorrect ? ((ans.points || 0) + (ans.bonusPoints || 0)) : 0;
    const reviewClass = wasCorrect === true ? 'correct' : (wasCorrect === false ? 'wrong' : '');
    const reviewLabel = wasCorrect === true
      ? `${t('review_correct')} <span style="color:var(--accent4)">+${totalEarned} pts${ans.bonusPoints > 0 ? ` (${ans.points} + ${ans.bonusPoints} bonus)` : ''}</span>`
      : (wasCorrect === false ? t('review_wrong') : t('no_answer'));
    inputArea = `
      <div style="margin-top:10px">
        <div style="font-size:0.8rem;color:var(--text3);margin-bottom:4px">${t('your_answer')}</div>
        <div class="flag-input" style="padding:10px 14px;font-size:0.9rem;opacity:0.8">${userAns}</div>
        <div class="flag-result ${reviewClass}" style="margin-top:6px">${reviewLabel}</div>
        <div class="admin-answer" style="margin-top:8px">${t('correct_answer')} <strong>${task.answer}</strong></div>
      </div>`;
  }

  wrap.innerHTML = `
    <div class="task-header" onclick="togglePTask(${task.id})">
      <div class="task-num ${statusClass}">${statusIcon || task.id}</div>
      <div class="task-title-wrap">
        <div class="task-name">${taskName}</div>
        <div class="task-stage">${task.stage} · ${stageLabel}</div>
      </div>
      <span class="task-points">${task.points} pts${bonusInfo}</span>
      <span class="task-chevron" id="pchev-${task.id}">▼</span>
    </div>
    <div class="task-body" id="ptask-body-${task.id}" style="display:none">
      <div class="task-narrative-wrap">
        <div class="task-narrative-label">${t('narrative_label')}</div>
        <div class="task-narrative">${narrative ? narrative : '—'}</div>
      </div>
      <div class="task-context-wrap">
        <div class="task-context-label">${t('context_label')}</div>
        <div class="task-context">${context ? context.replace(/\n/g,'<br>') : '—'}</div>
      </div>
      <div class="task-question">${question}</div>
      <div class="task-format">${isEN && task.formatEn ? task.formatEn : task.format}</div>
      ${task.images && task.images.length > 0 ? `
        <div class="task-images">
          ${task.images.map(img => `<img class="task-thumb" src="${img.url}" alt="${img.name}" onclick="openLightbox('${img.url}')">`).join('')}
        </div>` : ''}
      ${task.files && task.files.length > 0 ? `
        <div class="task-files">
          ${task.files.map(f => `<a href="${f.url}" target="_blank" class="task-file" download="${f.name}">📎 ${f.name}</a>`).join('')}
        </div>` : ''}
      ${inputArea}
    </div>`;
  return wrap;
}

function togglePTask(id) {
  const body = document.getElementById(`ptask-body-${id}`);
  const chev = document.getElementById(`pchev-${id}`);
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  chev.classList.toggle('open', !open);
  if (!open) body.querySelector('.flag-input')?.focus();
}

async function submitFlag(taskId) {
  const input = document.getElementById(`flag-${taskId}`);
  const resultEl = document.getElementById(`flag-result-${taskId}`);
  const submitted = input.value.trim();
  if (!submitted) { showToast(t('err_required'), 'error'); return; }
  const task = tasksData.find(t => t.id === taskId);
  if (!task) return;
  if (userAnswers[taskId]?.correct) { showToast(t('already_solved'), 'info'); return; }

  // Normalize: accept FLAGA{x} as FLAG{x}, strip whitespace
  function normalizeFlag(s) {
    return s.trim().toUpperCase()
      .replace(/^FLAGA\{/, 'FLAG{')   // PL: FLAGA{x} → FLAG{x}
      .replace(/^FLAGĂ\{/, 'FLAG{')   // typo variant
      .replace(/\s+/g, '');           // remove spaces
  }
  const correct = normalizeFlag(task.answer) === normalizeFlag(submitted);
  const bonusPoints = correct ? calcBonus(task.points, eventData.startedAt) : 0;

  const answerData = {
    userId: session.id, userLogin: session.login,
    taskId, answer: submitted, correct,
    points: correct ? task.points : 0,
    bonusPoints,
    totalPoints: correct ? task.points + bonusPoints : 0,
    solvedAt: new Date().toISOString(),
    eventId: eventData.id
  };

  try {
    const answerId = `${session.id}_${taskId}`;
    await db.collection('events').doc(eventData.id).collection('answers').doc(answerId).set(answerData, { merge: true });
    userAnswers[taskId] = answerData;

    if (correct) {
      input.className = 'flag-input correct';
      const bonusMsg = bonusPoints > 0 ? ` (+${bonusPoints} bonus!)` : '';
      resultEl.innerHTML = `<span class="flag-result correct">✓ ${t('correct')}</span>`;
      const totalEarnedNow = Math.round((task.points + bonusPoints) * 100) / 100;
      showToast(`🎯 ${t('correct')} +${totalEarnedNow} pts${bonusMsg}`, 'success');
      input.disabled = true;
      updateScore();
      const card = document.getElementById(`ptask-${taskId}`);
      const newCard = buildParticipantTaskCard(task, answerData, true, currentLang === 'en', false);
      card.replaceWith(newCard);
      togglePTask(taskId);
    } else {
      input.className = 'flag-input wrong';
      resultEl.innerHTML = `<span class="flag-result wrong">✗ ${t('wrong')}</span>`;
    }
  } catch (e) { showToast(t('err_generic'), 'error'); }
}

function updateScore() {
  let total = 0, solved = 0;
  Object.values(userAnswers).forEach(a => {
    if (a.correct) { total += (a.points || 0) + (a.bonusPoints || 0); solved++; }
  });
  document.getElementById('total-score').textContent = Number.isInteger(total) ? total : total.toFixed(2);
  const pct = tasksData.length > 0 ? (solved / tasksData.length) * 100 : 0;
  document.getElementById('ev-progress').style.width = pct + '%';
}

// ============================================================
// SCOREBOARD
// ============================================================
function showParticipantPage(page) {
  document.querySelectorAll('#app .main-content > div').forEach(p => p.style.display = 'none');
  document.getElementById(`p-page-${page}`).style.display = 'block';
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.nav-item')[page === 'tasks' ? 0 : 1]?.classList.add('active');
  if (page === 'scoreboard') loadScoreboard();
}

async function loadScoreboard() {
  if (!eventData) return;
  const tbody = document.getElementById('scoreboard-tbody');
  tbody.innerHTML = `<tr><td colspan="4"><div class="loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></td></tr>`;
  try {
    const snap = await db.collection('events').doc(eventData.id).collection('answers').get();
    const byUser = {};
    snap.forEach(doc => {
      const d = doc.data();
      if (!byUser[d.userId]) byUser[d.userId] = { login: d.userLogin, total: 0, solved: 0, lastSolve: null };
      if (d.correct) {
        byUser[d.userId].total = Math.round(((byUser[d.userId].total || 0) + (d.points || 0) + (d.bonusPoints || 0)) * 10000) / 10000;
        byUser[d.userId].solved++;
        const ts = d.solvedAt ? new Date(d.solvedAt) : null;
        if (ts && (!byUser[d.userId].lastSolve || ts > byUser[d.userId].lastSolve)) {
          byUser[d.userId].lastSolve = ts;
        }
      }
    });
    const sorted = Object.entries(byUser).sort((a, b) => b[1].total - a[1].total || (a[1].lastSolve?.getTime() || 0) - (b[1].lastSolve?.getTime() || 0));
    const maxScore = sorted[0]?.[1].total || 1;
    tbody.innerHTML = '';
    if (sorted.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text3);padding:30px">Brak danych</td></tr>`;
      return;
    }
    sorted.forEach(([uid, data], i) => {
      const rank = i + 1;
      const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
      const isMe = uid === session.id;
      const pct = Math.round((data.total / maxScore) * 100);
      tbody.innerHTML += `<tr style="${isMe ? 'background:rgba(46,204,113,0.05);' : ''}">
        <td class="rank-col" style="font-family:var(--font-mono)">${rankEmoji}</td>
        <td style="font-weight:${isMe ? 700 : 400}">${data.login}${isMe ? ' <span style="color:var(--accent);font-size:0.75rem">(Ty)</span>' : ''}</td>
        <td>
          <span class="score-col">${Number.isInteger(data.total) ? data.total : data.total.toFixed(2)}</span>
          <div class="score-bar"><div class="score-bar-fill" style="width:${pct}%"></div></div>
        </td>
        <td style="color:var(--text2)">${data.solved} / 15</td>
      </tr>`;
    });
  } catch (e) { tbody.innerHTML = `<tr><td colspan="4" style="color:var(--danger)">${t('err_generic')}</td></tr>`; }
}
