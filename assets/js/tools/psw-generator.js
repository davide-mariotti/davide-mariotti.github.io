/**
 * Password Generator Logic
 * Modernized with ES6, Crypto API (optional but simplified), and Clipboard API
 */

const getElements = () => ({
    length: document.getElementById("length"),
    uppercase: document.getElementById("uppercase"),
    lowercase: document.getElementById("lowercase"),
    numbers: document.getElementById("numbers"),
    symbols: document.getElementById("symbols"),
    password: document.getElementById("password")
});

const generatePassword = () => {
    const el = getElements();
    const length = parseInt(el.length.value);

    const charsets = {
        upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lower: "abcdefghijklmnopqrstuvwxyz",
        nums: "0123456789",
        syms: "!@#$%^&*()_+~`|}{[]\\:;?><,./-="
    };

    let charset = "";
    if (el.uppercase.checked) charset += charsets.upper;
    if (el.lowercase.checked) charset += charsets.lower;
    if (el.numbers.checked) charset += charsets.nums;
    if (el.symbols.checked) charset += charsets.syms;

    if (!charset) {
        el.password.value = "Select at least one setting";
        el.password.className = "";
        return;
    }

    let password = "";
    // Using simple Math.random for now to keep it lightweight, but ensuring at least one of each selected charset
    const chosenCharsets = [];
    if (el.uppercase.checked) chosenCharsets.push(charsets.upper);
    if (el.lowercase.checked) chosenCharsets.push(charsets.lower);
    if (el.numbers.checked) chosenCharsets.push(charsets.nums);
    if (el.symbols.checked) chosenCharsets.push(charsets.syms);

    // Initial password with one char from each category to ensure coverage
    chosenCharsets.forEach(set => {
        password += set.charAt(Math.floor(Math.random() * set.length));
    });

    // Fill the rest
    for (let i = password.length; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Shuffle result
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    el.password.value = password;
    checkPasswordSecurity(password);
};

const checkPasswordSecurity = (password) => {
    const el = getElements();
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 14) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let securityLevel = "red"; // Weak
    if (score >= 3) securityLevel = "yellow"; // Medium
    if (score >= 5 && password.length >= 12) securityLevel = "green"; // Strong

    el.password.className = securityLevel;
};

const copyToClipboard = async () => {
    const el = getElements();
    const password = el.password.value;
    if (!password || password.includes("Select")) return;

    try {
        await navigator.clipboard.writeText(password);

        const copyBtn = document.querySelector('button[onclick="copyToClipboard()"]');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
};

// Initial call
window.onload = () => {
    // Optional: generate one on load? Let's wait for user interaction to avoid confusion.
};