document.addEventListener("DOMContentLoaded", function() {
    const hexInput = document.getElementById("hex");
    const rgbInput = document.getElementById("rgb");
    const hslInput = document.getElementById("hsl");
    const cmykInput = document.getElementById("cmyk");
    const colorConverter = document.getElementById("color-converter");

    // Function to generate a random hexadecimal color
    function getRandomHexColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Function to convert RGB to CMYK
    function rgbToCmyk(r, g, b) {
        const c = 1 - (r / 255);
        const m = 1 - (g / 255);
        const y = 1 - (b / 255);
        const k = Math.min(c, m, y);
        return {
            c: (c - k) / (1 - k),
            m: (m - k) / (1 - k),
            y: (y - k) / (1 - k),
            k: k
        };
    }

    // Function to update color values based on HEX input
    function updateColorValues(hexColor) {
        const color = tinycolor(hexColor);
        const rgbColor = color.toRgb();
        const hslColor = color.toHsl();
        const cmykColor = rgbToCmyk(rgbColor.r, rgbColor.g, rgbColor.b);

        rgbInput.value = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
        hslInput.value = `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`;
        cmykInput.value = `cmyk(${Math.round(cmykColor.c * 100)}%, ${Math.round(cmykColor.m * 100)}%, ${Math.round(cmykColor.y * 100)}%, ${Math.round(cmykColor.k * 100)}%)`;
        colorConverter.style.backgroundColor = hexColor;
    }

    // Generate random HEX color on page load
    const randomHexColor = getRandomHexColor();
    hexInput.value = randomHexColor;
    updateColorValues(randomHexColor);

    // Event listener for HEX input change
    hexInput.addEventListener("input", function() {
        const inputHex = hexInput.value.trim();
        if (tinycolor(inputHex).isValid()) {
            updateColorValues(inputHex);
        }
    });
});

function copyText(inputId) {
    const inputElement = document.getElementById(inputId);
    inputElement.select();
    document.execCommand("copy");
    alert(`Copied ${inputElement.value} to clipboard!`);
}