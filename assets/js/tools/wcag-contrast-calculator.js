/**
 * WCAG Contrast Calculator Logic
 * Modernized with ES6 and improved visual indicators
 */

const el = {
    color1: document.getElementById('color1'),
    color1Val: document.getElementById('color1Value'),
    color2: document.getElementById('color2'),
    color2Val: document.getElementById('color2Value'),
    ratioDisplay: document.getElementById('contrast-ratio-display'),
    example: document.getElementById('colorExample'),
    result: document.getElementById('colorExampleResult')
};

const updateContrast = () => {
    const color1 = el.color1.value;
    const color2 = el.color2.value;

    const ratio = calculateContrastRatio(color1, color2);
    el.ratioDisplay.textContent = `${ratio.toFixed(2)}:1`;

    // Preview - Apply background and color directly
    el.example.style.setProperty('background-color', color2, 'important');
    el.example.style.setProperty('color', color1, 'important');

    el.example.innerHTML = `
        <div class="mb-2" style="font-size: 1.1rem; color: inherit;">The quick brown fox jumps over the lazy dog (Regular)</div>
        <div class="fw-bold" style="font-size: 1.6rem; color: inherit;">Large Bold Headline</div>
    `;

    // Compliance Cards
    el.result.innerHTML = `
        <div class="compliance-grid">
            <div class="compliance-card">
                <span class="compliance-title">Normal Text</span>
                <div class="compliance-status">
                    <span>WCAG AA (4.5:1)</span>
                    ${getBadge(ratio >= 4.5)}
                </div>
                <div class="compliance-status">
                    <span>WCAG AAA (7:1)</span>
                    ${getBadge(ratio >= 7)}
                </div>
            </div>
            <div class="compliance-card">
                <span class="compliance-title">Large Text</span>
                <div class="compliance-status">
                    <span>WCAG AA (3:1)</span>
                    ${getBadge(ratio >= 3)}
                </div>
                <div class="compliance-status">
                    <span>WCAG AAA (4.5:1)</span>
                    ${getBadge(ratio >= 4.5)}
                </div>
            </div>
        </div>
    `;
};

const getBadge = (isPass) => {
    return `<span class="badge-status ${isPass ? 'pass' : 'fail'}">${isPass ? 'PASS' : 'FAIL'}</span>`;
};

const calculateContrastRatio = (c1, c2) => {
    const l1 = calculateLuminance(c1);
    const l2 = calculateLuminance(c2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

const calculateLuminance = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const a = [r, g, b].map(v => {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const handleInput = (type, val) => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    let hex = val;
    if (!hex.startsWith('#')) hex = '#' + hex;

    if (hexRegex.test(hex)) {
        if (type === 1) {
            el.color1.value = hex;
            el.color1Val.value = hex.toUpperCase();
        } else {
            el.color2.value = hex;
            el.color2Val.value = hex.toUpperCase();
        }
        updateContrast();
    }
};

// Event Listeners
el.color1.addEventListener('input', (e) => handleInput(1, e.target.value));
el.color1Val.addEventListener('input', (e) => handleInput(1, e.target.value));
el.color2.addEventListener('input', (e) => handleInput(2, e.target.value));
el.color2Val.addEventListener('input', (e) => handleInput(2, e.target.value));

// Initial
updateContrast();
