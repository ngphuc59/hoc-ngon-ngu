// Lưu tiến độ trên máy (localStorage) + báo thay đổi cho phần đồng bộ.
import { LANGS } from './langs.js';

const KEY = 'hnn.v1';
const DAY = 86400000;
// Khoảng ôn lại theo "hộp" (Leitner): hộp càng cao, càng lâu mới ôn
const INTERVALS = [0, 1, 2, 4, 8, 16, 35, 80]; // ngày

export const DEFAULT_SETTINGS = {
  langs: LANGS.map(l => l.code),
  rate: 0.9,
  pinyin: true,
  kana: true,
  romaji: true,
  autoplay: true,
  dailyGoal: 30,
};

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return {
      settings: { ...DEFAULT_SETTINGS, ...(raw.settings || {}) },
      settingsU: raw.settingsU || 0,
      progress: raw.progress || {},   // { lang: { itemId: { b, d, n, c, u } } }
      days: raw.days || {},           // { 'YYYY-MM-DD': xp }
      seen: raw.seen || {},           // { itemId: u } đã xem qua thẻ học
    };
  } catch {
    return { settings: { ...DEFAULT_SETTINGS }, settingsU: 0, progress: {}, days: {}, seen: {} };
  }
}

export const state = load();
const listeners = new Set();
export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

let saveTimer;
// dirty: những gì cần đẩy lên máy chủ
export const dirty = { items: {}, settings: false, days: {}, seen: {} };

function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* đầy bộ nhớ */ }
  }, 150);
}
export function emit(source = 'local') {
  persist();
  for (const fn of listeners) fn(source);
}

export const today = () => new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD theo giờ máy

export function setSettings(patch) {
  Object.assign(state.settings, patch);
  state.settingsU = Date.now();
  dirty.settings = true;
  emit();
}

export function rec(lang, id) { return state.progress[lang]?.[id]; }

export function isDue(r, now = Date.now()) { return r && r.d <= now; }

// Ghi kết quả một lần trả lời
export function answer(lang, id, correct) {
  const now = Date.now();
  const p = (state.progress[lang] ||= {});
  const r = p[id] || { b: 0, d: now, n: 0, c: 0, u: 0 };
  r.n += 1;
  if (correct) {
    r.c += 1;
    r.b = Math.min(r.b + 1, INTERVALS.length - 1);
    r.d = now + INTERVALS[r.b] * DAY - 3600000; // trừ 1 giờ để ôn được vào cùng giờ hôm sau
  } else {
    r.b = Math.floor(r.b / 2);
    r.d = now + 10 * 60000; // ôn lại sau 10 phút
  }
  r.u = now;
  p[id] = r;
  (dirty.items[lang] ||= {})[id] = true;
  addXp(correct ? 2 : 1);
  return r;
}

export function markSeen(id) {
  const now = Date.now();
  state.seen[id] = now;
  dirty.seen[id] = true;
  emit();
}

export function addXp(n) {
  const d = today();
  state.days[d] = (state.days[d] || 0) + n;
  dirty.days[d] = true;
  emit();
}

export function streak() {
  let s = 0;
  const d = new Date();
  if (!state.days[today()]) d.setDate(d.getDate() - 1); // chưa học hôm nay vẫn giữ chuỗi
  while (state.days[d.toLocaleDateString('sv-SE')]) { s++; d.setDate(d.getDate() - 1); }
  return s;
}

export function langStats(lang, ids) {
  const p = state.progress[lang] || {};
  let learned = 0, mastered = 0, due = 0;
  const now = Date.now();
  for (const id of ids) {
    const r = p[id];
    if (!r) continue;
    if (r.b >= 1) learned++;
    if (r.b >= 4) mastered++;
    if (r.d <= now) due++;
  }
  return { learned, mastered, due, total: ids.length };
}

// Gộp dữ liệu từ máy chủ: bản nào mới hơn (u lớn hơn) thì thắng
export function mergeRemote({ items, lang, settings, settingsU, days, seen }) {
  let changed = false;
  if (lang && items) {
    const p = (state.progress[lang] ||= {});
    for (const [id, r] of Object.entries(items)) {
      if (!p[id] || (r.u || 0) > (p[id].u || 0)) { p[id] = r; changed = true; }
      else if ((p[id].u || 0) > (r.u || 0)) (dirty.items[lang] ||= {})[id] = true;
    }
  }
  if (settings && (settingsU || 0) > state.settingsU) {
    state.settings = { ...DEFAULT_SETTINGS, ...settings };
    state.settingsU = settingsU;
    changed = true;
  }
  if (days) for (const [d, xp] of Object.entries(days)) {
    if ((state.days[d] || 0) < xp) { state.days[d] = xp; changed = true; }
    else if ((state.days[d] || 0) > xp) dirty.days[d] = true;
  }
  if (seen) for (const [id, u] of Object.entries(seen)) {
    if (!state.seen[id]) { state.seen[id] = u; changed = true; }
  }
  if (changed) emit('remote');
  return changed;
}

export function resetAll() {
  localStorage.removeItem(KEY);
  location.reload();
}
