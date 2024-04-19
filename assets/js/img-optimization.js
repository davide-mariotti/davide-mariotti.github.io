
// Funzione per gestire la compressione dell'immagine
async function compressImage(imageFile) {
    try {
        // Imposta la chiave API di Tinify
        tinify.key = "tRWhMt1FM40Kzs51FPy54d9m8FNTNryM"; // Sostituisci con la tua chiave API di Tinify

        // Comprimi l'immagine utilizzando Tinify
        const source = tinify.fromBuffer(await imageFile.arrayBuffer());
        const resizedImage = await source.resize({
            method: "scale",
            width: 800 // Specifica la larghezza desiderata dell'immagine
        });

        // Ottieni i dati dell'immagine compressa
        const compressedData = await resizedImage.toBuffer();

        return compressedData;
    } catch (error) {
        throw new Error(`Compression error: ${error.message}`);
    }
}

// Funzione per gestire l'upload e la compressione dell'immagine
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('imageFile');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert('Please select an image file.');
        return;
    }

    const imageFile = fileInput.files[0];

    try {
        // Comprimi l'immagine caricata
        const compressedImage = await compressImage(imageFile);

        // Esegui ulteriori azioni con l'immagine compressa (ad esempio, visualizzala nell'UI)
        const compressedBlob = new Blob([compressedImage], { type: 'image/jpeg' });
        const compressedImageUrl = URL.createObjectURL(compressedBlob);

        // Aggiorna UI con l'immagine compressa
        document.getElementById('optimizedImage').src = compressedImageUrl;
        document.getElementById('result').style.display = 'block';
    } catch (error) {
        console.error('Image compression error:', error);
        alert('Image compression failed. Please try again.');
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
