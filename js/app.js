import { TOPICS, ITEMS } from './data/lessons.js';
import { KANA, JA_NOTES, ZH_TONES, ZH_INITIALS, ZH_FINALS, ZH_RADICALS, ZH_NOTES, LATIN } from './data/scripts.js';
import { LANGS, LANG, speakText, romanization } from './langs.js';
import { speak, hasVoice, ttsSupported, srSupported, listen, similarity } from './audio.js';
import { state, onChange, setSettings, answer, markSeen, addXp, streak, langStats, rec, today, resetAll } from './store.js';
import { wikiImage, commonsMedia, youglishUrl } from './media.js';
import { sync, syncAvailable, onSync, initSync, signInGoogle, signInEmail, signOut } from './sync.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const S = () => state.settings;
const active = () => LANGS.filter(l => S().langs.includes(l.code));
const topicById = id => TOPICS.find(t => t.id === id);
const topicItems = t => [...t.words, ...t.phrases];
const ALL_IDS = Object.keys(ITEMS);

// Tra một mục theo khóa: id từ vựng hoặc "dlg:topic:index" cho câu hội thoại
function entry(key) {
  if (key.startsWith('dlg:')) { const [, t, i] = key.split(':'); return topicById(t).dialogue.lines[+i]; }
  if (key.startsWith('raw:')) return null;
  return ITEMS[key];
}

// ---------------- Phát âm ----------------
async function say(key, code) {
  const e = entry(key);
  if (!e) return;
  const btn = $(`[data-act="say"][data-key="${CSS.escape(key)}"][data-lang="${code}"]`);
  btn?.classList.add('playing');
  await speak(speakText(e, code), code, S().rate);
  btn?.classList.remove('playing');
}
async function sayAll(key, codes = active().map(l => l.code)) {
  for (const c of codes) { await say(key, c); await new Promise(r => setTimeout(r, 250)); }
}

// ---------------- Thành phần giao diện ----------------
function langRow(key, e, l, opts = {}) {
  const rom = romanization(e, l.code, S());
  return `<div class="lrow" data-lang="${l.code}">
    <span class="flag" title="${esc(l.name)}">${l.flag}</span>
    <div class="txt" lang="${l.bcp}"><b>${esc(e[l.code].t)}</b>${rom ? `<small>${esc(rom)}</small>` : ''}</div>
    <button class="icon say" data-act="say" data-key="${esc(key)}" data-lang="${l.code}" aria-label="Nghe ${esc(l.name)}">🔊</button>
    ${opts.mic && srSupported() ? `<button class="icon" data-act="mic" data-key="${esc(key)}" data-lang="${l.code}" aria-label="Luyện nói">🎤</button>` : ''}
    ${opts.yg ? `<a class="icon" target="_blank" rel="noopener" href="${youglishUrl(e[l.code].t, l.yg)}" title="Xem video người bản xứ nói (YouGlish)">🎬</a>` : ''}
  </div>`;
}

function media(it, cls = '') {
  return `<div class="media ${cls}" ${it.wp ? `data-wp="${esc(it.wp)}"` : ''}><span class="emoji">${it.emoji}</span></div>`;
}

const io = 'IntersectionObserver' in window ? new IntersectionObserver(ents => {
  for (const en of ents) if (en.isIntersecting) { io.unobserve(en.target); loadImg(en.target); }
}, { rootMargin: '200px' }) : null;

async function loadImg(el) {
  const img = await wikiImage(el.dataset.wp);
  if (!img || !el.isConnected) return;
  const i = new Image();
  i.alt = '';
  i.loading = 'lazy';
  i.onload = () => { el.classList.add('has-img'); };
  i.src = img.src;
  el.prepend(i);
  if (el.classList.contains('big')) el.insertAdjacentHTML('beforeend', `<a class="credit" target="_blank" rel="noopener" href="${img.href}">Ảnh: ${esc(img.credit)}</a>`);
}
function hydrate(root = document) {
  for (const el of $$('.media[data-wp]:not([data-done])', root)) {
    el.dataset.done = 1;
    io ? io.observe(el) : loadImg(el);
  }
}

function itemCard(it) {
  const rows = active().map(l => langRow(it.id, it, l)).join('');
  const r = active().map(l => rec(l.code, it.id)?.b || 0);
  const lvl = Math.round(r.reduce((a, b) => a + b, 0) / Math.max(1, r.length));
  return `<article class="card item" data-act="open" data-key="${it.id}">
    ${media(it)}
    <div class="body">
      <div class="vi">${esc(it.vi)} ${lvl ? `<span class="lvl" title="Mức nhớ">${'●'.repeat(Math.min(lvl, 5))}</span>` : ''}</div>
      ${rows}
    </div>
  </article>`;
}

function bar(v, total, color) {
  const pct = total ? Math.round(v / total * 100) : 0;
  return `<div class="bar"><i style="width:${pct}%;${color ? `background:${color}` : ''}"></i></div>`;
}

// ---------------- Khung chính ----------------
const app = $('#app');
let route = { name: 'home', args: [] };

function header() {
  const xp = state.days[today()] || 0;
  $('#stats').innerHTML = `<span title="Chuỗi ngày học">🔥 ${streak()}</span><span title="Điểm hôm nay">⭐ ${xp}/${S().dailyGoal}</span>
    <a href="#/settings" class="sync ${sync.user ? 'on' : ''}" title="${esc(sync.status)}">${sync.user ? '☁️' : '💾'}</a>`;
  $('#langbar').innerHTML = LANGS.map(l => `<button class="chip ${S().langs.includes(l.code) ? 'on' : ''}" data-act="toggle-lang" data-lang="${l.code}" title="${esc(l.name)}">${l.flag}<span>${l.short}</span></button>`).join('');
  $$('#nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + (route.name === 'home' ? '' : route.name)));
}

function render() {
  const [name = '', ...args] = location.hash.replace(/^#\/?/, '').split('/');
  route = { name: name || 'home', args: args.map(decodeURIComponent) };
  const view = VIEWS[route.name] || VIEWS.home;
  if ($('#modal').open) closeModal();
  speechSynthesis?.cancel?.();
  app.innerHTML = view(...route.args);
  app.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  header();
  hydrate(app);
  AFTER[route.name]?.(...route.args);
}

// ---------------- Các màn hình ----------------
const VIEWS = {};
const AFTER = {};

VIEWS.home = () => {
  const due = dueList().length;
  const xp = state.days[today()] || 0;
  const goal = S().dailyGoal;
  return `
  <section class="hero card">
    <div>
      <h1>Chào bạn 👋</h1>
      <p>Học cùng lúc ${active().map(l => l.flag).join(' ')} — mỗi từ một hình, nghe giọng bản xứ, ôn lại đúng lúc sắp quên.</p>
      <div class="goal">${bar(Math.min(xp, goal), goal)}<span>${xp}/${goal} điểm hôm nay</span></div>
    </div>
    <div class="hero-actions">
      <a class="btn primary" href="#/review">🔁 Ôn tập${due ? ` <b class="badge">${due}</b>` : ''}</a>
      <a class="btn" href="#/topic/${nextTopic().id}">▶️ Học tiếp: ${esc(nextTopic().vi)}</a>
    </div>
  </section>
  ${!ttsSupported() ? `<div class="warn">Trình duyệt này không có giọng đọc. Hãy dùng Chrome, Edge hoặc Safari để nghe phát âm.</div>` : ''}
  <section>
    <h2>Bước 1 · Chữ viết & phát âm</h2>
    <div class="grid scripts-grid">
      <a class="card tile" href="#/scripts/ja"><span class="big-emoji">あ</span><b>Kana tiếng Nhật</b><small>Hiragana · Katakana</small></a>
      <a class="card tile" href="#/scripts/zh"><span class="big-emoji">拼</span><b>Pinyin & thanh điệu</b><small>Tiếng Trung</small></a>
      <a class="card tile" href="#/scripts/en"><span class="big-emoji">🇬🇧</span><b>Âm tiếng Anh UK</b><small>th, schwa, âm cuối</small></a>
      <a class="card tile" href="#/scripts/fr"><span class="big-emoji">🇫🇷</span><b>Âm tiếng Pháp</b><small>r, âm mũi, nối âm</small></a>
      <a class="card tile" href="#/scripts/es"><span class="big-emoji">🇪🇸</span><b>Âm Tây Ban Nha</b><small>rr, j, ñ</small></a>
    </div>
  </section>
  <section>
    <h2>Bước 2 · Lộ trình chủ đề</h2>
    <div class="grid topics">
      ${TOPICS.map((t, i) => topicTile(t, i)).join('')}
    </div>
  </section>`;
};

function topicTile(t, i) {
  const ids = topicItems(t).map(x => x.id);
  return `<a class="card topic" href="#/topic/${t.id}">
    <div class="t-head"><span class="t-emoji">${t.emoji}</span><div><small>Bài ${i + 1} · ${t.level}</small><b>${esc(t.vi)}</b></div></div>
    <div class="t-bars">${active().map(l => { const s = langStats(l.code, ids); return `<div class="t-bar"><span>${l.flag}</span>${bar(s.learned, s.total)}</div>`; }).join('')}</div>
  </a>`;
}

function nextTopic() {
  for (const t of TOPICS) {
    const ids = topicItems(t).map(x => x.id);
    const done = active().every(l => langStats(l.code, ids).learned >= ids.length * 0.7);
    if (!done) return t;
  }
  return TOPICS[TOPICS.length - 1];
}

VIEWS.topic = id => {
  const t = topicById(id);
  if (!t) return VIEWS.home();
  const idx = TOPICS.indexOf(t);
  return `
  <nav class="crumbs"><a href="#/">← Trang chủ</a></nav>
  <section class="topic-head card">
    <span class="t-emoji xl">${t.emoji}</span>
    <div><small>Bài ${idx + 1} · ${t.level}</small><h1>${esc(t.vi)}</h1>
      <p>${t.words.length} từ vựng · ${t.phrases.length} mẫu câu${t.dialogue ? ' · 1 hội thoại' : ''}</p></div>
    <div class="actions">
      <a class="btn primary" href="#/learn/${t.id}">📖 Học thẻ</a>
      <a class="btn" href="#/quiz/${t.id}">🎯 Luyện tập</a>
      ${t.dialogue ? `<a class="btn" href="#/dialogue/${t.id}">💬 Hội thoại</a>` : ''}
    </div>
  </section>
  <p class="hint">Chạm 🔊 để nghe, chạm vào thẻ để xem ảnh lớn, GIF, video và luyện nói.</p>
  ${t.words.length ? `<h2>Từ vựng</h2><div class="grid items">${t.words.map(itemCard).join('')}</div>` : ''}
  ${t.phrases.length ? `<h2>Mẫu câu</h2><div class="grid items phrases">${t.phrases.map(itemCard).join('')}</div>` : ''}
  <div class="pager">
    ${idx > 0 ? `<a class="btn" href="#/topic/${TOPICS[idx - 1].id}">← ${esc(TOPICS[idx - 1].vi)}</a>` : '<span></span>'}
    ${idx < TOPICS.length - 1 ? `<a class="btn" href="#/topic/${TOPICS[idx + 1].id}">${esc(TOPICS[idx + 1].vi)} →</a>` : ''}
  </div>`;
};

// ----- Chi tiết một mục (hộp thoại) -----
function openItem(key) {
  const it = entry(key);
  if (!it) return;
  const dlg = $('#modal');
  dlg.innerHTML = `<div class="sheet">
    <button class="icon close" data-act="close" aria-label="Đóng">✕</button>
    ${media(it, 'big')}
    <h2 class="vi">${esc(it.vi)}</h2>
    <div class="rows">${active().map(l => langRow(key, it, l, { mic: true, yg: true })).join('')}</div>
    <div class="mic-result" id="micres"></div>
    <div class="row-actions">
      <button class="btn" data-act="say-all" data-key="${key}">🔊 Nghe tất cả</button>
      <button class="btn" data-act="gif" data-key="${key}">🎞️ GIF minh họa</button>
      <button class="btn" data-act="video" data-key="${key}">🎥 Video minh họa</button>
    </div>
    <div id="extra"></div>
    <p class="fine">🎬 mở YouGlish: video thật trên YouTube có người bản xứ nói từ này. GIF/video lấy từ Wikimedia Commons theo từ khóa tiếng Anh, có thể chưa sát nghĩa.</p>
  </div>`;
  dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
  hydrate(dlg);
  markSeen(key);
  if (S().autoplay) sayAll(key);
}

async function showCommons(key, kind) {
  const it = entry(key);
  const box = $('#extra');
  box.innerHTML = '<p class="muted">Đang tìm trên Wikimedia Commons…</p>';
  const term = it.wp || it.en.t.replace(/^to /, '');
  const list = await commonsMedia(term, kind);
  if (!list.length) { box.innerHTML = '<p class="muted">Chưa tìm thấy. Hãy thử nút 🎬 YouGlish ở từng ngôn ngữ.</p>'; return; }
  box.innerHTML = `<div class="gallery">${list.map(m => kind === 'video'
    ? `<figure><video controls preload="none" playsinline ${m.poster ? `poster="${m.poster}"` : ''}><source src="${m.src}" ${m.type ? `type="${esc(m.type.split(';')[0])}"` : ''}></video><figcaption><a href="${m.href}" target="_blank" rel="noopener">${esc(m.title)}</a> ${esc(m.credit)}</figcaption></figure>`
    : `<figure><img src="${m.src}" alt="${esc(m.title)}" loading="lazy"><figcaption><a href="${m.href}" target="_blank" rel="noopener">${esc(m.title)}</a> ${esc(m.credit)}</figcaption></figure>`).join('')}</div>`;
}

async function practiceMic(key, code, outEl) {
  const e = entry(key);
  const out = outEl || $('#micres');
  if (!out) return null;
  out.innerHTML = `<span class="pulse">🎤</span> Hãy nói bằng ${LANG[code].name}: <b>${esc(e[code].t)}</b>`;
  try {
    const heard = await listen(code);
    const targets = [e[code].t, e[code].k, e[code].t.replace(/^(le|la|les|l'|el|los|las|un|une|to)\s*/i, '')].filter(Boolean);
    const score = similarity(heard, targets, code);
    const pct = Math.round(score * 100);
    out.innerHTML = heard.length
      ? `Máy nghe được: <b>${esc(heard[0])}</b> → <span class="${score >= 0.75 ? 'ok' : 'bad'}">${pct}% ${score >= 0.75 ? '✅ Tốt lắm!' : '🔁 Thử lại nhé'}</span>`
      : 'Không nghe rõ, hãy thử lại gần micro hơn.';
    return heard.length ? score : null;
  } catch (err) {
    out.innerHTML = err.message === 'not-allowed' ? 'Hãy cho phép dùng micro để luyện nói.' : 'Không nhận diện được giọng nói trên trình duyệt này (nên dùng Chrome hoặc Safari).';
    return null;
  }
}

// ----- Học thẻ -----
let learn = null;
VIEWS.learn = id => {
  const t = topicById(id);
  if (!t) return VIEWS.home();
  learn = { t, items: topicItems(t), i: 0, shown: false };
  return `<nav class="crumbs"><a href="#/topic/${t.id}">← ${esc(t.vi)}</a></nav><div id="learn"></div>`;
};
AFTER.learn = () => drawLearn();
function drawLearn() {
  const { t, items, i, shown } = learn;
  const box = $('#learn');
  if (i >= items.length) {
    box.innerHTML = `<section class="card done"><div class="big-emoji">🎉</div><h2>Xong ${items.length} thẻ!</h2>
      <p>Giờ hãy luyện tập để ghi nhớ lâu.</p><a class="btn primary" href="#/quiz/${t.id}">🎯 Luyện tập ngay</a></section>`;
    return;
  }
  const it = items[i];
  box.innerHTML = `<div class="progress-top">${bar(i, items.length)}<span>${i + 1}/${items.length}</span></div>
  <section class="card flash">
    ${media(it, 'big')}
    <h2 class="vi">${esc(it.vi)}</h2>
    ${shown ? `<div class="rows">${active().map(l => langRow(it.id, it, l, { mic: true, yg: true })).join('')}</div><div class="mic-result" id="micres"></div>`
      : `<button class="btn primary wide" data-act="reveal">👀 Xem & nghe ${active().length} ngôn ngữ</button>`}
  </section>
  <div class="pager">
    <button class="btn" data-act="learn-prev" ${i === 0 ? 'disabled' : ''}>← Trước</button>
    ${shown ? `<button class="btn" data-act="say-all" data-key="${it.id}">🔊 Nghe lại</button>` : ''}
    <button class="btn primary" data-act="learn-next">Tiếp →</button>
  </div>`;
  hydrate(box);
  if (shown) { markSeen(it.id); if (S().autoplay) sayAll(it.id); }
}

// ----- Luyện tập & ôn tập -----
let quiz = null;

function dueList() {
  const now = Date.now();
  const out = [];
  for (const l of active()) for (const [id, r] of Object.entries(state.progress[l.code] || {})) {
    if (ITEMS[id] && r.d <= now) out.push({ id, lang: l.code, d: r.d });
  }
  return out.sort((a, b) => a.d - b.d);
}

function distractors(it, n, sameTopicFirst = true) {
  const same = topicItems(topicById(it.topic)).filter(x => x.id !== it.id && x.kind === it.kind);
  const others = Object.values(ITEMS).filter(x => x.id !== it.id && x.kind === it.kind && x.topic !== it.topic);
  const pool = sameTopicFirst ? [...shuffle(same), ...shuffle(others)] : shuffle([...same, ...others]);
  const seen = new Set([it.vi]);
  const res = [];
  for (const x of pool) { if (seen.has(x.vi)) continue; seen.add(x.vi); res.push(x); if (res.length >= n) break; }
  return res;
}

function makeQuestion(it, lang) {
  const types = ['pick', 'read'];
  if (ttsSupported() && hasVoice(lang)) types.push('listen', 'listen');
  if (active().length > 1) types.push('cross');
  if (srSupported() && Math.random() < 0.25) types.push('speak');
  const type = pick(types);
  const opts = shuffle([it, ...distractors(it, 3)]);
  const q = { type, it, lang, opts };
  if (type === 'cross') q.from = pick(active().filter(l => l.code !== lang)).code;
  return q;
}

function buildQuiz(pairs, title, back) {
  const qs = pairs.map(({ id, lang }) => makeQuestion(ITEMS[id], lang));
  quiz = { qs, i: 0, right: 0, title, back, answered: false };
}

VIEWS.quiz = id => {
  const t = topicById(id);
  if (!t) return VIEWS.home();
  const its = topicItems(t);
  // ưu tiên mục chưa thuộc
  const pairs = [];
  for (const it of its) for (const l of active()) pairs.push({ id: it.id, lang: l.code, b: rec(l.code, it.id)?.b ?? -1 });
  const sorted = shuffle(pairs).sort((a, b) => a.b - b.b);
  buildQuiz(shuffle(sorted.slice(0, 15)), t.vi, `#/topic/${t.id}`);
  return `<nav class="crumbs"><a href="#/topic/${t.id}">← ${esc(t.vi)}</a></nav><div id="quiz"></div>`;
};
AFTER.quiz = () => drawQuiz();

VIEWS.review = () => {
  const due = dueList();
  if (!due.length) {
    const learnedAny = active().some(l => Object.keys(state.progress[l.code] || {}).length);
    return `<section class="card done"><div class="big-emoji">✅</div><h2>Không có gì cần ôn lúc này</h2>
      <p>${learnedAny ? 'Bạn đã ôn hết. Quay lại sau nhé, app sẽ nhắc từ sắp quên.' : 'Hãy học một chủ đề trước, sau đó các từ sẽ xuất hiện ở đây đúng lúc cần ôn.'}</p>
      <a class="btn primary" href="#/topic/${nextTopic().id}">▶️ Học: ${esc(nextTopic().vi)}</a></section>`;
  }
  buildQuiz(shuffle(due.slice(0, 20)), 'Ôn tập', '#/');
  return `<nav class="crumbs"><a href="#/">← Trang chủ</a></nav><div id="quiz"></div>`;
};
AFTER.review = () => { if (quiz && $('#quiz')) drawQuiz(); };

function optLabel(o, mode, lang) {
  if (mode === 'vi') return `<span><span class="oe">${o.emoji}</span> ${esc(o.vi)}</span>`;
  const rom = romanization(o, lang, S());
  return `<span lang="${LANG[lang].bcp}">${esc(o[lang].t)}</span>${rom ? `<small>${esc(rom)}</small>` : ''}`;
}

function drawQuiz() {
  const box = $('#quiz');
  if (!box) return;
  const { qs, i } = quiz;
  if (i >= qs.length) {
    const pct = Math.round(quiz.right / qs.length * 100);
    box.innerHTML = `<section class="card done"><div class="big-emoji">${pct >= 80 ? '🏆' : pct >= 50 ? '💪' : '🌱'}</div>
      <h2>Đúng ${quiz.right}/${qs.length} câu</h2><p>${pct >= 80 ? 'Xuất sắc!' : 'Các từ sai sẽ quay lại trong phần Ôn tập sau ít phút.'}</p>
      <div class="actions"><a class="btn" href="${quiz.back}">Quay lại</a><button class="btn primary" data-act="quiz-again">🔁 Làm lượt mới</button></div></section>`;
    return;
  }
  const q = qs[i];
  const L = LANG[q.lang];
  const it = q.it;
  let prompt = '', options = '';
  const ans = (o, mode, lang) => `<button class="opt" data-act="ans" data-id="${o.id}">${optLabel(o, mode, lang)}</button>`;
  switch (q.type) {
    case 'pick':
      prompt = `<p class="qlabel">Chọn từ ${L.name} ${L.flag} đúng nghĩa:</p>${media(it, 'big')}<h2 class="vi">${esc(it.vi)}</h2>`;
      options = q.opts.map(o => ans(o, 'lang', q.lang)).join('');
      break;
    case 'read': {
      const rom = romanization(it, q.lang, S());
      prompt = `<p class="qlabel">${L.flag} Câu này nghĩa là gì?</p><div class="qtext" lang="${L.bcp}">${esc(it[q.lang].t)}${rom ? `<small>${esc(rom)}</small>` : ''}</div>`;
      options = q.opts.map(o => ans(o, 'vi')).join('');
      break;
    }
    case 'listen':
      prompt = `<p class="qlabel">${L.flag} Nghe và chọn nghĩa đúng:</p><button class="btn big-say" data-act="say" data-key="${it.id}" data-lang="${q.lang}">🔊 Nghe</button>`;
      options = q.opts.map(o => ans(o, 'vi')).join('');
      break;
    case 'cross': {
      const F = LANG[q.from];
      const rom = romanization(it, q.from, S());
      prompt = `<p class="qlabel">${F.flag} → ${L.flag} Cùng nghĩa trong ${L.name} là gì?</p><div class="qtext" lang="${F.bcp}">${esc(it[q.from].t)}${rom ? `<small>${esc(rom)}</small>` : ''}</div>`;
      options = q.opts.map(o => ans(o, 'lang', q.lang)).join('');
      break;
    }
    case 'speak':
      prompt = `<p class="qlabel">${L.flag} Đọc to câu này:</p>${media(it)}<h2 class="vi">${esc(it.vi)}</h2>
        <div class="rows">${langRow(it.id, it, L)}</div>`;
      options = `<button class="btn primary wide" data-act="speak-ans">🎤 Bấm rồi nói</button><div class="mic-result" id="micres"></div><button class="btn ghost" data-act="skip">Bỏ qua (không có micro)</button>`;
      break;
  }
  box.innerHTML = `<div class="progress-top">${bar(i, qs.length)}<span>${i + 1}/${qs.length}</span></div>
    <section class="card quiz">${prompt}<div class="opts ${q.type === 'speak' ? 'single' : ''}">${options}</div><div id="feedback"></div></section>`;
  quiz.answered = false;
  hydrate(box);
  if (q.type === 'listen' && S().autoplay) say(it.id, q.lang);
  if (q.type === 'cross' && S().autoplay) say(it.id, q.from);
}

function finishAnswer(correct) {
  const q = quiz.qs[quiz.i];
  quiz.answered = true;
  if (correct) quiz.right++;
  answer(q.lang, q.it.id, correct);
  const L = LANG[q.lang];
  const rom = romanization(q.it, q.lang, S());
  $('#feedback').innerHTML = `<div class="fb ${correct ? 'fb-ok' : 'fb-bad'}">
    <b>${correct ? '✅ Chính xác!' : '❌ Chưa đúng'}</b>
    <div>${q.it.emoji} ${esc(q.it.vi)} = ${L.flag} <b lang="${L.bcp}">${esc(q.it[q.lang].t)}</b> ${rom ? `<small>${esc(rom)}</small>` : ''}
    <button class="icon" data-act="say" data-key="${q.it.id}" data-lang="${q.lang}">🔊</button></div>
    <button class="btn primary" data-act="next">Tiếp →</button></div>`;
  say(q.it.id, q.lang);
  $('#feedback [data-act="next"]').focus({ preventScroll: true });
  $('#feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ----- Hội thoại -----
let dlgLang = 'all', dlgVi = true;
VIEWS.dialogue = id => {
  const t = topicById(id);
  if (!t?.dialogue) return VIEWS.home();
  const langs = dlgLang === 'all' ? active() : [LANG[dlgLang]];
  const speakers = [...new Set(t.dialogue.lines.map(l => l.who))];
  return `<nav class="crumbs"><a href="#/topic/${t.id}">← ${esc(t.vi)}</a></nav>
  <section class="card">
    <h1>💬 ${esc(t.dialogue.title)}</h1>
    <div class="tabs">
      <button class="chip ${dlgLang === 'all' ? 'on' : ''}" data-act="dlg-lang" data-lang="all">Tất cả</button>
      ${active().map(l => `<button class="chip ${dlgLang === l.code ? 'on' : ''}" data-act="dlg-lang" data-lang="${l.code}">${l.flag} ${l.short}</button>`).join('')}
      <label class="toggle"><input type="checkbox" data-act="dlg-vi" ${dlgVi ? 'checked' : ''}> Hiện tiếng Việt</label>
    </div>
    ${dlgLang !== 'all' ? `<button class="btn" data-act="dlg-play" data-topic="${t.id}">▶️ Nghe cả bài</button>` : '<p class="hint">Chọn một ngôn ngữ để nghe cả bài liền mạch.</p>'}
  </section>
  <div class="dialogue">
    ${t.dialogue.lines.map((line, i) => `<div class="bubble ${speakers.indexOf(line.who) % 2 ? 'right' : 'left'}" data-line="${i}">
      <div class="who">${esc(line.who)}</div>
      ${langs.map(l => langRow(`dlg:${t.id}:${i}`, line, l)).join('')}
      ${dlgVi ? `<div class="vi-line">🇻🇳 ${esc(line.vi)}</div>` : ''}
    </div>`).join('')}
  </div>
  <a class="btn primary" href="#/quiz/${t.id}">🎯 Luyện tập chủ đề này</a>`;
};
async function playDialogue(tid) {
  const t = topicById(tid);
  for (let i = 0; i < t.dialogue.lines.length; i++) {
    if (route.name !== 'dialogue') return;
    const el = $(`[data-line="${i}"]`);
    el?.classList.add('now'); el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await say(`dlg:${tid}:${i}`, dlgLang);
    el?.classList.remove('now');
    await new Promise(r => setTimeout(r, 400));
  }
  addXp(3);
}

// ----- Chữ viết & phát âm -----
let kanaSet = 'hiragana';
VIEWS.scripts = (lang = 'ja') => {
  const tabs = `<div class="tabs">${LANGS.map(l => `<a class="chip ${lang === l.code ? 'on' : ''}" href="#/scripts/${l.code}">${l.flag} ${l.short}</a>`).join('')}</div>`;
  let body = '';
  const notes = arr => `<ul class="notes">${arr.map(n => `<li>${esc(n)}</li>`).join('')}</ul>`;
  if (lang === 'ja') {
    const tbl = rows => `<div class="kana">${rows.map(r => r.map(c => c ? `<button class="kc" data-act="say-raw" data-text="${c.c}" data-lang="ja"><b>${c.c}</b><small>${c.r}</small></button>` : '<span></span>').join('')).join('')}</div>`;
    const K = KANA[kanaSet];
    body = `${notes(JA_NOTES)}
      <div class="tabs"><button class="chip ${kanaSet === 'hiragana' ? 'on' : ''}" data-act="kana-set" data-set="hiragana">ひらがな Hiragana</button>
      <button class="chip ${kanaSet === 'katakana' ? 'on' : ''}" data-act="kana-set" data-set="katakana">カタカナ Katakana</button></div>
      <h3>Bảng cơ bản</h3>${tbl(K.basic)}<h3>Âm đục (゛) và bán đục (゜)</h3>${tbl(K.dakuten)}
      <div class="drill card" id="drill"><button class="btn primary" data-act="kana-drill">🎯 Luyện nhận mặt chữ ${kanaSet === 'hiragana' ? 'Hiragana' : 'Katakana'}</button></div>`;
  } else if (lang === 'zh') {
    body = `${notes(ZH_NOTES)}
      <h3>Thanh điệu</h3><div class="tones">${ZH_TONES.map(t => `<button class="card tone" data-act="say-raw" data-text="${t.zh}" data-lang="zh"><b>${t.mark}</b><span>${t.zh} · ${esc(t.vi)}</span><small>${esc(t.tone)}</small><em>${esc(t.tip)}</em></button>`).join('')}</div>
      <div class="drill card" id="drill"><button class="btn primary" data-act="tone-drill">🎯 Luyện nghe thanh điệu</button></div>
      <h3>Phụ âm đầu (thanh mẫu)</h3><div class="ptable">${ZH_INITIALS.map(([p, c, py, tip]) => `<button class="pc" data-act="say-raw" data-text="${c}" data-lang="zh"><b>${p}</b><span>${c} ${py}</span><small>${esc(tip)}</small></button>`).join('')}</div>
      <h3>Vần (vận mẫu)</h3><div class="ptable small">${ZH_FINALS.map(([p, c, py]) => `<button class="pc" data-act="say-raw" data-text="${c}" data-lang="zh"><b>${p}</b><span>${c} ${py}</span></button>`).join('')}</div>
      <h3>Chữ Hán đầu tiên (bộ thủ)</h3><div class="ptable">${ZH_RADICALS.map(([c, py, vi, em]) => `<button class="pc" data-act="say-raw" data-text="${c}" data-lang="zh"><b class="han">${c}</b><span>${py} · ${esc(vi)}</span><small>${em}</small></button>`).join('')}</div>`;
  } else {
    const d = LATIN[lang];
    body = `${notes(d.notes)}
      <h3>Bảng chữ cái</h3><div class="alpha">${[...d.alphabet].map(c => `<button class="kc" data-act="say-raw" data-text="${c}" data-lang="${lang}"><b>${c}${c.toLowerCase()}</b></button>`).join('')}</div>
      <h3>Âm khó cho người Việt</h3><div class="ptable wide">${d.sounds.map(([s, ex, tip]) => `<div class="pc"><b>${esc(s)}</b><span>${ex.split(/[,–]/).map(w => w.trim()).filter(Boolean).map(w => `<button class="link" data-act="say-raw" data-text="${esc(w)}" data-lang="${lang}">🔊 ${esc(w)}</button>`).join(' ')}</span><small>${esc(tip)}</small></div>`).join('')}</div>`;
  }
  return `<nav class="crumbs"><a href="#/">← Trang chủ</a></nav><h1>🔤 Chữ viết & phát âm</h1>${tabs}<section class="card">${body}</section>`;
};

function drill(kind) {
  const box = $('#drill');
  let q;
  if (kind === 'kana') {
    const all = [...KANA[kanaSet].basic, ...KANA[kanaSet].dakuten].flat().filter(Boolean);
    const target = pick(all);
    const opts = shuffle([target, ...shuffle(all.filter(x => x.r !== target.r)).slice(0, 3)]);
    q = { prompt: `<div class="qtext big">${target.c}</div>`, opts: opts.map(o => ({ label: o.r, ok: o === target })), say: target.c, lang: 'ja' };
  } else {
    const target = pick(ZH_TONES.slice(0, 4));
    q = { prompt: `<button class="btn big-say" data-act="say-raw" data-text="${target.zh}" data-lang="zh">🔊 Nghe</button>`, opts: ZH_TONES.slice(0, 4).map(t => ({ label: t.mark + ' · ' + t.tone, ok: t === target })), say: target.zh, lang: 'zh', auto: true };
  }
  box.innerHTML = `${q.prompt}<div class="opts">${q.opts.map((o, i) => `<button class="opt" data-act="drill-ans" data-i="${i}">${esc(o.label)}</button>`).join('')}</div><div class="drill-fb"></div>`;
  box._q = q; box._kind = kind;
  if (q.auto) speak(q.say, q.lang, S().rate);
}

// ----- Tiến độ -----
VIEWS.progress = () => {
  const days = [];
  const d = new Date();
  for (let i = 13; i >= 0; i--) { const x = new Date(d); x.setDate(d.getDate() - i); days.push(x.toLocaleDateString('sv-SE')); }
  const max = Math.max(S().dailyGoal, ...days.map(k => state.days[k] || 0));
  return `<h1>📊 Tiến độ</h1>
  <section class="grid statgrid">
    ${LANGS.map(l => { const s = langStats(l.code, ALL_IDS); return `<div class="card stat">
      <div class="st-head"><span class="flag">${l.flag}</span><b>${l.name}</b></div>
      ${bar(s.learned, s.total)}
      <p><b>${s.learned}</b>/${s.total} đã nhớ · <b>${s.mastered}</b> thuộc lâu · <b>${s.due}</b> cần ôn</p>
    </div>`; }).join('')}
  </section>
  <section class="card">
    <h2>14 ngày gần nhất</h2>
    <div class="chart">${days.map(k => { const v = state.days[k] || 0; return `<div class="col" title="${k}: ${v} điểm"><i style="height:${Math.round(v / max * 100)}%" class="${v >= S().dailyGoal ? 'met' : ''}"></i><small>${k.slice(8)}</small></div>`; }).join('')}</div>
    <p class="muted">🔥 Chuỗi hiện tại: ${streak()} ngày · Mục tiêu: ${S().dailyGoal} điểm/ngày</p>
  </section>`;
};

// ----- Cài đặt -----
VIEWS.settings = () => {
  const s = S();
  const voiceRows = LANGS.map(l => `<li>${l.flag} ${l.name}: ${hasVoice(l.code) ? '✅ có giọng đọc' : '⚠️ chưa có giọng đọc trên máy này'}</li>`).join('');
  return `<h1>⚙️ Cài đặt</h1>
  <section class="card">
    <h2>☁️ Đồng bộ giữa các thiết bị</h2>
    ${!syncAvailable ? `<p>Chưa bật đồng bộ. Tiến độ đang lưu trên máy này. Khi có cấu hình Firebase, bạn đăng nhập một lần trên mỗi thiết bị là tiến độ tự đồng bộ ngay lập tức.</p>`
      : sync.user ? `<p>Đã đăng nhập: <b>${esc(sync.user.name || sync.user.email)}</b> · ${esc(sync.status)}</p><button class="btn" data-act="logout">Đăng xuất</button>`
      : `<p>Đăng nhập để đồng bộ tiến độ theo thời gian thực giữa điện thoại, iPad và laptop.</p>
        <button class="btn primary" data-act="login-google">Đăng nhập bằng Google</button>
        <form class="login" data-form="email"><input type="email" name="email" placeholder="Email" required autocomplete="email"><input type="password" name="pass" placeholder="Mật khẩu (≥ 6 ký tự)" required minlength="6" autocomplete="current-password">
        <button class="btn" type="submit">Đăng nhập</button><button class="btn ghost" type="submit" name="create" value="1">Tạo tài khoản</button></form>`}
    ${sync.error ? `<p class="bad">${esc(sync.error)}</p>` : ''}
  </section>
  <section class="card">
    <h2>Ngôn ngữ đang học</h2>
    <div class="checks">${LANGS.map(l => `<label><input type="checkbox" data-act="set-lang" value="${l.code}" ${s.langs.includes(l.code) ? 'checked' : ''}> ${l.flag} ${l.name}</label>`).join('')}</div>
    <p class="muted">Có thể bật/tắt nhanh bằng các nút cờ ở đầu trang. Tiến độ mỗi ngôn ngữ được giữ riêng.</p>
  </section>
  <section class="card">
    <h2>Hiển thị & âm thanh</h2>
    <div class="checks">
      <label><input type="checkbox" data-set="pinyin" ${s.pinyin ? 'checked' : ''}> Hiện Pinyin (tiếng Trung)</label>
      <label><input type="checkbox" data-set="kana" ${s.kana ? 'checked' : ''}> Hiện Kana (tiếng Nhật)</label>
      <label><input type="checkbox" data-set="romaji" ${s.romaji ? 'checked' : ''}> Hiện Romaji (tiếng Nhật)</label>
      <label><input type="checkbox" data-set="autoplay" ${s.autoplay ? 'checked' : ''}> Tự động phát âm</label>
    </div>
    <label class="range">Tốc độ đọc: <input type="range" min="0.5" max="1.2" step="0.1" value="${s.rate}" data-set-num="rate"> <span>${s.rate}×</span></label>
    <label class="range">Mục tiêu mỗi ngày: <input type="range" min="10" max="150" step="10" value="${s.dailyGoal}" data-set-num="dailyGoal"> <span>${s.dailyGoal} điểm</span></label>
    <h3>Giọng đọc trên thiết bị này</h3><ul class="voices">${voiceRows}</ul>
    <p class="muted">Thiếu giọng đọc? Trên iPhone/iPad: Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói. Trên Android: cài "Dịch vụ nói của Google". Trên Windows: Cài đặt → Thời gian & ngôn ngữ → Giọng nói.</p>
  </section>
  <section class="card">
    <h2>Nguồn dữ liệu</h2>
    <ul class="notes">
      <li>Từ vựng, mẫu câu, hội thoại: biên soạn cho app, bám theo chủ đề CEFR A1–A2 / HSK 1–3 / JLPT N5–N4.</li>
      <li>Ảnh minh họa: <a href="https://www.wikipedia.org" target="_blank" rel="noopener">Wikipedia</a> & <a href="https://commons.wikimedia.org" target="_blank" rel="noopener">Wikimedia Commons</a> (giấy phép mở, ghi nguồn trên từng ảnh).</li>
      <li>GIF & video: Wikimedia Commons; video người bản xứ phát âm: <a href="https://youglish.com" target="_blank" rel="noopener">YouGlish</a>.</li>
      <li>Biểu tượng cảm xúc: emoji hệ thống. Giọng đọc & nhận diện giọng nói: Web Speech API của trình duyệt.</li>
    </ul>
  </section>
  <section class="card">
    <h2>Dữ liệu</h2>
    <button class="btn danger" data-act="reset">Xóa tiến độ trên máy này</button>
  </section>`;
};

// ---------------- Xử lý sự kiện ----------------
document.addEventListener('click', async ev => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  if (el.tagName === 'INPUT') return; // xử lý ở change
  const key = el.dataset.key;
  switch (act) {
    case 'say': ev.stopPropagation(); say(key, el.dataset.lang); break;
    case 'say-raw': speak(el.dataset.text, el.dataset.lang, S().rate); break;
    case 'say-all': sayAll(key); break;
    case 'open': if (!ev.target.closest('button,a')) openItem(key); break;
    case 'close': closeModal(); break;
    case 'mic': ev.stopPropagation(); {
      let out = $('#micres');
      if (!out) { el.closest('.lrow').insertAdjacentHTML('afterend', '<div class="mic-result" id="micres"></div>'); out = $('#micres'); }
      const sc = await practiceMic(key, el.dataset.lang, out);
      if (sc != null && sc >= 0.75 && ITEMS[key]) addXp(1);
    } break;
    case 'gif': showCommons(key, 'gif'); break;
    case 'video': showCommons(key, 'video'); break;
    case 'toggle-lang': {
      const c = el.dataset.lang;
      let langs = S().langs.includes(c) ? S().langs.filter(x => x !== c) : [...S().langs, c];
      if (!langs.length) return;
      langs = LANGS.map(l => l.code).filter(x => langs.includes(x));
      setSettings({ langs });
      if (!['quiz', 'review'].includes(route.name)) render(); else header();
    } break;
    case 'reveal': learn.shown = true; drawLearn(); break;
    case 'learn-next': learn.i++; learn.shown = false; drawLearn(); window.scrollTo(0, 0); break;
    case 'learn-prev': learn.i = Math.max(0, learn.i - 1); learn.shown = false; drawLearn(); break;
    case 'ans': {
      if (quiz.answered) return;
      const q = quiz.qs[quiz.i];
      const ok = el.dataset.id === q.it.id;
      $$('.opt', el.parentElement).forEach(b => { b.disabled = true; if (b.dataset.id === q.it.id) b.classList.add('right'); });
      if (!ok) el.classList.add('wrong');
      finishAnswer(ok);
    } break;
    case 'speak-ans': {
      if (quiz.answered) return;
      const q = quiz.qs[quiz.i];
      const sc = await practiceMic(q.it.id, q.lang, $('#micres'));
      if (sc != null) finishAnswer(sc >= 0.75);
    } break;
    case 'skip': quiz.i++; drawQuiz(); break;
    case 'next': quiz.i++; drawQuiz(); window.scrollTo(0, 0); break;
    case 'quiz-again': render(); break;
    case 'dlg-lang': dlgLang = el.dataset.lang; render(); break;
    case 'dlg-play': playDialogue(el.dataset.topic); break;
    case 'kana-set': kanaSet = el.dataset.set; render(); break;
    case 'kana-drill': drill('kana'); break;
    case 'tone-drill': drill('tone'); break;
    case 'drill-ans': {
      const box = $('#drill');
      const q = box._q;
      const o = q.opts[+el.dataset.i];
      $$('.opt', box).forEach((b, i) => { b.disabled = true; if (q.opts[i].ok) b.classList.add('right'); });
      if (!o.ok) el.classList.add('wrong'); else addXp(1);
      speak(q.say, q.lang, S().rate);
      $('.drill-fb', box).innerHTML = `<button class="btn primary" data-act="${box._kind}-drill">Tiếp →</button>`;
    } break;
    case 'login-google': try { await signInGoogle(); } catch (e) { sync.error = e.message; render(); } break;
    case 'logout': await signOut(); render(); break;
    case 'reset':
      if (el.dataset.confirm) resetAll();
      else { el.dataset.confirm = 1; el.textContent = 'Bấm lần nữa để xóa hẳn'; }
      break;
  }
});

document.addEventListener('change', ev => {
  const el = ev.target;
  if (el.dataset.act === 'set-lang') {
    const langs = $$('[data-act="set-lang"]').filter(x => x.checked).map(x => x.value);
    if (!langs.length) { el.checked = true; return; }
    setSettings({ langs }); header();
  } else if (el.dataset.act === 'dlg-vi') { dlgVi = el.checked; render(); }
  else if (el.dataset.set) { setSettings({ [el.dataset.set]: el.checked }); }
});
document.addEventListener('input', ev => {
  const el = ev.target;
  if (el.dataset.setNum) {
    setSettings({ [el.dataset.setNum]: +el.value });
    el.nextElementSibling.textContent = el.dataset.setNum === 'rate' ? `${el.value}×` : `${el.value} điểm`;
  }
});
document.addEventListener('submit', async ev => {
  const f = ev.target;
  if (f.dataset.form !== 'email') return;
  ev.preventDefault();
  const create = ev.submitter?.name === 'create';
  try { await signInEmail(f.email.value, f.pass.value, create); sync.error = ''; }
  catch (e) { sync.error = e.message; }
  render();
});

function closeModal() {
  const dlg = $('#modal');
  speechSynthesis?.cancel?.();
  dlg.close ? dlg.close() : dlg.removeAttribute('open');
}
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
$('#modal').addEventListener('close', () => { if (route.name === 'topic') { const y = scrollY; render(); scrollTo(0, y); } });

document.addEventListener('keydown', e => {
  if (!quiz || !['quiz', 'review'].includes(route.name) || $('#modal').open) return;
  if (/^[1-4]$/.test(e.key) && !quiz.answered) $$('#quiz .opt')[+e.key - 1]?.click();
  if (e.key === 'Enter' && quiz.answered) $('#quiz [data-act="next"]')?.click();
});

onChange(source => {
  header();
  if (source === 'remote' && ['home', 'progress', 'settings', 'topic'].includes(route.name) && !$('#modal').open) render();
});
onSync(() => { header(); if (route.name === 'settings') render(); });

window.addEventListener('hashchange', render);
render();
initSync();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
