# Học Ngôn Ngữ

App web học cùng lúc **tiếng Anh (UK), Trung, Nhật, Pháp, Tây Ban Nha** từ con số 0, giao diện tiếng Việt.
Chạy trên điện thoại, iPad, laptop; cài được như app (PWA); đồng bộ tiến độ thời gian thực qua Firebase (miễn phí).

## Có gì trong app
- **Chữ viết & phát âm**: bảng Hiragana/Katakana (bấm để nghe, có bài luyện), Pinyin + 4 thanh điệu (có bài luyện nghe), phụ âm/vần, bộ thủ; bảng chữ cái và các âm khó của Anh, Pháp, Tây Ban Nha.
- **16 chủ đề A1–A2** (285 từ & mẫu câu, 7 hội thoại): mỗi mục hiện cả 5 ngôn ngữ, chung một hình minh họa, có phiên âm (Pinyin, Kana, Romaji).
- **Hình ảnh / GIF / video**: ảnh từ Wikipedia, GIF & video từ Wikimedia Commons (có ghi nguồn), nút 🎬 mở YouGlish để xem người bản xứ nói từ đó trong video thật.
- **Âm thanh & luyện nói**: giọng đọc của trình duyệt cho từng ngôn ngữ; 🎤 nhận diện giọng nói và chấm điểm phát âm.
- **Học thẻ, luyện tập, ôn tập ngắt quãng**: 5 dạng câu hỏi (chọn từ theo hình, đọc hiểu, nghe, chuyển ngữ giữa 2 ngôn ngữ, nói); từ sai quay lại sau 10 phút, từ đúng giãn dần 1–80 ngày. Tiến độ tính riêng từng ngôn ngữ; có thể tắt bớt ngôn ngữ bằng các nút cờ.
- **Tiến độ**: chuỗi ngày học, điểm mỗi ngày, số từ đã nhớ / thuộc lâu / cần ôn theo ngôn ngữ.

## Chạy thử trên máy
Cần một web server tĩnh bất kỳ (không mở trực tiếp file index.html):
```
cd hoc-ngon-ngu
python3 -m http.server 8000
```
rồi mở http://localhost:8000

## Đưa lên mạng miễn phí (GitHub Pages)
1. Đẩy thư mục này lên một repo GitHub.
2. Repo → Settings → Pages → Source: *Deploy from a branch*, chọn nhánh `main`, thư mục `/ (root)`.
3. Sau 1–2 phút app có ở `https://<tên-github>.github.io/<tên-repo>/`.

## Bật đồng bộ giữa các thiết bị (Firebase, gói Spark miễn phí)
1. https://console.firebase.google.com → *Add project*.
2. *Build → Authentication → Get started*: bật **Google** và **Email/Password**. Trong *Settings → Authorized domains* thêm `<tên-github>.github.io`.
3. *Build → Firestore Database → Create database* (chế độ production), rồi vào tab *Rules*, dán nội dung file `firestore.rules`, bấm *Publish*.
4. *Project settings → Your apps → Web (</>)*: đăng ký app, sao chép đoạn `firebaseConfig` vào `firebase-config.js` (thay `null`).
5. Trên mỗi thiết bị: mở app → Cài đặt → Đăng nhập. Tiến độ, cài đặt và điểm số đồng bộ ngay lập tức.

## Cấu trúc
```
index.html, css/style.css, manifest.webmanifest, sw.js (chạy offline)
firebase-config.js      cấu hình Firebase (để null = chỉ lưu trên máy)
js/app.js               giao diện & các màn hình
js/data/lessons.js      nội dung bài học (thêm chủ đề mới ở đây)
js/data/scripts.js      chữ viết & phát âm
js/store.js             tiến độ, ôn tập ngắt quãng
js/sync.js              đồng bộ Firebase
js/audio.js             phát âm & nhận diện giọng nói
js/media.js             ảnh/GIF/video từ Wikipedia & Wikimedia Commons
```

## Nguồn
Nội dung bài học biên soạn cho app theo chủ đề CEFR A1–A2 / HSK 1–3 / JLPT N5–N4. Ảnh, GIF, video: Wikipedia & Wikimedia Commons (giấy phép mở, ghi nguồn trên từng mục). Video phát âm: YouGlish. Giọng đọc: Web Speech API của trình duyệt.
