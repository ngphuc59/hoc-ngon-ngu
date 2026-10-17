// Ảnh, GIF, video minh họa lấy trực tiếp từ Wikipedia và Wikimedia Commons (nội dung mở, có ghi nguồn).
const CACHE_KEY = 'hnn.media.v1';
let cache = {};
try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch { cache = {}; }
function save() { try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch { cache = {}; } }

const strip = html => (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

// Ảnh đại diện của bài Wikipedia tiếng Anh
export async function wikiImage(title) {
  if (!title) return null;
  const k = 'wp:' + title;
  if (k in cache) return cache[k];
  const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1'
    + '&prop=pageimages&piprop=thumbnail|name&pithumbsize=480&titles=' + encodeURIComponent(title);
  try {
    const j = await (await fetch(url)).json();
    const page = Object.values(j.query?.pages || {})[0];
    const res = page?.thumbnail ? {
      src: page.thumbnail.source,
      credit: 'Wikipedia: ' + page.title,
      href: page.pageimage ? 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(page.pageimage) : 'https://en.wikipedia.org/wiki/' + encodeURIComponent(page.title),
    } : null;
    cache[k] = res; save();
    return res;
  } catch { return null; }
}

// Tìm GIF động hoặc video trên Wikimedia Commons
export async function commonsMedia(term, kind) {
  const k = `c:${kind}:${term}`;
  if (k in cache) return cache[k];
  const filter = kind === 'video' ? 'filetype:video' : 'filemime:image/gif';
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*'
    + '&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=' + encodeURIComponent(`${term} ${filter}`)
    + '&prop=imageinfo|videoinfo&iiprop=url|extmetadata|mime&iiurlwidth=480'
    + '&viprop=derivatives|url';
  try {
    const j = await (await fetch(url)).json();
    const pages = Object.values(j.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
    const out = [];
    for (const p of pages) {
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      const md = ii.extmetadata || {};
      const item = {
        title: p.title.replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, ''),
        href: ii.descriptionurl,
        credit: [strip(md.Artist?.value), md.LicenseShortName?.value].filter(Boolean).join(' · '),
      };
      if (kind === 'video') {
        const ders = p.videoinfo?.[0]?.derivatives || [];
        const pick = ders.find(d => /mp4/.test(d.type)) || ders.find(d => /webm/.test(d.type) && /480|360/.test(d.transcodekey || '')) || ders[0];
        item.src = pick?.src || ii.url;
        item.type = pick?.type || ii.mime;
        item.poster = ii.thumburl;
      } else {
        // GIF lớn: dùng bản thu nhỏ (vẫn động)
        item.src = ii.thumburl || ii.url;
      }
      out.push(item);
      if (out.length >= 4) break;
    }
    cache[k] = out; save();
    return out;
  } catch { return []; }
}

export function youglishUrl(text, yg) {
  return `https://youglish.com/pronounce/${encodeURIComponent(text)}/${yg}`;
}
