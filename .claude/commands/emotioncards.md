# קלפים מדברים — הוספת פיצ'ר

אתה מוסיף פיצ'ר לאפליקציית **קלפים מדברים** — כלי דיגיטלי לשיח רגשי בטיפול.

## הפיצ'ר המבוקש
$ARGUMENTS

---

## סטאק טכני
- **Vanilla JS** — ES modules, ללא bundler/framework
- **Firebase Realtime Database** — `onValue`, `update`, `set`, `ref`, `get`
- **Sortable.js v1.15.2** — CDN, גלובלי `Sortable`
- **Netlify** — auto-deploy מ-GitHub push
- **Cache-busting** — `?v=N` על תג game.js ב-index.html

## קבצים
| קובץ | תפקיד |
|------|--------|
| `public/index.html` | כל מבנה המסכים (HTML סטטי) |
| `public/style.css` | design system + כל הסטיילים |
| `public/game.js` | כל הלוגיקה (~2600 שורות, ES module) |

---

## Patterns מרכזיים

### מסכים
```css
.screen { display: none; min-height: 100vh; }
.screen.active { display: flex; flex-direction: column; align-items: center; }
```
מעבר: `showScreen('screen-id')`
מסכי משחק: `screen-game`, `screen-free-play`, `screen-shared-story`, `screen-story-contest`
מסכים נוספים: `screen-landing`, `screen-lobby`, `screen-settings`

### Firebase
```js
// קריאה
onValue(ref(db, `rooms/${roomCode}`), snap => render(snap.val()));
// כתיבה
update(ref(db, `rooms/${roomCode}`), { key: value });
```
כל ה-state חי ב-Firebase. שינוי ב-Firebase → `render(room)` → route לפי `room.phase`.

### render() routing
`render(room)` מנתב לפי `room.phase`:
- `'lobby'` → `renderLobby(room)`
- `'choosing'` / `'guessing'` / `'reveal'` → `renderGame(room)`
- `'shared-story'` → `renderSharedStory(room)`
- `'story-contest'` → `renderStoryContest(room)`
- `'free-play'` → `renderFreePlay(room)`

### קלפים
- **סה"כ קלפים:** 95 (`TOTAL_CARDS = 95`)
- **נתיב תמונה:** `/cards/card_${String(cardId).padStart(2,'0')}.png`
- `buildCard(cardId)` — יוצר `.card` div (aspect-ratio 3:2)
- ⚠️ **אל תכניס כפתורי zoom לתוך `.card`** — יש לו stacking context שמסתיר אותם. במקום, עטוף ב-div עם `position:relative` ושים את הכפתור כ-sibling:

```js
const wrap = document.createElement('div');
wrap.className = 'my-card-wrap'; // position: relative; display: inline-block
const card = buildCard(cardId);
const zoomBtn = document.createElement('button');
zoomBtn.className = 'sc-card-zoom'; // CSS מוכן, z-index:20
zoomBtn.textContent = '🔍';
zoomBtn.addEventListener('click', e => { e.stopPropagation(); showZoomModal(cardId); });
wrap.appendChild(card);
wrap.appendChild(zoomBtn);
```

### Zoom modal
`showZoomModal(cardId)` — משתמש ב-`#browser-zoom-modal` + `#browser-zoom-img`

### תפקידים (Roles)
- `myRole` = `'therapist'` | `'child'`
- `effectiveRole(room)` — מחזיר תפקיד בהתחשב ב-localPlay
- **בקרות מנהל:** בדוק `myRole === 'therapist' || room.localPlay`

### כפתורי back/home בכותרות משחק
כל מסך משחק מכיל:
- `btn-*-back` → `backToLobby()` — חזור ללובי (שינוי phase:'lobby' ב-Firebase)
- `btn-*-home` → `goChooseGame()` — עבור למסך הגדרות לבחור משחק אחר
- שניהם `.hidden` כברירת מחדל, מוצגים רק ל-therapist/localPlay

### Drag & Drop (Sortable.js)
```js
if (typeof Sortable !== 'undefined') {
  Sortable.create(containerEl, {
    animation: 150, ghostClass: 'drag-ghost', chosenClass: 'drag-chosen',
    onEnd(evt) { /* update Firebase with new order */ }
  });
}
```

---

## Design System CSS

### צבעים ומשתנים עיקריים
```css
--accent: #c8624a        /* כתום-אדום ראשי */
--bg / --bg-soft / --bg-warm   /* רקעים */
--border / --border-dark        /* גבולות */
--text / --text-mid / --text-dim  /* טקסט */
--r-sm:6px / --r:12px / --r-lg:18px / --r-full:9999px
--shadow-xs / --shadow-sm / --shadow / --shadow-lg
--t: .2s  --t-lg: .32s  --font: 'Heebo'
```

### קלאסים נפוצים
`.btn .btn-primary .btn-secondary .btn-ghost .btn-small .btn-lg`
`.hidden` `.screen` `.card` `.spinner .spinner.small`
`.brand-footer` (footer בכל המסכים)
`.btn-header-back` (כפתורי back/home בכותרות)
`.sc-card-zoom` (כפתור zoom על קלפים — תמיד גלוי, z-index:20)
`.drag-ghost .drag-chosen` (Sortable.js)

---

## מבנה state חשוב
```js
let myRole = 'therapist' | 'child'
let roomCode = ''
let currentRoom = null          // snapshot אחרון מ-Firebase
let selectedPlayMode = 'two-screens' | 'one-screen'
let localCurrentRole = 'therapist'  // למסך יחיד
let storyPickerPending = null | 'shared' | 'contest'
let _scSortable = null          // Sortable instance (destroy לפני כל render)
```

### Firebase room keys חשובים
`phase`, `gameMode`, `therapistName`, `childName`, `localPlay`,
`cardsPerRound`, `therapistHand`, `childHand`, `storyLine`, `cards`,
`therapistOrder`, `childOrder`, `therapistSentences`, `childSentences`,
`therapistDone`, `childDone`, `tableCards`, `deck`

---

## העדפות עיצוב ו-UX

1. **עברית RTL** — כל הטקסטים בעברית, כיוון RTL
2. **UI קומפקטי** — לא לצופף כותרות, רכיבי UI דיסקרטיים
3. **Touch-friendly** — כפתורי zoom תמיד גלויים (לא רק בhover)
4. **Footer בכל המסכים** — `brand-footer` קיים גם במסכי משחק, `position: sticky; bottom: 0`, ממורכז. לוגו 62px, טקסט 15px, גלולות (סדנאות/הרצאות) 15px עם רקע לבן ובורדר
5. **בקרות therapist** — מוסתרות מהילד/שחקן אלא אם הורשה
6. **גדלי קלפים:**
   - קלפי יד בסיפור: `width: 165px` (ss-hand-row)
   - קלפים בסיפור הבנוי: `width: 120px` (ss-story-card-img)
   - קלפי בחירה בתחרות: `clamp(180px, 44vw, 240px)` (sc-avail-card)
   - קלפים בתחרות הממוינים: `width: 108px` (sc-story-card-img)
7. **Sortable.js** — drag & drop בכל רשימות קלפים/סיפורים ב-free-play, shared-story, story-contest

---

## Workflow

### לפני הכתיבה
1. קרא את הקבצים הרלוונטיים (`Read` tool) לפני שינויים
2. העלה את `?v=N` ב-index.html בכל שינוי ב-game.js

### סדר עריכה מועדף
1. `style.css` — CSS חדש
2. `game.js` — לוגיקה
3. `index.html` — HTML + bump version

### commit & push
```bash
git add public/style.css public/game.js public/index.html
git commit -m "תיאור קצר של השינוי"
git push
```

---

## מבנה מסכי המשחק (HTML)

### screen-game
`game-header` (sticky) → `game-sticky-top` (phase-banner + prompt) → `table-surface` (flex:1) → `action-area`

### screen-free-play
`fp-header` (sticky) → `fp-table-section` → `fp-controls` → `fp-hand-section` (flex:1) → `fp-end-area` → `brand-footer`

### screen-shared-story
`ss-header` → `ss-story-area` (flex:1, overflow-y:auto) → `ss-action-area` → `brand-footer`

### screen-story-contest
`sc-header` → `sc-content` (flex:1, overflow-y:auto) → `brand-footer`
