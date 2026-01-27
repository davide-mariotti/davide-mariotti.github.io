/**
 * Scrap SEO Logic
 * Modernized with ES6 and Optimized rendering
 */

const getElements = () => ({
    apiKey: document.getElementById('apiKeyInput'),
    cx: document.getElementById('cxInput'),
    domain: document.getElementById('domainInput'),
    pageCount: document.getElementById('pageCount'),
    results: document.getElementById('results'),
    modal: document.getElementById('infoModal'),
    modalText: document.getElementById('modalText')
});

const fetchPages = async () => {
    const el = getElements();
    const apiKey = el.apiKey.value.trim();
    const cx = el.cx.value.trim();
    const domain = el.domain.value.trim();
    const pageCount = parseInt(el.pageCount.value);

    if (!apiKey || !cx || !domain) {
        alert('Please fill in all required fields (including Advanced options if keys are missing).');
        return;
    }

    el.results.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-success" role="status"></div>
            <p class="mt-3 text-white opacity-50">Fetching data from Google...</p>
        </div>
    `;

    const pageSize = 10;
    const totalPages = Math.ceil(pageCount / pageSize);
    const fetchPromises = [];

    try {
        for (let i = 0; i < totalPages; i++) {
            const startIndex = i * pageSize + 1;
            const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=site:${domain}&start=${startIndex}&num=${pageSize}`;

            fetchPromises.push(
                fetch(url).then(async res => {
                    if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.error?.message || 'API request failed');
                    }
                    return res.json();
                })
            );
        }

        const responses = await Promise.all(fetchPromises);
        const allItems = responses.flatMap(data => data.items || []);

        renderResults(allItems);
    } catch (error) {
        console.error('Scrap SEO Error:', error);
        el.results.innerHTML = `
            <div class="glass-panel text-center p-5 border-danger">
                <h3 class="text-danger">Analysis Failed</h3>
                <p class="text-white opacity-75">${error.message}</p>
                <button class="btn btn-outline-light mt-3" onclick="fetchPages()">Try Again</button>
            </div>
        `;
    }
};

const renderResults = (pages) => {
    const el = getElements();

    if (!pages.length) {
        el.results.innerHTML = `
            <div class="glass-panel text-center p-5">
                <p class="text-white opacity-75">No indexed pages found for this domain.</p>
            </div>
        `;
        return;
    }

    let rowsHtml = pages.map(page => `
        <tr class="result-row">
            <td>
                <span class="result-title">${page.title}</span>
                <p class="result-snippet">${page.snippet}</p>
            </td>
            <td>
                <a href="${page.link}" target="_blank" class="result-url">${page.link}</a>
            </td>
        </tr>
    `).join('');

    el.results.innerHTML = `
        <div class="glass-panel p-0 overflow-hidden">
            <table class="results-table mb-0">
                <thead class="results-header">
                    <tr>
                        <th style="width: 60%">Page Info</th>
                        <th style="width: 40%">URL</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    `;
};

const showInfoModal = (type) => {
    const el = getElements();
    let content = '';

    if (type === 'apiKey') {
        content = `
            <h3>Google API Key</h3>
            <p class="opacity-75">To get an API key:</p>
            <ol class="small opacity-75">
                <li>Visit <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a>.</li>
                <li>Create a project and enable "Custom Search API".</li>
                <li>Go to "Credentials" and create an "API Key".</li>
            </ol>
        `;
    } else {
        content = `
            <h3>Search Engine ID (CX)</h3>
            <p class="opacity-75">To get your CX ID:</p>
            <ol class="small opacity-75">
                <li>Go to <a href="https://cse.google.com/cse/" target="_blank">Google Custom Search</a>.</li>
                <li>Add your domain and create the engine.</li>
                <li>Copy the "Search engine ID" from the dashboard.</li>
            </ol>
        `;
    }

    el.modalText.innerHTML = content;
    el.modal.style.display = 'block';
};

const hideInfoModal = () => {
    getElements().modal.style.display = 'none';
};

// Close modal when clicking outside
window.onclick = (event) => {
    const el = getElements();
    if (event.target === el.modal) {
        hideInfoModal();
    }
};
