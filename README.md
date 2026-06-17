# 📝 Ứng Dụng Chuyển Đổi Đề Thi Word Thành Đề Luyện Tập Tương Tác

Ứng dụng thông minh giúp tự động hóa quy trình biến các file tài liệu Word (`.docx`) chứa đề thi truyền thống thành các bài tập trắc nghiệm trực quan, sinh động và có tính tương tác cao.

---

## 📌 Mục Lục (Click để xem nhanh)
* [1. Giao diện tải lên file đề](#1-giao-diện-tải-lên-file-đề)
* [2. Tự động xử lý cấu trúc file Word](#2-tự-động-xử-lý-cấu-trúc-file-word)
* [3. Tách và phân chia số lượng câu hỏi](#3-tách-và-phân-chia-số-lượng-câu-hỏi)
* [4. Chế độ chấm điểm và hiển thị đáp án tức thời](#4-chế-độ-chấm-điểm-và-hiển-thị-đáp-án-tức-thời)

---

## 🚀 Các Tính Năng Chính

### 1. Giao diện tải lên file đề
Giao diện tối giản, hiện đại và dễ sử dụng. Người dùng chỉ cần một thao tác click hoặc kéo thả để tải file Word chứa bộ đề hệ thống vào ứng dụng.

* **Tính năng:** Hỗ trợ định dạng `.docx`, xử lý tải lên nhanh chóng.
* **Minh họa giao diện:**

<p align="center">
  <img width="852" height="341" alt="Giao diện thêm file" src="https://github.com/user-attachments/assets/0c5372fa-041c-406a-a0fe-aca762b52c04" />
</p>

---

### 2. Tự động xử lý cấu trúc file Word
Hệ thống tích hợp bộ parser thông minh để phân tích cú pháp dữ liệu văn bản. Tự động bóc tách nội dung câu hỏi, các phương án lựa chọn (A, B, C, D) và chuyển đổi thành form làm bài tương tác trực tuyến.

* **Tính năng:** Giữ nguyên định dạng văn bản, hình ảnh đi kèm (nếu có) và nhận diện chính xác các block câu hỏi.
* **Minh họa giao diện:**

<p align="center">
  <img width="612" height="313" alt="Xử lý file Word thành form" src="https://github.com/user-attachments/assets/294ebf2b-10fa-49cf-945f-8a5273e4a02b" />
</p>

---

### 3. Tách và phân chia số lượng câu hỏi
Hỗ trợ quản lý và phân phối ngân hàng câu hỏi một cách linh hoạt. Cho phép người dùng hoặc hệ thống tự động chia nhỏ một file đề lớn thành nhiều đề luyện tập nhỏ hơn với số lượng câu hỏi tùy chỉnh.

* **Tính năng:** Giúp người học không bị ngợp, dễ dàng quản lý tiến độ luyện đề theo từng chặng ngắn.
* **Minh họa giao diện:**

<p align="center">
  <img width="634" height="862" alt="Chia nhỏ số lượng câu hỏi theo đề" src="https://github.com/user-attachments/assets/cf91ed97-ba0a-42b6-bacf-fa573a741eea" />
</p>

---

### 4. Chế độ chấm điểm và hiển thị đáp án tức thời
Tăng cường trải nghiệm học tập chủ động bằng cách phản hồi kết quả ngay khi người dùng tương tác.

* **Tính năng:** * Hiện màu **Xanh** cho đáp án Đúng.
  * Hiện màu **Đỏ** cho đáp án Sai.
  * Giúp người học nhận biết lỗi sai ngay lập tức để kịp thời ghi nhớ kiến thức.
* **Minh họa giao diện:**

<p align="center">
  <img width="317" height="182" alt="Hiển thị đáp án đúng sai tức thời" src="https://github.com/user-attachments/assets/60134c39-81f0-46b8-b270-81e0786f1666" />
</p>

---

## 🛠️ Công Nghệ Sử Dụng (Tùy chỉnh theo dự án của bạn)
* **Frontend:** Vue.js / React.js, Tailwind CSS
* **Backend:** Node.js / Express
* **File Processing:** Mammoth.js / Docx-parser (để đọc file Word)
