// Nội dung bài học: mỗi mục có nghĩa tiếng Việt và 5 ngôn ngữ.
// zh: "汉字|pinyin"   ja: "表記|かな|romaji" (bỏ trống phần かな nếu giống phần 表記)
// wp: tên bài Wikipedia tiếng Anh dùng để lấy ảnh minh họa (bỏ trống = chỉ dùng emoji)

function split(s) { return (s || '').split('|').map(x => x.trim()); }

function langs(en, zh, ja, fr, es) {
  const [zt, zp] = split(zh);
  const [jt, jk, jr] = split(ja);
  return {
    en: { t: en },
    zh: { t: zt, r: zp },
    ja: { t: jt, k: jk || jt, r: jr },
    fr: { t: fr },
    es: { t: es },
  };
}

// từ vựng / mẫu câu
function W(id, emoji, vi, wp, en, zh, ja, fr, es) {
  return { id, emoji, vi, wp, ...langs(en, zh, ja, fr, es) };
}
// câu hội thoại
function L(who, vi, en, zh, ja, fr, es) {
  return { who, vi, ...langs(en, zh, ja, fr, es) };
}

export const TOPICS = [
  {
    id: 'chao-hoi', emoji: '👋', vi: 'Chào hỏi & làm quen', level: 'A1',
    words: [],
    phrases: [
      W('hello', '👋', 'Xin chào', '', 'Hello', '你好|nǐ hǎo', 'こんにちは||konnichiwa', 'Bonjour', 'Hola'),
      W('good-morning', '🌅', 'Chào buổi sáng', '', 'Good morning', '早上好|zǎoshang hǎo', 'おはようございます||ohayō gozaimasu', 'Bonjour', 'Buenos días'),
      W('good-evening', '🌆', 'Chào buổi tối', '', 'Good evening', '晚上好|wǎnshang hǎo', 'こんばんは||konbanwa', 'Bonsoir', 'Buenas noches'),
      W('goodbye', '🙋', 'Tạm biệt', '', 'Goodbye', '再见|zàijiàn', 'さようなら||sayōnara', 'Au revoir', 'Adiós'),
      W('see-you', '🔜', 'Hẹn gặp lại', '', 'See you later', '回头见|huítóu jiàn', 'またね||mata ne', 'À plus tard', 'Hasta luego'),
      W('thank-you', '🙏', 'Cảm ơn', '', 'Thank you', '谢谢|xièxie', 'ありがとうございます||arigatō gozaimasu', 'Merci', 'Gracias'),
      W('welcome', '😊', 'Không có gì', '', "You're welcome", '不客气|bú kèqi', 'どういたしまして||dō itashimashite', 'De rien', 'De nada'),
      W('sorry', '🙇', 'Xin lỗi', '', 'Sorry', '对不起|duìbuqǐ', 'ごめんなさい||gomen nasai', 'Désolé', 'Lo siento'),
      W('excuse-me', '🙋‍♀️', 'Xin lỗi, cho tôi hỏi', '', 'Excuse me', '请问|qǐngwèn', 'すみません||sumimasen', 'Excusez-moi', 'Disculpe'),
      W('yes', '✅', 'Vâng / Có', '', 'Yes', '是|shì', 'はい||hai', 'Oui', 'Sí'),
      W('no', '❌', 'Không', '', 'No', '不是|bú shì', 'いいえ||iie', 'Non', 'No'),
      W('please', '🤲', 'Làm ơn', '', 'Please', '请|qǐng', 'お願いします|おねがいします|onegaishimasu', "S'il vous plaît", 'Por favor'),
      W('how-are-you', '🙂', 'Bạn khỏe không?', '', 'How are you?', '你好吗？|nǐ hǎo ma?', 'お元気ですか？|おげんきですか？|o-genki desu ka?', 'Comment allez-vous ?', '¿Cómo estás?'),
      W('im-fine', '😀', 'Tôi khỏe, cảm ơn.', '', "I'm fine, thanks.", '我很好，谢谢。|wǒ hěn hǎo, xièxie.', '元気です、ありがとう。|げんきです、ありがとう。|genki desu, arigatō.', 'Je vais bien, merci.', 'Estoy bien, gracias.'),
      W('your-name', '❓', 'Bạn tên là gì?', '', "What's your name?", '你叫什么名字？|nǐ jiào shénme míngzi?', 'お名前は何ですか？|おなまえはなんですか？|o-namae wa nan desu ka?', 'Comment vous appelez-vous ?', '¿Cómo te llamas?'),
      W('my-name', '🪪', 'Tôi tên là Anna.', '', 'My name is Anna.', '我叫安娜。|wǒ jiào Ānnà.', '私はアンナです。|わたしはアンナです。|watashi wa Anna desu.', "Je m'appelle Anna.", 'Me llamo Anna.'),
      W('nice-meet', '🤝', 'Rất vui được gặp bạn.', '', 'Nice to meet you.', '很高兴认识你。|hěn gāoxìng rènshi nǐ.', 'はじめまして。||hajimemashite.', 'Enchanté.', 'Mucho gusto.'),
      W('where-from', '🌍', 'Bạn đến từ đâu?', '', 'Where are you from?', '你是哪国人？|nǐ shì nǎ guó rén?', 'どこから来ましたか？|どこからきましたか？|doko kara kimashita ka?', "D'où venez-vous ?", '¿De dónde eres?'),
      W('from-vietnam', '🇻🇳', 'Tôi đến từ Việt Nam.', '', "I'm from Vietnam.", '我是越南人。|wǒ shì Yuènán rén.', 'ベトナムから来ました。|ベトナムからきました。|Betonamu kara kimashita.', 'Je viens du Vietnam.', 'Soy de Vietnam.'),
      W('dont-understand', '🤷', 'Tôi không hiểu.', '', "I don't understand.", '我不明白。|wǒ bù míngbai.', 'わかりません。||wakarimasen.', 'Je ne comprends pas.', 'No entiendo.'),
      W('speak-slowly', '🐢', 'Làm ơn nói chậm lại.', '', 'Could you speak more slowly, please?', '请说慢一点。|qǐng shuō màn yìdiǎn.', 'ゆっくり話してください。|ゆっくりはなしてください。|yukkuri hanashite kudasai.', 'Pouvez-vous parler plus lentement ?', '¿Puede hablar más despacio?'),
    ],
    dialogue: {
      title: 'Lần đầu gặp mặt',
      lines: [
        L('Tom', 'Xin chào!', 'Hello!', '你好！|nǐ hǎo!', 'こんにちは！||konnichiwa!', 'Bonjour !', '¡Hola!'),
        L('Mai', 'Chào bạn! Bạn tên là gì?', "Hi! What's your name?", '你好！你叫什么名字？|nǐ hǎo! nǐ jiào shénme míngzi?', 'こんにちは！お名前は？|こんにちは！おなまえは？|konnichiwa! o-namae wa?', "Salut ! Comment tu t'appelles ?", '¡Hola! ¿Cómo te llamas?'),
        L('Tom', 'Tôi tên là Tom. Còn bạn?', "I'm Tom. And you?", '我叫汤姆。你呢？|wǒ jiào Tāngmǔ. nǐ ne?', 'トムです。あなたは？||Tomu desu. anata wa?', "Je m'appelle Tom. Et toi ?", 'Me llamo Tom. ¿Y tú?'),
        L('Mai', 'Tôi tên là Mai. Rất vui được gặp bạn.', "I'm Mai. Nice to meet you.", '我叫阿梅。很高兴认识你。|wǒ jiào Ā Méi. hěn gāoxìng rènshi nǐ.', 'マイです。はじめまして。||Mai desu. hajimemashite.', "Moi, c'est Mai. Enchantée.", 'Soy Mai. Mucho gusto.'),
        L('Tom', 'Bạn đến từ đâu?', 'Where are you from?', '你是哪国人？|nǐ shì nǎ guó rén?', 'どこから来ましたか？|どこからきましたか？|doko kara kimashita ka?', "Tu viens d'où ?", '¿De dónde eres?'),
        L('Mai', 'Tôi đến từ Việt Nam. Còn bạn?', "I'm from Vietnam. And you?", '我是越南人。你呢？|wǒ shì Yuènán rén. nǐ ne?', 'ベトナムから来ました。トムさんは？|ベトナムからきました。トムさんは？|Betonamu kara kimashita. Tomu-san wa?', 'Je viens du Vietnam. Et toi ?', 'Soy de Vietnam. ¿Y tú?'),
        L('Tom', 'Tôi đến từ London.', "I'm from London.", '我是从伦敦来的。|wǒ shì cóng Lúndūn lái de.', 'ロンドンから来ました。|ロンドンからきました。|Rondon kara kimashita.', 'Je viens de Londres.', 'Soy de Londres.'),
        L('Mai', 'Tạm biệt, hẹn gặp lại!', 'Bye, see you later!', '再见，回头见！|zàijiàn, huítóu jiàn!', 'じゃあ、またね！||jā, mata ne!', 'Au revoir, à plus tard !', '¡Adiós, hasta luego!'),
      ],
    },
  },

  {
    id: 'so-dem', emoji: '🔢', vi: 'Số đếm & tuổi', level: 'A1',
    words: [
      W('n0', '0️⃣', 'số không', '', 'zero', '零|líng', 'ゼロ||zero', 'zéro', 'cero'),
      W('n1', '1️⃣', 'một', '', 'one', '一|yī', '一|いち|ichi', 'un', 'uno'),
      W('n2', '2️⃣', 'hai', '', 'two', '二|èr', '二|に|ni', 'deux', 'dos'),
      W('n3', '3️⃣', 'ba', '', 'three', '三|sān', '三|さん|san', 'trois', 'tres'),
      W('n4', '4️⃣', 'bốn', '', 'four', '四|sì', '四|よん|yon', 'quatre', 'cuatro'),
      W('n5', '5️⃣', 'năm', '', 'five', '五|wǔ', '五|ご|go', 'cinq', 'cinco'),
      W('n6', '6️⃣', 'sáu', '', 'six', '六|liù', '六|ろく|roku', 'six', 'seis'),
      W('n7', '7️⃣', 'bảy', '', 'seven', '七|qī', '七|なな|nana', 'sept', 'siete'),
      W('n8', '8️⃣', 'tám', '', 'eight', '八|bā', '八|はち|hachi', 'huit', 'ocho'),
      W('n9', '9️⃣', 'chín', '', 'nine', '九|jiǔ', '九|きゅう|kyū', 'neuf', 'nueve'),
      W('n10', '🔟', 'mười', '', 'ten', '十|shí', '十|じゅう|jū', 'dix', 'diez'),
      W('n20', '✌️', 'hai mươi', '', 'twenty', '二十|èrshí', '二十|にじゅう|nijū', 'vingt', 'veinte'),
      W('n100', '💯', 'một trăm', '', 'a hundred', '一百|yìbǎi', '百|ひゃく|hyaku', 'cent', 'cien'),
      W('n1000', '🧮', 'một nghìn', '', 'a thousand', '一千|yìqiān', '千|せん|sen', 'mille', 'mil'),
    ],
    phrases: [
      W('how-old', '🎂', 'Bạn bao nhiêu tuổi?', '', 'How old are you?', '你多大了？|nǐ duō dà le?', '何歳ですか？|なんさいですか？|nansai desu ka?', 'Quel âge as-tu ?', '¿Cuántos años tienes?'),
      W('im-25', '🎉', 'Tôi 25 tuổi.', '', "I'm twenty-five.", '我二十五岁。|wǒ èrshíwǔ suì.', '二十五歳です。|にじゅうごさいです。|nijūgo-sai desu.', "J'ai vingt-cinq ans.", 'Tengo veinticinco años.'),
      W('phone-number', '📱', 'Số điện thoại của bạn là gì?', '', "What's your phone number?", '你的电话号码是多少？|nǐ de diànhuà hàomǎ shì duōshao?', '電話番号は何ですか？|でんわばんごうはなんですか？|denwa bangō wa nan desu ka?', 'Quel est ton numéro de téléphone ?', '¿Cuál es tu número de teléfono?'),
    ],
  },

  {
    id: 'gia-dinh', emoji: '👨‍👩‍👧', vi: 'Gia đình', level: 'A1',
    words: [
      W('family', '👨‍👩‍👧', 'gia đình', 'Family', 'family', '家人|jiārén', '家族|かぞく|kazoku', 'la famille', 'la familia'),
      W('mother', '👩', 'mẹ', 'Mother', 'mum', '妈妈|māma', 'お母さん|おかあさん|okāsan', 'la mère', 'la madre'),
      W('father', '👨', 'bố', 'Father', 'dad', '爸爸|bàba', 'お父さん|おとうさん|otōsan', 'le père', 'el padre'),
      W('parents', '👫', 'bố mẹ', 'Parent', 'parents', '父母|fùmǔ', '両親|りょうしん|ryōshin', 'les parents', 'los padres'),
      W('older-brother', '🧑', 'anh trai', '', 'older brother', '哥哥|gēge', 'お兄さん|おにいさん|onīsan', 'le grand frère', 'el hermano mayor'),
      W('older-sister', '👩‍🦰', 'chị gái', '', 'older sister', '姐姐|jiějie', 'お姉さん|おねえさん|onēsan', 'la grande sœur', 'la hermana mayor'),
      W('younger-brother', '👦', 'em trai', '', 'younger brother', '弟弟|dìdi', '弟|おとうと|otōto', 'le petit frère', 'el hermano menor'),
      W('younger-sister', '👧', 'em gái', '', 'younger sister', '妹妹|mèimei', '妹|いもうと|imōto', 'la petite sœur', 'la hermana menor'),
      W('husband', '🤵', 'chồng', 'Husband', 'husband', '丈夫|zhàngfu', '夫|おっと|otto', 'le mari', 'el marido'),
      W('wife', '👰', 'vợ', 'Wife', 'wife', '妻子|qīzi', '妻|つま|tsuma', 'la femme', 'la esposa'),
      W('son', '👶', 'con trai', '', 'son', '儿子|érzi', '息子|むすこ|musuko', 'le fils', 'el hijo'),
      W('daughter', '👧🏻', 'con gái', '', 'daughter', '女儿|nǚ’ér', '娘|むすめ|musume', 'la fille', 'la hija'),
      W('grandfather', '👴', 'ông', 'Grandparent', 'grandfather', '爷爷|yéye', 'おじいさん||ojīsan', 'le grand-père', 'el abuelo'),
      W('grandmother', '👵', 'bà', '', 'grandmother', '奶奶|nǎinai', 'おばあさん||obāsan', 'la grand-mère', 'la abuela'),
      W('child', '🧒', 'đứa trẻ', 'Child', 'child', '孩子|háizi', '子供|こども|kodomo', "l'enfant", 'el niño'),
      W('friend', '🧑‍🤝‍🧑', 'bạn bè', 'Friendship', 'friend', '朋友|péngyou', '友達|ともだち|tomodachi', "l'ami", 'el amigo'),
    ],
    phrases: [
      W('have-siblings', '👪', 'Bạn có anh chị em không?', '', 'Have you got any brothers or sisters?', '你有兄弟姐妹吗？|nǐ yǒu xiōngdì jiěmèi ma?', '兄弟はいますか？|きょうだいはいますか？|kyōdai wa imasu ka?', 'As-tu des frères et sœurs ?', '¿Tienes hermanos?'),
      W('one-sister', '👧', 'Tôi có một em gái.', '', "I've got a younger sister.", '我有一个妹妹。|wǒ yǒu yí ge mèimei.', '妹が一人います。|いもうとがひとりいます。|imōto ga hitori imasu.', "J'ai une petite sœur.", 'Tengo una hermana menor.'),
      W('how-many-people', '🏠', 'Nhà bạn có mấy người?', '', 'How many people are there in your family?', '你家有几口人？|nǐ jiā yǒu jǐ kǒu rén?', '何人家族ですか？|なんにんかぞくですか？|nan-nin kazoku desu ka?', 'Combien de personnes y a-t-il dans ta famille ?', '¿Cuántas personas hay en tu familia?'),
      W('four-people', '4️⃣', 'Nhà tôi có bốn người.', '', 'There are four people in my family.', '我家有四口人。|wǒ jiā yǒu sì kǒu rén.', '四人家族です。|よにんかぞくです。|yonin kazoku desu.', 'Nous sommes quatre dans ma famille.', 'Somos cuatro en mi familia.'),
    ],
    dialogue: {
      title: 'Ảnh gia đình',
      lines: [
        L('Lan', 'Đây là ảnh gia đình tôi.', 'This is a photo of my family.', '这是我家的照片。|zhè shì wǒ jiā de zhàopiàn.', 'これは私の家族の写真です。|これはわたしのかぞくのしゃしんです。|kore wa watashi no kazoku no shashin desu.', 'Voici une photo de ma famille.', 'Esta es una foto de mi familia.'),
        L('Ben', 'Ai đây?', "Who's this?", '这是谁？|zhè shì shéi?', 'この人は誰ですか？|このひとはだれですか？|kono hito wa dare desu ka?', "C'est qui ?", '¿Quién es?'),
        L('Lan', 'Đó là mẹ tôi. Còn đây là em gái tôi.', "That's my mum. And this is my younger sister.", '这是我妈妈。这是我妹妹。|zhè shì wǒ māma. zhè shì wǒ mèimei.', '母です。そして、これは妹です。|ははです。そして、これはいもうとです。|haha desu. soshite, kore wa imōto desu.', "C'est ma mère. Et voici ma petite sœur.", 'Es mi madre. Y esta es mi hermana menor.'),
        L('Ben', 'Em gái bạn bao nhiêu tuổi?', 'How old is your sister?', '你妹妹多大了？|nǐ mèimei duō dà le?', '妹さんは何歳ですか？|いもうとさんはなんさいですか？|imōto-san wa nansai desu ka?', 'Quel âge a ta sœur ?', '¿Cuántos años tiene tu hermana?'),
        L('Lan', 'Em ấy mười tám tuổi. Em ấy là sinh viên.', "She's eighteen. She's a student.", '她十八岁。她是学生。|tā shíbā suì. tā shì xuésheng.', '十八歳です。学生です。|じゅうはっさいです。がくせいです。|jūhassai desu. gakusei desu.', 'Elle a dix-huit ans. Elle est étudiante.', 'Tiene dieciocho años. Es estudiante.'),
      ],
    },
  },

  {
    id: 'do-an', emoji: '🍜', vi: 'Đồ ăn & đồ uống', level: 'A1',
    words: [
      W('water', '💧', 'nước', 'Drinking water', 'water', '水|shuǐ', '水|みず|mizu', "l'eau", 'el agua'),
      W('coffee', '☕', 'cà phê', 'Coffee', 'coffee', '咖啡|kāfēi', 'コーヒー||kōhī', 'le café', 'el café'),
      W('tea', '🍵', 'trà', 'Tea', 'tea', '茶|chá', 'お茶|おちゃ|ocha', 'le thé', 'el té'),
      W('milk', '🥛', 'sữa', 'Milk', 'milk', '牛奶|niúnǎi', '牛乳|ぎゅうにゅう|gyūnyū', 'le lait', 'la leche'),
      W('rice', '🍚', 'cơm', 'Cooked rice', 'rice', '米饭|mǐfàn', 'ご飯|ごはん|gohan', 'le riz', 'el arroz'),
      W('bread', '🍞', 'bánh mì', 'Bread', 'bread', '面包|miànbāo', 'パン||pan', 'le pain', 'el pan'),
      W('noodles', '🍜', 'mì, sợi phở', 'Noodle', 'noodles', '面条|miàntiáo', '麺|めん|men', 'les nouilles', 'los fideos'),
      W('egg', '🥚', 'trứng', 'Egg as food', 'egg', '鸡蛋|jīdàn', '卵|たまご|tamago', "l'œuf", 'el huevo'),
      W('meat', '🥩', 'thịt', 'Meat', 'meat', '肉|ròu', '肉|にく|niku', 'la viande', 'la carne'),
      W('chicken-food', '🍗', 'thịt gà', 'Chicken as food', 'chicken', '鸡肉|jīròu', '鶏肉|とりにく|toriniku', 'le poulet', 'el pollo'),
      W('fish-food', '🐟', 'cá (món ăn)', 'Fish as food', 'fish', '鱼|yú', '魚|さかな|sakana', 'le poisson', 'el pescado'),
      W('vegetables', '🥦', 'rau', 'Vegetable', 'vegetables', '蔬菜|shūcài', '野菜|やさい|yasai', 'les légumes', 'las verduras'),
      W('fruit', '🍇', 'trái cây', 'Fruit', 'fruit', '水果|shuǐguǒ', '果物|くだもの|kudamono', 'les fruits', 'la fruta'),
      W('apple', '🍎', 'quả táo', 'Apple', 'apple', '苹果|píngguǒ', 'りんご||ringo', 'la pomme', 'la manzana'),
      W('banana', '🍌', 'quả chuối', 'Banana', 'banana', '香蕉|xiāngjiāo', 'バナナ||banana', 'la banane', 'el plátano'),
      W('beer', '🍺', 'bia', 'Beer', 'beer', '啤酒|píjiǔ', 'ビール||bīru', 'la bière', 'la cerveza'),
    ],
    phrases: [
      W('im-hungry', '😋', 'Tôi đói.', '', "I'm hungry.", '我饿了。|wǒ è le.', 'お腹が空きました。|おなかがすきました。|onaka ga sukimashita.', "J'ai faim.", 'Tengo hambre.'),
      W('im-thirsty', '🥤', 'Tôi khát.', '', "I'm thirsty.", '我渴了。|wǒ kě le.', '喉が渇きました。|のどがかわきました。|nodo ga kawakimashita.', "J'ai soif.", 'Tengo sed.'),
      W('delicious', '🤤', 'Ngon quá!', '', "It's delicious!", '很好吃！|hěn hǎochī!', 'おいしい！||oishii!', "C'est délicieux !", '¡Está delicioso!'),
      W('i-like-coffee', '☕', 'Tôi thích cà phê.', '', 'I like coffee.', '我喜欢咖啡。|wǒ xǐhuan kāfēi.', 'コーヒーが好きです。|コーヒーがすきです。|kōhī ga suki desu.', "J'aime le café.", 'Me gusta el café.'),
      W('no-meat', '🥗', 'Tôi không ăn thịt.', '', "I don't eat meat.", '我不吃肉。|wǒ bù chī ròu.', '肉は食べません。|にくはたべません。|niku wa tabemasen.', 'Je ne mange pas de viande.', 'No como carne.'),
    ],
  },

  {
    id: 'mau-sac', emoji: '🎨', vi: 'Màu sắc & tính chất', level: 'A1',
    words: [
      W('red', '🔴', 'màu đỏ', '', 'red', '红色|hóngsè', '赤|あか|aka', 'rouge', 'rojo'),
      W('blue', '🔵', 'màu xanh dương', '', 'blue', '蓝色|lánsè', '青|あお|ao', 'bleu', 'azul'),
      W('green', '🟢', 'màu xanh lá', '', 'green', '绿色|lǜsè', '緑|みどり|midori', 'vert', 'verde'),
      W('yellow', '🟡', 'màu vàng', '', 'yellow', '黄色|huángsè', '黄色|きいろ|kiiro', 'jaune', 'amarillo'),
      W('black', '⚫', 'màu đen', '', 'black', '黑色|hēisè', '黒|くろ|kuro', 'noir', 'negro'),
      W('white', '⚪', 'màu trắng', '', 'white', '白色|báisè', '白|しろ|shiro', 'blanc', 'blanco'),
      W('orange', '🟠', 'màu cam', '', 'orange', '橙色|chéngsè', 'オレンジ||orenji', 'orange', 'naranja'),
      W('pink', '🩷', 'màu hồng', '', 'pink', '粉色|fěnsè', 'ピンク||pinku', 'rose', 'rosa'),
      W('purple', '🟣', 'màu tím', '', 'purple', '紫色|zǐsè', '紫|むらさき|murasaki', 'violet', 'morado'),
      W('brown', '🟤', 'màu nâu', '', 'brown', '棕色|zōngsè', '茶色|ちゃいろ|chairo', 'marron', 'marrón'),
      W('grey', '🩶', 'màu xám', '', 'grey', '灰色|huīsè', '灰色|はいいろ|haiiro', 'gris', 'gris'),
      W('big', '🐘', 'to, lớn', '', 'big', '大|dà', '大きい|おおきい|ōkii', 'grand', 'grande'),
      W('small', '🐭', 'nhỏ', '', 'small', '小|xiǎo', '小さい|ちいさい|chiisai', 'petit', 'pequeño'),
      W('new', '✨', 'mới', '', 'new', '新|xīn', '新しい|あたらしい|atarashii', 'nouveau', 'nuevo'),
      W('old-thing', '🏚️', 'cũ', '', 'old', '旧|jiù', '古い|ふるい|furui', 'vieux', 'viejo'),
    ],
    phrases: [
      W('fav-colour', '🌈', 'Bạn thích màu gì?', '', "What's your favourite colour?", '你喜欢什么颜色？|nǐ xǐhuan shénme yánsè?', '何色が好きですか？|なにいろがすきですか？|nani-iro ga suki desu ka?', 'Quelle est ta couleur préférée ?', '¿Cuál es tu color favorito?'),
      W('like-blue', '💙', 'Tôi thích màu xanh dương.', '', 'I like blue.', '我喜欢蓝色。|wǒ xǐhuan lánsè.', '青が好きです。|あおがすきです。|ao ga suki desu.', "J'aime le bleu.", 'Me gusta el azul.'),
      W('red-car', '🚗', 'một chiếc ô tô màu đỏ', '', 'a red car', '一辆红色的车|yí liàng hóngsè de chē', '赤い車|あかいくるま|akai kuruma', 'une voiture rouge', 'un coche rojo'),
    ],
  },

  {
    id: 'dong-vat', emoji: '🐾', vi: 'Động vật', level: 'A1',
    words: [
      W('dog', '🐶', 'con chó', 'Dog', 'dog', '狗|gǒu', '犬|いぬ|inu', 'le chien', 'el perro'),
      W('cat', '🐱', 'con mèo', 'Cat', 'cat', '猫|māo', '猫|ねこ|neko', 'le chat', 'el gato'),
      W('bird', '🐦', 'con chim', 'Bird', 'bird', '鸟|niǎo', '鳥|とり|tori', "l'oiseau", 'el pájaro'),
      W('fish', '🐠', 'con cá', 'Fish', 'fish', '鱼|yú', '魚|さかな|sakana', 'le poisson', 'el pez'),
      W('horse', '🐴', 'con ngựa', 'Horse', 'horse', '马|mǎ', '馬|うま|uma', 'le cheval', 'el caballo'),
      W('cow', '🐮', 'con bò', 'Cattle', 'cow', '牛|niú', '牛|うし|ushi', 'la vache', 'la vaca'),
      W('pig', '🐷', 'con lợn', 'Pig', 'pig', '猪|zhū', '豚|ぶた|buta', 'le cochon', 'el cerdo'),
      W('hen', '🐔', 'con gà', 'Chicken', 'chicken', '鸡|jī', '鶏|にわとり|niwatori', 'la poule', 'la gallina'),
      W('elephant', '🐘', 'con voi', 'Elephant', 'elephant', '大象|dàxiàng', '象|ぞう|zō', "l'éléphant", 'el elefante'),
      W('monkey', '🐒', 'con khỉ', 'Monkey', 'monkey', '猴子|hóuzi', '猿|さる|saru', 'le singe', 'el mono'),
      W('tiger', '🐯', 'con hổ', 'Tiger', 'tiger', '老虎|lǎohǔ', '虎|とら|tora', 'le tigre', 'el tigre'),
      W('rabbit', '🐰', 'con thỏ', 'Rabbit', 'rabbit', '兔子|tùzi', 'うさぎ||usagi', 'le lapin', 'el conejo'),
    ],
    phrases: [
      W('have-pet', '🐕', 'Bạn có nuôi thú cưng không?', '', 'Have you got a pet?', '你养宠物吗？|nǐ yǎng chǒngwù ma?', 'ペットを飼っていますか？|ペットをかっていますか？|petto o katte imasu ka?', 'Tu as un animal de compagnie ?', '¿Tienes mascota?'),
      W('have-dog', '🦮', 'Tôi nuôi một con chó.', '', "I've got a dog.", '我有一只狗。|wǒ yǒu yì zhī gǒu.', '犬を飼っています。|いぬをかっています。|inu o katte imasu.', "J'ai un chien.", 'Tengo un perro.'),
    ],
  },

  {
    id: 'thoi-gian', emoji: '🕒', vi: 'Thời gian & ngày tháng', level: 'A1',
    words: [
      W('today', '📅', 'hôm nay', '', 'today', '今天|jīntiān', '今日|きょう|kyō', "aujourd'hui", 'hoy'),
      W('tomorrow', '⏭️', 'ngày mai', '', 'tomorrow', '明天|míngtiān', '明日|あした|ashita', 'demain', 'mañana'),
      W('yesterday', '⏮️', 'hôm qua', '', 'yesterday', '昨天|zuótiān', '昨日|きのう|kinō', 'hier', 'ayer'),
      W('morning', '🌄', 'buổi sáng', 'Morning', 'morning', '早上|zǎoshang', '朝|あさ|asa', 'le matin', 'la mañana'),
      W('evening', '🌙', 'buổi tối', 'Night', 'evening', '晚上|wǎnshang', '夜|よる|yoru', 'le soir', 'la noche'),
      W('monday', '1️⃣', 'thứ Hai', '', 'Monday', '星期一|xīngqīyī', '月曜日|げつようび|getsuyōbi', 'lundi', 'lunes'),
      W('tuesday', '2️⃣', 'thứ Ba', '', 'Tuesday', '星期二|xīngqī’èr', '火曜日|かようび|kayōbi', 'mardi', 'martes'),
      W('wednesday', '3️⃣', 'thứ Tư', '', 'Wednesday', '星期三|xīngqīsān', '水曜日|すいようび|suiyōbi', 'mercredi', 'miércoles'),
      W('thursday', '4️⃣', 'thứ Năm', '', 'Thursday', '星期四|xīngqīsì', '木曜日|もくようび|mokuyōbi', 'jeudi', 'jueves'),
      W('friday', '5️⃣', 'thứ Sáu', '', 'Friday', '星期五|xīngqīwǔ', '金曜日|きんようび|kin’yōbi', 'vendredi', 'viernes'),
      W('saturday', '6️⃣', 'thứ Bảy', '', 'Saturday', '星期六|xīngqīliù', '土曜日|どようび|doyōbi', 'samedi', 'sábado'),
      W('sunday', '7️⃣', 'Chủ nhật', '', 'Sunday', '星期天|xīngqītiān', '日曜日|にちようび|nichiyōbi', 'dimanche', 'domingo'),
      W('week', '🗓️', 'tuần', '', 'week', '星期|xīngqī', '週|しゅう|shū', 'la semaine', 'la semana'),
      W('month', '📆', 'tháng', '', 'month', '月|yuè', '月|つき|tsuki', 'le mois', 'el mes'),
      W('year', '🎆', 'năm', '', 'year', '年|nián', '年|とし|toshi', "l'année", 'el año'),
      W('clock', '⏰', 'đồng hồ', 'Clock', 'clock', '钟|zhōng', '時計|とけい|tokei', "l'horloge", 'el reloj'),
    ],
    phrases: [
      W('what-time', '🕰️', 'Mấy giờ rồi?', '', 'What time is it?', '现在几点？|xiànzài jǐ diǎn?', '今何時ですか？|いまなんじですか？|ima nanji desu ka?', 'Quelle heure est-il ?', '¿Qué hora es?'),
      W('its-three', '🕒', 'Bây giờ là ba giờ.', '', "It's three o'clock.", '现在三点。|xiànzài sān diǎn.', '三時です。|さんじです。|sanji desu.', 'Il est trois heures.', 'Son las tres.'),
      W('what-day', '📅', 'Hôm nay là thứ mấy?', '', 'What day is it today?', '今天星期几？|jīntiān xīngqī jǐ?', '今日は何曜日ですか？|きょうはなんようびですか？|kyō wa nan-yōbi desu ka?', 'Quel jour sommes-nous ?', '¿Qué día es hoy?'),
      W('see-tomorrow', '👋', 'Hẹn gặp ngày mai!', '', 'See you tomorrow!', '明天见！|míngtiān jiàn!', 'また明日！|またあした！|mata ashita!', 'À demain !', '¡Hasta mañana!'),
    ],
  },

  {
    id: 'dong-tu', emoji: '🏃', vi: 'Hoạt động hằng ngày', level: 'A1',
    words: [
      W('eat', '🍽️', 'ăn', 'Eating', 'to eat', '吃|chī', '食べる|たべる|taberu', 'manger', 'comer'),
      W('drink', '🥤', 'uống', 'Drinking', 'to drink', '喝|hē', '飲む|のむ|nomu', 'boire', 'beber'),
      W('sleep', '😴', 'ngủ', 'Sleep', 'to sleep', '睡觉|shuìjiào', '寝る|ねる|neru', 'dormir', 'dormir'),
      W('go', '🚶', 'đi', 'Walking', 'to go', '去|qù', '行く|いく|iku', 'aller', 'ir'),
      W('come', '🏃', 'đến', '', 'to come', '来|lái', '来る|くる|kuru', 'venir', 'venir'),
      W('see', '👀', 'nhìn, xem', '', 'to see', '看|kàn', '見る|みる|miru', 'voir', 'ver'),
      W('listen', '👂', 'nghe', 'Hearing', 'to listen', '听|tīng', '聞く|きく|kiku', 'écouter', 'escuchar'),
      W('speak', '🗣️', 'nói', 'Speech', 'to speak', '说|shuō', '話す|はなす|hanasu', 'parler', 'hablar'),
      W('read', '📖', 'đọc', 'Reading', 'to read', '读|dú', '読む|よむ|yomu', 'lire', 'leer'),
      W('write', '✍️', 'viết', 'Handwriting', 'to write', '写|xiě', '書く|かく|kaku', 'écrire', 'escribir'),
      W('buy', '🛍️', 'mua', 'Shopping', 'to buy', '买|mǎi', '買う|かう|kau', 'acheter', 'comprar'),
      W('work', '💼', 'làm việc', '', 'to work', '工作|gōngzuò', '働く|はたらく|hataraku', 'travailler', 'trabajar'),
      W('study', '📚', 'học', 'Learning', 'to study', '学习|xuéxí', '勉強する|べんきょうする|benkyō suru', 'étudier', 'estudiar'),
      W('want', '🙋', 'muốn', '', 'to want', '想要|xiǎng yào', '欲しい|ほしい|hoshii', 'vouloir', 'querer'),
      W('like', '❤️', 'thích', '', 'to like', '喜欢|xǐhuan', '好き|すき|suki', 'aimer', 'gustar'),
      W('have', '🤲', 'có', '', 'to have', '有|yǒu', 'ある||aru', 'avoir', 'tener'),
    ],
    phrases: [
      W('learn-japanese', '🇯🇵', 'Tôi đang học tiếng Nhật.', '', "I'm learning Japanese.", '我在学日语。|wǒ zài xué Rìyǔ.', '日本語を勉強しています。|にほんごをべんきょうしています。|nihongo o benkyō shite imasu.', "J'apprends le japonais.", 'Estoy aprendiendo japonés.'),
      W('speak-english', '🇬🇧', 'Bạn có nói tiếng Anh không?', '', 'Do you speak English?', '你会说英语吗？|nǐ huì shuō Yīngyǔ ma?', '英語を話せますか？|えいごをはなせますか？|eigo o hanasemasu ka?', 'Parlez-vous anglais ?', '¿Habla inglés?'),
      W('a-little', '🤏', 'Một chút thôi.', '', 'Only a little.', '一点点。|yìdiǎndiǎn.', '少しだけ。|すこしだけ。|sukoshi dake.', 'Un petit peu.', 'Solo un poco.'),
      W('what-doing', '🤔', 'Bạn đang làm gì?', '', 'What are you doing?', '你在做什么？|nǐ zài zuò shénme?', '何をしていますか？|なにをしていますか？|nani o shite imasu ka?', "Qu'est-ce que tu fais ?", '¿Qué estás haciendo?'),
      W('going-home', '🏡', 'Tôi về nhà.', '', "I'm going home.", '我回家。|wǒ huí jiā.', '家に帰ります。|いえにかえります。|ie ni kaerimasu.', 'Je rentre à la maison.', 'Me voy a casa.'),
    ],
  },

  {
    id: 'nha-cua', emoji: '🏠', vi: 'Nhà cửa & đồ vật', level: 'A1',
    words: [
      W('house', '🏠', 'ngôi nhà', 'House', 'house', '房子|fángzi', '家|いえ|ie', 'la maison', 'la casa'),
      W('room', '🛋️', 'căn phòng', 'Living room', 'room', '房间|fángjiān', '部屋|へや|heya', 'la pièce', 'la habitación'),
      W('kitchen', '🍳', 'nhà bếp', 'Kitchen', 'kitchen', '厨房|chúfáng', '台所|だいどころ|daidokoro', 'la cuisine', 'la cocina'),
      W('bathroom', '🛁', 'phòng tắm', 'Bathroom', 'bathroom', '浴室|yùshì', 'お風呂|おふろ|ofuro', 'la salle de bain', 'el baño'),
      W('bed', '🛏️', 'cái giường', 'Bed', 'bed', '床|chuáng', 'ベッド||beddo', 'le lit', 'la cama'),
      W('table', '🍽️', 'cái bàn', 'Table (furniture)', 'table', '桌子|zhuōzi', 'テーブル||tēburu', 'la table', 'la mesa'),
      W('chair', '🪑', 'cái ghế', 'Chair', 'chair', '椅子|yǐzi', '椅子|いす|isu', 'la chaise', 'la silla'),
      W('door', '🚪', 'cửa ra vào', 'Door', 'door', '门|mén', 'ドア||doa', 'la porte', 'la puerta'),
      W('window', '🪟', 'cửa sổ', 'Window', 'window', '窗户|chuānghu', '窓|まど|mado', 'la fenêtre', 'la ventana'),
      W('phone', '📱', 'điện thoại', 'Smartphone', 'phone', '手机|shǒujī', 'スマホ||sumaho', 'le téléphone', 'el teléfono'),
      W('computer', '💻', 'máy tính', 'Laptop', 'computer', '电脑|diànnǎo', 'パソコン||pasokon', "l'ordinateur", 'el ordenador'),
      W('key', '🔑', 'chìa khóa', 'Key (lock)', 'key', '钥匙|yàoshi', '鍵|かぎ|kagi', 'la clé', 'la llave'),
      W('book', '📕', 'quyển sách', 'Book', 'book', '书|shū', '本|ほん|hon', 'le livre', 'el libro'),
    ],
    phrases: [
      W('where-live', '📍', 'Bạn sống ở đâu?', '', 'Where do you live?', '你住在哪儿？|nǐ zhù zài nǎr?', 'どこに住んでいますか？|どこにすんでいますか？|doko ni sunde imasu ka?', 'Où habites-tu ?', '¿Dónde vives?'),
      W('live-hanoi', '🏙️', 'Tôi sống ở Hà Nội.', '', 'I live in Hanoi.', '我住在河内。|wǒ zhù zài Hénèi.', 'ハノイに住んでいます。|ハノイにすんでいます。|Hanoi ni sunde imasu.', "J'habite à Hanoï.", 'Vivo en Hanói.'),
      W('come-in', '🚪', 'Mời vào!', '', 'Come in!', '请进！|qǐng jìn!', 'どうぞ、入ってください。|どうぞ、はいってください。|dōzo, haitte kudasai.', 'Entrez !', '¡Adelante!'),
    ],
  },

  {
    id: 'nha-hang', emoji: '🍽️', vi: 'Nhà hàng & quán cà phê', level: 'A2',
    words: [
      W('restaurant', '🍽️', 'nhà hàng', 'Restaurant', 'restaurant', '餐厅|cāntīng', 'レストラン||resutoran', 'le restaurant', 'el restaurante'),
      W('cafe', '☕', 'quán cà phê', 'Coffeehouse', 'café', '咖啡馆|kāfēiguǎn', 'カフェ||kafe', 'le café', 'la cafetería'),
      W('menu', '📋', 'thực đơn', 'Menu', 'menu', '菜单|càidān', 'メニュー||menyū', 'la carte', 'la carta'),
      W('bill', '🧾', 'hóa đơn', '', 'bill', '账单|zhàngdān', 'お会計|おかいけい|okaikei', "l'addition", 'la cuenta'),
      W('waiter', '🤵', 'người phục vụ', 'Waiting staff', 'waiter', '服务员|fúwùyuán', '店員|てんいん|ten’in', 'le serveur', 'el camarero'),
      W('glass', '🥛', 'cái cốc', '', 'glass', '杯子|bēizi', 'コップ||koppu', 'le verre', 'el vaso'),
      W('chopsticks', '🥢', 'đôi đũa', 'Chopsticks', 'chopsticks', '筷子|kuàizi', '箸|はし|hashi', 'les baguettes', 'los palillos'),
      W('spoon', '🥄', 'cái thìa', 'Spoon', 'spoon', '勺子|sháozi', 'スプーン||supūn', 'la cuillère', 'la cuchara'),
    ],
    phrases: [
      W('table-for-two', '👥', 'Cho tôi bàn hai người.', '', 'A table for two, please.', '我们两个人。|wǒmen liǎng ge rén.', '二人です。|ふたりです。|futari desu.', 'Une table pour deux, s’il vous plaît.', 'Una mesa para dos, por favor.'),
      W('menu-please', '📋', 'Cho tôi xem thực đơn.', '', 'Could I see the menu, please?', '请给我菜单。|qǐng gěi wǒ càidān.', 'メニューをください。||menyū o kudasai.', 'La carte, s’il vous plaît.', 'La carta, por favor.'),
      W('id-like-coffee', '☕', 'Cho tôi một cà phê.', '', "I'd like a coffee, please.", '我要一杯咖啡。|wǒ yào yì bēi kāfēi.', 'コーヒーを一つください。|コーヒーをひとつください。|kōhī o hitotsu kudasai.', 'Je voudrais un café, s’il vous plaît.', 'Un café, por favor.'),
      W('recommend', '⭐', 'Bạn gợi ý món gì?', '', 'What do you recommend?', '你推荐什么？|nǐ tuījiàn shénme?', 'おすすめは何ですか？|おすすめはなんですか？|osusume wa nan desu ka?', 'Qu’est-ce que vous recommandez ?', '¿Qué me recomienda?'),
      W('water-please', '💧', 'Cho tôi một cốc nước.', '', 'A glass of water, please.', '请给我一杯水。|qǐng gěi wǒ yì bēi shuǐ.', 'お水をください。|おみずをください。|o-mizu o kudasai.', 'Un verre d’eau, s’il vous plaît.', 'Un vaso de agua, por favor.'),
      W('bill-please', '🧾', 'Làm ơn tính tiền.', '', 'Could I have the bill, please?', '买单！|mǎidān!', 'お会計お願いします。|おかいけいおねがいします。|okaikei onegaishimasu.', 'L’addition, s’il vous plaît.', 'La cuenta, por favor.'),
      W('pay-card', '💳', 'Tôi trả bằng thẻ được không?', '', 'Can I pay by card?', '可以刷卡吗？|kěyǐ shuākǎ ma?', 'カードで払えますか？|カードではらえますか？|kādo de haraemasu ka?', 'Je peux payer par carte ?', '¿Puedo pagar con tarjeta?'),
      W('where-toilet', '🚻', 'Nhà vệ sinh ở đâu?', '', "Where's the toilet?", '洗手间在哪儿？|xǐshǒujiān zài nǎr?', 'トイレはどこですか？||toire wa doko desu ka?', 'Où sont les toilettes ?', '¿Dónde está el baño?'),
    ],
    dialogue: {
      title: 'Gọi đồ uống ở quán cà phê',
      lines: [
        L('Nhân viên', 'Xin chào! Bạn muốn dùng gì?', 'Hello! What would you like?', '你好！你要什么？|nǐ hǎo! nǐ yào shénme?', 'いらっしゃいませ。ご注文は？|いらっしゃいませ。ごちゅうもんは？|irasshaimase. go-chūmon wa?', 'Bonjour ! Qu’est-ce que vous désirez ?', '¡Hola! ¿Qué desea?'),
        L('Khách', 'Cho tôi một cà phê sữa.', 'A white coffee, please.', '我要一杯拿铁。|wǒ yào yì bēi nátiě.', 'カフェラテを一つください。|カフェラテをひとつください。|kafe rate o hitotsu kudasai.', 'Un café au lait, s’il vous plaît.', 'Un café con leche, por favor.'),
        L('Nhân viên', 'Nóng hay đá?', 'Hot or iced?', '热的还是冰的？|rè de háishi bīng de?', 'ホットですか、アイスですか？||hotto desu ka, aisu desu ka?', 'Chaud ou glacé ?', '¿Caliente o con hielo?'),
        L('Khách', 'Đá, cảm ơn. Bao nhiêu tiền?', 'Iced, thanks. How much is it?', '冰的，谢谢。多少钱？|bīng de, xièxie. duōshao qián?', 'アイスでお願いします。いくらですか？|アイスでおねがいします。いくらですか？|aisu de onegaishimasu. ikura desu ka?', 'Glacé, merci. C’est combien ?', 'Con hielo, gracias. ¿Cuánto es?'),
        L('Nhân viên', 'Giá ba bảng rưỡi (25 tệ, 450 yên, 4 euro).', "That's three pounds fifty.", '二十五块。|èrshíwǔ kuài.', '四百五十円です。|よんひゃくごじゅうえんです。|yonhyaku gojū en desu.', 'Ça fait quatre euros.', 'Son cuatro euros.'),
        L('Khách', 'Tôi trả bằng thẻ được không?', 'Can I pay by card?', '可以刷卡吗？|kěyǐ shuākǎ ma?', 'カードで払えますか？|カードではらえますか？|kādo de haraemasu ka?', 'Je peux payer par carte ?', '¿Puedo pagar con tarjeta?'),
        L('Nhân viên', 'Được ạ. Cảm ơn bạn!', 'Of course. Thank you!', '可以。谢谢！|kěyǐ. xièxie!', 'はい、大丈夫です。ありがとうございます！|はい、だいじょうぶです。ありがとうございます！|hai, daijōbu desu. arigatō gozaimasu!', 'Bien sûr. Merci !', 'Claro. ¡Gracias!'),
      ],
    },
  },

  {
    id: 'mua-sam', emoji: '🛍️', vi: 'Mua sắm & tiền', level: 'A2',
    words: [
      W('shop', '🏪', 'cửa hàng', 'Retail', 'shop', '商店|shāngdiàn', '店|みせ|mise', 'le magasin', 'la tienda'),
      W('supermarket', '🛒', 'siêu thị', 'Supermarket', 'supermarket', '超市|chāoshì', 'スーパー||sūpā', 'le supermarché', 'el supermercado'),
      W('market', '🧺', 'chợ', 'Marketplace', 'market', '市场|shìchǎng', '市場|いちば|ichiba', 'le marché', 'el mercado'),
      W('money', '💵', 'tiền', 'Money', 'money', '钱|qián', 'お金|おかね|okane', "l'argent", 'el dinero'),
      W('price', '🏷️', 'giá', 'Price tag', 'price', '价格|jiàgé', '値段|ねだん|nedan', 'le prix', 'el precio'),
      W('cheap', '👍', 'rẻ', '', 'cheap', '便宜|piányi', '安い|やすい|yasui', 'pas cher', 'barato'),
      W('expensive', '💸', 'đắt', '', 'expensive', '贵|guì', '高い|たかい|takai', 'cher', 'caro'),
      W('clothes', '👕', 'quần áo', 'Clothing', 'clothes', '衣服|yīfu', '服|ふく|fuku', 'les vêtements', 'la ropa'),
      W('shoes', '👟', 'giày', 'Shoe', 'shoes', '鞋|xié', '靴|くつ|kutsu', 'les chaussures', 'los zapatos'),
      W('bag', '👜', 'cái túi', 'Handbag', 'bag', '包|bāo', 'かばん||kaban', 'le sac', 'el bolso'),
      W('card', '💳', 'thẻ ngân hàng', 'Payment card', 'card', '卡|kǎ', 'カード||kādo', 'la carte', 'la tarjeta'),
      W('cash', '💴', 'tiền mặt', 'Cash', 'cash', '现金|xiànjīn', '現金|げんきん|genkin', 'les espèces', 'el efectivo'),
    ],
    phrases: [
      W('how-much', '💰', 'Cái này bao nhiêu tiền?', '', 'How much is this?', '这个多少钱？|zhège duōshao qián?', 'これはいくらですか？||kore wa ikura desu ka?', 'C’est combien ?', '¿Cuánto cuesta esto?'),
      W('too-expensive', '😱', 'Đắt quá!', '', "It's too expensive!", '太贵了！|tài guì le!', '高すぎます！|たかすぎます！|takasugimasu!', 'C’est trop cher !', '¡Es demasiado caro!'),
      W('take-this', '👆', 'Tôi lấy cái này.', '', "I'll take this one.", '我要这个。|wǒ yào zhège.', 'これをください。||kore o kudasai.', 'Je prends celui-ci.', 'Me llevo este.'),
      W('just-looking', '👀', 'Tôi chỉ xem thôi.', '', "I'm just looking, thanks.", '我只是看看。|wǒ zhǐshì kànkan.', '見ているだけです。|みているだけです。|mite iru dake desu.', 'Je regarde seulement, merci.', 'Solo estoy mirando, gracias.'),
      W('bigger-size', '📏', 'Có cỡ lớn hơn không?', '', 'Have you got a bigger size?', '有大一点的吗？|yǒu dà yìdiǎn de ma?', 'もっと大きいサイズはありますか？|もっとおおきいサイズはありますか？|motto ōkii saizu wa arimasu ka?', 'Vous avez une taille plus grande ?', '¿Tiene una talla más grande?'),
    ],
    dialogue: {
      title: 'Mua áo',
      lines: [
        L('Khách', 'Xin lỗi, cái áo này bao nhiêu tiền?', 'Excuse me, how much is this shirt?', '请问，这件衬衫多少钱？|qǐngwèn, zhè jiàn chènshān duōshao qián?', 'すみません、このシャツはいくらですか？||sumimasen, kono shatsu wa ikura desu ka?', 'Excusez-moi, combien coûte cette chemise ?', 'Perdone, ¿cuánto cuesta esta camisa?'),
        L('Người bán', 'Giá hai mươi bảng (200 tệ, 3000 yên, 20 euro).', "It's twenty pounds.", '两百块。|liǎngbǎi kuài.', '三千円です。|さんぜんえんです。|sanzen en desu.', 'Elle coûte vingt euros.', 'Cuesta veinte euros.'),
        L('Khách', 'Hơi đắt. Có cỡ lớn hơn không?', "It's a bit expensive. Have you got a bigger size?", '有点贵。有大一点的吗？|yǒudiǎn guì. yǒu dà yìdiǎn de ma?', 'ちょっと高いですね。もっと大きいサイズはありますか？|ちょっとたかいですね。もっとおおきいサイズはありますか？|chotto takai desu ne. motto ōkii saizu wa arimasu ka?', 'C’est un peu cher. Vous avez une taille plus grande ?', 'Es un poco caro. ¿Tiene una talla más grande?'),
        L('Người bán', 'Có, đây ạ.', 'Yes, here you are.', '有，给你。|yǒu, gěi nǐ.', 'はい、どうぞ。||hai, dōzo.', 'Oui, voilà.', 'Sí, aquí tiene.'),
        L('Khách', 'Cảm ơn. Tôi lấy cái này.', "Thanks. I'll take it.", '谢谢。我要这件。|xièxie. wǒ yào zhè jiàn.', 'ありがとう。これをください。||arigatō. kore o kudasai.', 'Merci. Je la prends.', 'Gracias. Me la llevo.'),
      ],
    },
  },

  {
    id: 'di-lai', emoji: '🚆', vi: 'Đi lại & hỏi đường', level: 'A2',
    words: [
      W('station', '🚉', 'nhà ga', 'Train station', 'station', '车站|chēzhàn', '駅|えき|eki', 'la gare', 'la estación'),
      W('airport', '✈️', 'sân bay', 'Airport', 'airport', '机场|jīchǎng', '空港|くうこう|kūkō', "l'aéroport", 'el aeropuerto'),
      W('train', '🚆', 'tàu hỏa', 'Train', 'train', '火车|huǒchē', '電車|でんしゃ|densha', 'le train', 'el tren'),
      W('bus', '🚌', 'xe buýt', 'Bus', 'bus', '公交车|gōngjiāochē', 'バス||basu', 'le bus', 'el autobús'),
      W('taxi', '🚕', 'taxi', 'Taxi', 'taxi', '出租车|chūzūchē', 'タクシー||takushī', 'le taxi', 'el taxi'),
      W('car', '🚗', 'ô tô', 'Car', 'car', '汽车|qìchē', '車|くるま|kuruma', 'la voiture', 'el coche'),
      W('bicycle', '🚲', 'xe đạp', 'Bicycle', 'bicycle', '自行车|zìxíngchē', '自転車|じてんしゃ|jitensha', 'le vélo', 'la bicicleta'),
      W('ticket', '🎫', 'vé', '', 'ticket', '票|piào', '切符|きっぷ|kippu', 'le billet', 'el billete'),
      W('hotel', '🏨', 'khách sạn', 'Hotel', 'hotel', '酒店|jiǔdiàn', 'ホテル||hoteru', "l'hôtel", 'el hotel'),
      W('left', '⬅️', 'bên trái', '', 'left', '左|zuǒ', '左|ひだり|hidari', 'à gauche', 'a la izquierda'),
      W('right', '➡️', 'bên phải', '', 'right', '右|yòu', '右|みぎ|migi', 'à droite', 'a la derecha'),
      W('straight', '⬆️', 'đi thẳng', '', 'straight on', '一直走|yìzhí zǒu', 'まっすぐ||massugu', 'tout droit', 'todo recto'),
      W('near', '📍', 'gần', '', 'near', '近|jìn', '近い|ちかい|chikai', 'près', 'cerca'),
      W('far', '🗺️', 'xa', '', 'far', '远|yuǎn', '遠い|とおい|tōi', 'loin', 'lejos'),
    ],
    phrases: [
      W('where-station', '🚉', 'Ga tàu ở đâu?', '', "Where's the station?", '车站在哪儿？|chēzhàn zài nǎr?', '駅はどこですか？|えきはどこですか？|eki wa doko desu ka?', 'Où est la gare ?', '¿Dónde está la estación?'),
      W('turn-left', '↩️', 'Rẽ trái.', '', 'Turn left.', '往左拐。|wǎng zuǒ guǎi.', '左に曲がってください。|ひだりにまがってください。|hidari ni magatte kudasai.', 'Tournez à gauche.', 'Gire a la izquierda.'),
      W('is-it-far', '🤔', 'Có xa không?', '', 'Is it far?', '远吗？|yuǎn ma?', '遠いですか？|とおいですか？|tōi desu ka?', 'C’est loin ?', '¿Está lejos?'),
      W('one-ticket', '🎟️', 'Cho tôi một vé.', '', 'One ticket, please.', '一张票。|yì zhāng piào.', '切符を一枚ください。|きっぷをいちまいください。|kippu o ichimai kudasai.', 'Un billet, s’il vous plaît.', 'Un billete, por favor.'),
      W('take-me', '🚕', 'Cho tôi đến địa chỉ này.', '', 'Please take me to this address.', '请带我去这个地址。|qǐng dài wǒ qù zhège dìzhǐ.', 'この住所までお願いします。|このじゅうしょまでおねがいします。|kono jūsho made onegaishimasu.', 'Emmenez-moi à cette adresse, s’il vous plaît.', 'Lléveme a esta dirección, por favor.'),
      W('im-lost', '😵', 'Tôi bị lạc đường.', '', "I'm lost.", '我迷路了。|wǒ mílù le.', '道に迷いました。|みちにまよいました。|michi ni mayoimashita.', 'Je suis perdu.', 'Estoy perdido.'),
    ],
    dialogue: {
      title: 'Hỏi đường đến ga',
      lines: [
        L('Du khách', 'Xin lỗi, ga tàu ở đâu?', "Excuse me, where's the station?", '请问，火车站在哪儿？|qǐngwèn, huǒchēzhàn zài nǎr?', 'すみません、駅はどこですか？|すみません、えきはどこですか？|sumimasen, eki wa doko desu ka?', 'Excusez-moi, où est la gare ?', 'Perdone, ¿dónde está la estación?'),
        L('Người dân', 'Đi thẳng, rồi rẽ trái.', 'Go straight on, then turn left.', '一直走，然后往左拐。|yìzhí zǒu, ránhòu wǎng zuǒ guǎi.', 'まっすぐ行って、左に曲がってください。|まっすぐいって、ひだりにまがってください。|massugu itte, hidari ni magatte kudasai.', 'Allez tout droit, puis tournez à gauche.', 'Siga todo recto y luego gire a la izquierda.'),
        L('Du khách', 'Có xa không?', 'Is it far?', '远吗？|yuǎn ma?', '遠いですか？|とおいですか？|tōi desu ka?', 'C’est loin ?', '¿Está lejos?'),
        L('Người dân', 'Không, đi bộ năm phút thôi.', "No, it's only a five-minute walk.", '不远，走五分钟就到了。|bù yuǎn, zǒu wǔ fēnzhōng jiù dào le.', 'いいえ、歩いて五分ぐらいです。|いいえ、あるいてごふんぐらいです。|iie, aruite gofun gurai desu.', 'Non, c’est à cinq minutes à pied.', 'No, está a cinco minutos a pie.'),
        L('Du khách', 'Cảm ơn nhiều!', 'Thank you very much!', '非常感谢！|fēicháng gǎnxiè!', 'どうもありがとうございます！||dōmo arigatō gozaimasu!', 'Merci beaucoup !', '¡Muchas gracias!'),
        L('Người dân', 'Không có gì.', "You're welcome.", '不客气。|bú kèqi.', 'どういたしまして。||dō itashimashite.', 'De rien.', 'De nada.'),
      ],
    },
  },

  {
    id: 'thoi-tiet', emoji: '☀️', vi: 'Thời tiết & mùa', level: 'A2',
    words: [
      W('weather', '🌤️', 'thời tiết', 'Weather', 'weather', '天气|tiānqì', '天気|てんき|tenki', 'le temps', 'el tiempo'),
      W('sunny', '☀️', 'trời nắng', 'Sunlight', 'sunny', '晴天|qíngtiān', '晴れ|はれ|hare', 'ensoleillé', 'soleado'),
      W('rain', '🌧️', 'mưa', 'Rain', 'rain', '雨|yǔ', '雨|あめ|ame', 'la pluie', 'la lluvia'),
      W('snow', '❄️', 'tuyết', 'Snow', 'snow', '雪|xuě', '雪|ゆき|yuki', 'la neige', 'la nieve'),
      W('wind', '💨', 'gió', 'Wind', 'wind', '风|fēng', '風|かぜ|kaze', 'le vent', 'el viento'),
      W('cloud', '☁️', 'mây', 'Cloud', 'cloud', '云|yún', '雲|くも|kumo', 'le nuage', 'la nube'),
      W('hot', '🥵', 'nóng', '', 'hot', '热|rè', '暑い|あつい|atsui', 'chaud', 'caluroso'),
      W('cold', '🥶', 'lạnh', '', 'cold', '冷|lěng', '寒い|さむい|samui', 'froid', 'frío'),
      W('umbrella', '☂️', 'cái ô', 'Umbrella', 'umbrella', '雨伞|yǔsǎn', '傘|かさ|kasa', 'le parapluie', 'el paraguas'),
      W('spring', '🌸', 'mùa xuân', 'Spring (season)', 'spring', '春天|chūntiān', '春|はる|haru', 'le printemps', 'la primavera'),
      W('summer', '🏖️', 'mùa hè', 'Summer', 'summer', '夏天|xiàtiān', '夏|なつ|natsu', "l'été", 'el verano'),
      W('autumn', '🍂', 'mùa thu', 'Autumn', 'autumn', '秋天|qiūtiān', '秋|あき|aki', "l'automne", 'el otoño'),
      W('winter', '⛄', 'mùa đông', 'Winter', 'winter', '冬天|dōngtiān', '冬|ふゆ|fuyu', "l'hiver", 'el invierno'),
    ],
    phrases: [
      W('weather-today', '🌦️', 'Hôm nay thời tiết thế nào?', '', "What's the weather like today?", '今天天气怎么样？|jīntiān tiānqì zěnmeyàng?', '今日の天気はどうですか？|きょうのてんきはどうですか？|kyō no tenki wa dō desu ka?', 'Quel temps fait-il aujourd’hui ?', '¿Qué tiempo hace hoy?'),
      W('its-raining', '🌧️', 'Trời đang mưa.', '', "It's raining.", '下雨了。|xià yǔ le.', '雨が降っています。|あめがふっています。|ame ga futte imasu.', 'Il pleut.', 'Está lloviendo.'),
      W('its-hot', '🥵', 'Hôm nay nóng quá.', '', "It's really hot today.", '今天很热。|jīntiān hěn rè.', '今日はとても暑いです。|きょうはとてもあついです。|kyō wa totemo atsui desu.', 'Il fait très chaud aujourd’hui.', 'Hoy hace mucho calor.'),
      W('its-cold', '🥶', 'Trời lạnh.', '', "It's cold.", '天气很冷。|tiānqì hěn lěng.', '寒いです。|さむいです。|samui desu.', 'Il fait froid.', 'Hace frío.'),
    ],
    dialogue: {
      title: 'Trời mưa rồi',
      lines: [
        L('An', 'Hôm nay thời tiết thế nào?', "What's the weather like today?", '今天天气怎么样？|jīntiān tiānqì zěnmeyàng?', '今日の天気はどうですか？|きょうのてんきはどうですか？|kyō no tenki wa dō desu ka?', 'Quel temps fait-il aujourd’hui ?', '¿Qué tiempo hace hoy?'),
        L('Sam', 'Trời lạnh và đang mưa.', "It's cold and it's raining.", '很冷，还在下雨。|hěn lěng, hái zài xià yǔ.', '寒くて、雨が降っています。|さむくて、あめがふっています。|samukute, ame ga futte imasu.', 'Il fait froid et il pleut.', 'Hace frío y está lloviendo.'),
        L('An', 'Ôi không! Tôi không mang ô.', "Oh no! I haven't got an umbrella.", '哎呀！我没带伞。|āiyā! wǒ méi dài sǎn.', 'ああ、傘を持っていません。|ああ、かさをもっていません。|ā, kasa o motte imasen.', 'Oh non ! Je n’ai pas de parapluie.', '¡Oh, no! No tengo paraguas.'),
        L('Sam', 'Bạn dùng ô của tôi đi.', 'Take my umbrella.', '用我的伞吧。|yòng wǒ de sǎn ba.', '私の傘を使ってください。|わたしのかさをつかってください。|watashi no kasa o tsukatte kudasai.', 'Prends mon parapluie.', 'Usa mi paraguas.'),
        L('An', 'Cảm ơn bạn nhiều!', 'Thanks a lot!', '太谢谢你了！|tài xièxie nǐ le!', '本当にありがとう！|ほんとうにありがとう！|hontō ni arigatō!', 'Merci beaucoup !', '¡Muchas gracias!'),
      ],
    },
  },

  {
    id: 'suc-khoe', emoji: '🩺', vi: 'Cơ thể & sức khỏe', level: 'A2',
    words: [
      W('head', '🙆', 'đầu', 'Head', 'head', '头|tóu', '頭|あたま|atama', 'la tête', 'la cabeza'),
      W('eye', '👁️', 'mắt', 'Eye', 'eye', '眼睛|yǎnjing', '目|め|me', "l'œil", 'el ojo'),
      W('ear', '👂', 'tai', 'Ear', 'ear', '耳朵|ěrduo', '耳|みみ|mimi', "l'oreille", 'la oreja'),
      W('mouth', '👄', 'miệng', 'Mouth', 'mouth', '嘴|zuǐ', '口|くち|kuchi', 'la bouche', 'la boca'),
      W('hand', '✋', 'bàn tay', 'Hand', 'hand', '手|shǒu', '手|て|te', 'la main', 'la mano'),
      W('foot', '🦶', 'bàn chân', 'Foot', 'foot', '脚|jiǎo', '足|あし|ashi', 'le pied', 'el pie'),
      W('stomach', '🫃', 'bụng', 'Abdomen', 'stomach', '肚子|dùzi', 'お腹|おなか|onaka', 'le ventre', 'la barriga'),
      W('doctor', '🧑‍⚕️', 'bác sĩ', 'Physician', 'doctor', '医生|yīshēng', '医者|いしゃ|isha', 'le médecin', 'el médico'),
      W('hospital', '🏥', 'bệnh viện', 'Hospital', 'hospital', '医院|yīyuàn', '病院|びょういん|byōin', "l'hôpital", 'el hospital'),
      W('medicine', '💊', 'thuốc', 'Medication', 'medicine', '药|yào', '薬|くすり|kusuri', 'le médicament', 'la medicina'),
      W('pharmacy', '⚕️', 'hiệu thuốc', 'Pharmacy (shop)', "chemist's", '药店|yàodiàn', '薬局|やっきょく|yakkyoku', 'la pharmacie', 'la farmacia'),
      W('tired', '😩', 'mệt', '', 'tired', '累|lèi', '疲れた|つかれた|tsukareta', 'fatigué', 'cansado'),
      W('ill', '🤒', 'ốm', '', 'ill', '生病|shēngbìng', '病気|びょうき|byōki', 'malade', 'enfermo'),
    ],
    phrases: [
      W('headache', '🤕', 'Tôi bị đau đầu.', '', "I've got a headache.", '我头疼。|wǒ tóu téng.', '頭が痛いです。|あたまがいたいです。|atama ga itai desu.', 'J’ai mal à la tête.', 'Me duele la cabeza.'),
      W('call-doctor', '📞', 'Làm ơn gọi bác sĩ.', '', 'Please call a doctor.', '请叫医生。|qǐng jiào yīshēng.', 'お医者さんを呼んでください。|おいしゃさんをよんでください。|o-isha-san o yonde kudasai.', 'Appelez un médecin, s’il vous plaît.', 'Llame a un médico, por favor.'),
      W('help', '🆘', 'Cứu tôi với!', '', 'Help!', '救命！|jiùmìng!', '助けて！|たすけて！|tasukete!', 'Au secours !', '¡Socorro!'),
      W('feel-better', '😌', 'Tôi thấy khá hơn rồi.', '', 'I feel better now.', '我好多了。|wǒ hǎo duō le.', '良くなりました。|よくなりました。|yoku narimashita.', 'Je me sens mieux.', 'Me siento mejor.'),
    ],
  },

  {
    id: 'cong-viec', emoji: '💼', vi: 'Công việc & trường học', level: 'A2',
    words: [
      W('job', '💼', 'công việc', '', 'job', '工作|gōngzuò', '仕事|しごと|shigoto', 'le travail', 'el trabajo'),
      W('teacher', '🧑‍🏫', 'giáo viên', 'Teacher', 'teacher', '老师|lǎoshī', '先生|せんせい|sensei', 'le professeur', 'el profesor'),
      W('student', '🧑‍🎓', 'học sinh, sinh viên', 'Student', 'student', '学生|xuésheng', '学生|がくせい|gakusei', "l'étudiant", 'el estudiante'),
      W('engineer', '👷', 'kỹ sư', 'Engineer', 'engineer', '工程师|gōngchéngshī', 'エンジニア||enjinia', "l'ingénieur", 'el ingeniero'),
      W('nurse', '🩺', 'y tá', 'Nursing', 'nurse', '护士|hùshi', '看護師|かんごし|kangoshi', "l'infirmier", 'el enfermero'),
      W('chef', '🧑‍🍳', 'đầu bếp', 'Chef', 'chef', '厨师|chúshī', 'シェフ||shefu', 'le cuisinier', 'el cocinero'),
      W('office', '🏢', 'văn phòng', 'Office', 'office', '办公室|bàngōngshì', 'オフィス||ofisu', 'le bureau', 'la oficina'),
      W('company', '🏬', 'công ty', 'Company', 'company', '公司|gōngsī', '会社|かいしゃ|kaisha', "l'entreprise", 'la empresa'),
      W('school', '🏫', 'trường học', 'School', 'school', '学校|xuéxiào', '学校|がっこう|gakkō', "l'école", 'la escuela'),
      W('meeting', '👥', 'cuộc họp', 'Meeting', 'meeting', '会议|huìyì', '会議|かいぎ|kaigi', 'la réunion', 'la reunión'),
    ],
    phrases: [
      W('what-job', '❔', 'Bạn làm nghề gì?', '', 'What do you do?', '你做什么工作？|nǐ zuò shénme gōngzuò?', 'お仕事は何ですか？|おしごとはなんですか？|o-shigoto wa nan desu ka?', 'Qu’est-ce que vous faites dans la vie ?', '¿A qué te dedicas?'),
      W('im-engineer', '👷', 'Tôi là kỹ sư.', '', "I'm an engineer.", '我是工程师。|wǒ shì gōngchéngshī.', 'エンジニアです。||enjinia desu.', 'Je suis ingénieur.', 'Soy ingeniero.'),
      W('busy', '⏳', 'Tôi rất bận.', '', "I'm very busy.", '我很忙。|wǒ hěn máng.', 'とても忙しいです。|とてもいそがしいです。|totemo isogashii desu.', 'Je suis très occupé.', 'Estoy muy ocupado.'),
    ],
  },

  {
    id: 'cam-xuc', emoji: '😊', vi: 'Cảm xúc & nhận xét', level: 'A2',
    words: [
      W('happy', '😄', 'vui', '', 'happy', '高兴|gāoxìng', '嬉しい|うれしい|ureshii', 'heureux', 'feliz'),
      W('sad', '😢', 'buồn', '', 'sad', '难过|nánguò', '悲しい|かなしい|kanashii', 'triste', 'triste'),
      W('angry', '😠', 'tức giận', '', 'angry', '生气|shēngqì', '怒っている|おこっている|okotte iru', 'en colère', 'enfadado'),
      W('scared', '😨', 'sợ', '', 'scared', '害怕|hàipà', '怖い|こわい|kowai', 'effrayé', 'asustado'),
      W('surprised', '😲', 'ngạc nhiên', '', 'surprised', '惊讶|jīngyà', '驚いた|おどろいた|odoroita', 'surpris', 'sorprendido'),
      W('bored', '🥱', 'chán', '', 'bored', '无聊|wúliáo', '退屈|たいくつ|taikutsu', 'ennuyé', 'aburrido'),
      W('love', '❤️', 'yêu', '', 'to love', '爱|ài', '愛する|あいする|aisuru', 'aimer', 'amar'),
      W('good', '👍', 'tốt', '', 'good', '好|hǎo', 'いい||ii', 'bon', 'bueno'),
      W('bad', '👎', 'tệ', '', 'bad', '坏|huài', '悪い|わるい|warui', 'mauvais', 'malo'),
      W('beautiful', '🌺', 'đẹp', '', 'beautiful', '漂亮|piàoliang', 'きれい||kirei', 'beau', 'bonito'),
      W('fun', '🎉', 'vui, thú vị', '', 'fun', '有意思|yǒu yìsi', '楽しい|たのしい|tanoshii', 'amusant', 'divertido'),
      W('difficult', '🧗', 'khó', '', 'difficult', '难|nán', '難しい|むずかしい|muzukashii', 'difficile', 'difícil'),
      W('easy', '🍰', 'dễ', '', 'easy', '容易|róngyì', '簡単|かんたん|kantan', 'facile', 'fácil'),
    ],
    phrases: [
      W('im-happy', '😄', 'Tôi rất vui.', '', "I'm very happy.", '我很高兴。|wǒ hěn gāoxìng.', 'とても嬉しいです。|とてもうれしいです。|totemo ureshii desu.', 'Je suis très content.', 'Estoy muy contento.'),
      W('dont-worry', '🤗', 'Đừng lo.', '', "Don't worry.", '别担心。|bié dānxīn.', '心配しないで。|しんぱいしないで。|shinpai shinaide.', 'Ne t’inquiète pas.', 'No te preocupes.'),
      W('great', '🤩', 'Tuyệt vời!', '', 'Brilliant!', '太棒了！|tài bàng le!', 'すごい！||sugoi!', 'Génial !', '¡Genial!'),
      W('i-love-you', '💕', 'Anh yêu em / Em yêu anh.', '', 'I love you.', '我爱你。|wǒ ài nǐ.', '愛してる。|あいしてる。|aishiteru.', 'Je t’aime.', 'Te quiero.'),
    ],
  },
];

// Tất cả mục (từ + câu) theo id
export const ITEMS = {};
for (const t of TOPICS) {
  for (const it of [...t.words, ...t.phrases]) {
    it.topic = t.id;
    it.kind = t.words.includes(it) ? 'word' : 'phrase';
    ITEMS[it.id] = it;
  }
}
