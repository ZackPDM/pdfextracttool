# PDF Image Extractor Tool

Đây là một ứng dụng Web siêu nhẹ (Mini Web App) giúp bạn tự động trích xuất toàn bộ hình ảnh chất lượng cao từ các tệp tài liệu PDF một cách nhanh chóng và thông minh.

## 🚀 Tính năng nổi bật

- **Giao diện hiện đại (Glassmorphism)**: Tối ưu trải nghiệm người dùng với tính năng kéo-thả (Drag & Drop) mượt mà.
- **Trích xuất siêu tốc**: Xử lý PDF ngay lập tức trên máy của bạn.
- **Bộ lọc ảnh rác thông minh**: Tự động loại bỏ các icon nhỏ, gạch đầu dòng, logo vụn vặt và chỉ giữ lại những hình ảnh, đồ thị quan trọng.
- **Tự động đóng gói**: Kết quả trả về là một tệp `.zip` gọn gàng chứa toàn bộ ảnh.
- **An toàn & Riêng tư**: Mọi quá trình xử lý đều diễn ra cục bộ (trên máy tính của bạn), tài liệu của bạn không bao giờ bị tải lên bên thứ 3.

---

## 💻 Hướng dẫn Cài đặt & Sử dụng (Clone)

Để "clone" (tải) và chạy dự án này trên máy tính của bạn, bạn cần cài đặt sẵn **Python** và **Git**.

### Bước 1: Tải mã nguồn về máy (Clone)
Mở Terminal / Command Prompt và chạy lệnh sau để tải source code:
```bash
git clone https://github.com/ZackPDM/pdfextracttool.git
cd pdfextracttool
```

### Bước 2: Tạo môi trường ảo (Khuyến nghị)
Để tránh xung đột thư viện với các dự án khác, bạn nên tạo một môi trường ảo (virtual environment):
```bash
# Trên Windows:
python -m venv .venv
.venv\Scripts\activate

# Trên macOS/Linux:
python3 -m venv .venv
source .venv/bin/activate
```

### Bước 3: Cài đặt các thư viện cần thiết
Dự án yêu cầu các thư viện như `Flask` và `PyMuPDF`. Bạn chỉ cần cài đặt thông qua tệp `requirements.txt`:
```bash
pip install -r requirements.txt
```

### Bước 4: Khởi động ứng dụng
Chạy server cục bộ bằng lệnh:
```bash
python app.py
```

### Bước 5: Sử dụng
Mở trình duyệt web của bạn và truy cập vào địa chỉ:
👉 **[http://localhost:5000](http://localhost:5000)**

Kéo thả tệp PDF vào trang web và tận hưởng thành quả! 🎉

---

## 📂 Cấu trúc thư mục

- `app.py`: Tệp máy chủ backend (chạy Flask framework).
- `extract_web.py`: Chứa các hàm xử lý lõi (đọc PDF và trích xuất hình ảnh).
- `templates/`: Thư mục chứa giao diện web (tệp `index.html`).
- `static/`: Chứa định dạng CSS và Script kéo-thả.
- `requirements.txt`: Danh sách các công cụ/thư viện cần tải về để chạy ứng dụng.
