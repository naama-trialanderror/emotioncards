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
  { id:'p41', text:'אם הייתי מקום בעולם, הייתי...', category:'imagine', enabled:true },
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
let selectedMode = 'fixed';       // 'fixed' | 'cards-only' | 'free-play' (UI display mode)
let selectedCardsCount = 3;
let selectedChildCanSettings = false;
let selectedAllowReroll = true;
let selectedChoiceMode = false;   // when true + mode='fixed', effective Firebase mode is 'choice'

let pendingCard = null;  // local pending selection (not synced to Firebase)
let prevPhase   = null;  // track phase changes to reset pending
let ssSelectedCardId = null;  // shared story: locally selected card
let scMyOrder = [];           // story contest: local card order
let scMySentences = {};       // story contest: local sentences

// ── Local-play state ──────────────────────────────────
let selectedPlayMode = 'two-screens'; // 'two-screens' | 'one-screen'
let localChildNameVal = '';
let localCurrentRole  = 'therapist';   // 'therapist' | 'child'
let prevActivePlayerLocal = null;       // detect activePlayer changes
let localPassVisible  = false;          // is the pass-screen showing?
let storyPickerPending = null;          // 'shared' | 'contest' | null — count picker flow
let _scSortable = null;                 // Sortable instance for story-contest ordered list
// Role-keyed story-contest arrays (so each player has their own local state)
let scTherapistOrder = [];
let scTherapistSentences = {};
let scChildOrder = [];
let scChildSentences = {};

/** Returns the effective role for display in local-play mode. */
function effectiveRole(room) {
  return room.localPlay ? localCurrentRole : myRole;
}

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
  const hidden = getHiddenCards();
  const all = Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1);
  const available = all.filter(c => !usedCardsObj?.[c] && !hidden.includes(c));
  const fallback = all.filter(c => !hidden.includes(c));
  const pool = available.length >= count ? available : (fallback.length >= count ? fallback : all);
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

function toStoryLine(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return Object.entries(val)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([, v]) => v)
    .filter(Boolean);
}

function toNotesList(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return Object.entries(val)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([, v]) => v)
    .filter(Boolean);
}

// ── Screen management ─────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── Error helpers ─────────────────────────────────────

function showError(msg) {
  const el = document.getElementById('landing-error');
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

function showInlineError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3500);
}

// ── localStorage — manager settings ───────────────────

function saveManagerSettings() {
  try {
    localStorage.setItem('managerSettings', JSON.stringify({
      name: document.getElementById('therapist-name').value.trim(),
      mode: selectedMode === 'fixed' && selectedChoiceMode ? 'choice' : selectedMode,
      cardsCount: selectedCardsCount,
      allowReroll: selectedAllowReroll,
    }));
  } catch {}
}

function loadManagerSettings() {
  try {
    const s = JSON.parse(localStorage.getItem('managerSettings'));
    if (!s) return;
    if (s.name) document.getElementById('therapist-name').value = s.name;
    if (s.mode) {
      const isChoice = s.mode === 'choice';
      selectedMode = isChoice ? 'fixed' : s.mode;
      selectedChoiceMode = isChoice;
      document.querySelectorAll('.mode-card[data-mode]').forEach(c =>
        c.classList.toggle('selected', c.dataset.mode === selectedMode));
      const choiceToggle = document.getElementById('toggle-choice-mode');
      if (choiceToggle) choiceToggle.checked = isChoice;
      const choiceSection = document.getElementById('choice-toggle-section');
      if (choiceSection) choiceSection.classList.toggle('hidden', selectedMode !== 'fixed');
    }
    if (s.cardsCount) {
      selectedCardsCount = s.cardsCount;
      document.querySelectorAll('.count-btn[data-count]').forEach(b =>
        b.classList.toggle('selected', parseInt(b.dataset.count) === s.cardsCount));
    }
    if (s.allowReroll !== undefined) {
      selectedAllowReroll = s.allowReroll;
      document.getElementById('toggle-allow-reroll').checked = s.allowReroll;
    }
  } catch {}
}

// ── sessionStorage — reconnect ────────────────────────

function saveSession(code, role, name) {
  try {
    sessionStorage.setItem('gameSession', JSON.stringify({ roomCode: code, role, name }));
  } catch {}
}

function loadSession() {
  try { return JSON.parse(sessionStorage.getItem('gameSession')); }
  catch { return null; }
}

function clearSession() {
  sessionStorage.removeItem('gameSession');
}

// ── localStorage — hidden cards ───────────────────────

function getHiddenCards() {
  try { return JSON.parse(localStorage.getItem('hiddenCards')) || []; }
  catch { return []; }
}

function setHiddenCards(ids) {
  try { localStorage.setItem('hiddenCards', JSON.stringify(ids)); } catch {}
  updateHiddenCardsSummary();
}

function toggleHideCard(cardId) {
  const hidden = getHiddenCards();
  const idx = hidden.indexOf(cardId);
  if (idx === -1) hidden.push(cardId);
  else hidden.splice(idx, 1);
  setHiddenCards(hidden);
  // Refresh grid if the overlay is open
  if (!document.getElementById('hidden-cards-overlay').classList.contains('hidden')) {
    populateHiddenCardsGrid();
  }
}

function updateHiddenCardsSummary() {
  const hidden = getHiddenCards();
  const el = document.getElementById('hidden-cards-summary');
  if (!el) return;
  if (hidden.length === 0) {
    el.textContent = 'אין קלפים מוסתרים';
    el.style.color = '';
  } else {
    el.textContent = `${hidden.length} קלפים מוסתרים`;
    el.style.color = 'var(--danger)';
  }
}

// ── Landing routing ───────────────────────────────────

function showManagerView() {
  document.getElementById('landing-manager').classList.remove('hidden');
  document.getElementById('landing-player').classList.add('hidden');
}

function showPlayerView(code) {
  document.getElementById('landing-manager').classList.add('hidden');
  document.getElementById('landing-player').classList.remove('hidden');
  if (code) {
    document.getElementById('room-code-input').value = code.toUpperCase();
    document.getElementById('player-join-desc').textContent =
      `הוזמנתם — הזינו שם והצטרפו`;
  }
  setTimeout(() => document.getElementById('child-name').focus(), 100);
}

// btn-switch-to-player removed from HTML; guard in case it exists in cached version
const _switchToPlayer = document.getElementById('btn-switch-to-player');
if (_switchToPlayer) _switchToPlayer.addEventListener('click', e => {
  e.preventDefault();
  showPlayerView('');
  document.getElementById('room-code-input').style.display = '';
  document.getElementById('room-code-input').placeholder = 'קוד חדר';
});

document.getElementById('btn-switch-to-manager').addEventListener('click', e => {
  e.preventDefault();
  showManagerView();
});

// ── Reconnect banner ──────────────────────────────────

function showReconnectBanner(session) {
  const roleLabel = session.role === 'therapist' ? 'מנהל.ת משחק' : 'שחקנ.ית';
  document.getElementById('reconnect-desc').textContent =
    `נמצא משחק פתוח (${session.name} • ${roleLabel}) — רוצים לחזור?`;
  document.getElementById('reconnect-banner').classList.remove('hidden');
}

document.getElementById('btn-reconnect').addEventListener('click', async () => {
  const session = loadSession();
  if (!session) return;
  try {
    const snap = await get(ref(db, `rooms/${session.roomCode}`));
    if (!snap.exists()) {
      clearSession();
      document.getElementById('reconnect-banner').classList.add('hidden');
      return showInlineError('error-manager', 'המשחק כבר לא קיים');
    }
    roomCode = session.roomCode;
    myRole   = session.role;
    document.getElementById('reconnect-banner').classList.add('hidden');
    if (myRole === 'therapist') {
      document.getElementById('therapist-name').value = session.name;
    }
    showScreen('screen-lobby');
    if (myRole === 'therapist') {
      document.getElementById('therapist-lobby-controls').classList.remove('hidden');
    } else {
      document.getElementById('child-lobby-msg').classList.remove('hidden');
    }
    listenToRoom(session.roomCode);
  } catch (e) {
    showInlineError('error-manager', 'שגיאה בחיבור: ' + e.message);
  }
});

document.getElementById('btn-dismiss-reconnect').addEventListener('click', () => {
  clearSession();
  document.getElementById('reconnect-banner').classList.add('hidden');
});

// ── Init on page load ─────────────────────────────────

(function initLanding() {
  // Load saved manager settings
  loadManagerSettings();
  updateHiddenCardsSummary();

  // URL routing
  const joinCode = new URLSearchParams(location.search).get('join');
  if (joinCode) {
    showPlayerView(joinCode);
  } else {
    // Check for saved session
    const session = loadSession();
    if (session) showReconnectBanner(session);
  }
})();

// ══════════════════════════════════════════════════════
// LANDING
// ══════════════════════════════════════════════════════

// Play-mode selector (one-screen / two-screens)
document.querySelectorAll('.play-mode-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.play-mode-opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedPlayMode = btn.dataset.mode;
    const isLocal = selectedPlayMode === 'one-screen';
    document.getElementById('local-child-name-wrap').classList.toggle('hidden', !isLocal);
    document.getElementById('landing-flow-hint').classList.toggle('hidden', isLocal);
    // Update form placeholders for symmetric single-screen naming
    document.getElementById('therapist-name').placeholder = isLocal ? 'שם שחקן 1' : 'השם שלך';
    document.getElementById('local-child-name').placeholder = isLocal ? 'שם שחקן 2' : 'שם השחקנ.ית';
  });
});

document.getElementById('btn-go-settings').addEventListener('click', () => {
  if (!document.getElementById('therapist-name').value.trim()) {
    return showInlineError('error-manager', 'נא להזין שם');
  }
  if (selectedPlayMode === 'one-screen') {
    const childName = document.getElementById('local-child-name').value.trim();
    if (!childName) return showInlineError('error-manager', 'נא להזין שם לשחקנ.ית');
    localChildNameVal = childName;
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
    if (card.classList.contains('mode-card--soon')) return;
    document.querySelectorAll('.mode-card[data-mode]').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedMode = card.dataset.mode;
    // Reset choice sub-mode when switching modes
    selectedChoiceMode = false;
    document.getElementById('toggle-choice-mode').checked = false;
    document.getElementById('choice-toggle-section').classList.toggle('hidden', selectedMode !== 'fixed');
    const noPrompts = ['cards-only', 'free-play', 'shared-story', 'story-contest'].includes(selectedMode);
    document.getElementById('prompts-section').style.display = noPrompts ? 'none' : '';
    const hideAdvanced = selectedMode === 'free-play';
    document.getElementById('advanced-settings-panel').classList.toggle('hidden-by-mode', hideAdvanced);
    document.getElementById('btn-advanced-toggle').classList.toggle('hidden-by-mode', hideAdvanced);
  });
});

document.getElementById('toggle-choice-mode').addEventListener('change', e => {
  selectedChoiceMode = e.target.checked;
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

document.getElementById('toggle-allow-reroll').addEventListener('change', e => {
  selectedAllowReroll = e.target.checked;
});

document.getElementById('btn-create').addEventListener('click', async () => {
  const name = document.getElementById('therapist-name').value.trim();
  if (!name) return showInlineError('error-manager', 'נא להזין שם');

  const code = generateCode();
  roomCode = code;
  myRole   = 'therapist';

  try {
    const isLocal = selectedPlayMode === 'one-screen';
    await set(ref(db, `rooms/${code}`), {
      therapistName:   name,
      childName:       isLocal ? localChildNameVal : null,
      childConnected:  isLocal,
      localPlay:       isLocal || null,
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
      gameMode:            selectedMode === 'fixed' && selectedChoiceMode ? 'choice' : selectedMode,
      cardsPerRound:       selectedCardsCount,
      childCanSettings:    selectedChildCanSettings,
      allowReroll:         selectedAllowReroll,
      createdAt:           Date.now(),
    });
  } catch (e) {
    return showError('שגיאה בחיבור ל-Firebase: ' + e.message);
  }

  saveManagerSettings();
  saveSession(code, 'therapist', name);
  document.getElementById('display-code').textContent = code;
  showScreen('screen-lobby');
  document.getElementById('therapist-lobby-controls').classList.remove('hidden');
  listenToRoom(code);
});

document.getElementById('btn-join').addEventListener('click', async () => {
  try {
    const name = document.getElementById('child-name').value.trim();
    const code = document.getElementById('room-code-input').value.trim().toUpperCase();
    if (!name) return showInlineError('error-player', 'נא להזין שם');
    if (code.length < 4) return showInlineError('error-player', 'נא להזין קוד חדר');

    const snap = await get(ref(db, `rooms/${code}`));
    if (!snap.exists()) return showInlineError('error-player', 'קוד חדר לא נמצא. בדוק שוב.');
    const room = snap.val();
    if (room.childConnected) return showInlineError('error-player', 'החדר כבר מלא.');

    roomCode = code;
    myRole   = 'child';

    await update(ref(db, `rooms/${code}`), { childName: name, childConnected: true });
    saveSession(code, 'child', name);

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

document.getElementById('local-pass-btn').addEventListener('click', () => {
  localPassVisible = false;
  document.getElementById('local-pass-overlay').classList.add('hidden');
  render(currentRoom);
});

// Back-to-lobby buttons (all game screens)
['btn-game-back','btn-ss-back','btn-sc-back','btn-fp-back'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => backToLobby());
});

// Home buttons — go to settings to choose a different game
['btn-game-home','btn-ss-home','btn-sc-home','btn-fp-home'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => goChooseGame());
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
  } else if (room.gameMode === 'shared-story') {
    writeNewSharedStoryGame(room);
  } else if (room.gameMode === 'story-contest') {
    writeNewStoryContestGame(room);
  } else {
    writeNewRound(room, 'therapist', 1);
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
    ssSelectedCardId = null;
    scMyOrder = [];
    scMySentences = {};
    scTherapistOrder = [];
    scTherapistSentences = {};
    scChildOrder = [];
    scChildSentences = {};
    storyPickerPending = null;
    prevPhase = room.phase;
    prevActivePlayerLocal = null;
    localPassVisible = false;
  }
  document.getElementById('btn-next-round-top').classList.add('hidden');

  // Local play: show pass-screen when active player changes
  if (room.localPlay && room.phase !== 'lobby' && room.phase !== 'story-contest') {
    if (localPassVisible) return; // don't render game while overlay is up
    const curActive = room.activePlayer;
    if (curActive && prevActivePlayerLocal !== null && curActive !== prevActivePlayerLocal) {
      localCurrentRole = curActive;
      prevActivePlayerLocal = curActive;
      ssSelectedCardId = null;
      const name = curActive === 'therapist' ? room.therapistName : room.childName;
      document.getElementById('local-pass-name').textContent = `תורו של ${name}`;
      document.getElementById('local-pass-overlay').classList.remove('hidden');
      localPassVisible = true;
      return;
    }
    if (prevActivePlayerLocal === null) {
      prevActivePlayerLocal = curActive;
      localCurrentRole = curActive || 'therapist';
    }
  }

  // In solo mode therapist acts for both sides.
  // During guessing, the guesser is the non-active player (!isActive),
  // so we set isActive=false so the therapist can guess too.
  const isActive = room.solo
    ? room.phase !== 'guessing'
    : myRole === room.activePlayer;

  if (room.phase === 'lobby') { renderLobby(room); return; }
  if (room.phase === 'choosing-prompt') { renderChoosePrompt(room, isActive); return; }
  if (room.phase === 'free-play') { renderFreePlay(room); return; }
  if (room.phase === 'shared-story') { renderSharedStory(room); return; }
  if (room.phase === 'story-contest') { renderStoryContest(room); return; }
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

  // Reset local-play pass state on every lobby render
  if (room.localPlay) {
    localCurrentRole = 'therapist';
    prevActivePlayerLocal = null;
    localPassVisible = false;
    document.getElementById('local-pass-overlay').classList.add('hidden');
  }

  if (myRole === 'therapist') {
    document.getElementById('therapist-lobby-controls').classList.remove('hidden');

    // Count picker for story modes (initial game)
    const pickerEl = document.getElementById('lobby-count-picker');
    pickerEl.innerHTML = '';
    if (room.gameMode === 'shared-story') {
      pickerEl.appendChild(buildCountBar(room.cardsPerRound || 3, [2,3,4,5,6,7,8,9,10], 'קלפים לכל שחקן:'));
    } else if (room.gameMode === 'story-contest') {
      pickerEl.appendChild(buildCountBar(room.cardsPerRound || 5, [3,4,5,6,7,8,9,10], 'קלפים בסך הכל (לשניכם):'));
    }

    // Single-screen warning for non-story modes
    if (room.localPlay && ['fixed','cards-only','choice'].includes(room.gameMode)) {
      const hint = document.createElement('p');
      hint.className = 'one-screen-hint';
      hint.textContent = '💡 המשחק הזה עובד טוב יותר עם שני מסכים — כל שחקן רואה את בחירות השני';
      pickerEl.appendChild(hint);
    }

    if (room.localPlay) {
      // Local play: skip sharing instructions, both players are here
      document.getElementById('lobby-instructions').classList.add('hidden');
      document.getElementById('lobby-status-text').textContent =
        `${room.therapistName} ↔ ${room.childName} — מוכנים! 🎉`;
      document.getElementById('lobby-spinner').classList.add('hidden');
      document.getElementById('btn-start').classList.remove('hidden');
    } else {
      document.getElementById('lobby-instructions').classList.remove('hidden');
      document.getElementById('lobby-link-display').textContent =
        `${location.origin}/?join=${roomCode}`;
      if (room.childConnected) {
        document.getElementById('lobby-status-text').textContent = `${room.childName} כאן! 🎉`;
        document.getElementById('lobby-spinner').classList.add('hidden');
        document.getElementById('btn-start').classList.remove('hidden');
      } else {
        document.getElementById('lobby-status-text').textContent = 'ממתינים לשחקנ.ית...';
        document.getElementById('lobby-spinner').classList.remove('hidden');
        document.getElementById('btn-start').classList.add('hidden');
      }
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
    ? 'בחירת משפט:'
    : `${activeName} בוחרים משפט...`;

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
  document.getElementById('btn-game-back').classList.toggle('hidden', !(myRole === 'therapist' || room.localPlay));
  document.getElementById('btn-game-home').classList.toggle('hidden', !(myRole === 'therapist' || room.localPlay));
}

// ── Mid-game settings ─────────────────────────────────

document.getElementById('btn-mid-settings').addEventListener('click', () => {
  if (!currentRoom) return;
  // Sync panel to current room state ('choice' maps to 'fixed' in UI)
  const effectiveMode = currentRoom.gameMode === 'choice' ? 'fixed' : currentRoom.gameMode;
  document.querySelectorAll('[data-midmode]').forEach(c => {
    c.classList.toggle('selected', c.dataset.midmode === effectiveMode);
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
  const activeName  = room.activePlayer === 'therapist' ? room.therapistName : room.childName;
  const myTurn = (room.phase === 'choosing' && isActive) ||
                 (room.phase === 'guessing' && !isActive);

  banner.className = `phase-banner phase-${room.phase}${myTurn ? ' my-turn' : ''}`;

  if (room.phase === 'choosing') {
    if (pendingCard !== null) {
      text.textContent = 'לחצו שוב לאישור — או בחרו קלף אחר';
    } else {
      text.textContent = isActive
        ? 'תורך! בחרו קלף שמתאים למשפט'
        : `ממתינים ל${activeName} לבחור קלף...`;
    }
  } else if (room.phase === 'guessing') {
    if (pendingCard !== null && !isActive) {
      text.textContent = 'לחצו שוב לאישור — או בחרו קלף אחר';
    } else {
      text.textContent = !isActive
        ? 'תורך לנחש — לאיזה קלף התכוונו?'
        : `ממתינים לניחוש...`;
    }
  } else if (room.phase === 'reveal') {
    const correct = room.secretChoice === room.guess;
    banner.className = `phase-banner phase-reveal${correct ? '' : ' phase-reveal-wrong'}`;
    text.textContent = correct ? '🎉 ניחשתם נכון!' : '🤔 לא ניחשתם';
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
  const canReroll = isActive && room.phase === 'choosing'
    && room.gameMode !== 'cards-only'
    && room.gameMode !== 'choice'
    && room.allowReroll !== false;
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
  area.classList.remove('action-area--reveal');
  document.getElementById('btn-next-round-top').classList.add('hidden');

  const activeName  = room.activePlayer === 'therapist' ? room.therapistName : room.childName;
  const guesserName = room.activePlayer === 'therapist' ? room.childName     : room.therapistName;
  const chooserName = activeName;

  if (room.phase === 'choosing' && !isActive) {
    const div = document.createElement('div');
    div.className = 'action-waiting';
    div.innerHTML = `<div class="spinner small"></div><span>ממתינים ל${activeName}...</span>`;
    area.appendChild(div);

  } else if (room.phase === 'guessing' && isActive) {
    const div = document.createElement('div');
    div.className = 'action-waiting';
    div.innerHTML = `<div class="spinner small"></div><span>הקלף שלך נבחר — ממתינים לניחוש</span>`;
    area.appendChild(div);

  } else if (room.phase === 'reveal') {
    const correct = room.secretChoice === room.guess;
    area.classList.add('action-area--reveal');

    // Headline
    const headline = document.createElement('div');
    headline.className = `reveal-headline ${correct ? 'reveal-correct' : 'reveal-wrong'}`;
    headline.textContent = correct ? '🎉 ניחשתם נכון!' : '🤔 לא ניחשתם';
    area.appendChild(headline);

    // Card thumbnails
    const thumbRow = document.createElement('div');
    thumbRow.className = 'reveal-thumb-row';

    const chosenDiv = document.createElement('div');
    chosenDiv.className = 'reveal-thumb-item';
    const chosenImg = document.createElement('img');
    chosenImg.src = `/cards/card_${String(room.secretChoice).padStart(2,'0')}.png`;
    chosenImg.className = `reveal-thumb-img${correct ? ' thumb-match' : ''}`;
    chosenImg.alt = '';
    const chosenLabel = document.createElement('span');
    chosenLabel.textContent = 'הקלף שנבחר';
    chosenDiv.appendChild(chosenLabel);
    chosenDiv.appendChild(chosenImg);
    thumbRow.appendChild(chosenDiv);

    if (!correct && room.guess) {
      const guessDiv = document.createElement('div');
      guessDiv.className = 'reveal-thumb-item';
      const guessImg = document.createElement('img');
      guessImg.src = `/cards/card_${String(room.guess).padStart(2,'0')}.png`;
      guessImg.className = 'reveal-thumb-img thumb-mismatch';
      guessImg.alt = '';
      const guessLabel = document.createElement('span');
      guessLabel.textContent = 'הקלף שנוחש';
      guessDiv.appendChild(guessLabel);
      guessDiv.appendChild(guessImg);
      thumbRow.appendChild(guessDiv);
    }
    area.appendChild(thumbRow);

    // Score message
    const scoreDiv = document.createElement('div');
    scoreDiv.className = 'reveal-score-msg';
    scoreDiv.textContent = correct
      ? `3 נקודות ל${guesserName} • 1 נקודה ל${chooserName}`
      : `3 נקודות ל${chooserName}`;
    area.appendChild(scoreDiv);

    // Next round button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary reveal-next-btn';
    nextBtn.textContent = '← סיבוב הבא';
    nextBtn.addEventListener('click', nextRound);
    area.appendChild(nextBtn);

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

// ── Hidden cards overlay ───────────────────────────────

document.getElementById('btn-manage-hidden').addEventListener('click', () => {
  populateHiddenCardsGrid();
  document.getElementById('hidden-cards-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

document.getElementById('btn-close-hidden-cards').addEventListener('click', () => {
  document.getElementById('hidden-cards-overlay').classList.add('hidden');
  document.body.style.overflow = '';
});

document.getElementById('hidden-cards-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('hidden-cards-overlay')) {
    document.getElementById('hidden-cards-overlay').classList.add('hidden');
    document.body.style.overflow = '';
  }
});

function populateHiddenCardsGrid() {
  const grid = document.getElementById('hidden-cards-grid');
  grid.innerHTML = '';
  const hidden = getHiddenCards();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target.querySelector('img[data-src]');
      if (img) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '300px' });

  for (let i = 1; i <= TOTAL_CARDS; i++) {
    const isHidden = hidden.includes(i);
    const cell = document.createElement('div');
    cell.className = 'browser-card' + (isHidden ? ' hc-card-hidden' : '');
    cell.title = isHidden ? 'מוסתר — לחיצה לביטול' : 'לחיצה להסתרה';

    const src = `/cards/card_${String(i).padStart(2,'0')}.png`;
    const img = document.createElement('img');
    img.dataset.src = src;
    img.alt = `קלף ${i}`;
    cell.appendChild(img);

    if (isHidden) {
      const badge = document.createElement('div');
      badge.className = 'hc-hidden-badge';
      badge.textContent = 'מוסתר';
      cell.appendChild(badge);
    }

    cell.addEventListener('click', () => {
      toggleHideCard(i);
      const nowHidden = getHiddenCards().includes(i);
      cell.classList.toggle('hc-card-hidden', nowHidden);
      cell.title = nowHidden ? 'מוסתר — לחץ/י לבטל הסתרה' : 'לחיצה להסתרה';
      let badge = cell.querySelector('.hc-hidden-badge');
      if (nowHidden && !badge) {
        badge = document.createElement('div');
        badge.className = 'hc-hidden-badge';
        badge.textContent = 'מוסתר';
        cell.appendChild(badge);
      } else if (!nowHidden && badge) {
        badge.remove();
      }
    });

    grid.appendChild(cell);
    observer.observe(cell);
  }
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target.querySelector('img[data-src]');
      if (img) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '300px' });

  for (let i = 1; i <= TOTAL_CARDS; i++) {
    const cell = document.createElement('div');
    cell.className = 'browser-card';
    const src = `/cards/card_${String(i).padStart(2,'0')}.png`;
    const img = document.createElement('img');
    img.dataset.src = src;
    img.alt = `קלף ${i}`;
    cell.appendChild(img);
    cell.addEventListener('click', () => {
      document.getElementById('browser-zoom-img').src = src;
      document.getElementById('browser-zoom-modal').classList.remove('hidden');
    });
    grid.appendChild(cell);
    observer.observe(cell);
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

// ── Shared helpers (story modes) ─────────────────────

async function backToLobby() {
  if (!roomCode) return;
  await update(ref(db, `rooms/${roomCode}`), { phase: 'lobby' });
}

function goChooseGame() {
  renderPromptsScreen();
  showScreen('screen-settings');
}

function showZoomModal(cardId) {
  const src = `/cards/card_${String(cardId).padStart(2, '0')}.png`;
  document.getElementById('browser-zoom-img').src = src;
  document.getElementById('browser-zoom-modal').classList.remove('hidden');
}

// ── Start shared-story ────────────────────────────────

// ── Story mode helpers ────────────────────────────────

/** Compact count-picker bar used by both story modes */
function buildCountBar(currentCount, options, label) {
  const bar = document.createElement('div');
  bar.className = 'story-therapist-bar';
  const lbl = document.createElement('span');
  lbl.className = 'story-bar-label';
  lbl.textContent = label;
  bar.appendChild(lbl);
  options.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'count-chip' + (currentCount === n ? ' active' : '');
    btn.textContent = n;
    btn.addEventListener('click', async () => {
      await update(ref(db, `rooms/${roomCode}`), { cardsPerRound: n });
      bar.querySelectorAll('.count-chip').forEach(b =>
        b.classList.toggle('active', parseInt(b.textContent) === n));
    });
    bar.appendChild(btn);
  });
  return bar;
}

/** Deal 1 extra card to each player and extend the story by 2 turns */
async function ssAddCard(room) {
  const usedIds = new Set([
    ...toHandCards(room.therapistHand),
    ...toHandCards(room.childHand),
    ...toStoryLine(room.storyLine).map(e => e.cardId),
  ]);
  const hidden = getHiddenCards();
  const pool = shuffle(
    Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1)
      .filter(c => !hidden.includes(c) && !usedIds.has(c))
  );
  if (pool.length < 2) return;
  await update(ref(db, `rooms/${roomCode}`), {
    therapistHand: [...toHandCards(room.therapistHand), pool[0]],
    childHand:     [...toHandCards(room.childHand),     pool[1]],
    therapistHandCount: (room.therapistHandCount || 0) + 1,
    childHandCount:     (room.childHandCount     || 0) + 1,
    maxTurns: (room.maxTurns || 6) + 2,
  });
}

/** Add 1 extra card to the shared story-contest pool */
async function scAddCard(room) {
  if (room.therapistDone || room.childDone) return; // too late
  const existing = new Set(toCards(room.cards));
  const hidden = getHiddenCards();
  const pool = shuffle(
    Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1)
      .filter(c => !hidden.includes(c) && !existing.has(c))
  );
  if (pool.length < 1) return;
  await update(ref(db, `rooms/${roomCode}`), {
    cards: [...toCards(room.cards), pool[0]],
  });
}

async function writeNewSharedStoryGame(room) {
  const cardsPerPlayer = Math.min(room.cardsPerRound || 3, 10);
  const hidden = getHiddenCards();
  const pool = shuffle(
    Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1).filter(c => !hidden.includes(c))
  );
  const therapistHand = pool.slice(0, cardsPerPlayer);
  const childHand = pool.slice(cardsPerPlayer, cardsPerPlayer * 2);
  await update(ref(db, `rooms/${roomCode}`), {
    phase: 'shared-story',
    activePlayer: 'therapist',
    round: 1,
    therapistHand,
    childHand,
    therapistHandCount: cardsPerPlayer,
    childHandCount: cardsPerPlayer,
    storyLine: [],
    maxTurns: cardsPerPlayer * 2,
  });
}

// ── Render shared-story ───────────────────────────────

function renderSharedStory(room) {
  showScreen('screen-shared-story');
  document.getElementById('ss-name-therapist').textContent = room.therapistName || 'מנהל.ת';
  document.getElementById('ss-name-child').textContent = room.childName || 'שחקנ.ית';
  document.getElementById('btn-ss-back').classList.toggle('hidden', !(myRole === 'therapist' || room.localPlay));
  document.getElementById('btn-ss-home').classList.toggle('hidden', !(myRole === 'therapist' || room.localPlay));

  const storyLine = toStoryLine(room.storyLine);
  const maxTurns = room.maxTurns || 6;
  const isDone = storyLine.length >= maxTurns;
  const eRole = effectiveRole(room);
  const isActive = eRole === room.activePlayer;

  // Render story so far
  const storyEl = document.getElementById('ss-story-area');
  storyEl.innerHTML = '';
  if (storyLine.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'ss-empty-hint';
    empty.textContent = 'הסיפור מתחיל כאן...';
    storyEl.appendChild(empty);
  }
  storyLine.forEach((entry, idx) => {
    const item = document.createElement('div');
    item.className = 'ss-story-item';
    item.dataset.storyIdx = String(idx);
    const img = document.createElement('img');
    img.src = `/cards/card_${String(entry.cardId).padStart(2, '0')}.png`;
    img.className = 'ss-story-card-img';
    img.addEventListener('click', () => showZoomModal(entry.cardId));
    const textBlock = document.createElement('div');
    textBlock.className = 'ss-story-text-block';
    const author = document.createElement('span');
    author.className = 'ss-story-author';
    author.textContent = entry.authorName + ':';
    const sentence = document.createElement('span');
    sentence.className = 'ss-story-sentence';
    sentence.textContent = entry.sentence;
    textBlock.appendChild(author);
    textBlock.appendChild(sentence);
    item.appendChild(img);
    item.appendChild(textBlock);
    storyEl.appendChild(item);
  });

  // Action area
  const actionEl = document.getElementById('ss-action-area');
  actionEl.innerHTML = '';

  if (isDone) {
    const doneMsg = document.createElement('div');
    doneMsg.className = 'ss-done-msg';
    doneMsg.textContent = '🎉 הסיפור הושלם!';
    actionEl.appendChild(doneMsg);
    if (myRole === 'therapist') {
      if (storyPickerPending === 'shared') {
        // Show count picker then start
        const wrap = document.createElement('div');
        wrap.className = 'story-picker-wrap';
        const countBar = buildCountBar(room.cardsPerRound || 3, [2,3,4,5,6,7,8,9,10], 'קלפים לכל שחקן:');
        wrap.appendChild(countBar);
        const startBtn = document.createElement('button');
        startBtn.className = 'btn btn-primary';
        startBtn.textContent = 'התחל סיפור ◀';
        startBtn.addEventListener('click', () => {
          storyPickerPending = null;
          writeNewSharedStoryGame(currentRoom);
        });
        wrap.appendChild(startBtn);
        actionEl.appendChild(wrap);
      } else {
        const btnRow = document.createElement('div');
        btnRow.className = 'story-end-btns';
        const newBtn = document.createElement('button');
        newBtn.className = 'btn btn-primary';
        newBtn.textContent = '← סיפור חדש';
        newBtn.addEventListener('click', () => { storyPickerPending = 'shared'; render(currentRoom); });
        const otherBtn = document.createElement('button');
        otherBtn.className = 'btn btn-secondary';
        otherBtn.textContent = 'משחק אחר';
        otherBtn.addEventListener('click', () => backToLobby());
        const endBtn = document.createElement('button');
        endBtn.className = 'btn btn-ghost btn-small';
        endBtn.textContent = 'סיום שיחה';
        endBtn.addEventListener('click', () => { clearSession(); location.reload(); });
        btnRow.appendChild(newBtn);
        btnRow.appendChild(otherBtn);
        btnRow.appendChild(endBtn);
        actionEl.appendChild(btnRow);
      }
    }
    return;
  }

  if (isActive) {
    const myHandKey = eRole === 'therapist' ? 'therapistHand' : 'childHand';
    const myHand = toHandCards(room[myHandKey]);

    const turnMsg = document.createElement('div');
    turnMsg.className = 'ss-turn-msg';
    turnMsg.textContent = 'התור שלך — בחר קלף לסיפור';
    actionEl.appendChild(turnMsg);

    const handRow = document.createElement('div');
    handRow.className = 'ss-hand-row';
    myHand.forEach(cardId => {
      const card = buildCard(cardId);
      card.classList.add('selectable');
      card.classList.toggle('selected', ssSelectedCardId === cardId);
      card.addEventListener('click', () => ssSelectCard(cardId));
      handRow.appendChild(card);
    });
    actionEl.appendChild(handRow);

    // Sentence input (visible only when card selected)
    const inputArea = document.createElement('div');
    inputArea.className = 'ss-input-area' + (ssSelectedCardId ? '' : ' hidden');
    inputArea.id = 'ss-input-area';

    const textarea = document.createElement('textarea');
    textarea.id = 'ss-sentence-input';
    textarea.className = 'ss-textarea';
    textarea.placeholder = 'כתוב.י משפט לסיפור...';
    textarea.maxLength = 150;
    textarea.rows = 2;

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = '← הוסף לסיפור';
    submitBtn.addEventListener('click', () => ssSubmitCard(room, storyLine));

    inputArea.appendChild(textarea);
    inputArea.appendChild(submitBtn);
    actionEl.appendChild(inputArea);

    if (ssSelectedCardId) {
      setTimeout(() => document.getElementById('ss-sentence-input')?.focus(), 50);
    }
  } else {
    const activeName = room.activePlayer === 'therapist' ? room.therapistName : room.childName;
    const waitDiv = document.createElement('div');
    waitDiv.className = 'ss-waiting';
    waitDiv.innerHTML = `<div class="spinner small"></div><span>ממתינים ל${activeName} לבחור קלף...</span>`;
    actionEl.appendChild(waitDiv);
  }

  // Therapist-only: add a card to both hands mid-story
  if (myRole === 'therapist') {
    const bar = document.createElement('div');
    bar.className = 'story-therapist-bar';
    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-ghost btn-small';
    addBtn.textContent = '+ קלף נוסף לכל שחקן';
    addBtn.addEventListener('click', () => ssAddCard(room));
    bar.appendChild(addBtn);
    actionEl.appendChild(bar);
  }
}

function ssSelectCard(cardId) {
  ssSelectedCardId = cardId;
  // Re-highlight cards in DOM (without full re-render)
  document.querySelectorAll('.ss-hand-row .card').forEach(c => {
    c.classList.toggle('selected', parseInt(c.dataset.id) === cardId);
  });
  const inputArea = document.getElementById('ss-input-area');
  if (inputArea) {
    inputArea.classList.remove('hidden');
    document.getElementById('ss-sentence-input')?.focus();
  }
}

async function ssSubmitCard(room, storyLine) {
  if (!ssSelectedCardId) return;
  const sentenceEl = document.getElementById('ss-sentence-input');
  const sentence = sentenceEl ? sentenceEl.value.trim() : '';
  if (!sentence) {
    sentenceEl?.focus();
    return;
  }
  const eRole = effectiveRole(room);
  const myHandKey  = eRole === 'therapist' ? 'therapistHand' : 'childHand';
  const myCountKey = eRole === 'therapist' ? 'therapistHandCount' : 'childHandCount';
  const myHand = toHandCards(room[myHandKey]).filter(id => id !== ssSelectedCardId);
  const myName = eRole === 'therapist' ? room.therapistName : room.childName;
  const nextPlayer = room.activePlayer === 'therapist' ? 'child' : 'therapist';
  const newIndex = storyLine.length;
  const cardId = ssSelectedCardId;
  ssSelectedCardId = null;
  await update(ref(db, `rooms/${roomCode}`), {
    [`storyLine/${newIndex}`]: { cardId, authorRole: eRole, authorName: myName, sentence },
    [myHandKey]: myHand,
    [myCountKey]: myHand.length,
    activePlayer: nextPlayer,
    round: room.round + 1,
  });
}

// ── Start story-contest ───────────────────────────────

async function writeNewStoryContestGame(room) {
  const count = Math.min(room.cardsPerRound || 5, 10);
  const hidden = getHiddenCards();
  const pool = shuffle(
    Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1).filter(c => !hidden.includes(c))
  );
  const cards = pool.slice(0, count);
  await update(ref(db, `rooms/${roomCode}`), {
    phase: 'story-contest',
    cards,
    therapistOrder: [],
    childOrder: [],
    therapistSentences: {},
    childSentences: {},
    therapistDone: false,
    childDone: false,
  });
}

// ── Render story-contest ──────────────────────────────

function renderStoryContest(room) {
  showScreen('screen-story-contest');
  document.getElementById('btn-sc-back').classList.toggle('hidden', !(myRole === 'therapist' || room.localPlay));
  document.getElementById('btn-sc-home').classList.toggle('hidden', !(myRole === 'therapist' || room.localPlay));
  const cards = toCards(room.cards);
  const eRole = effectiveRole(room);
  const myDoneKey    = eRole === 'therapist' ? 'therapistDone' : 'childDone';
  const otherDoneKey = eRole === 'therapist' ? 'childDone' : 'therapistDone';
  const otherName    = eRole === 'therapist' ? room.childName : room.therapistName;
  const myDone  = room[myDoneKey];
  const otherDone = room[otherDoneKey];
  const bothDone = room.therapistDone && room.childDone;

  const statusEl = document.getElementById('sc-status');
  statusEl.textContent = bothDone
    ? 'שניכם סיימתם! 🎉'
    : (myDone ? `ממתינים ל${otherName}...` : (otherDone ? `${otherName} סיים.ה ✓` : ''));

  const content = document.getElementById('sc-content');
  content.innerHTML = '';

  if (bothDone) {
    renderStoryContestReveal(room, content);
    return;
  }

  if (myDone) {
    // Local play: show a "pass to other player" prompt instead of spinner
    if (room.localPlay && eRole === 'therapist' && !otherDone) {
      const passDiv = document.createElement('div');
      passDiv.className = 'sc-local-pass';
      const passMsg = document.createElement('p');
      passMsg.className = 'sc-local-pass-msg';
      passMsg.textContent = `סיימת! עכשיו תורו של ${room.childName}`;
      const passBtn = document.createElement('button');
      passBtn.className = 'btn btn-primary sc-done-btn';
      passBtn.textContent = `התחל תורו של ${room.childName} ◀`;
      passBtn.addEventListener('click', () => {
        localCurrentRole = 'child';
        render(currentRoom);
      });
      passDiv.appendChild(passMsg);
      passDiv.appendChild(passBtn);
      content.appendChild(passDiv);
    } else {
      const waitDiv = document.createElement('div');
      waitDiv.className = 'sc-waiting';
      waitDiv.innerHTML = `<div class="spinner small"></div><span>ממתינים ל${otherName} לסיים...</span>`;
      content.appendChild(waitDiv);
    }
    return;
  }

  // Local-play aware order/sentences — each role has its own local state
  const myOrder     = room.localPlay ? (eRole === 'therapist' ? scTherapistOrder     : scChildOrder)     : scMyOrder;
  const mySentences = room.localPlay ? (eRole === 'therapist' ? scTherapistSentences : scChildSentences) : scMySentences;
  const setOrder = (val) => {
    if (room.localPlay) { if (eRole === 'therapist') scTherapistOrder = val; else scChildOrder = val; }
    else scMyOrder = val;
  };
  const setSentence = (id, val) => {
    if (room.localPlay) { if (eRole === 'therapist') scTherapistSentences[id] = val; else scChildSentences[id] = val; }
    else scMySentences[id] = val;
  };
  const delSentence = (id) => {
    if (room.localPlay) { if (eRole === 'therapist') delete scTherapistSentences[id]; else delete scChildSentences[id]; }
    else delete scMySentences[id];
  };

  // Available cards (not yet ordered)
  const available = cards.filter(id => !myOrder.includes(id));

  const availHeader = document.createElement('p');
  availHeader.className = 'sc-section-title';
  availHeader.textContent = available.length > 0
    ? 'בחר.י קלפים לפי הסדר שבו תרצה לספר את הסיפור'
    : 'כל הקלפים סודרו ✓';
  content.appendChild(availHeader);

  if (available.length > 0) {
    const availRow = document.createElement('div');
    availRow.className = 'sc-available-row';
    available.forEach(cardId => {
      const wrap = document.createElement('div');
      wrap.className = 'sc-avail-card';
      const img = document.createElement('img');
      img.src = `/cards/card_${String(cardId).padStart(2, '0')}.png`;
      img.className = 'sc-avail-img';
      img.alt = `קלף ${cardId}`;
      wrap.addEventListener('click', () => {
        setOrder([...myOrder, cardId]);
        renderStoryContest(room);
      });
      const zoomBtn = document.createElement('button');
      zoomBtn.className = 'sc-card-zoom';
      zoomBtn.textContent = '🔍';
      zoomBtn.addEventListener('click', e => { e.stopPropagation(); showZoomModal(cardId); });
      wrap.appendChild(img);
      wrap.appendChild(zoomBtn);
      availRow.appendChild(wrap);
    });
    content.appendChild(availRow);
  }

  if (myOrder.length > 0) {
    const storyHeader = document.createElement('p');
    storyHeader.className = 'sc-section-title';
    storyHeader.textContent = 'הסיפור שלך';
    content.appendChild(storyHeader);

    // Sub-container for sortable rows
    const storyListEl = document.createElement('div');
    storyListEl.className = 'sc-story-list';

    myOrder.forEach((cardId, idx) => {
      const row = document.createElement('div');
      row.className = 'sc-story-row';
      row.dataset.cardId = String(cardId);

      // Move column: number + up/down buttons (kept as fallback / desktop alternative)
      const moveCol = document.createElement('div');
      moveCol.className = 'sc-story-move-col';
      const numEl = document.createElement('span');
      numEl.className = 'sc-story-num';
      numEl.textContent = `${idx + 1}`;
      const upBtn = document.createElement('button');
      upBtn.className = 'sc-move-btn';
      upBtn.textContent = '↑';
      upBtn.title = 'העלה';
      upBtn.disabled = idx === 0;
      upBtn.addEventListener('click', () => {
        const newOrder = [...myOrder];
        [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
        setOrder(newOrder);
        renderStoryContest(room);
      });
      const downBtn = document.createElement('button');
      downBtn.className = 'sc-move-btn';
      downBtn.textContent = '↓';
      downBtn.title = 'הורד';
      downBtn.disabled = idx === myOrder.length - 1;
      downBtn.addEventListener('click', () => {
        const newOrder = [...myOrder];
        [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
        setOrder(newOrder);
        renderStoryContest(room);
      });
      moveCol.appendChild(numEl);
      moveCol.appendChild(upBtn);
      moveCol.appendChild(downBtn);

      const cardImg = document.createElement('img');
      cardImg.src = `/cards/card_${String(cardId).padStart(2, '0')}.png`;
      cardImg.className = 'sc-story-card-img';
      cardImg.style.cursor = 'zoom-in';
      cardImg.addEventListener('click', () => showZoomModal(cardId));

      const removeBtn = document.createElement('button');
      removeBtn.className = 'sc-remove-btn';
      removeBtn.textContent = '✕';
      removeBtn.title = 'הסרה מהסיפור';
      removeBtn.addEventListener('click', () => {
        setOrder(myOrder.filter(id => id !== cardId));
        delSentence(cardId);
        renderStoryContest(room);
      });

      const textarea = document.createElement('textarea');
      textarea.className = 'sc-sentence-input';
      textarea.placeholder = 'כתוב.י משפט...';
      textarea.maxLength = 150;
      textarea.rows = 2;
      textarea.value = mySentences[cardId] || '';
      textarea.addEventListener('input', () => setSentence(cardId, textarea.value));

      row.appendChild(moveCol);
      row.appendChild(cardImg);
      row.appendChild(removeBtn);
      row.appendChild(textarea);
      storyListEl.appendChild(row);
    });

    content.appendChild(storyListEl);

    // Drag-and-drop reorder (Sortable.js)
    if (_scSortable) { _scSortable.destroy(); _scSortable = null; }
    if (typeof Sortable !== 'undefined' && myOrder.length > 1) {
      const snapOrder = myOrder;       // captured from this render
      const snapSetOrder = setOrder;   // captured setter
      _scSortable = Sortable.create(storyListEl, {
        animation: 150,
        ghostClass: 'drag-ghost',
        chosenClass: 'drag-chosen',
        onEnd(evt) {
          if (evt.oldIndex === evt.newIndex) return;
          const newOrder = [...snapOrder];
          const [moved] = newOrder.splice(evt.oldIndex, 1);
          newOrder.splice(evt.newIndex, 0, moved);
          snapSetOrder(newOrder);
          render(currentRoom);
        },
      });
    }
  }

  const allPlaced = myOrder.length === cards.length;
  const allFilled = allPlaced && myOrder.every(id => (mySentences[id] || '').trim());
  const doneBtn = document.createElement('button');
  doneBtn.className = 'btn btn-primary sc-done-btn';
  doneBtn.textContent = 'סיימתי ✓';
  doneBtn.disabled = !allFilled;
  doneBtn.addEventListener('click', () => scSubmitStory(room));
  content.appendChild(doneBtn);

  // Therapist-only: add card to current round
  if (myRole === 'therapist') {
    const bar = document.createElement('div');
    bar.className = 'story-therapist-bar';
    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-ghost btn-small';
    addBtn.textContent = '+ הוסף קלף';
    addBtn.addEventListener('click', () => scAddCard(room));
    bar.appendChild(addBtn);
    content.appendChild(bar);
  }
}

async function scSubmitStory(room) {
  const eRole = effectiveRole(room);
  const myOrderKey     = eRole === 'therapist' ? 'therapistOrder'    : 'childOrder';
  const mySentencesKey = eRole === 'therapist' ? 'therapistSentences': 'childSentences';
  const myDoneKey      = eRole === 'therapist' ? 'therapistDone'     : 'childDone';
  const ord  = room.localPlay ? (eRole === 'therapist' ? scTherapistOrder     : scChildOrder)     : scMyOrder;
  const sent = room.localPlay ? (eRole === 'therapist' ? scTherapistSentences : scChildSentences) : scMySentences;
  await update(ref(db, `rooms/${roomCode}`), {
    [myOrderKey]: ord,
    [mySentencesKey]: sent,
    [myDoneKey]: true,
  });
}

function renderStoryContestReveal(room, container) {
  const therapistOrder = toCards(room.therapistOrder);
  const childOrder = toCards(room.childOrder);
  const therapistSentences = room.therapistSentences || {};
  const childSentences = room.childSentences || {};

  const colsWrap = document.createElement('div');
  colsWrap.className = 'sc-reveal-cols';

  [
    { name: room.therapistName, order: therapistOrder, sentences: therapistSentences },
    { name: room.childName, order: childOrder, sentences: childSentences },
  ].forEach(({ name, order, sentences }) => {
    const col = document.createElement('div');
    col.className = 'sc-reveal-col';

    const nameEl = document.createElement('h4');
    nameEl.className = 'sc-reveal-name';
    nameEl.textContent = name;
    col.appendChild(nameEl);

    order.forEach((cardId, idx) => {
      const item = document.createElement('div');
      item.className = 'sc-reveal-item';
      const img = document.createElement('img');
      img.src = `/cards/card_${String(cardId).padStart(2, '0')}.png`;
      img.className = 'sc-reveal-card-img';
      img.addEventListener('click', () => showZoomModal(cardId));
      const text = document.createElement('div');
      text.className = 'sc-reveal-text';
      text.textContent = `${idx + 1}. ${sentences[cardId] || ''}`;
      item.appendChild(img);
      item.appendChild(text);
      col.appendChild(item);
    });

    colsWrap.appendChild(col);
  });

  container.appendChild(colsWrap);

  if (myRole === 'therapist') {
    if (storyPickerPending === 'contest') {
      const wrap = document.createElement('div');
      wrap.className = 'story-picker-wrap';
      const countBar = buildCountBar(currentRoom.cardsPerRound || 5, [3,4,5,6,7,8,9,10], 'קלפים בסך הכל לשניכם:');
      wrap.appendChild(countBar);
      const startBtn = document.createElement('button');
      startBtn.className = 'btn btn-primary';
      startBtn.textContent = 'התחל תחרות ◀';
      startBtn.addEventListener('click', () => {
        storyPickerPending = null;
        writeNewStoryContestGame(currentRoom);
      });
      wrap.appendChild(startBtn);
      container.appendChild(wrap);
    } else {
      const btnRow = document.createElement('div');
      btnRow.className = 'story-end-btns';
      const newBtn = document.createElement('button');
      newBtn.className = 'btn btn-primary';
      newBtn.textContent = '← תחרות חדשה';
      newBtn.addEventListener('click', () => { storyPickerPending = 'contest'; render(currentRoom); });
      const otherBtn = document.createElement('button');
      otherBtn.className = 'btn btn-secondary';
      otherBtn.textContent = 'משחק אחר';
      otherBtn.addEventListener('click', () => backToLobby());
      const endBtn = document.createElement('button');
      endBtn.className = 'btn btn-ghost btn-small';
      endBtn.textContent = 'סיום שיחה';
      endBtn.addEventListener('click', () => { clearSession(); location.reload(); });
      btnRow.appendChild(newBtn);
      btnRow.appendChild(otherBtn);
      btnRow.appendChild(endBtn);
      container.appendChild(btnRow);
    }
  }
}

// ── Render ────────────────────────────────────────────

function renderFreePlay(room) {
  showScreen('screen-free-play');
  document.getElementById('btn-fp-back').classList.toggle('hidden', !(myRole === 'therapist' || room.localPlay));
  document.getElementById('btn-fp-home').classList.toggle('hidden', !(myRole === 'therapist' || room.localPlay));

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
    const notesList = toNotesList(tableNotes[cardId]);
    const el = fpBuildCard(cardId, 'לקחת לידיים', () => fpTakeFromTable(cardId), notesList, true);
    tableEl.appendChild(el);
  });

  // My hand (private)
  const myHandKey = myRole === 'therapist' ? 'therapistHand' : 'childHand';
  const myHand = toHandCards(room[myHandKey]);
  const tableIsFull = tableCards.length >= 4;

  document.getElementById('fp-hand-count').textContent = myHand.length ? `(${myHand.length})` : '';
  document.getElementById('fp-hand-empty').style.display = myHand.length ? 'none' : '';

  const myHandNotesKey = myRole === 'therapist' ? 'therapistHandNotes' : 'childHandNotes';
  const myHandNotes = room[myHandNotesKey] || {};
  const handEl = document.getElementById('fp-hand-cards');
  handEl.innerHTML = '';
  myHand.forEach(cardId => {
    const notesList = toNotesList(myHandNotes[cardId]);
    const btnText = tableIsFull ? 'שולחן מלא' : 'להניח על השולחן';
    const onClick = tableIsFull ? null : () => fpPlaceOnTable(cardId);
    const el = fpBuildCard(cardId, btnText, onClick, notesList, false);
    if (tableIsFull) el.querySelector('.fp-card-btn').classList.add('fp-card-btn--disabled');
    handEl.appendChild(el);
  });

  // End button — therapist only
  document.getElementById('fp-end-area').style.display = myRole === 'therapist' ? '' : 'none';
}

function fpBuildCard(cardId, btnText, onClick, notesList = [], isTableCard = false) {
  const wrap = document.createElement('div');
  wrap.className = isTableCard ? 'fp-card-wrap' : 'fp-card-wrap fp-card-wrap--hand';
  if (isTableCard) wrap.dataset.cardId = String(cardId);

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

  // Note button — add new note (shown on both table and hand cards)
  const noteBtn = document.createElement('button');
  noteBtn.className = 'fp-card-note-btn';
  noteBtn.title = 'הוספת פתק';
  noteBtn.textContent = '📝';
  noteBtn.addEventListener('click', e => { e.stopPropagation(); fpOpenNoteModal(cardId, isTableCard, -1, null); });
  div.appendChild(noteBtn);

  const btn = document.createElement('button');
  btn.className = 'fp-card-btn';
  btn.textContent = btnText;
  if (onClick) btn.addEventListener('click', e => { e.stopPropagation(); onClick(); });
  div.appendChild(btn);

  // Note papers — one per note, each with its own edit button
  notesList.forEach((note, idx) => {
    const paper = document.createElement('div');
    paper.className = 'fp-note-paper';
    paper.style.background = note.color;

    const textEl = document.createElement('span');
    textEl.className = 'fp-note-paper-text';
    textEl.textContent = note.text;
    paper.appendChild(textEl);

    const editBtn = document.createElement('button');
    editBtn.className = 'fp-note-paper-edit';
    editBtn.textContent = '✏️';
    editBtn.title = 'עריכת פתק';
    editBtn.addEventListener('click', e => { e.stopPropagation(); fpOpenNoteModal(cardId, isTableCard, idx, note); });
    paper.appendChild(editBtn);

    wrap.appendChild(paper);
  });

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
  const tableCards    = toTableCards(room.tableCards);
  const myHandKey     = myRole === 'therapist' ? 'therapistHand'      : 'childHand';
  const myCountKey    = myRole === 'therapist' ? 'therapistHandCount'  : 'childHandCount';
  const myHandNotesKey = myRole === 'therapist' ? 'therapistHandNotes' : 'childHandNotes';
  const myHand        = toHandCards(room[myHandKey]);

  const updates = {
    tableCards:   tableCards.filter(id => id !== cardId),
    [myHandKey]:  [...myHand, cardId],
    [myCountKey]: myHand.length + 1,
  };

  // Move notes from table → hand (preserve them)
  const tableNoteData = room.tableNotes?.[cardId];
  if (tableNoteData != null) {
    updates[`tableNotes/${cardId}`] = null;
    updates[`${myHandNotesKey}/${cardId}`] = tableNoteData;
  }

  await update(ref(db, `rooms/${roomCode}`), updates);
}

async function fpPlaceOnTable(cardId) {
  const room = currentRoom;
  const tableCards     = toTableCards(room.tableCards);
  if (tableCards.length >= 4) return;

  const myHandKey      = myRole === 'therapist' ? 'therapistHand'      : 'childHand';
  const myCountKey     = myRole === 'therapist' ? 'therapistHandCount'  : 'childHandCount';
  const myHandNotesKey = myRole === 'therapist' ? 'therapistHandNotes'  : 'childHandNotes';
  const myHand         = toHandCards(room[myHandKey]);
  const handNoteData   = (room[myHandNotesKey] || {})[cardId];

  const updates = {
    tableCards:   [...tableCards, cardId],
    [myHandKey]:  myHand.filter(id => id !== cardId),
    [myCountKey]: myHand.length - 1,
  };

  // Move notes from hand → table (preserve them)
  if (handNoteData != null) {
    updates[`${myHandNotesKey}/${cardId}`] = null;
    updates[`tableNotes/${cardId}`] = handNoteData;
  }

  await update(ref(db, `rooms/${roomCode}`), updates);
}

// ── Note modal ────────────────────────────────────────

let fpCurrentNoteCardId = null;
let fpCurrentNoteColor  = '#fff9c4';
let fpCurrentNoteIsTable = true;
let fpCurrentNoteIndex  = -1;   // -1 = new note

function fpOpenNoteModal(cardId, isTable, noteIndex, existingNote) {
  fpCurrentNoteCardId  = cardId;
  fpCurrentNoteIsTable = isTable;
  fpCurrentNoteIndex   = noteIndex;
  fpCurrentNoteColor   = existingNote?.color || '#fff9c4';

  document.getElementById('fp-note-text').value = existingNote?.text || '';
  document.getElementById('fp-note-delete').style.display = noteIndex !== -1 ? '' : 'none';
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
  const noteData = { text, color: fpCurrentNoteColor };
  const cardId = fpCurrentNoteCardId;
  const room = currentRoom;

  let basePath, currentNotes;
  if (fpCurrentNoteIsTable) {
    basePath = `rooms/${roomCode}/tableNotes`;
    currentNotes = toNotesList(room.tableNotes?.[cardId]);
  } else {
    const k = myRole === 'therapist' ? 'therapistHandNotes' : 'childHandNotes';
    basePath = `rooms/${roomCode}/${k}`;
    currentNotes = toNotesList(room[k]?.[cardId]);
  }

  const updated = fpCurrentNoteIndex === -1
    ? [...currentNotes, noteData]
    : currentNotes.map((n, i) => i === fpCurrentNoteIndex ? noteData : n);

  await update(ref(db, basePath), { [cardId]: updated });
  document.getElementById('fp-note-modal').classList.add('hidden');
}

async function fpDeleteNote() {
  if (!fpCurrentNoteCardId || fpCurrentNoteIndex === -1) return;
  const cardId = fpCurrentNoteCardId;
  const room = currentRoom;

  let basePath, currentNotes;
  if (fpCurrentNoteIsTable) {
    basePath = `rooms/${roomCode}/tableNotes`;
    currentNotes = toNotesList(room.tableNotes?.[cardId]);
  } else {
    const k = myRole === 'therapist' ? 'therapistHandNotes' : 'childHandNotes';
    basePath = `rooms/${roomCode}/${k}`;
    currentNotes = toNotesList(room[k]?.[cardId]);
  }

  const updated = currentNotes.filter((_, i) => i !== fpCurrentNoteIndex);
  await update(ref(db, basePath), { [cardId]: updated.length ? updated : null });
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

document.querySelectorAll('.fp-note-emoji').forEach(el => {
  el.addEventListener('click', () => {
    const textarea = document.getElementById('fp-note-text');
    const start = textarea.selectionStart ?? textarea.value.length;
    const val = textarea.value;
    const emoji = el.dataset.emoji;
    textarea.value = val.slice(0, start) + emoji + val.slice(start);
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    textarea.focus();
  });
});

// ── Event listeners ───────────────────────────────────

document.getElementById('btn-fp-flip').addEventListener('click', fpFlipCard);
document.getElementById('btn-fp-deal').addEventListener('click', fpDeal);
document.getElementById('btn-fp-end').addEventListener('click', () => { clearSession(); location.reload(); });

// ── Drag-and-drop (Sortable.js) ───────────────────────

if (typeof Sortable !== 'undefined') {
  // Free-play table: reorder cards on the shared table
  Sortable.create(document.getElementById('fp-table-cards'), {
    animation: 150,
    ghostClass: 'drag-ghost',
    chosenClass: 'drag-chosen',
    onEnd(evt) {
      if (!currentRoom || !roomCode || evt.oldIndex === evt.newIndex) return;
      const arr = toTableCards(currentRoom.tableCards);
      const newArr = [...arr];
      const [moved] = newArr.splice(evt.oldIndex, 1);
      newArr.splice(evt.newIndex, 0, moved);
      update(ref(db, `rooms/${roomCode}`), { tableCards: newArr });
    },
  });

  // Shared story: reorder story entries
  Sortable.create(document.getElementById('ss-story-area'), {
    animation: 150,
    ghostClass: 'drag-ghost',
    chosenClass: 'drag-chosen',
    draggable: '.ss-story-item',
    onEnd(evt) {
      if (!currentRoom || !roomCode || evt.oldIndex === evt.newIndex) return;
      const line = toStoryLine(currentRoom.storyLine);
      const newLine = [...line];
      const [moved] = newLine.splice(evt.oldIndex, 1);
      newLine.splice(evt.newIndex, 0, moved);
      const obj = {};
      newLine.forEach((entry, i) => { obj[i] = entry; });
      update(ref(db, `rooms/${roomCode}`), { storyLine: obj });
    },
  });
}
