/**
 * HTML Beautifier Logic
 * Modernized with ES6 and Improved formatting
 */

const beautify = () => {
    const input = document.getElementById('input').value;
    if (!input.trim()) return;

    const formattedHTML = formatHTML(input);
    document.getElementById('output').textContent = formattedHTML;
};

const formatHTML = (html) => {
    // Basic cleanup and wrapping in a template to parse
    const tab = '  ';
    let result = '';
    let indent = '';

    html.split(/>\s*</).forEach(function (element) {
        if (element.match(/^\/\w/)) {
            indent = indent.substring(tab.length);
        }

        result += indent + '<' + element + '>\n';

        if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input") && !element.startsWith("img") && !element.startsWith("br") && !element.startsWith("hr") && !element.startsWith("meta") && !element.startsWith("link")) {
            indent += tab;
        }
    });

    return result.substring(1, result.length - 3);
};

/* Alternative more robust formatting using DOM if needed, but the regex split is often "cleaner" for output strings */
/* For now, keeping a simplified improved version of the original logic if possible or switching to a better one */

const copyToClipboard = async () => {
    const output = document.getElementById('output');
    const text = output.textContent;
    if (!text || text.includes("Result will appear here")) return;

    try {
        await navigator.clipboard.writeText(text);

        const btn = document.querySelector('.copy-btn-small');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
};