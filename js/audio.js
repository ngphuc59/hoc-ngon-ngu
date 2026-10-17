// Phát âm bằng giọng đọc có sẵn của trình duyệt (Web Speech API, miễn phí, chạy offline trên nhiều máy)
// và nhận diện giọng nói để luyện nói.
import { LANG } from './langs.js';

let voices = [];
function loadVoices() { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; }
if (window.speechSynthesis) {
  loadVoices();
  speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

const QUALITY = /(natural|neural|premium|enhanced|google|siri|online)/i;

export function pickVoice(bcp) {
  if (!voices.length) loadVoices();
  const lc = bcp.toLowerCase();
  const base = lc.split('-')[0];
  const norm = v => v.lang.replace('_', '-').toLowerCase();
  const exact = voices.filter(v => norm(v) === lc);
  const loose = voices.filter(v => norm(v).startsWith(base));
  const pool = exact.length ? exact : loose;
  if (!pool.length) return null;
  return pool.find(v => QUALITY.test(v.name)) || pool.find(v => v.localService) || pool[0];
}

export function hasVoice(code) { return !!pickVoice(LANG[code].bcp); }
export function ttsSupported() { return 'speechSynthesis' in window; }

export function speak(text, code, rate = 0.9) {
  return new Promise(resolve => {
    if (!ttsSupported() || !text) return resolve(false);
    const bcp = LANG[code].bcp;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = bcp;
    const v = pickVoice(bcp);
    if (v) u.voice = v;
    u.rate = rate;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    speechSynthesis.speak(u);
    // một số trình duyệt không gọi onend
    setTimeout(() => resolve(true), 8000 + text.length * 150);
  });
}

// ---------- Nhận diện giọng nói ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export function srSupported() { return !!SR; }

export function listen(code) {
  return new Promise((resolve, reject) => {
    if (!SR) return reject(new Error('unsupported'));
    const r = new SR();
    r.lang = LANG[code].bcp;
    r.interimResults = false;
    r.maxAlternatives = 5;
    let done = false;
    r.onresult = e => {
      done = true;
      const alts = [...e.results[0]].map(a => a.transcript);
      resolve(alts);
    };
    r.onerror = e => { if (!done) { done = true; reject(new Error(e.error || 'error')); } };
    r.onend = () => { if (!done) { done = true; resolve([]); } };
    r.start();
  });
}

// So sánh câu nói với đáp án, trả về điểm 0..1
function normalize(s, code) {
  s = s.toLowerCase().normalize('NFKC');
  if (code === 'zh' || code === 'ja') return s.replace(/[\s\p{P}\p{S}]/gu, '');
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}
function lev(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
export function similarity(heard, targets, code) {
  let best = 0;
  for (const h of heard) for (const t of targets) {
    const a = [...normalize(h, code)], b = [...normalize(t, code)];
    if (!b.length) continue;
    const s = 1 - lev(a, b) / Math.max(a.length, b.length);
    best = Math.max(best, s);
  }
  return best;
}
