import fitz  # PyMuPDF
import os
import zipfile

def extract_images_from_pdf(pdf_path, output_zip):
    doc = fitz.open(pdf_path)
    img_folder = "extracted_images_temp"
    os.makedirs(img_folder, exist_ok=True)
    
    img_list = []
    
    for page_index in range(len(doc)):
        page = doc[page_index]
        image_list = page.get_images(full=True)
        
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            width = base_image.get("width", 0)
            height = base_image.get("height", 0)
            
            # Bộ lọc siêu tốc: Bỏ qua các ảnh quá nhỏ (icon, logo nhỏ, rác)
            if width < 100 or height < 100:
                continue
                
            # Bỏ qua các ảnh quá dẹt (có thể là đường kẻ ngang/dọc)
            if width / height > 10 or height / width > 10:
                continue
                
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            image_name = f"page{page_index+1}_img{img_index+1}.{image_ext}"
            
            file_path = os.path.join(img_folder, image_name)
            with open(file_path, "wb") as f:
                f.write(image_bytes)
            img_list.append(file_path)

    # Đóng gói vào file ZIP
    if not img_list:
        return False, 0
        
    with zipfile.ZipFile(output_zip, 'w') as zipf:
        for file in img_list:
            zipf.write(file, os.path.basename(file))
            
    # Dọn dẹp ảnh tạm
    for file in img_list:
        try:
            os.remove(file)
        except Exception:
            pass
            
    return True, len(img_list)
