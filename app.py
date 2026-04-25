from flask import Flask, request, render_template, send_file, jsonify
import os
import uuid
from extract_web import extract_images_from_pdf

app = Flask(__name__)

# Thư mục lưu file tạm
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/extract', methods=['POST'])
def extract():
    if 'pdf' not in request.files:
        return jsonify({'error': 'Không tìm thấy file PDF.'}), 400
        
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({'error': 'Chưa chọn file.'}), 400
        
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Vui lòng upload file PDF.'}), 400

    # Lưu file với tên ngẫu nhiên để tránh trùng lặp
    unique_id = str(uuid.uuid4())
    pdf_path = os.path.join(UPLOAD_FOLDER, f'{unique_id}.pdf')
    zip_path = os.path.join(OUTPUT_FOLDER, f'{unique_id}_images.zip')
    
    file.save(pdf_path)
    
    try:
        # Gọi hàm trích xuất
        success, count = extract_images_from_pdf(pdf_path, zip_path)
        
        # Dọn dẹp file pdf sau khi xong
        if os.path.exists(pdf_path):
            try:
                os.remove(pdf_path)
            except:
                pass
            
        if success:
            # Trả về file zip
            return send_file(zip_path, as_attachment=True, download_name=f'images_{file.filename}.zip')
        else:
            return jsonify({'error': 'Không tìm thấy ảnh nào đủ lớn/hợp lệ trong file PDF này.'}), 404
            
    except Exception as e:
        return jsonify({'error': f'Lỗi hệ thống: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
