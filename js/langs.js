export const LANGS = [
  { code: 'en', name: 'Tiếng Anh (UK)', short: 'Anh', flag: '🇬🇧', bcp: 'en-GB', yg: 'english/uk' },
  { code: 'zh', name: 'Tiếng Trung', short: 'Trung', flag: '🇨🇳', bcp: 'zh-CN', yg: 'chinese' },
  { code: 'ja', name: 'Tiếng Nhật', short: 'Nhật', flag: '🇯🇵', bcp: 'ja-JP', yg: 'japanese' },
  { code: 'fr', name: 'Tiếng Pháp', short: 'Pháp', flag: '🇫🇷', bcp: 'fr-FR', yg: 'french' },
  { code: 'es', name: 'Tiếng Tây Ban Nha', short: 'TBN', flag: '🇪🇸', bcp: 'es-ES', yg: 'spanish' },
];
export const LANG = Object.fromEntries(LANGS.map(l => [l.code, l]));

// Văn bản dùng để đọc to (TTS) cho một mục ở một ngôn ngữ
export function speakText(entry, code) {
  const e = entry[code];
  if (!e) return '';
  // Một chữ Kanji đứng riêng dễ bị đọc sai -> đọc bằng Kana
  if (code === 'ja' && [...e.t].length === 1 && e.k) return e.k;
  return e.t;
}

// Phiên âm hiển thị bên dưới
export function romanization(entry, code, settings) {
  const e = entry[code];
  if (!e) return '';
  if (code === 'zh' && settings.pinyin) return e.r || '';
  if (code === 'ja') {
    const parts = [];
    if (settings.kana && e.k && e.k !== e.t) parts.push(e.k);
    if (settings.romaji && e.r) parts.push(e.r);
    return parts.join(' · ');
  }
  return '';
}
