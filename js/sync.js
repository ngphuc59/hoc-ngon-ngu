// Đồng bộ thời gian thực giữa các thiết bị bằng Firebase (gói miễn phí Spark).
// Chưa có cấu hình trong firebase-config.js thì app chạy hoàn toàn trên máy.
import { state, dirty, onChange, mergeRemote } from './store.js';
import { LANGS } from './langs.js';

const V = '10.12.5';
const cfg = window.FIREBASE_CONFIG;
export const syncAvailable = !!(cfg && cfg.apiKey);

export const sync = { user: null, status: syncAvailable ? 'Chưa đăng nhập' : 'Chưa cấu hình', error: '' };
const subs = new Set();
export function onSync(fn) { subs.add(fn); }
function notify() { for (const fn of subs) fn(sync); }

let fb = null; // các hàm Firebase sau khi tải
let unsub = [];
let pushTimer;

async function loadFirebase() {
  if (fb) return fb;
  const base = `https://www.gstatic.com/firebasejs/${V}/`;
  const [app, auth, fs] = await Promise.all([
    import(base + 'firebase-app.js'),
    import(base + 'firebase-auth.js'),
    import(base + 'firebase-firestore.js'),
  ]);
  const a = app.initializeApp(cfg);
  const db = fs.initializeFirestore(a, { localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }) });
  fb = { app: a, auth: auth.getAuth(a), db, A: auth, F: fs };
  return fb;
}

export async function initSync() {
  if (!syncAvailable) return;
  try {
    const { auth, A } = await loadFirebase();
    A.getRedirectResult(auth).catch(() => {});
    A.onAuthStateChanged(auth, u => {
      sync.user = u ? { uid: u.uid, name: u.displayName || u.email, email: u.email, photo: u.photoURL } : null;
      sync.status = u ? 'Đang đồng bộ' : 'Chưa đăng nhập';
      notify();
      stopListening();
      if (u) startListening(u.uid);
    });
  } catch (e) {
    sync.status = 'Lỗi tải Firebase'; sync.error = String(e.message || e); notify();
  }
}

export async function signInGoogle() {
  const { auth, A } = await loadFirebase();
  const provider = new A.GoogleAuthProvider();
  try { await A.signInWithPopup(auth, provider); }
  catch (e) {
    if (/popup|operation-not-supported/i.test(e.code || '')) await A.signInWithRedirect(auth, provider);
    else throw e;
  }
}
export async function signInEmail(email, pass, create) {
  const { auth, A } = await loadFirebase();
  if (create) await A.createUserWithEmailAndPassword(auth, email, pass);
  else await A.signInWithEmailAndPassword(auth, email, pass);
}
export async function signOut() {
  const { auth, A } = await loadFirebase();
  await A.signOut(auth);
}

function stopListening() { unsub.forEach(f => f()); unsub = []; }

function startListening(uid) {
  const { db, F } = fb;
  const col = F.collection(db, 'users', uid, 'data');
  // Lần đầu: đẩy toàn bộ dữ liệu trên máy để gộp
  for (const l of LANGS) for (const id of Object.keys(state.progress[l.code] || {})) (dirty.items[l.code] ||= {})[id] = true;
  dirty.settings = true;
  Object.keys(state.days).forEach(d => dirty.days[d] = true);
  Object.keys(state.seen).forEach(id => dirty.seen[id] = true);

  unsub.push(F.onSnapshot(col, snap => {
    snap.docChanges().forEach(ch => {
      if (ch.doc.metadata.hasPendingWrites) return;
      const data = ch.doc.data();
      const id = ch.doc.id;
      if (id.startsWith('progress_')) mergeRemote({ lang: id.slice(9), items: data.items || {} });
      else if (id === 'meta') mergeRemote({ settings: data.settings, settingsU: data.settingsU, days: data.days, seen: data.seen });
    });
    sync.status = 'Đã đồng bộ'; sync.last = Date.now(); notify();
    schedulePush();
  }, err => { sync.status = 'Lỗi đồng bộ'; sync.error = friendlyError(err); notify(); }));
  schedulePush();
}

function schedulePush() {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(push, 1200);
}

async function push() {
  if (!fb || !sync.user) return;
  const { db, F } = fb;
  const uid = sync.user.uid;
  const batch = F.writeBatch(db);
  let n = 0;
  for (const [lang, ids] of Object.entries(dirty.items)) {
    const items = {};
    for (const id of Object.keys(ids)) { const r = state.progress[lang]?.[id]; if (r) items[id] = r; }
    if (Object.keys(items).length) { batch.set(F.doc(db, 'users', uid, 'data', 'progress_' + lang), { items }, { merge: true }); n++; }
    delete dirty.items[lang];
  }
  const meta = {};
  if (dirty.settings) { meta.settings = state.settings; meta.settingsU = state.settingsU; dirty.settings = false; }
  const days = Object.keys(dirty.days);
  if (days.length) { meta.days = Object.fromEntries(days.map(d => [d, state.days[d]])); dirty.days = {}; }
  const seen = Object.keys(dirty.seen);
  if (seen.length) { meta.seen = Object.fromEntries(seen.map(id => [id, state.seen[id]])); }
  for (const k of seen) delete dirty.seen[k];
  if (Object.keys(meta).length) { batch.set(F.doc(db, 'users', uid, 'data', 'meta'), meta, { merge: true }); n++; }
  if (!n) return;
  try {
    await batch.commit();
    sync.status = 'Đã đồng bộ'; sync.last = Date.now(); notify();
  } catch (e) {
    sync.status = 'Lỗi đồng bộ'; sync.error = friendlyError(e); notify();
  }
}

onChange(source => { if (source === 'local' && sync.user) schedulePush(); });

// Lỗi Firebase -> lời giải thích tiếng Việt
const ERRORS = {
  'auth/unauthorized-domain': 'Tên miền này chưa được phép đăng nhập. Vào Firebase → Authentication → Settings → Authorized domains và thêm tên miền của app.',
  'auth/operation-not-allowed': 'Cách đăng nhập này chưa được bật. Vào Firebase → Authentication → Sign-in method để bật Google hoặc Email/Password.',
  'auth/configuration-not-found': 'Authentication chưa được bật trong Firebase. Vào Firebase → Authentication → Get started.',
  'auth/invalid-credential': 'Email hoặc mật khẩu không đúng.',
  'auth/wrong-password': 'Mật khẩu không đúng.',
  'auth/user-not-found': 'Chưa có tài khoản với email này. Bấm "Tạo tài khoản".',
  'auth/email-already-in-use': 'Email này đã có tài khoản. Bấm "Đăng nhập".',
  'auth/weak-password': 'Mật khẩu cần ít nhất 6 ký tự.',
  'auth/invalid-email': 'Email không hợp lệ.',
  'auth/popup-closed-by-user': 'Cửa sổ đăng nhập đã bị đóng. Hãy thử lại.',
  'auth/network-request-failed': 'Không có mạng. Kiểm tra kết nối rồi thử lại.',
  'permission-denied': 'Firestore từ chối lưu dữ liệu. Kiểm tra lại phần Rules của Firestore Database.',
};
export function friendlyError(e) {
  const code = e?.code || (String(e?.message || '').match(/\(([^)]+)\)/) || [])[1];
  return ERRORS[code] || String(e?.message || e);
}
