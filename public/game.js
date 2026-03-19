/* ══════════════════════════════════════════════════════
   קלפי רגשות — Firebase Client
   ══════════════════════════════════════════════════════

   הגדרת Firebase:
   1. כנסי ל-console.firebase.google.com
   2. צרי פרויקט חדש
   3. הוסיפי Realtime Database (בחרי "Start in test mode")
   4. לחצי על הגלגל ← Project settings ← הוסיפי אפליקציית Web
   5. העתיקי את firebaseConfig מטה
   ══════════════════════════════════════════════════════ */

import { initializeApp }            from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js';
import { getDatabase, ref, set, update, onValue, get, off }
                                    from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js';

const firebaseConfig = {
  apiKey:            "AIzaSyBNoKFGa9Cacn5ZkslmPyALIpa5Rqvp79Q",
  authDomain:        "emotioncards-41add.firebaseapp.com",
  databaseURL:       "https://emotioncards-41add-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "emotioncards-41add",
  storageBucket:     "emotioncards-41add.firebasestorage.app",
  messagingSenderId: "34612679289",
  appId:             "1:34612679289:web:30dc920230887626bcbaa8",
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// ── Prompts ───────────────────────────────────────────

const CATEGORIES = [
  { id: 'daily',    label: 'יומיום' },
  { id: 'emotions', label: 'רגשות' },
  { id: 'family',   label: 'משפחה וחברים' },
  { id: 'security', label: 'ביטחון' },
  { id: 'future',   label: 'עתיד וחלומות' },
  { id: 'creative', label: 'דמיון ויצירה' },
  { id: 'play',     label: 'משחק ופנאי' },
];

let PROMPTS = [
  { id:'p01', text:'בבוקר כשאני מתעורר/ת, זה...', category:'daily', enabled:true },
  { id:'p02', text:'הרגע הכי טוב של היום שלי זה...', category:'daily', enabled:true },
  { id:'p03', text:'הבית שלי מרגיש...', category:'daily', enabled:true },
  { id:'p04', text:'כשאני לבד בחדר שלי, זה...', category:'daily', enabled:true },
  { id:'p16', text:'להיכנס לכיתה בבוקר זה...', category:'daily', enabled:true },
  { id:'p20', text:'ההפסקה בבית ספר מרגישה...', category:'daily', enabled:true },
  { id:'p06', text:'כשמישהו מחבק אותי, זה...', category:'emotions', enabled:true },
  { id:'p08', text:'כשמישהו מבין אותי בלי מילים, זה...', category:'emotions', enabled:true },
  { id:'p10', text:'כשאני מתגעגע/ת למישהו, זה...', category:'emotions', enabled:true },
  { id:'p11', text:'כעס מרגיש כמו...', category:'emotions', enabled:true },
  { id:'p12', text:'כשאני פוחד/ת, זה...', category:'emotions', enabled:true },
  { id:'p13', text:'כשמשהו מפתיע אותי, זה...', category:'emotions', enabled:true },
  { id:'p14', text:'כשאני שמח/ה באמת, זה...', category:'emotions', enabled:true },
  { id:'p15', text:'כשאני עצוב/ה ולא יודע/ת למה, זה...', category:'emotions', enabled:true },
  { id:'p17', text:'כשכולם מסתכלים עלי, זה...', category:'emotions', enabled:true },
  { id:'p19', text:'כשמצליח/ה במשהו קשה, זה...', category:'emotions', enabled:true },
  { id:'p05', text:'ארוחת ערב משפחתית זה...', category:'family', enabled:true },
  { id:'p07', text:'כשיש ריב עם חבר או חברה, זה...', category:'family', enabled:true },
  { id:'p09', text:'כשחושב/ת על האח או האחות שלי, זה...', category:'family', enabled:true },
  { id:'p18', text:'כשמישהו אומר משהו שפוגע, זה...', category:'family', enabled:true },
  { id:'p29', text:'הדבר שהכי רוצה/ת שאנשים יבינו עלי הוא...', category:'family', enabled:true },
  { id:'p21', text:'כשמופעלת אזעקה, זה...', category:'security', enabled:true },
  { id:'p22', text:'ללכת למרחב המוגן באמצע הלילה זה...', category:'security', enabled:true },
  { id:'p23', text:'כשאני שומע/ת חדשות, זה...', category:'security', enabled:true },
  { id:'p24', text:'כשמדברים על המלחמה, אני...', category:'security', enabled:true },
  { id:'p25', text:'כשחוזרים הביתה אחרי שהיינו בטוחים, זה...', category:'security', enabled:true },
  { id:'p26', text:'הדבר שאני הכי מחכה/ה לו זה...', category:'future', enabled:true },
  { id:'p27', text:'אם הייתי יכול/ה לשנות דבר אחד, זה...', category:'future', enabled:true },
  { id:'p28', text:'כשאני חולם/ת על העתיד, זה...', category:'future', enabled:true },
  { id:'p30', text:'כשהכל יהיה בסדר, זה ירגיש...', category:'future', enabled:true },
  // דמיון ויצירה
  { id:'p31', text:'אם הייתי יכול/ה לעוף, הייתי...', category:'creative', enabled:true },
  { id:'p32', text:'הדמות שהכי הייתי רוצה להיות זה...', category:'creative', enabled:true },
  { id:'p33', text:'אם הייתי מצייר/ת את הרגשות שלי עכשיו, זה היה...', category:'creative', enabled:true },
  { id:'p34', text:'המקום הקסום שהייתי רוצה לברוח אליו הוא...', category:'creative', enabled:true },
  { id:'p35', text:'אם היה לי יום שלם לעשות מה שרוצה, זה...', category:'creative', enabled:true },
  // משחק ופנאי
  { id:'p36', text:'הדבר שהכי משמח אותי מחוץ לבית ספר זה...', category:'play', enabled:true },
  { id:'p37', text:'כשמשחק/ת עם חברים, הרגשה הכי טובה היא...', category:'play', enabled:true },
  { id:'p38', text:'כשיש לי זמן חופשי לבד, אני...', category:'play', enabled:true },
  { id:'p39', text:'המשחק או הסרט שהכי משפיע עלי הוא...', category:'play', enabled:true },
];

const TOTAL_CARDS = 52;

// ── Local state ───────────────────────────────────────

let myRole    = null;   // 'therapist' | 'child'
let roomCode  = null;
let roomRef   = null;
let currentRoom = null; // latest snapshot
let selectedMode = 'fixed';       // 'fixed' | 'choice' | 'cards-only'
let selectedCardsCount = 3;
let selectedChildCanSettings = false;

// ── Helpers ───────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function pickCards(usedCardsObj, count = 3) {
  const all = Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1);
  const available = all.filter(c => !usedCardsObj?.[c]);
  const pool = available.length >= count ? available : all;
  return shuffle(pool).slice(0, count);
}

function pickPrompt(usedPromptsObj) {
  const eligible = PROMPTS.filter(p => p.enabled);
  const pool = eligible.filter(p => !usedPromptsObj?.[p.id]);
  const source = pool.length > 0 ? pool : (eligible.length > 0 ? eligible : PROMPTS);
  return source[Math.floor(Math.random() * source.length)];
}

// Firebase stores arrays as objects — safely read as array
function toCards(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return Object.values(val).map(Number);
}

// ── Screen management ─────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showError(msg) {
  const el = document.getElementById('landing-error');
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

// ══════════════════════════════════════════════════════
// LANDING
// ══════════════════════════════════════════════════════

document.getElementById('btn-go-settings').addEventListener('click', () => {
  if (!document.getElementById('therapist-name').value.trim()) {
    return showError('נא להזין שם');
  }
  renderPromptsScreen();
  showScreen('screen-settings');
});

document.getElementById('btn-back-to-landing').addEventListener('click', () => {
  showScreen('screen-landing');
});

// Mode selection (pre-game)
document.querySelectorAll('.mode-card[data-mode]').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.mode-card[data-mode]').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedMode = card.dataset.mode;
    document.getElementById('prompts-section').style.display =
      selectedMode === 'cards-only' ? 'none' : '';
  });
});

// Cards count (pre-game)
document.querySelectorAll('.count-btn[data-count]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.count-btn[data-count]').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedCardsCount = parseInt(btn.dataset.count);
  });
});

// Child settings permission toggle
document.getElementById('toggle-child-settings').addEventListener('change', e => {
  selectedChildCanSettings = e.target.checked;
});

document.getElementById('btn-create').addEventListener('click', async () => {
  const name = document.getElementById('therapist-name').value.trim();
  if (!name) return showError('נא להזין שם');

  const code = generateCode();
  roomCode = code;
  myRole   = 'therapist';

  try {
    await set(ref(db, `rooms/${code}`), {
      therapistName:   name,
      childName:       null,
      childConnected:  false,
      phase:           'lobby',
      activePlayer:    'therapist',
      round:           0,
      promptText:      null,
      promptId:        null,
      cards:           [],
      secretChoice:    null,
      guess:           null,
      therapistScore:  0,
      childScore:      0,
      usedCards:       {},
      usedPrompts:     {},
      gameMode:            selectedMode,
      cardsPerRound:       selectedCardsCount,
      childCanSettings:    selectedChildCanSettings,
      createdAt:           Date.now(),
    });
  } catch (e) {
    return showError('שגיאה בחיבור ל-Firebase: ' + e.message);
  }

  document.getElementById('display-code').textContent = code;
  showScreen('screen-lobby');
  document.getElementById('therapist-lobby-controls').classList.remove('hidden');
  listenToRoom(code);
});

document.getElementById('btn-join').addEventListener('click', async () => {
  const name = document.getElementById('child-name').value.trim();
  const code = document.getElementById('room-code-input').value.trim().toUpperCase();
  if (!name) return showError('נא להזין שם');
  if (code.length < 4) return showError('נא להזין קוד חדר');

  const snap = await get(ref(db, `rooms/${code}`));
  if (!snap.exists()) return showError('קוד חדר לא נמצא. בדוק שוב.');
  const room = snap.val();
  if (room.childConnected) return showError('החדר כבר מלא.');

  roomCode = code;
  myRole   = 'child';

  await update(ref(db, `rooms/${code}`), { childName: name, childConnected: true });

  showScreen('screen-lobby');
  document.getElementById('lobby-code-section').classList.add('hidden');
  document.getElementById('child-lobby-msg').classList.remove('hidden');
  document.getElementById('lobby-status-text').textContent = 'מחוברים! ממתינים למטפל/ת...';
  listenToRoom(code);
});

// Enter key support
['therapist-name'].forEach(id =>
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-go-settings').click();
  })
);
['child-name','room-code-input'].forEach(id =>
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-join').click();
  })
);

// ── Copy room code ────────────────────────────────────

document.getElementById('btn-copy-code').addEventListener('click', () => {
  navigator.clipboard.writeText(roomCode || '');
  const btn = document.getElementById('btn-copy-code');
  btn.textContent = '✅';
  setTimeout(() => btn.textContent = '📋', 1500);
});

let _promptCounter = 40;

function renderPromptsScreen() {
  const container = document.getElementById('prompts-categories');
  container.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const prompts = PROMPTS.filter(p => p.category === cat.id);

    const section = document.createElement('div');
    section.className = 'prompts-category';

    const header = document.createElement('div');
    header.className = 'prompts-category-header';

    const title = document.createElement('h3');
    title.textContent = cat.label;

    const enabledCount = document.createElement('span');
    enabledCount.className = 'prompts-count';
    const countEnabled = () => PROMPTS.filter(q => q.category === cat.id && q.enabled).length;
    enabledCount.textContent = `${countEnabled()}/${prompts.length}`;

    const toggleCatBtn = document.createElement('button');
    toggleCatBtn.className = 'btn-toggle-cat';
    const updateToggleCatBtn = () => {
      const allOn = prompts.every(p => PROMPTS[PROMPTS.indexOf(p)].enabled);
      toggleCatBtn.textContent = allOn ? 'כבה קטגוריה' : 'הפעל קטגוריה';
      toggleCatBtn.dataset.state = allOn ? 'on' : 'off';
    };
    updateToggleCatBtn();
    toggleCatBtn.addEventListener('click', () => {
      const enable = toggleCatBtn.dataset.state === 'off';
      prompts.forEach(p => { PROMPTS[PROMPTS.indexOf(p)].enabled = enable; });
      enabledCount.textContent = `${countEnabled()}/${prompts.length}`;
      updateToggleCatBtn();
      renderPromptsScreen();
    });

    header.appendChild(title);
    header.appendChild(enabledCount);
    header.appendChild(toggleCatBtn);
    section.appendChild(header);

    const list = document.createElement('div');
    list.className = 'prompts-list';

    prompts.forEach(p => {
      const idx = PROMPTS.indexOf(p);
      const row = document.createElement('div');
      row.className = 'prompt-row' + (p.enabled ? '' : ' disabled');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = p.enabled;
      checkbox.addEventListener('change', () => {
        PROMPTS[idx].enabled = checkbox.checked;
        row.classList.toggle('disabled', !checkbox.checked);
        enabledCount.textContent = `${PROMPTS.filter(q => q.category === cat.id && q.enabled).length}/${prompts.length}`;
      });

      const textEl = document.createElement('input');
      textEl.type = 'text';
      textEl.className = 'prompt-row-text';
      textEl.value = p.text;
      textEl.addEventListener('change', () => { PROMPTS[idx].text = textEl.value; });

      const delBtn = document.createElement('button');
      delBtn.className = 'prompt-row-delete';
      delBtn.textContent = '×';
      delBtn.addEventListener('click', () => {
        PROMPTS.splice(idx, 1);
        renderPromptsScreen();
      });

      row.appendChild(checkbox);
      row.appendChild(textEl);
      row.appendChild(delBtn);
      list.appendChild(row);
    });

    // Add prompt row
    const addRow = document.createElement('div');
    addRow.className = 'add-prompt-row';
    const addInput = document.createElement('input');
    addInput.type = 'text';
    addInput.className = 'input';
    addInput.placeholder = 'הוסף משפט...';
    addInput.maxLength = 120;
    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-primary btn-small';
    addBtn.textContent = 'הוסף';
    addBtn.addEventListener('click', () => {
      const text = addInput.value.trim();
      if (!text) return;
      PROMPTS.push({ id: `p${_promptCounter++}`, text, category: cat.id, enabled: true });
      addInput.value = '';
      renderPromptsScreen();
    });
    addRow.appendChild(addInput);
    addRow.appendChild(addBtn);

    section.appendChild(list);
    section.appendChild(addRow);
    container.appendChild(section);
  });
}

// ── Start game ────────────────────────────────────────

document.getElementById('btn-start').addEventListener('click', async () => {
  const snap = await get(ref(db, `rooms/${roomCode}`));
  const room = snap.val();
  if (!room.childConnected) return showError('ממתינים לשחקן השני.');
  writeNewRound(room, 'therapist', 1);
});

// ══════════════════════════════════════════════════════
// FIREBASE LISTENER
// ══════════════════════════════════════════════════════

function listenToRoom(code) {
  if (roomRef) off(roomRef);
  roomRef = ref(db, `rooms/${code}`);
  onValue(roomRef, snap => {
    if (!snap.exists()) return;
    currentRoom = snap.val();
    render(currentRoom);
  });
}

// ══════════════════════════════════════════════════════
// GAME LOGIC (runs on therapist client for round starts)
// ══════════════════════════════════════════════════════

async function writeNewRound(room, activePlayer, round) {
  const mode = room.gameMode || 'fixed';
  const cardsPerRound = room.cardsPerRound || 3;
  const cards = pickCards(room.usedCards || {}, cardsPerRound);
  const usedCards = { ...(room.usedCards || {}), ...Object.fromEntries(cards.map(c => [c, true])) };

  if (mode === 'cards-only') {
    await update(ref(db, `rooms/${roomCode}`), {
      phase: 'choosing',
      activePlayer, round,
      promptText: null, promptId: null,
      cards, secretChoice: null, guess: null,
      usedCards, usedPrompts: room.usedPrompts || {},
    });
    return;
  }

  if (mode === 'choice') {
    const used = room.usedPrompts || {};
    const eligible = PROMPTS.filter(p => p.enabled && !used[p.id]);
    const pool = eligible.length >= 3 ? eligible : PROMPTS.filter(p => p.enabled);
    const shuffled = shuffle([...pool]);
    const options = shuffled.slice(0, 3).map(p => ({ id: p.id, text: p.text }));
    const usedPromptsAfter = { ...used, ...Object.fromEntries(options.map(o => [o.id, true])) };
    await update(ref(db, `rooms/${roomCode}`), {
      phase: 'choosing-prompt',
      activePlayer, round,
      promptOptions: options,
      promptText: null, promptId: null,
      cards, secretChoice: null, guess: null,
      usedCards, usedPrompts: usedPromptsAfter,
    });
    return;
  }

  // mode === 'fixed'
  const prompt = pickPrompt(room.usedPrompts || {});
  const usedPrompts = { ...(room.usedPrompts || {}), [prompt.id]: true };
  await update(ref(db, `rooms/${roomCode}`), {
    phase: 'choosing',
    activePlayer, round,
    promptText: prompt.text, promptId: prompt.id,
    cards, secretChoice: null, guess: null,
    usedCards, usedPrompts,
  });
}

// ══════════════════════════════════════════════════════
// RENDER
// ══════════════════════════════════════════════════════

function render(room) {
  document.getElementById('btn-next-round-top').classList.add('hidden');
  const isActive = myRole === room.activePlayer;
  if (room.phase === 'lobby') { renderLobby(room); return; }
  if (room.phase === 'choosing-prompt') { renderChoosePrompt(room, isActive); return; }
  showScreen('screen-game');
  renderHeader(room);
  renderPhase(room, isActive);
  renderPrompt(room, isActive);
  renderCards(room, isActive);
  renderActions(room, isActive);
}

// ── Lobby render ──────────────────────────────────────

function renderLobby(room) {
  showScreen('screen-lobby');
  if (myRole === 'therapist') {
    document.getElementById('therapist-lobby-controls').classList.remove('hidden');
    if (room.childConnected) {
      document.getElementById('lobby-status-text').textContent =
        `${room.childName} הצטרף/ה!`;
      document.getElementById('lobby-spinner').classList.add('hidden');
      document.getElementById('btn-start').classList.remove('hidden');
    } else {
      document.getElementById('lobby-status-text').textContent = 'ממתין לשחקן השני...';
      document.getElementById('lobby-spinner').classList.remove('hidden');
      document.getElementById('btn-start').classList.add('hidden');
    }
  }
}

// ── Choose prompt (mode: choice) ──────────────────────

function renderChoosePrompt(room, isActive) {
  showScreen('screen-game');
  renderHeader(room);

  const banner = document.getElementById('phase-banner');
  banner.className = 'phase-banner phase-choosing';
  const activeName = room.activePlayer === 'therapist' ? room.therapistName : room.childName;
  document.getElementById('phase-text').textContent = isActive
    ? 'בחר/י משפט שמתאים לתור'
    : `${activeName} בוחר/ת משפט...`;

  const cardsRow = document.getElementById('cards-row');
  cardsRow.innerHTML = '';

  document.getElementById('prompt-area').classList.add('hidden');
  document.getElementById('action-area').innerHTML = '';

  if (!isActive) {
    const wait = document.createElement('div');
    wait.className = 'action-waiting';
    wait.innerHTML = '<div class="spinner small"></div><span>ממתין לבחירת משפט...</span>';
    document.getElementById('action-area').appendChild(wait);
    return;
  }

  const options = room.promptOptions || [];
  const container = document.createElement('div');
  container.className = 'prompt-options-container';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'prompt-option-btn';
    btn.textContent = opt.text;
    btn.addEventListener('click', async () => {
      container.querySelectorAll('.prompt-option-btn').forEach(b => b.classList.add('dimmed'));
      btn.classList.remove('dimmed');
      btn.classList.add('selected');
      const usedPrompts = { ...(room.usedPrompts || {}), [opt.id]: true };
      await update(ref(db, `rooms/${roomCode}`), {
        phase: 'choosing',
        promptText: opt.text,
        promptId: opt.id,
        usedPrompts,
      });
      document.getElementById('prompt-area').classList.remove('hidden');
    });
    container.appendChild(btn);
  });
  document.getElementById('action-area').appendChild(container);
}

// ── Header ────────────────────────────────────────────

function renderHeader(room) {
  document.getElementById('name-therapist').textContent  = room.therapistName || 'מטפל/ת';
  document.getElementById('name-child').textContent      = room.childName     || 'ילד/ה';
  document.getElementById('score-therapist').textContent = room.therapistScore ?? 0;
  document.getElementById('score-child').textContent     = room.childScore    ?? 0;
  document.getElementById('round-badge').textContent     = `סיבוב ${room.round}`;

  document.getElementById('score-block-therapist').classList
    .toggle('active', room.activePlayer === 'therapist');
  document.getElementById('score-block-child').classList
    .toggle('active', room.activePlayer === 'child');

  const canSettings = myRole === 'therapist' || room.childCanSettings;
  document.getElementById('btn-mid-settings').classList.toggle('hidden', !canSettings);
}

// ── Mid-game settings ─────────────────────────────────

document.getElementById('btn-mid-settings').addEventListener('click', () => {
  if (!currentRoom) return;
  // Sync panel to current room state
  document.querySelectorAll('[data-midmode]').forEach(c => {
    c.classList.toggle('selected', c.dataset.midmode === currentRoom.gameMode);
  });
  document.querySelectorAll('[data-midcount]').forEach(b => {
    b.classList.toggle('selected', parseInt(b.dataset.midcount) === currentRoom.cardsPerRound);
  });
  document.getElementById('mid-settings-overlay').classList.remove('hidden');
});

document.getElementById('btn-close-mid-settings').addEventListener('click', () => {
  document.getElementById('mid-settings-overlay').classList.add('hidden');
});

document.querySelectorAll('[data-midmode]').forEach(card => {
  card.addEventListener('click', async () => {
    document.querySelectorAll('[data-midmode]').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    if (roomCode) await update(ref(db, `rooms/${roomCode}`), { gameMode: card.dataset.midmode });
  });
});

document.querySelectorAll('[data-midcount]').forEach(btn => {
  btn.addEventListener('click', async () => {
    document.querySelectorAll('[data-midcount]').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (roomCode) await update(ref(db, `rooms/${roomCode}`), { cardsPerRound: parseInt(btn.dataset.midcount) });
  });
});

// ── Phase banner ──────────────────────────────────────

function renderPhase(room, isActive) {
  const banner = document.getElementById('phase-banner');
  const text   = document.getElementById('phase-text');
  const activeName = room.activePlayer === 'therapist' ? room.therapistName : room.childName;

  banner.className = `phase-banner phase-${room.phase}`;

  if (room.phase === 'choosing') {
    text.textContent = isActive
      ? 'תורך לבחור קלף שמתאים למשפט'
      : `${activeName} בוחר/ת קלף...`;
  } else if (room.phase === 'guessing') {
    const guesserName = room.activePlayer === 'therapist' ? room.childName : room.therapistName;
    text.textContent = isActive
      ? `${guesserName} מנחש/ת...`
      : 'נחש/י — לאיזה קלף התכוון/נה?';
  } else if (room.phase === 'reveal') {
    text.textContent = 'חשיפה!';
  }
}

// ── Prompt ────────────────────────────────────────────

function renderPrompt(room, isActive) {
  const promptArea      = document.getElementById('prompt-area');
  const bubble          = document.getElementById('prompt-bubble');
  const cardsOnlyArea   = document.getElementById('cards-only-input-area');

  const isCardsOnly = room.gameMode === 'cards-only';

  // Cards-only choosing: active player sees typing input
  if (isCardsOnly && room.phase === 'choosing' && isActive) {
    promptArea.classList.remove('hidden');
    cardsOnlyArea.classList.remove('hidden');
    bubble.classList.add('hidden');
    return;
  }

  cardsOnlyArea.classList.add('hidden');

  // Cards-only: show typed text to guesser, hide if nothing typed
  if (isCardsOnly) {
    if (room.promptText) {
      promptArea.classList.remove('hidden');
      bubble.classList.remove('hidden');
      document.getElementById('prompt-text').textContent = room.promptText;
      document.getElementById('btn-edit-prompt').classList.add('hidden');
    } else {
      promptArea.classList.add('hidden');
    }
    return;
  }

  if (!room.promptText) {
    promptArea.classList.add('hidden');
    return;
  }

  promptArea.classList.remove('hidden');
  bubble.classList.remove('hidden');
  document.getElementById('prompt-text').textContent = room.promptText;

  const canEdit = isActive && room.phase === 'choosing';
  const canReroll = isActive && room.phase === 'choosing' && room.gameMode !== 'cards-only';
  document.getElementById('btn-edit-prompt').classList.toggle('hidden', !canEdit);
  document.getElementById('btn-reroll-prompt').classList.toggle('hidden', !canReroll);

  if (room.phase !== 'choosing') closePromptEdit();
}

document.getElementById('btn-edit-prompt').addEventListener('click', () => {
  document.getElementById('custom-prompt-input').value =
    document.getElementById('prompt-text').textContent;
  document.getElementById('edit-prompt-area').classList.remove('hidden');
  document.getElementById('prompt-bubble').classList.add('hidden');
  document.getElementById('custom-prompt-input').focus();
});

document.getElementById('btn-reroll-prompt').addEventListener('click', () => {
  if (!currentRoom || !roomCode) return;
  const prompt = pickPrompt(currentRoom.usedPrompts || {});
  const usedPrompts = { ...(currentRoom.usedPrompts || {}), [prompt.id]: true };
  update(ref(db, `rooms/${roomCode}`), { promptText: prompt.text, promptId: prompt.id, usedPrompts });
});

document.getElementById('btn-save-prompt').addEventListener('click', () => {
  const text = document.getElementById('custom-prompt-input').value.trim();
  if (text && roomCode) update(ref(db, `rooms/${roomCode}`), { promptText: text, promptId: 'custom' });
  closePromptEdit();
});

document.getElementById('btn-cancel-prompt').addEventListener('click', closePromptEdit);

function closePromptEdit() {
  document.getElementById('edit-prompt-area').classList.add('hidden');
  document.getElementById('prompt-bubble').classList.remove('hidden');
}

// ── Cards ─────────────────────────────────────────────

function renderCards(room, isActive) {
  const cards = toCards(room.cards);
  const container = document.getElementById('cards-row');
  container.innerHTML = '';

  cards.forEach(cardId => {
    const card = buildCard(cardId);

    if (room.phase === 'reveal') {
      const isChosen  = cardId === room.secretChoice;
      const isGuessed = cardId === room.guess;

      if (isChosen && isGuessed) {
        card.classList.add('result-correct-chosen');
      } else if (isChosen) {
        card.classList.add('result-chosen');
      } else if (isGuessed) {
        card.classList.add('result-wrong-guess');
      } else {
        card.classList.add('dimmed');
      }
    } else {
      const selectable =
        (room.phase === 'choosing' && isActive) ||
        (room.phase === 'guessing' && !isActive);

      if (selectable) {
        card.classList.add('selectable');
        card.classList.add(room.phase === 'choosing' ? 'phase-choosing' : 'phase-guessing');
        card.addEventListener('click', () => handleCardClick(cardId, room, isActive));
      }

      // Active player sees own choice during guessing phase
      if (room.phase === 'guessing' && isActive && cardId === room.secretChoice) {
        card.classList.add('indicator-chosen');
      }
    }

    container.appendChild(card);
  });
}

function buildCard(cardId) {
  const div = document.createElement('div');
  div.className = 'card';
  div.dataset.id = cardId;
  div.style.background = '#f2ede6';

  const img = document.createElement('img');
  img.src = `/cards/card_${String(cardId).padStart(2,'0')}.png`;
  img.alt = `קלף ${cardId}`;
  img.onerror = () => img.remove();
  div.appendChild(img);

  const num = document.createElement('span');
  num.className = 'card-number';
  num.textContent = cardId;
  div.appendChild(num);

  return div;
}

async function handleCardClick(cardId, room, isActive) {
  if (room.phase === 'choosing' && isActive) {
    const typedText = room.gameMode === 'cards-only'
      ? (document.getElementById('cards-only-text').value.trim() || null)
      : undefined;
    const update_data = { secretChoice: cardId, phase: 'guessing' };
    if (typedText !== undefined) update_data.promptText = typedText;
    document.getElementById('cards-only-text').value = '';
    await update(ref(db, `rooms/${roomCode}`), update_data);
  } else if (room.phase === 'guessing' && !isActive) {
    const correct = cardId === room.secretChoice;
    const therapistIsActive = room.activePlayer === 'therapist';
    const tScore = room.therapistScore + (therapistIsActive
      ? (correct ? 1 : 3)
      : (correct ? 3 : 0));
    const cScore = room.childScore + (!therapistIsActive
      ? (correct ? 1 : 3)
      : (correct ? 3 : 0));
    await update(ref(db, `rooms/${roomCode}`), {
      guess: cardId,
      phase: 'reveal',
      therapistScore: tScore,
      childScore: cScore,
    });
  }
}

// ── Actions ───────────────────────────────────────────

function renderActions(room, isActive) {
  const waiting = document.getElementById('action-waiting');
  const reveal  = document.getElementById('action-reveal');

  waiting.classList.add('hidden');
  reveal.classList.add('hidden');
  document.getElementById('btn-next-round-top').classList.add('hidden');

  if (room.phase === 'choosing' && !isActive) {
    waiting.classList.remove('hidden');
    document.getElementById('waiting-text').textContent = 'ממתין לבחירת השחקן...';
  } else if (room.phase === 'guessing') {
    if (isActive) {
      waiting.classList.remove('hidden');
      document.getElementById('waiting-text').textContent = 'ממתין לניחוש...';
    }
  } else if (room.phase === 'reveal') {
    reveal.classList.remove('hidden');
    document.getElementById('btn-next-round-top').classList.remove('hidden');
    const correct = room.secretChoice === room.guess;
    const result  = document.getElementById('reveal-result');
    if (correct) {
      const guesserName = room.activePlayer === 'therapist' ? room.childName : room.therapistName;
      result.textContent = `${guesserName} ניחש/ה נכון!`;
      result.className = 'reveal-result correct';
    } else {
      const activeName = room.activePlayer === 'therapist' ? room.therapistName : room.childName;
      result.textContent = `לא נוחש — ${activeName} קיבל/ה 3 נקודות`;
      result.className = 'reveal-result wrong';
    }
  }
}

async function nextRound() {
  if (!currentRoom) return;
  const nextActive = currentRoom.activePlayer === 'therapist' ? 'child' : 'therapist';
  await writeNewRound(currentRoom, nextActive, currentRoom.round + 1);
}

document.getElementById('btn-next-round').addEventListener('click', nextRound);
document.getElementById('btn-next-round-top').addEventListener('click', nextRound);
