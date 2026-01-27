/**
 * Image Optimizer Logic
 * Modernized with ES6 and standard modern APIs
 */

const el = {
    input: document.getElementById('inputFile'),
    optimizeBtn: document.getElementById('optimizeButton'),
    fileName: document.getElementById('fileNameDisplay'),
    qualityInput: document.getElementById('qualityInput'),
    qualityDisplay: document.getElementById('qualityDisplay'),
    canvas: document.getElementById('outputCanvasIMG'),
    dropZone: document.getElementById('dropZone')
};

const ctx = el.canvas.getContext('2d');

// Initial Message
const displayInitialMessage = () => {
    el.canvas.width = 400;
    el.canvas.height = 200;
    ctx.clearRect(0, 0, el.canvas.width, el.canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Preview will appear here after optimization", el.canvas.width / 2, el.canvas.height / 2);
};

displayInitialMessage();

const updateQualityDisplay = () => {
    const quality = Math.round(parseFloat(el.qualityInput.value) * 100);
    el.qualityDisplay.textContent = `${quality}%`;
};

// Handle File selection
el.input.addEventListener('change', () => {
    if (el.input.files.length > 0) {
        const file = el.input.files[0];
        el.optimizeBtn.disabled = false;
        el.fileName.textContent = `Selected File: ${file.name}`;
        el.dropZone.style.borderColor = "var(--color-primary)";
    } else {
        el.optimizeBtn.disabled = true;
        el.fileName.textContent = "Selected File: No File Uploaded";
        el.dropZone.style.borderColor = "";
    }
});

// Drag & Drop
el.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    el.dropZone.classList.add('dragover');
});

el.dropZone.addEventListener('dragleave', () => {
    el.dropZone.classList.remove('dragover');
});

el.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    el.dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        el.input.files = e.dataTransfer.files;
        el.input.dispatchEvent(new Event('change'));
    }
});

const optimizeImage = async () => {
    const file = el.input.files[0];
    if (!file) return;

    const quality = parseFloat(el.qualityInput.value);

    // Create an Image object
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
        img.onload = () => {
            // Setup canvas
            el.canvas.width = img.width;
            el.canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Convert to Blob (JPEG for compression support)
            el.canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);

                // Update Preview on Canvas with compressed version
                const previewImg = new Image();
                previewImg.onload = () => {
                    ctx.clearRect(0, 0, el.canvas.width, el.canvas.height);
                    ctx.drawImage(previewImg, 0, 0);

                    // Trigger Download
                    const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
                    const extension = file.name.split('.').pop();
                    const downloadName = `${originalName}_optimized_${Math.round(quality * 100)}% .${extension}`;

                    const link = document.createElement('a');
                    link.href = url;
                    link.download = downloadName;
                    link.click();

                    // Success state on button
                    const originalBtnText = el.optimizeBtn.innerHTML;
                    el.optimizeBtn.innerHTML = "✅ Optimized & Downloaded!";
                    el.optimizeBtn.classList.remove('btn-primary');
                    el.optimizeBtn.classList.add('btn-success');

                    setTimeout(() => {
                        el.optimizeBtn.innerHTML = originalBtnText;
                        el.optimizeBtn.classList.add('btn-primary');
                        el.optimizeBtn.classList.remove('btn-success');
                        URL.revokeObjectURL(url);
                    }, 3000);
                };
                previewImg.src = url;
            }, 'image/jpeg', quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};