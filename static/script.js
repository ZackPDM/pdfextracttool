document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const dropContent = dropZone.querySelector('.drop-content');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const removeBtn = document.getElementById('remove-file');
    const extractBtn = document.getElementById('extract-btn');
    const uploadSection = document.querySelector('.upload-section');
    const loadingState = document.getElementById('loading-state');
    const successState = document.getElementById('success-state');
    const errorMessage = document.getElementById('error-message');
    const resetBtn = document.getElementById('reset-btn');

    let currentFile = null;

    // Handle Drag & Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    // Handle Click Upload
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        
        if (file.type !== 'application/pdf') {
            showError('Vui lòng chỉ tải lên file PDF hợp lệ.');
            return;
        }

        currentFile = file;
        fileName.textContent = file.name;
        
        dropContent.classList.add('hidden');
        fileInfo.classList.remove('hidden');
        extractBtn.disabled = false;
        hideError();
    }

    // Handle File Removal
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Ngăn dropzone click
        currentFile = null;
        fileInput.value = '';
        dropContent.classList.remove('hidden');
        fileInfo.classList.add('hidden');
        extractBtn.disabled = true;
    });

    // Handle Extraction
    extractBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        // Show Loading
        uploadSection.classList.add('hidden');
        loadingState.classList.remove('hidden');
        hideError();

        const formData = new FormData();
        formData.append('pdf', currentFile);

        try {
            const response = await fetch('/extract', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Handle File Download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                
                // Lấy tên file từ header (nếu có)
                const contentDisposition = response.headers.get('content-disposition');
                let downloadName = 'extracted_images.zip';
                if (contentDisposition && contentDisposition.includes('filename=')) {
                    downloadName = contentDisposition.split('filename=')[1].replace(/"/g, '');
                }
                
                a.download = downloadName;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                // Show Success State
                loadingState.classList.add('hidden');
                successState.classList.remove('hidden');
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Có lỗi xảy ra trong quá trình trích xuất.');
            }
        } catch (error) {
            // Show Error & Return to Upload
            loadingState.classList.add('hidden');
            uploadSection.classList.remove('hidden');
            showError(error.message);
        }
    });

    // Handle Reset
    resetBtn.addEventListener('click', () => {
        currentFile = null;
        fileInput.value = '';
        
        successState.classList.add('hidden');
        uploadSection.classList.remove('hidden');
        dropContent.classList.remove('hidden');
        fileInfo.classList.add('hidden');
        extractBtn.disabled = true;
        hideError();
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }
});
