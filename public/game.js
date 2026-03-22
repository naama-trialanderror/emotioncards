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
  { id: 'imagine',  label: 'אם הייתי... ✨' },
];

let PROMPTS = [
  // יומיום
  { id:'p01', text:'בבוקר כשאני מתעורר.ת...', category:'daily', enabled:true },
  { id:'p02', text:'הרגע הכי טוב של היום שלי הוא...', category:'daily', enabled:true },
  { id:'p03', text:'הבית שלי מרגיש...', category:'daily', enabled:true },
  { id:'p04', text:'כשאני לבד.ה בחדר שלי...', category:'daily', enabled:true },
  { id:'p05', text:'אני אוהב.ת ש...', category:'daily', enabled:true },
  { id:'p06', text:'הכי משמח אותי ש...', category:'daily', enabled:true },
  { id:'p07', text:'בארוחת ערב משפחתית אני...', category:'daily', enabled:true },
  // רגשות
  { id:'p08', text:'מעצבן אותי כש...', category:'emotions', enabled:true },
  { id:'p09', text:'כשאני כועס.ת אני מרגיש.ה בגוף...', category:'emotions', enabled:true },
  { id:'p10', text:'כולם הסתכלו עלי כש...', category:'emotions', enabled:true },
  { id:'p11', text:'הסמקתי כש...', category:'emotions', enabled:true },
  { id:'p12', text:'הפעם האחרונה שבכיתי הייתה כש...', category:'emotions', enabled:true },
  { id:'p13', text:'אני חושש.ת שידעו עלי ש...', category:'emotions', enabled:true },
  { id:'p14', text:'הייתי רוצה שידעו עלי ש...', category:'emotions', enabled:true },
  { id:'p15', text:'במקומות חדשים אני...', category:'emotions', enabled:true },
  { id:'p16', text:'העליב אותי ש...', category:'emotions', enabled:true },
  { id:'p17', text:'כשמישהו מחבק אותי אני מרגיש.ה...', category:'emotions', enabled:true },
  { id:'p18', text:'כשמישהו מבין אותי בלי מילים...', category:'emotions', enabled:true },
  { id:'p19', text:'כשאני מצליח.ה במשהו קשה...', category:'emotions', enabled:true },
  // משפחה וחברים
  { id:'p20', text:'כשאני מתגעגע.ת למישהו...', category:'family', enabled:true },
  { id:'p21', text:'כשיש ריב עם חבר.ה...', category:'family', enabled:true },
  { id:'p22', text:'כשאני חושב.ת על האח/האחות שלי...', category:'family', enabled:true },
  { id:'p23', text:'כשמישהו אומר משהו שפוגע...', category:'family', enabled:true },
  { id:'p24', text:'הייתי רוצה שאנשים יבינו עלי ש...', category:'family', enabled:true },
  { id:'p25', text:'כשאני משחק.ת עם חברים...', category:'family', enabled:true },
  // ביטחון
  { id:'p26', text:'כשיש אזעקה, הגוף שלי...', category:'security', enabled:true },
  { id:'p27', text:'ללכת למרחב המוגן באמצע הלילה מרגיש...', category:'security', enabled:true },
  { id:'p28', text:'כשאני שומע.ת חדשות...', category:'security', enabled:true },
  { id:'p29', text:'כשמדברים על המלחמה, אני...', category:'security', enabled:true },
  // עתיד וחלומות
  { id:'p30', text:'הדבר שאני הכי מחכה לו הוא...', category:'future', enabled:true },
  { id:'p31', text:'אם הייתי יכול.ה לשנות דבר אחד, הייתי משנה את...', category:'future', enabled:true },
  { id:'p32', text:'כשאני חולם.ת על העתיד...', category:'future', enabled:true },
  { id:'p33', text:'כשהכל יהיה בסדר, זה ירגיש...', category:'future', enabled:true },
  // דמיון ויצירה
  { id:'p34', text:'אם הייתי יכול.ה לעוף, הייתי...', category:'creative', enabled:true },
  { id:'p35', text:'הדמות שהכי הייתי רוצה להיות היא...', category:'creative', enabled:true },
  { id:'p36', text:'הייתי רוצה להיות עכשיו ב...', category:'creative', enabled:true },
  { id:'p37', text:'אם היה לי יום שלם לעשות מה שאני רוצה, הייתי...', category:'creative', enabled:true },
  // משחק ופנאי
  { id:'p38', text:'כשיש לי זמן לבד...', category:'play', enabled:true },
  { id:'p39', text:'המשחק שאני הכי אוהב.ת הוא...', category:'play', enabled:true },
  { id:'p40', text:'הסרט או הסדרה שאני הכי אוהב.ת...', category:'play', enabled:true },
  // אם הייתי...
  { id:'p41', text:'אם הייתי חיה, הייתי...', category:'imagine', enabled:true },
  { id:'p42', text:'אם הייתי צבע, הייתי...', category:'imagine', enabled:true },
  { id:'p43', text:'אם הייתי ממתק, הייתי...', category:'imagine', enabled:true },
  { id:'p44', text:'כוח העל שהייתי רוצה שיהיה לי הוא...', category:'imagine', enabled:true },
  { id:'p45', text:'הדבר המוזר שאני אוהב.ת הוא...', category:'imagine', enabled:true },
  { id:'p46', text:'אם הייתי ממציא.ה משהו, הייתי ממציא.ה...', category:'imagine', enabled:true },
  { id:'p47', text:'הדבר שאף אחד לא מאמין שאני אוהב.ת הוא...', category:'imagine', enabled:true },
];

const TOTAL_CARDS = 95;

// ── Local state ───────────────────────────────────────

let myRole    = null;   // 'therapist' | 'child'
let roomCode  = null;
let roomRef   = null;
let currentRoom = null; // latest snapshot
let selectedMode = 'fixed';       // 'fixed' | 'choice' | 'cards-only'
let selectedCardsCount = 3;
let selectedChildCanSettings = false;

let pendingCard = null;  // local pending selection (not synced to Firebase)
let prevPhase   = null;  // track phase changes to reset pending

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
    const isFreePlay = selectedMode === 'free-play';
    document.getElementById('advanced-settings-panel').classList.toggle('hidden-by-mode', isFreePlay);
    document.getElementById('btn-advanced-toggle').classList.toggle('hidden-by-mode', isFreePlay);
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
  try {
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
    document.getElementById('child-lobby-msg').classList.remove('hidden');
    document.getElementById('lobby-status-text').textContent = `ממתינים ל${room.therapistName || 'מנהל.ת המשחק'}...`;
    listenToRoom(code);
  } catch (e) {
    showError('שגיאה בהצטרפות: ' + e.message);
  }
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

// ── URL param: auto-fill join code ────────────────────

(function () {
  const joinCode = new URLSearchParams(location.search).get('join');
  if (joinCode) {
    const input = document.getElementById('room-code-input');
    if (input) input.value = joinCode.toUpperCase();
  }
})();

// ── Copy room code / link ─────────────────────────────

document.getElementById('btn-copy-code').addEventListener('click', () => {
  navigator.clipboard.writeText(roomCode || '');
  const btn = document.getElementById('btn-copy-code');
  btn.textContent = '✅ הועתק';
  setTimeout(() => btn.textContent = '📋 העתק קוד', 1500);
});

document.getElementById('btn-copy-link').addEventListener('click', () => {
  const url = `${location.origin}/?join=${roomCode}`;
  navigator.clipboard.writeText(url);
  const btn = document.getElementById('btn-copy-link');
  btn.textContent = '✅ הועתק';
  setTimeout(() => btn.textContent = '🔗 העתק לינק', 1500);
});

let _promptCounter = 48;

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
  if (room.gameMode === 'free-play') {
    writeNewFreePlayGame();
  } else {
    writeNewRound(room, 'therapist', 1);
  }
});

// ── Start solo browse ─────────────────────────────────

document.getElementById('btn-start-solo').addEventListener('click', async () => {
  try {
    await update(ref(db, `rooms/${roomCode}`), {
      childName:      'מטופל',
      childConnected: true,
      solo:           true,
    });
    const room = { ...currentRoom, childName: 'מטופל', childConnected: true, solo: true };
    if (room.gameMode === 'free-play') {
      await writeNewFreePlayGame();
    } else {
      await writeNewRound(room, 'therapist', 1);
    }
  } catch (e) {
    showError('שגיאה בפתיחת עיון לבד: ' + e.message);
  }
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
  // Reset pending selection when phase changes
  if (room.phase !== prevPhase) {
    pendingCard = null;
    prevPhase = room.phase;
  }
  document.getElementById('btn-next-round-top').classList.add('hidden');

  // In solo mode therapist acts for both sides.
  // During guessing, the guesser is the non-active player (!isActive),
  // so we set isActive=false so the therapist can guess too.
  const isActive = room.solo
    ? room.phase !== 'guessing'
    : myRole === room.activePlayer;

  if (room.phase === 'lobby') { renderLobby(room); return; }
  if (room.phase === 'choosing-prompt') { renderChoosePrompt(room, isActive); return; }
  if (room.phase === 'free-play') { renderFreePlay(room); return; }
  showScreen('screen-game');
  document.getElementById('prompt-options-area').classList.add('hidden');
  document.getElementById('solo-badge').classList.toggle('hidden', !room.solo);
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
    document.getElementById('lobby-instructions').classList.remove('hidden');
    document.getElementById('lobby-link-display').textContent =
      `${location.origin}/?join=${roomCode}`;
    if (room.childConnected) {
      document.getElementById('lobby-status-text').textContent = `${room.childName} מחובר/ת! 🎉`;
      document.getElementById('lobby-spinner').classList.add('hidden');
      document.getElementById('btn-start').classList.remove('hidden');
      document.getElementById('lobby-solo-section').classList.add('hidden');
    } else {
      document.getElementById('lobby-status-text').textContent = 'ממתין...';
      document.getElementById('lobby-spinner').classList.remove('hidden');
      document.getElementById('btn-start').classList.add('hidden');
      document.getElementById('lobby-solo-section').classList.remove('hidden');
    }
  } else {
    document.getElementById('lobby-instructions').classList.add('hidden');
    document.getElementById('lobby-status-text').textContent = `ממתינים ל${room.therapistName}...`;
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
    ? 'בחר/י משפט:'
    : `${activeName} בוחר/ת משפט...`;

  // Prompt options go in the STICKY TOP area
  const optionsArea = document.getElementById('prompt-options-area');
  optionsArea.innerHTML = '';
  document.getElementById('prompt-bubble').classList.add('hidden');

  // Clear action area (we own it entirely)
  document.getElementById('action-area').innerHTML = '';

  // Show cards (non-selectable, for preview)
  const cardsRow = document.getElementById('cards-row');
  cardsRow.innerHTML = '';
  toCards(room.cards).forEach(cardId => cardsRow.appendChild(buildCard(cardId)));

  if (!isActive) {
    optionsArea.classList.add('hidden');
    const wait = document.createElement('div');
    wait.className = 'action-waiting';
    wait.innerHTML = `<div class="spinner small"></div><span>${activeName} בוחר/ת משפט...</span>`;
    document.getElementById('action-area').appendChild(wait);
    return;
  }

  optionsArea.classList.remove('hidden');
  const options = room.promptOptions || [];
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'prompt-option-btn';
    btn.textContent = opt.text;
    btn.addEventListener('click', async () => {
      optionsArea.querySelectorAll('.prompt-option-btn').forEach(b => b.classList.add('dimmed'));
      btn.classList.remove('dimmed');
      btn.classList.add('selected');
      const usedPrompts = { ...(room.usedPrompts || {}), [opt.id]: true };
      await update(ref(db, `rooms/${roomCode}`), {
        phase: 'choosing',
        promptText: opt.text,
        promptId: opt.id,
        usedPrompts,
      });
    });
    optionsArea.appendChild(btn);
  });
}

// ── Header ────────────────────────────────────────────

function renderHeader(room) {
  document.getElementById('name-therapist').textContent  = room.therapistName || 'מנהל.ת';
  document.getElementById('name-child').textContent      = room.childName     || 'שחקנ.ית';
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
  const activeName   = room.activePlayer === 'therapist' ? room.therapistName : room.childName;
  const myTurn = (room.phase === 'choosing' && isActive) ||
                 (room.phase === 'guessing' && !isActive);

  banner.className = `phase-banner phase-${room.phase}${myTurn ? ' my-turn' : ''}`;

  if (room.phase === 'choosing') {
    text.textContent = isActive
      ? 'תורך! בחר/י קלף שמתאים למשפט'
      : `ממתינים ל${activeName} לבחור קלף...`;
  } else if (room.phase === 'guessing') {
    text.textContent = !isActive
      ? 'תורך לנחש! לאיזה קלף התכוונו?'
      : `ממתינים לניחוש...`;
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
      container.appendChild(card);
    } else {
      // Chooser sees their own chosen card in a highlighted box during guessing phase
      const isChosen = room.phase === 'guessing' && isActive && cardId === room.secretChoice;

      const selectable =
        (room.phase === 'choosing' && isActive) ||
        (room.phase === 'guessing' && !isActive);

      if (selectable) {
        card.classList.add('selectable');
        card.addEventListener('click', () => handleCardClick(cardId, room, isActive));

        if (pendingCard === cardId) {
          card.classList.add(room.phase === 'choosing' ? 'pending-choose' : 'pending-guess');
          // Wrap card + hint below it (not inside card where it overlaps image)
          const wrap = document.createElement('div');
          wrap.className = 'pending-card-wrap';
          const hint = document.createElement('div');
          hint.className = `card-confirm-hint ${room.phase === 'guessing' ? 'card-confirm-hint--guess' : ''}`;
          hint.textContent = 'לחץ/י שוב לאישור';
          wrap.appendChild(card);
          wrap.appendChild(hint);
          container.appendChild(wrap);
          return;
        } else if (pendingCard !== null) {
          card.classList.add('pending-dimmed');
        } else {
          card.classList.add(room.phase === 'choosing' ? 'phase-choosing' : 'phase-guessing');
        }
      }

      if (isChosen) {
        const wrap = document.createElement('div');
        wrap.className = 'chosen-card-wrap';
        const label = document.createElement('span');
        label.className = 'chosen-card-label';
        label.textContent = 'הקלף שלך';
        wrap.appendChild(label);
        wrap.appendChild(card);
        container.appendChild(wrap);
      } else {
        container.appendChild(card);
      }
    }
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
    if (pendingCard === cardId) {
      // Second click — confirm
      pendingCard = null;
      const typedText = room.gameMode === 'cards-only'
        ? (document.getElementById('cards-only-text').value.trim() || null)
        : undefined;
      const update_data = { secretChoice: cardId, phase: 'guessing' };
      if (typedText !== undefined) update_data.promptText = typedText;
      document.getElementById('cards-only-text').value = '';
      await update(ref(db, `rooms/${roomCode}`), update_data);
    } else {
      // First click — mark as pending
      pendingCard = cardId;
      renderCards(room, isActive);
    }
  } else if (room.phase === 'guessing' && !isActive) {
    if (pendingCard === cardId) {
      // Second click — confirm
      pendingCard = null;
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
    } else {
      // First click — mark as pending
      pendingCard = cardId;
      renderCards(room, isActive);
    }
  }
}

// ── Actions ───────────────────────────────────────────

function renderActions(room, isActive) {
  const area = document.getElementById('action-area');
  area.innerHTML = '';
  document.getElementById('btn-next-round-top').classList.add('hidden');

  const activeName  = room.activePlayer === 'therapist' ? room.therapistName : room.childName;
  const guesserName = room.activePlayer === 'therapist' ? room.childName     : room.therapistName;

  if (room.phase === 'choosing' && !isActive) {
    const div = document.createElement('div');
    div.className = 'action-waiting';
    div.innerHTML = `<div class="spinner small"></div><span>ממתין ל${activeName}...</span>`;
    area.appendChild(div);

  } else if (room.phase === 'guessing' && isActive) {
    const div = document.createElement('div');
    div.className = 'action-waiting';
    div.innerHTML = `<div class="spinner small"></div><span>הקלף שלך נבחר — ממתינים לניחוש</span>`;
    area.appendChild(div);

  } else if (room.phase === 'reveal') {
    const correct = room.secretChoice === room.guess;
    // Personalized per player: guesser (!isActive) sees first-person, chooser sees third-person
    let resultText;
    if (correct) {
      resultText = !isActive ? `ניחשת נכון! 🎉` : `${guesserName} ניחש/ה נכון! 🎉`;
    } else {
      resultText = !isActive
        ? `לא ניחשת — ${activeName} מקבל/ת 3 נקודות`
        : `לא נוחש — קיבלת 3 נקודות`;
    }

    const revealDiv = document.createElement('div');
    revealDiv.className = 'action-reveal';

    const result = document.createElement('div');
    result.className = `reveal-result ${correct ? 'correct' : 'wrong'}`;
    result.textContent = resultText;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary btn-lg';
    nextBtn.style.maxWidth = '240px';
    nextBtn.textContent = 'סיבוב הבא →';
    nextBtn.addEventListener('click', nextRound);

    revealDiv.appendChild(result);
    revealDiv.appendChild(nextBtn);
    area.appendChild(revealDiv);
    document.getElementById('btn-next-round-top').classList.remove('hidden');
  }
}

async function nextRound() {
  if (!currentRoom) return;
  const nextActive = currentRoom.activePlayer === 'therapist' ? 'child' : 'therapist';
  await writeNewRound(currentRoom, nextActive, currentRoom.round + 1);
}

document.getElementById('btn-next-round-top').addEventListener('click', nextRound);

// ══════════════════════════════════════════════════════
// FREE PLAY MODE
// ══════════════════════════════════════════════════════

// ── Helpers ───────────────────────────────────────────

function toTableCards(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(Number).filter(Boolean);
  return Object.values(val).map(Number).filter(Boolean);
}

function toHandCards(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(Number).filter(Boolean);
  return Object.values(val).map(Number).filter(Boolean);
}

// ── Advanced settings accordion ───────────────────────

document.getElementById('btn-advanced-toggle').addEventListener('click', () => {
  const btn   = document.getElementById('btn-advanced-toggle');
  const panel = document.getElementById('advanced-settings-panel');
  const isOpen = panel.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  btn.textContent = isOpen ? 'הגדרות מתקדמות ▴' : 'הגדרות מתקדמות ▾';
});

// ── Card browser ──────────────────────────────────────

function populateCardBrowser() {
  const grid = document.getElementById('card-browser-grid');
  if (grid.childElementCount > 0) return; // already populated
  for (let i = 1; i <= TOTAL_CARDS; i++) {
    const cell = document.createElement('div');
    cell.className = 'browser-card';
    const img = document.createElement('img');
    img.src = `/cards/card_${String(i).padStart(2,'0')}.png`;
    img.alt = `קלף ${i}`;
    img.loading = 'lazy';
    cell.appendChild(img);
    cell.addEventListener('click', () => {
      const zoomModal = document.getElementById('browser-zoom-modal');
      document.getElementById('browser-zoom-img').src = img.src;
      zoomModal.classList.remove('hidden');
    });
    grid.appendChild(cell);
  }
}

document.getElementById('btn-open-card-browser').addEventListener('click', () => {
  populateCardBrowser();
  document.getElementById('card-browser-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

document.getElementById('btn-close-card-browser').addEventListener('click', () => {
  document.getElementById('card-browser-overlay').classList.add('hidden');
  document.body.style.overflow = '';
});

document.getElementById('browser-zoom-modal').addEventListener('click', () => {
  document.getElementById('browser-zoom-modal').classList.add('hidden');
});

// Close browser overlay on backdrop click
document.getElementById('card-browser-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('card-browser-overlay')) {
    document.getElementById('card-browser-overlay').classList.add('hidden');
    document.body.style.overflow = '';
  }
});

// ── Start free-play ───────────────────────────────────

async function writeNewFreePlayGame() {
  const all  = Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1);
  const deck = shuffle(all);
  await update(ref(db, `rooms/${roomCode}`), {
    phase:              'free-play',
    deck,
    tableCards:         [],
    therapistHand:      [],
    childHand:          [],
    therapistHandCount: 0,
    childHandCount:     0,
  });
}

// ── Render ────────────────────────────────────────────

function renderFreePlay(room) {
  showScreen('screen-free-play');

  // Header
  document.getElementById('fp-name-therapist').textContent  = room.therapistName || 'מנהל.ת';
  document.getElementById('fp-name-child').textContent      = room.childName     || 'שחקנ.ית';
  document.getElementById('fp-count-therapist').textContent = room.therapistHandCount || 0;
  document.getElementById('fp-count-child').textContent     = room.childHandCount     || 0;

  // Deck
  const deck = toHandCards(room.deck);
  document.getElementById('fp-deck-num').textContent = deck.length;
  document.getElementById('btn-fp-flip').disabled = deck.length === 0;
  document.getElementById('btn-fp-deal').disabled = deck.length < 6;

  // Table
  const tableCards = toTableCards(room.tableCards);
  document.getElementById('fp-table-count').textContent = `(${tableCards.length}/4)`;
  document.getElementById('fp-table-empty').style.display = tableCards.length ? 'none' : '';

  const tableNotes = room.tableNotes || {};
  const tableEl = document.getElementById('fp-table-cards');
  tableEl.innerHTML = '';
  tableCards.forEach(cardId => {
    const noteData = tableNotes[cardId] || null;
    const el = fpBuildCard(cardId, 'אסוף לידיים שלי', () => fpTakeFromTable(cardId), noteData, true);
    tableEl.appendChild(el);
  });

  // My hand (private)
  const myHandKey = myRole === 'therapist' ? 'therapistHand' : 'childHand';
  const myHand = toHandCards(room[myHandKey]);
  const tableIsFull = tableCards.length >= 4;

  document.getElementById('fp-hand-count').textContent = myHand.length ? `(${myHand.length})` : '';
  document.getElementById('fp-hand-empty').style.display = myHand.length ? 'none' : '';

  const handEl = document.getElementById('fp-hand-cards');
  handEl.innerHTML = '';
  myHand.forEach(cardId => {
    const btnText = tableIsFull ? 'שולחן מלא' : 'הנח על השולחן';
    const onClick = tableIsFull ? null : () => fpPlaceOnTable(cardId);
    const el = fpBuildCard(cardId, btnText, onClick);
    if (tableIsFull) el.querySelector('.fp-card-btn').classList.add('fp-card-btn--disabled');
    handEl.appendChild(el);
  });

  // End button — therapist only
  document.getElementById('fp-end-area').style.display = myRole === 'therapist' ? '' : 'none';
}

function fpBuildCard(cardId, btnText, onClick, noteData = null, isTableCard = false) {
  // Wrapper holds the card + optional note paper beneath it
  const wrap = document.createElement('div');
  wrap.className = isTableCard ? 'fp-card-wrap' : 'fp-card-wrap fp-card-wrap--hand';

  const div = document.createElement('div');
  div.className = 'fp-card';
  div.addEventListener('click', () => fpShowCardModal(cardId));
  wrap.appendChild(div);

  const img = document.createElement('img');
  img.src = `/cards/card_${String(cardId).padStart(2, '0')}.png`;
  img.alt = `קלף ${cardId}`;
  img.onerror = () => img.remove();
  div.appendChild(img);

  // Zoom icon
  const zoomBtn = document.createElement('button');
  zoomBtn.className = 'fp-zoom-btn';
  zoomBtn.title = 'הגדל';
  zoomBtn.textContent = '🔍';
  zoomBtn.addEventListener('click', e => { e.stopPropagation(); fpShowCardModal(cardId); });
  div.appendChild(zoomBtn);

  // Note button (table cards only)
  if (isTableCard) {
    const noteBtn = document.createElement('button');
    noteBtn.className = 'fp-card-note-btn' + (noteData ? ' fp-card-note-btn--has-note' : '');
    noteBtn.title = noteData ? 'ערוך פתק' : 'הוסף פתק';
    noteBtn.textContent = noteData ? '✏️' : '📝';
    noteBtn.addEventListener('click', e => { e.stopPropagation(); fpOpenNoteModal(cardId, noteData); });
    div.appendChild(noteBtn);
  }

  const btn = document.createElement('button');
  btn.className = 'fp-card-btn';
  btn.textContent = btnText;
  if (onClick) btn.addEventListener('click', e => { e.stopPropagation(); onClick(); });
  div.appendChild(btn);

  // Note paper — appears below the card, not on top
  if (noteData) {
    const paper = document.createElement('div');
    paper.className = 'fp-note-paper';
    paper.style.background = noteData.color;
    paper.textContent = noteData.text;
    wrap.appendChild(paper);
  }

  return wrap;
}

function fpShowCardModal(cardId) {
  const modal = document.getElementById('fp-card-modal');
  document.getElementById('fp-card-modal-img').src =
    `/cards/card_${String(cardId).padStart(2, '0')}.png`;
  modal.classList.remove('hidden');
}

document.getElementById('fp-card-modal').addEventListener('click', () => {
  document.getElementById('fp-card-modal').classList.add('hidden');
});

// ── Actions ───────────────────────────────────────────

async function fpFlipCard() {
  const room = currentRoom;
  const deck       = toHandCards(room.deck);
  const tableCards = toTableCards(room.tableCards);
  if (!deck.length || tableCards.length >= 4) return;

  const [cardId, ...remaining] = deck;
  await update(ref(db, `rooms/${roomCode}`), {
    deck:       remaining,
    tableCards: [...tableCards, cardId],
  });
}

async function fpDeal() {
  const room = currentRoom;
  const deck = toHandCards(room.deck);
  if (deck.length < 6) return;

  const tCards = deck.slice(0, 3);
  const cCards = deck.slice(3, 6);
  const remaining = deck.slice(6);

  const therapistHand = [...toHandCards(room.therapistHand), ...tCards];
  const childHand     = [...toHandCards(room.childHand), ...cCards];

  await update(ref(db, `rooms/${roomCode}`), {
    deck:               remaining,
    therapistHand,
    childHand,
    therapistHandCount: therapistHand.length,
    childHandCount:     childHand.length,
  });
}

async function fpTakeFromTable(cardId) {
  const room = currentRoom;
  const tableCards = toTableCards(room.tableCards);
  const myHandKey  = myRole === 'therapist' ? 'therapistHand' : 'childHand';
  const myCountKey = myRole === 'therapist' ? 'therapistHandCount' : 'childHandCount';
  const myHand     = toHandCards(room[myHandKey]);

  const updates = {
    tableCards:   tableCards.filter(id => id !== cardId),
    [myHandKey]:  [...myHand, cardId],
    [myCountKey]: myHand.length + 1,
  };
  if (room.tableNotes?.[cardId]) updates[`tableNotes/${cardId}`] = null;

  await update(ref(db, `rooms/${roomCode}`), updates);
}

async function fpPlaceOnTable(cardId) {
  const room = currentRoom;
  const tableCards = toTableCards(room.tableCards);
  if (tableCards.length >= 4) return;

  const myHandKey  = myRole === 'therapist' ? 'therapistHand' : 'childHand';
  const myCountKey = myRole === 'therapist' ? 'therapistHandCount' : 'childHandCount';
  const myHand     = toHandCards(room[myHandKey]);

  await update(ref(db, `rooms/${roomCode}`), {
    tableCards:   [...tableCards, cardId],
    [myHandKey]:  myHand.filter(id => id !== cardId),
    [myCountKey]: myHand.length - 1,
  });
}

// ── Note modal ────────────────────────────────────────

let fpCurrentNoteCardId = null;
let fpCurrentNoteColor  = '#fff9c4';

function fpOpenNoteModal(cardId, existingNote) {
  fpCurrentNoteCardId = cardId;
  fpCurrentNoteColor  = existingNote?.color || '#fff9c4';

  document.getElementById('fp-note-text').value = existingNote?.text || '';
  document.getElementById('fp-note-delete').style.display = existingNote ? '' : 'none';
  document.getElementById('fp-note-dialog').style.background = fpCurrentNoteColor;

  document.querySelectorAll('.fp-note-color').forEach(el => {
    el.classList.toggle('active', el.dataset.color === fpCurrentNoteColor);
  });

  document.getElementById('fp-note-modal').classList.remove('hidden');
  document.getElementById('fp-note-text').focus();
}

async function fpSaveNote() {
  const text = document.getElementById('fp-note-text').value.trim();
  if (!text || !fpCurrentNoteCardId) return;
  await update(ref(db, `rooms/${roomCode}/tableNotes`), {
    [fpCurrentNoteCardId]: { text, color: fpCurrentNoteColor },
  });
  document.getElementById('fp-note-modal').classList.add('hidden');
}

async function fpDeleteNote() {
  if (!fpCurrentNoteCardId) return;
  await update(ref(db, `rooms/${roomCode}`), {
    [`tableNotes/${fpCurrentNoteCardId}`]: null,
  });
  document.getElementById('fp-note-modal').classList.add('hidden');
}

document.getElementById('fp-note-save').addEventListener('click', fpSaveNote);
document.getElementById('fp-note-cancel').addEventListener('click', () => {
  document.getElementById('fp-note-modal').classList.add('hidden');
});
document.getElementById('fp-note-delete').addEventListener('click', fpDeleteNote);

document.querySelectorAll('.fp-note-color').forEach(el => {
  el.addEventListener('click', () => {
    fpCurrentNoteColor = el.dataset.color;
    document.getElementById('fp-note-dialog').style.background = fpCurrentNoteColor;
    document.querySelectorAll('.fp-note-color').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
  });
});

// ── Event listeners ───────────────────────────────────

document.getElementById('btn-fp-flip').addEventListener('click', fpFlipCard);
document.getElementById('btn-fp-deal').addEventListener('click', fpDeal);
document.getElementById('btn-fp-end').addEventListener('click', () => location.reload());
