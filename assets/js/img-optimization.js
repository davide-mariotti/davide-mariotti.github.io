document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('imageFile');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert('Please select an image file.');
        return;
    }

    const imageFile = fileInput.files[0];
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch('https://api.tinify.com/shrink', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa('api:' + 'tRWhMt1FM40Kzs51FPy54d9m8FNTNryM'),
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            const optimizedUrl = data.output.url;
            const originalSize = data.input.size;
            const optimizedSize = data.output.size;

            // Update UI with optimization results
            document.getElementById('originalSize').textContent = formatBytes(originalSize);
            document.getElementById('optimizedSize').textContent = formatBytes(optimizedSize);
            document.getElementById('optimizedImage').src = optimizedUrl;
            document.getElementById('result').style.display = 'block';
        } else {
            alert('Image optimization failed. Please try again.');
        }
    } catch (error) {
        console.error('Image optimization error:', error);
        alert('Image optimization failed. Please try again.');
    }
});

// Helper function to format bytes into a human-readable string
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
