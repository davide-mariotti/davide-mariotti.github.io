// Get file input element
const inputFile = document.getElementById('inputFile');
const optimizeButton = document.getElementById('optimizeButton');

// Add event listener to file input for change detection
inputFile.addEventListener('change', function() {
    // Check if files have been selected
    if (inputFile.files.length > 0) {
        // Enable the optimizeButton if files are selected
        optimizeButton.disabled = false;

        // Display selected file name
        const fileNameDisplay = document.getElementById('fileNameDisplay');
        const fileName = inputFile.files[0].name;
        fileNameDisplay.textContent = `Selected File: ${fileName}`;
    } else {
        // Disable the optimizeButton if no files are selected
        optimizeButton.disabled = true;

        // Clear file name display
        const fileNameDisplay = document.getElementById('fileNameDisplay');
        fileNameDisplay.textContent = '';
    }
});

function updateQualityDisplay() {
    const qualityInput = document.getElementById('qualityInput');
    const qualityDisplay = document.getElementById('qualityDisplay');

    // Calculate and display the quality percentage
    const qualityPercentage = Math.round(parseFloat(qualityInput.value) * 100);
    qualityDisplay.textContent = `${qualityPercentage}%`;
}

// Function to handle file upload
function handleFileUpload() {
    // Trigger file input click event
    inputFile.click();
}

async function optimizeImage() {
    const inputElement = document.getElementById('inputFile');
    const inputFile = inputElement.files[0];

    if (!inputFile) {
        alert('Please select an image file.');
        return;
    }

    const imgElement = new Image();
    imgElement.onload = async function() {
        const canvas = document.getElementById('outputCanvasIMG');
        const ctx = canvas.getContext('2d');

        canvas.width = imgElement.width;
        canvas.height = imgElement.height;

        ctx.drawImage(imgElement, 0, 0);

        const qualityInput = document.getElementById('qualityInput');
        const quality = parseFloat(qualityInput.value);

        canvas.toBlob(async function(blob) {
            const url = URL.createObjectURL(blob);

            // Clear canvas before drawing optimized image
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const optimizedImg = new Image();
            optimizedImg.onload = function() {
                ctx.drawImage(optimizedImg, 0, 0);
                URL.revokeObjectURL(url); // Clean up object URL
            };
            optimizedImg.src = url;

            // Create download link with custom filename
            const originalFileName = inputFile.name;
            const fileExtension = originalFileName.split('.').pop(); // Get file extension
            const fileNameWithoutExtension = originalFileName.replace('.' + fileExtension, '');
            const formattedQuality = (quality * 100).toFixed().padStart(2, '0');
            const optimizedFileName = `${fileNameWithoutExtension}_optimized-${formattedQuality}.${fileExtension}`;

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = optimizedFileName;
            downloadLink.click();
        }, 'image/jpeg', quality);

    };

    const reader = new FileReader();
    reader.onload = function(e) {
        imgElement.src = e.target.result;
    };
    reader.readAsDataURL(inputFile);
}

// Get canvas element and its context
const canvas = document.getElementById('outputCanvasIMG');
const ctx = canvas.getContext('2d');

// Function to display message on canvas
function displayNoImageMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.fillStyle = 'black';
    ctx.font = '15px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No image uploaded or optimized', canvas.width / 2, canvas.height / 2);
}

// Call displayNoImageMessage initially when no image is uploaded
displayNoImageMessage();