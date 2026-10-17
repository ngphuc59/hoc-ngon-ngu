// Chữ viết & phát âm cơ bản cho người mới bắt đầu.

// ---------- Tiếng Nhật: bảng Kana ----------
const KANA_ROWS = [
  ['あいうえお', 'a i u e o'],
  ['かきくけこ', 'ka ki ku ke ko'],
  ['さしすせそ', 'sa shi su se so'],
  ['たちつてと', 'ta chi tsu te to'],
  ['なにぬねの', 'na ni nu ne no'],
  ['はひふへほ', 'ha hi fu he ho'],
  ['まみむめも', 'ma mi mu me mo'],
  ['や ゆ よ', 'ya _ yu _ yo'],
  ['らりるれろ', 'ra ri ru re ro'],
  ['わ   を', 'wa _ _ _ wo'],
  ['ん    ', 'n _ _ _ _'],
];
const KANA_DAKUTEN = [
  ['がぎぐげご', 'ga gi gu ge go'],
  ['ざじずぜぞ', 'za ji zu ze zo'],
  ['だぢづでど', 'da ji zu de do'],
  ['ばびぶべぼ', 'ba bi bu be bo'],
  ['ぱぴぷぺぽ', 'pa pi pu pe po'],
];

function toKatakana(s) {
  return [...s].map(c => {
    const code = c.charCodeAt(0);
    return code >= 0x3041 && code <= 0x3096 ? String.fromCharCode(code + 0x60) : c;
  }).join('');
}

function buildKana(rows, kata) {
  return rows.map(([chars, ro]) => {
    const cs = [...chars.padEnd(5, ' ')].slice(0, 5);
    const rs = ro.split(' ');
    return cs.map((c, i) => (c.trim() && rs[i] !== '_') ? { c: kata ? toKatakana(c) : c, r: rs[i] } : null);
  });
}

export const KANA = {
  hiragana: { basic: buildKana(KANA_ROWS, false), dakuten: buildKana(KANA_DAKUTEN, false) },
  katakana: { basic: buildKana(KANA_ROWS, true), dakuten: buildKana(KANA_DAKUTEN, true) },
};

export const JA_NOTES = [
  'Tiếng Nhật dùng 3 loại chữ: Hiragana (chữ mềm, cho từ thuần Nhật và ngữ pháp), Katakana (chữ cứng, cho từ mượn nước ngoài như コーヒー "cà phê") và Kanji (chữ Hán).',
  'Mỗi chữ Kana là một âm tiết, đọc gần như tiếng Việt. Học thuộc Hiragana trước, sau đó Katakana.',
  'Phát âm: "u" tròn môi nhẹ, gần "ư"; "r" nằm giữa "r" và "l"; "tsu" như "ch" bật nhẹ + "ư"; "fu" thổi hơi qua hai môi.',
  'Dấu nháy ゛ làm âm đục (か ka → が ga), vòng tròn ゜ biến h thành p (は ha → ぱ pa).',
  'Trường âm (ō, ū) đọc kéo dài gấp đôi; っ nhỏ là ngắt hơi trước phụ âm sau (きって kitte).',
  'Trợ từ は đọc là "wa", を đọc là "o", へ đọc là "e".',
];

// ---------- Tiếng Trung: Pinyin & thanh điệu ----------
export const ZH_TONES = [
  { mark: 'mā', tone: 'Thanh 1 (ngang, cao)', zh: '妈', vi: 'mẹ', tip: 'Giữ giọng cao và đều, như kéo dài "a" ở cao độ cao.' },
  { mark: 'má', tone: 'Thanh 2 (lên)', zh: '麻', vi: 'tê', tip: 'Đi lên từ giữa lên cao, giống dấu sắc tiếng Việt.' },
  { mark: 'mǎ', tone: 'Thanh 3 (xuống rồi lên)', zh: '马', vi: 'ngựa', tip: 'Hạ thấp rồi hơi lên, gần dấu hỏi. Khi nói nhanh thường chỉ hạ thấp.' },
  { mark: 'mà', tone: 'Thanh 4 (xuống mạnh)', zh: '骂', vi: 'mắng', tip: 'Rơi nhanh từ cao xuống thấp, dứt khoát, gần dấu nặng.' },
  { mark: 'ma', tone: 'Thanh nhẹ', zh: '吗', vi: '(từ để hỏi)', tip: 'Đọc ngắn và nhẹ, không nhấn.' },
];

export const ZH_INITIALS = [
  ['b', '爸', 'bà', 'như "p" tiếng Việt, không bật hơi'],
  ['p', '怕', 'pà', '"p" bật hơi mạnh'],
  ['m', '妈', 'mā', 'như "m"'],
  ['f', '饭', 'fàn', 'như "ph"'],
  ['d', '大', 'dà', 'như "t" tiếng Việt, không bật hơi'],
  ['t', '他', 'tā', 'như "th", bật hơi'],
  ['n', '你', 'nǐ', 'như "n"'],
  ['l', '来', 'lái', 'như "l"'],
  ['g', '哥', 'gē', 'như "c/k", không bật hơi'],
  ['k', '可', 'kě', '"kh" bật hơi mạnh'],
  ['h', '好', 'hǎo', 'như "h" khàn, gần "kh"'],
  ['j', '家', 'jiā', 'như "ch", không bật hơi'],
  ['q', '去', 'qù', '"ch" bật hơi mạnh'],
  ['x', '小', 'xiǎo', 'như "x" tiếng Việt'],
  ['zh', '中', 'zhōng', 'như "tr", cong lưỡi'],
  ['ch', '吃', 'chī', '"tr" cong lưỡi và bật hơi'],
  ['sh', '是', 'shì', 'như "s" cong lưỡi'],
  ['r', '人', 'rén', 'như "r" nhẹ, cong lưỡi, gần "gi"'],
  ['z', '在', 'zài', 'như "ch" đầu lưỡi thẳng (ts), không bật hơi'],
  ['c', '菜', 'cài', '"ts" bật hơi'],
  ['s', '四', 'sì', 'như "x"'],
  ['y', '有', 'yǒu', 'như "d" miền Nam / "i"'],
  ['w', '我', 'wǒ', 'như "u" lướt / "qu"'],
];

export const ZH_FINALS = [
  ['a', '八', 'bā'], ['o', '我', 'wǒ'], ['e', '喝', 'hē'], ['i', '你', 'nǐ'], ['u', '五', 'wǔ'], ['ü', '女', 'nǚ'],
  ['ai', '爱', 'ài'], ['ei', '北', 'běi'], ['ao', '好', 'hǎo'], ['ou', '口', 'kǒu'],
  ['an', '三', 'sān'], ['en', '门', 'mén'], ['ang', '忙', 'máng'], ['eng', '冷', 'lěng'], ['ong', '中', 'zhōng'],
  ['ia', '家', 'jiā'], ['ie', '谢', 'xiè'], ['iao', '小', 'xiǎo'], ['iu', '六', 'liù'], ['ian', '钱', 'qián'], ['in', '新', 'xīn'], ['ing', '听', 'tīng'],
  ['ua', '花', 'huā'], ['uo', '说', 'shuō'], ['uai', '快', 'kuài'], ['ui', '水', 'shuǐ'], ['uan', '玩', 'wán'], ['un', '春', 'chūn'],
];

export const ZH_RADICALS = [
  ['人', 'rén', 'người', '🧍'], ['口', 'kǒu', 'miệng', '👄'], ['日', 'rì', 'mặt trời, ngày', '☀️'], ['月', 'yuè', 'mặt trăng, tháng', '🌙'],
  ['山', 'shān', 'núi', '⛰️'], ['水', 'shuǐ', 'nước', '💧'], ['木', 'mù', 'cây, gỗ', '🌳'], ['火', 'huǒ', 'lửa', '🔥'],
  ['女', 'nǚ', 'phụ nữ', '👩'], ['子', 'zǐ', 'con', '👶'], ['手', 'shǒu', 'tay', '✋'], ['心', 'xīn', 'tim', '❤️'],
];

export const ZH_NOTES = [
  'Tiếng Trung dùng chữ Hán (giản thể). Pinyin là cách ghi âm bằng chữ Latin, giúp bạn đọc được trước khi nhớ mặt chữ.',
  'Mỗi chữ Hán là một âm tiết, có 4 thanh + 1 thanh nhẹ. Sai thanh là sai nghĩa, giống tiếng Việt.',
  'Người Việt có lợi thế: rất nhiều từ Hán Việt gần nghĩa (学生 xuésheng ~ học sinh, 电话 diànhuà ~ điện thoại).',
  'Biến điệu: hai thanh 3 liền nhau thì thanh đầu đọc thành thanh 2 (你好 nǐ hǎo → ní hǎo). 不 bù đứng trước thanh 4 đọc thành bú.',
];

// ---------- Tiếng Anh (UK), Pháp, Tây Ban Nha ----------
export const LATIN = {
  en: {
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    notes: [
      'Tiếng Anh viết một đằng đọc một nẻo, nên hãy luôn nghe âm thanh khi học từ mới.',
      'Giọng Anh-Anh (UK) thường không đọc "r" ở cuối âm tiết: car /kɑː/, water /ˈwɔːtə/.',
      'Âm cuối rất quan trọng: đọc rõ -s, -t, -d (cats, walked).',
      'Trọng âm: mỗi từ có một âm tiết nhấn mạnh hơn (TEAcher, comPUter).',
    ],
    sounds: [
      ['th (vô thanh)', 'think, three', 'Đặt đầu lưỡi giữa hai răng, thổi hơi.'],
      ['th (hữu thanh)', 'this, mother', 'Như trên nhưng rung dây thanh.'],
      ['i ngắn / i dài', 'ship – sheep', '"i" ngắn và lỏng; "ee" dài và căng.'],
      ['æ', 'cat, bag', 'Mở miệng rộng, giữa "a" và "e".'],
      ['ə (schwa)', 'about, teacher', 'Âm "ơ" nhẹ, rất phổ biến ở âm tiết không nhấn.'],
      ['v / w', 'very – wet', '"v" răng chạm môi dưới; "w" tròn môi như "u".'],
      ['ʃ / tʃ', 'she – cheese', '"sh" như "s" cong lưỡi; "ch" có chặn hơi trước.'],
    ],
  },
  fr: {
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    notes: [
      'Phụ âm cuối thường không đọc: petit /pəti/, Paris /paʁi/. Trừ c, r, f, l (nhớ chữ "CaReFuL").',
      'Nối âm (liaison): les amis đọc "lê-za-mi".',
      'Trọng âm luôn rơi vào âm tiết cuối của cụm từ.',
      'Dấu: é đọc "ê" khép, è/ê đọc "e" mở, ç đọc "x".',
    ],
    sounds: [
      ['r', 'rouge, Paris', 'Âm "r" ở cổ họng, gần "gờ" rung nhẹ.'],
      ['u / ou', 'tu – tout', '"u" tròn môi nói "i" (gần "uy"); "ou" là "u" tiếng Việt.'],
      ['an / en', 'enfant, France', 'Nguyên âm mũi, như "ăng" nhưng không bật "ng".'],
      ['on', 'bonjour, nom', 'Mũi, như "ông" không bật "ng".'],
      ['in / ain', 'vin, pain', 'Mũi, như "anh" mở.'],
      ['eu', 'deux, bleu', 'Tròn môi nói "ê", gần "ơ".'],
      ['oi', 'moi, trois', 'Đọc "oa".'],
      ['gn', 'montagne', 'Như "nh" tiếng Việt.'],
    ],
  },
  es: {
    alphabet: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ',
    notes: [
      'Tiếng Tây Ban Nha đọc gần như viết: mỗi chữ một âm, rất dễ cho người Việt.',
      '5 nguyên âm a, e, i, o, u luôn đọc ngắn và rõ như tiếng Việt.',
      'Dấu sắc (á, é, í, ó, ú) chỉ trọng âm, không đổi âm.',
      'Câu hỏi và câu cảm thán có dấu ngược ở đầu: ¿…? ¡…!',
    ],
    sounds: [
      ['r / rr', 'pero – perro', '"r" đơn bật lưỡi một lần; "rr" rung lưỡi nhiều lần.'],
      ['j / ge, gi', 'jamón, gente', 'Như "kh" tiếng Việt.'],
      ['ñ', 'España, mañana', 'Như "nh" tiếng Việt.'],
      ['ll / y', 'llamar, yo', 'Như "d" miền Nam / "gi".'],
      ['h', 'hola, hotel', 'Chữ h câm, không đọc.'],
      ['c (ce, ci) / z', 'cinco, zapato', 'Ở Tây Ban Nha: lưỡi giữa răng như "th" tiếng Anh.'],
      ['b / v', 'vino, bueno', 'Đọc giống nhau, như "b" nhẹ.'],
    ],
  },
};
