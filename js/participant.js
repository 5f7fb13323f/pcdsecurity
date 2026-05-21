// ============================================================
// PARTICIPANT PANEL LOGIC
// ============================================================

let session = null;
let eventData = null;
let tasksData = [];
let userAnswers = {}; // taskId -> { correct, answer, points, solvedAt }
let scoreListener = null;

document.addEventListener('DOMContentLoaded', async () => {
  setLang(currentLang);

  // Check existing session
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
    if (user.role === 'admin') {
      setSession(user);
      window.location.href = 'admin.html';
      return;
    }
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
  if (scoreListener) scoreListener();
  clearSession();
  window.location.href = '../index.html';
}

async function initParticipantApp() {
  document.getElementById('app').style.display = 'grid';
  document.getElementById('p-username').textContent = session.login;
  document.getElementById('p-avatar').textContent = session.login[0].toUpperCase();

  // Load user's event
  const userDoc = await db.collection('users').doc(session.id).get();
  const userData = userDoc.data();

  if (!userData.eventId) {
    document.getElementById('no-event-msg').style.display = 'flex';
    return;
  }

  const evDoc = await db.collection('events').doc(userData.eventId).get();
  if (!evDoc.exists) {
    document.getElementById('no-event-msg').style.display = 'flex';
    return;
  }

  eventData = { id: evDoc.id, ...evDoc.data() };

  document.getElementById('ev-banner-name').textContent = eventData.name;
  document.getElementById('ev-banner-meta').textContent = eventData.date || '';
  document.getElementById('event-banner').style.display = 'flex';
  document.getElementById('nav-event-name').textContent = currentLang === 'en' ? 'My Tasks' : 'Moje zadania';

  if (eventData.status === 'finished') {
    document.getElementById('review-banner').style.display = 'flex';
  }

  // Load tasks and answers
  await loadTasksAndAnswers();

  // Live listener for event status changes
  db.collection('events').doc(eventData.id).onSnapshot(snap => {
    const newData = snap.data();
    if (newData.status === 'finished' && eventData.status !== 'finished') {
      eventData.status = 'finished';
      document.getElementById('review-banner').style.display = 'flex';
      renderTasks();
      showToast('Wydarzenie zostało zakończone przez administratora', 'info');
    }
  });

  showParticipantPage('tasks');
}

async function loadTasksAndAnswers() {
  const [tasksSnap, answersSnap] = await Promise.all([
    db.collection('events').doc(eventData.id).collection('tasks').orderBy('id').get(),
    db.collection('events').doc(eventData.id).collection('answers')
      .where('userId', '==', session.id).get()
  ]);

  tasksData = [];
  tasksSnap.forEach(doc => tasksData.push({ ...doc.data() }));

  userAnswers = {};
  answersSnap.forEach(doc => {
    const d = doc.data();
    userAnswers[d.taskId] = d;
  });

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

  let statusIcon = isSolved ? '✓' : (ans && !ans.correct ? '✗' : '');
  let statusClass = isSolved ? 'solved-num' : '';

  // Input area or review
  let inputArea = '';
  if (!isReview) {
    if (isSolved) {
      inputArea = `<div style="display:flex;align-items:center;gap:8px;margin-top:10px">
        <span class="flag-input correct" style="padding:10px 14px;font-size:0.9rem">${ans.answer}</span>
        <span style="color:var(--success);font-size:0.9rem">✓ ${t('correct')}</span>
      </div>`;
    } else {
      const prevWrong = ans && !ans.correct;
      inputArea = `
        <div class="flag-input-wrap" style="margin-top:10px">
          <input class="flag-input${prevWrong ? ' wrong' : ''}" id="flag-${task.id}"
            placeholder="${t('flag_placeholder')}" value="${prevWrong ? (ans.answer || '') : ''}"
            ${isSolved ? 'disabled' : ''}>
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
    const reviewClass = wasCorrect === true ? 'correct' : (wasCorrect === false ? 'wrong' : '');
    const reviewLabel = wasCorrect === true ? t('review_correct') : (wasCorrect === false ? t('review_wrong') : t('no_answer'));
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
      <span class="task-points">${task.points} pts</span>
      <span class="task-chevron" id="pchev-${task.id}">▼</span>
    </div>
    <div class="task-body" id="ptask-body-${task.id}" style="display:none">
      ${narrative ? `<div style="background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.1);border-radius:6px;padding:14px;margin-bottom:16px;font-size:0.875rem;color:var(--text2);line-height:1.7">📡 ${narrative}</div>` : ''}
      ${context ? `<div class="task-context">${context.replace(/\n/g,'<br>')}</div>` : ''}
      <div class="task-question">${question}</div>
      <div class="task-format">${task.format}</div>
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

  // Already solved check
  if (userAnswers[taskId]?.correct) { showToast(t('already_solved'), 'info'); return; }

  // Normalize comparison: case-insensitive, trim
  const correct = task.answer.trim().toUpperCase() === submitted.toUpperCase();

  const answerData = {
    userId: session.id,
    userLogin: session.login,
    taskId,
    answer: submitted,
    correct,
    points: correct ? task.points : 0,
    solvedAt: firebase.firestore.FieldValue.serverTimestamp(),
    eventId: eventData.id
  };

  try {
    // Upsert answer doc
    const answerId = `${session.id}_${taskId}`;
    // Only save if not already correctly answered
    await db.collection('events').doc(eventData.id).collection('answers').doc(answerId).set(answerData, { merge: true });

    userAnswers[taskId] = { ...answerData, correct };

    if (correct) {
      input.className = 'flag-input correct';
      resultEl.innerHTML = `<span class="flag-result correct">✓ ${t('correct')}</span>`;
      showToast(`🎯 ${t('correct')} +${task.points} pts`, 'success');
      input.disabled = true;
      updateScore();
      // Re-render that card
      const card = document.getElementById(`ptask-${taskId}`);
      const newCard = buildParticipantTaskCard(task, userAnswers[taskId], true, currentLang === 'en', false);
      card.replaceWith(newCard);
      togglePTask(taskId); // keep open
    } else {
      input.className = 'flag-input wrong';
      resultEl.innerHTML = `<span class="flag-result wrong">✗ ${t('wrong')}</span>`;
    }
  } catch (e) {
    showToast(t('err_generic'), 'error');
  }
}

function updateScore() {
  let total = 0, solved = 0;
  Object.values(userAnswers).forEach(a => {
    if (a.correct) { total += (a.points || 0); solved++; }
  });
  document.getElementById('total-score').textContent = total;
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

    // Aggregate by user
    const byUser = {};
    snap.forEach(doc => {
      const d = doc.data();
      if (!byUser[d.userId]) byUser[d.userId] = { login: d.userLogin, total: 0, solved: 0, lastSolve: null };
      if (d.correct) {
        byUser[d.userId].total += (d.points || 0);
        byUser[d.userId].solved++;
        const ts = d.solvedAt?.toDate ? d.solvedAt.toDate() : null;
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
      tbody.innerHTML += `<tr style="${isMe ? 'background:rgba(0,212,255,0.05);' : ''}">
        <td class="rank-col" style="font-family:var(--font-mono)">${rankEmoji}</td>
        <td style="font-weight:${isMe ? 700 : 400}">${data.login}${isMe ? ' <span style="color:var(--accent);font-size:0.75rem">(Ty)</span>' : ''}</td>
        <td>
          <span class="score-col">${data.total}</span>
          <div class="score-bar"><div class="score-bar-fill" style="width:${pct}%"></div></div>
        </td>
        <td style="color:var(--text2)">${data.solved} / 15</td>
      </tr>`;
    });
  } catch (e) { tbody.innerHTML = `<tr><td colspan="4" style="color:var(--danger)">${t('err_generic')}</td></tr>`; }
}
