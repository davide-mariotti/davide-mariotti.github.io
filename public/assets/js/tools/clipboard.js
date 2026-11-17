/**
 * Shared clipboard helper for the tools pages.
 * Writes text to the clipboard, swaps a button's innerHTML to a feedback
 * message for a bit, then restores it. Include with a plain <script> tag.
 */
async function copyWithFeedback(text, btn, { message = '✅ Copied!', duration = 2000 } = {}) {
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
        if (btn) {
            const original = btn.innerHTML;
            btn.innerHTML = message;
            setTimeout(() => {
                btn.innerHTML = original;
            }, duration);
        }
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}
