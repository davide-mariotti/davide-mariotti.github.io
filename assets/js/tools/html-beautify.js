function beautify() {
    const input = document.getElementById('input').value;
    const formattedHTML = formatHTML(input);
    document.getElementById('output').textContent = formattedHTML;
}

function formatHTML(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html.trim();
    return format(temp, 0).innerHTML.trim();
}

function format(node, level) {
    let indentBefore = new Array(level++ + 1).join('  '),
        indentAfter = new Array(level - 1).join('  '),
        textNode;

    for (let i = 0; i < node.children.length; i++) {
        textNode = document.createTextNode('\n' + indentBefore);
        node.insertBefore(textNode, node.children[i]);

        format(node.children[i], level);

        if (node.lastElementChild == node.children[i]) {
            textNode = document.createTextNode('\n' + indentAfter);
            node.appendChild(textNode);
        }
    }

    return node;
}

function copyToClipboard() {
    const output = document.getElementById('output');
    const range = document.createRange();
    range.selectNode(output);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Copied to clipboard!');
}