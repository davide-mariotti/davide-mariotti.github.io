const color1Input = document.getElementById('color1');
const color1ValueInput = document.getElementById('color1Value'); // Nuovo elemento per valore esadecimale di color1
const color2Input = document.getElementById('color2');
const color2ValueInput = document.getElementById('color2Value'); // Nuovo elemento per valore esadecimale di color2
const resultElement = document.getElementById('result');
const colorExample = document.getElementById('colorExample');
const colorExampleResult = document.getElementById('colorExampleResult');

// Inizializza i valori iniziali dei colori
color1ValueInput.value = color1Input.value;
color2ValueInput.value = color2Input.value;

// Aggiorna il risultato del contrasto WCAG quando i colori cambiano
color1Input.addEventListener('input', updateColor1);
color2Input.addEventListener('input', updateColor2);
color1ValueInput.addEventListener('input', updateColor1FromInput);
color2ValueInput.addEventListener('input', updateColor2FromInput);

function updateColor1() {
    const color = validateAndFormatHexColor(color1Input.value);
    if (color) {
        color1Input.value = color;
        color1ValueInput.value = color;
        updateContrast();
    }
}

function updateColor2() {
    const color = validateAndFormatHexColor(color2Input.value);
    if (color) {
        color2Input.value = color;
        color2ValueInput.value = color;
        updateContrast();
    }
}

function updateColor1FromInput() {
    const color = validateAndFormatHexColor(color1ValueInput.value);
    if (color) {
        color1Input.value = color;
        updateContrast();
    }
}

function updateColor2FromInput() {
    const color = validateAndFormatHexColor(color2ValueInput.value);
    if (color) {
        color2Input.value = color;
        updateContrast();
    }
}

function validateAndFormatHexColor(input) {
    // Verifica se il colore inserito è nel formato corretto #rrggbb
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (hexRegex.test(input)) {
        return input.toUpperCase(); // Converte il valore in maiuscolo (opzionale)
    } else {
        return null; // Ritorna null se il formato non è corretto
    }
}

function updateContrast() {
    const color1 = color1Input.value;
    const color2 = color2Input.value;

    const contrastRatio = calculateContrastRatio(color1, color2);

    // Mostra il risultato del contrasto WCAG
    resultElement.innerHTML = `<span>Contrast Ratio:</span> <b>${contrastRatio.toFixed(2)}:1</b>`;

    // Aggiorna l'esempio visivo dei colori nel text area
    colorExample.style.backgroundColor = color2;
    colorExample.style.color = color1;

    // Crea i div per ogni parte del testo risultato
    colorExample.innerHTML = `
        <span style="font-size:16px; font-weight:200;">SMALL sample text: 16px Light</span> <br>
        <span style="font-size:16px; font-weight:400;">SMALL sample text: 16px Regular</span> <br>
        <span style="font-size:16px; font-weight:600;">SMALL sample text: 16px Bold</span> <br>
        <span style="font-size:24px; font-weight:200;">BIG sample text: 24px Light</span> <br>
        <span style="font-size:24px; font-weight:400;">BIG sample text: 24px Regular</span> <br>
        <span style="font-size:24px; font-weight:600;">BIG sample text: 24px Bold</span> <br>
    `;
    colorExampleResult.innerHTML = `
        <div class="mt-3"><b>Normal text</b></div>
        <div class="my-2">WCAG 2.1 AA ${getComplianceText(contrastRatio, 4.5)}</div>
        <div class="my-2">WCAG 2.1 AAA ${getComplianceText(contrastRatio, 7)}</div>

        <div class="mt-3"><b>Large text</b></div>
        <div>(Testo di dimensioni maggiori di 18pt o in grassetto)</div>
        <div class="my-2">WCAG 2.1 AA ${getComplianceText(contrastRatio, 3)}</div>
        <div class="my-2">WCAG 2.1 AAA ${getComplianceText(contrastRatio, 4.5)}</div>
        
        <div class="mt-3"><b>Required Contrast Ratios for WCAG Conformance</b></div>
        <div>4.5:1 for regular text and 3:1 for large text</div>
    `;
}

// Funzioni di supporto per il calcolo del contrasto e conversioni
function getComplianceText(contrastRatio, threshold) {
    const isPass = contrastRatio >= threshold;
    const text = isPass ? 'PASS' : 'FAIL';
    const color = isPass ? 'green' : 'red';

    return `<span class="${color}">${text}</span>`;
}

function calculateContrastRatio(color1, color2) {
    const luminance1 = calculateLuminance(color1);
    const luminance2 = calculateLuminance(color2);

    // Calcola il contrasto ratio secondo le linee guida WCAG 2.1
    const contrastRatio = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);

    return contrastRatio;
}

function calculateLuminance(color) {
    const rgb = hexToRgb(color);

    // Applica la correzione gamma e calcola la luminosità relativa
    const linearR = gammaToLinear(rgb.r / 255);
    const linearG = gammaToLinear(rgb.g / 255);
    const linearB = gammaToLinear(rgb.b / 255);

    // Calcola la luminosità relativa secondo le formule WCAG 2.1
    const luminance = 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;

    return luminance;
}

function gammaToLinear(colorComponent) {
    // Conversione da gamma-corretto a scala lineare
    return colorComponent <= 0.03928 ? colorComponent / 12.92 : Math.pow((colorComponent + 0.055) / 1.055, 2.4);
}

function hexToRgb(hex) {
    // Conversione da colore esadecimale (#RRGGBB) a RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

// Esegui il calcolo iniziale al caricamento della pagina
updateContrast();
