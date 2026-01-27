/**
 * Color Converter Logic
 * Modernized with ES6 and Navigator Clipboard API
 */

document.addEventListener("DOMContentLoaded", () => {
    const el = {
        hex: document.getElementById("hex"),
        rgb: document.getElementById("rgb"),
        hsl: document.getElementById("hsl"),
        cmyk: document.getElementById("cmyk"),
        preview: document.getElementById("color-preview-box"),
        randomBtn: document.getElementById("random-color-button")
    };

    const getRandomHexColor = () => {
        return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
    };

    const rgbToCmyk = (r, g, b) => {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);

        if (k === 1) return { c: 0, m: 0, y: 0, k: 1 };

        return {
            c: (c - k) / (1 - k),
            m: (m - k) / (1 - k),
            y: (y - k) / (1 - k),
            k: k
        };
    };

    const updateUI = (hex) => {
        const color = tinycolor(hex);
        if (!color.isValid()) return;

        const rgb = color.toRgb();
        const hsl = color.toHsl();
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

        el.hex.value = hex.toUpperCase();
        el.rgb.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        el.hsl.value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
        el.cmyk.value = `cmyk(${Math.round(cmyk.c * 100)}%, ${Math.round(cmyk.m * 100)}%, ${Math.round(cmyk.y * 100)}%, ${Math.round(cmyk.k * 100)}%)`;

        // Update Preview
        el.preview.style.backgroundColor = hex;
        el.preview.textContent = hex.toUpperCase();

        // Dynamic Text Color for contrast
        const isDark = color.isDark();
        el.preview.style.color = isDark ? "#FFFFFF" : "#000000";
        el.preview.style.borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";
    };

    // Event Listeners
    el.hex.addEventListener("input", (e) => {
        let val = e.target.value;
        if (!val.startsWith("#")) val = "#" + val;
        if (tinycolor(val).isValid()) {
            updateUI(val);
        }
    });

    el.randomBtn.addEventListener("click", () => {
        updateUI(getRandomHexColor());
    });

    // Initial state
    updateUI(getRandomHexColor());
});

const copyText = async (id) => {
    const input = document.getElementById(id);
    if (!input || !input.value) return;

    try {
        await navigator.clipboard.writeText(input.value);

        const btn = input.parentElement.querySelector('.copy-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅';
        btn.style.color = 'var(--color-primary)';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.color = '';
        }, 1500);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
};
