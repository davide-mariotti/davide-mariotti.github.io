/**
 * Case Converter Logic
 * Modernized with ES6 and Navigator Clipboard API
 */

const getElements = () => ({
    input: document.getElementById("inputText"),
    output: document.getElementById("outputText"),
    count: document.getElementById("characterCount")
});

const updateCharacterCount = () => {
    const { input, count } = getElements();
    const length = input.value.length;
    count.textContent = `${length} Characters`;
};

const setOutput = (text) => {
    const { output } = getElements();
    output.value = text;
};

const convertToUppercase = () => {
    const { input } = getElements();
    setOutput(input.value.toUpperCase());
};

const convertToLowercase = () => {
    const { input } = getElements();
    setOutput(input.value.toLowerCase());
};

const convertToCamelcase = () => {
    const { input } = getElements();
    const text = input.value;
    const words = text.split(/\s+/);
    const camelCase = words.map((word, index) => {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join("");
    setOutput(camelCase);
};

const convertToSentenceCase = () => {
    const { input } = getElements();
    const text = input.value.toLowerCase();
    const sentenceCase = text.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    setOutput(sentenceCase);
};

const convertToTitleCase = () => {
    const { input } = getElements();
    const text = input.value.toLowerCase();
    const titleCase = text.replace(/\b\w/g, c => c.toUpperCase());
    setOutput(titleCase);
};

const convertToInverseCase = () => {
    const { input } = getElements();
    const text = input.value;
    const inverse = text.split('').map(c =>
        c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
    ).join('');
    setOutput(inverse);
};

const convertToTextForUpload = () => {
    const { input } = getElements();
    let text = input.value.toLowerCase();

    // Map special characters to base chars
    const charMap = {
        '[èéêë]': 'e',
        '[àáâãäå]': 'a',
        '[ìíîï]': 'i',
        '[òóôõö]': 'o',
        '[ùúûü]': 'u',
        '&': 'e'
    };

    Object.keys(charMap).forEach(key => {
        text = text.replace(new RegExp(key, 'g'), charMap[key]);
    });

    // Replace spaces with dashes
    text = text.replace(/\s+/g, '-');

    // Remove unwanted chars
    text = text.replace(/[\/()#,\.;:<>\{\}\[\]\*\+\!\?\^|]/g, '');

    setOutput(text);
};

const copyToClipboard = async () => {
    const { output } = getElements();
    if (!output.value) return;

    try {
        await navigator.clipboard.writeText(output.value);

        // Visual feedback
        const copyBtn = document.querySelector('button[onclick="copyToClipboard()"]');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="me-2">✅</span> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
};

const resetText = () => {
    const { input, output, count } = getElements();
    input.value = "";
    output.value = "";
    count.textContent = "0 Characters";
};