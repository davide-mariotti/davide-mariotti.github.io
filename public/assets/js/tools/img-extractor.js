/**
 * Image Extractor Logic
 * Fetches a webpage via CORS proxy, extracts all image URLs,
 * and renders a filterable grid with download support.
 */

const CORS_PROXY = 'https://api.allorigins.win/get?url=';

let allImages = [];
let activeFilter = 'all';

/* ── Helpers ─────────────────────────────────────────── */

const getExt = (url) => {
    try {
        const path = new URL(url).pathname.toLowerCase();
        const match = path.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp|ico|avif|tiff?)(\?|$)/);
        return match ? (match[1] === 'jpeg' ? 'jpg' : match[1]) : 'other';
    } catch {
        return 'other';
    }
};

const getFilename = (url) => {
    try {
        return decodeURIComponent(new URL(url).pathname.split('/').pop()) || 'image';
    } catch {
        return 'image';
    }
};

const resolveUrl = (src, base) => {
    try {
        return new URL(src, base).href;
    } catch {
        return null;
    }
};

const dedupeUrls = (urls) => [...new Set(urls.filter(Boolean))];

/* ── Extraction ──────────────────────────────────────── */

const extractImages = async () => {
    const urlInput = document.getElementById('urlInput');
    const rawUrl = urlInput.value.trim();

    if (!rawUrl) {
        urlInput.focus();
        return;
    }

    // Ensure protocol
    const targetUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

    showLoading();

    try {
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
        const res = await fetch(proxyUrl);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const html = data.contents;

        if (!html) throw new Error('Empty response from proxy.');

        const images = parseImages(html, targetUrl);
        allImages = images;

        renderResults(images, targetUrl);
    } catch (err) {
        showError(err.message);
    }
};

const parseImages = (html, baseUrl) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const srcs = new Set();

    // <img src> and <img srcset>
    doc.querySelectorAll('img').forEach(img => {
        if (img.src) srcs.add(resolveUrl(img.getAttribute('src'), baseUrl));
        if (img.dataset.src) srcs.add(resolveUrl(img.dataset.src, baseUrl));
        if (img.dataset.lazySrc) srcs.add(resolveUrl(img.dataset.lazySrc, baseUrl));

        const srcset = img.getAttribute('srcset');
        if (srcset) {
            srcset.split(',').forEach(part => {
                const url = part.trim().split(/\s+/)[0];
                srcs.add(resolveUrl(url, baseUrl));
            });
        }
    });

    // <source srcset> inside <picture>
    doc.querySelectorAll('source[srcset]').forEach(source => {
        source.getAttribute('srcset').split(',').forEach(part => {
            const url = part.trim().split(/\s+/)[0];
            srcs.add(resolveUrl(url, baseUrl));
        });
    });

    // CSS background-image in style attributes
    doc.querySelectorAll('[style]').forEach(el => {
        const match = el.getAttribute('style').match(/url\(['"]?([^'")\s]+)['"]?\)/gi);
        if (match) {
            match.forEach(m => {
                const inner = m.replace(/url\(['"]?/i, '').replace(/['"]?\)$/, '');
                srcs.add(resolveUrl(inner, baseUrl));
            });
        }
    });

    // <meta og:image>
    doc.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(m => {
        srcs.add(resolveUrl(m.getAttribute('content'), baseUrl));
    });

    return dedupeUrls([...srcs]).filter(url => {
        // Filter out data URIs and tiny tracking pixels
        if (!url || url.startsWith('data:')) return false;
        return true;
    });
};

/* ── Filtering ───────────────────────────────────────── */

const setFilter = (filter) => {
    activeFilter = filter;

    document.querySelectorAll('.chip').forEach(c => {
        c.classList.toggle('active', c.dataset.filter === filter);
    });

    applyFilter();
};

const applyFilter = () => {
    const cards = document.querySelectorAll('.img-card');
    let visible = 0;

    cards.forEach(card => {
        const ext = card.dataset.ext;
        const show = activeFilter === 'all' || ext === activeFilter;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
    });

    const countEl = document.getElementById('visibleCount');
    if (countEl) countEl.textContent = visible;

    refreshUrlPanel();
};

/* ── Rendering ───────────────────────────────────────── */

const showLoading = () => {
    document.getElementById('results').innerHTML = `
        <div class="download-bar">
            <div class="result-summary">Fetching images…</div>
        </div>
        <div class="skeleton-grid">
            ${Array.from({ length: 12 }, () => `
                <div class="skeleton-card">
                    <div class="skeleton-thumb"></div>
                    <div class="skeleton-footer"></div>
                </div>
            `).join('')}
        </div>
    `;
    document.getElementById('countBadge').classList.add('d-none');
};

const showError = (msg) => {
    document.getElementById('results').innerHTML = `
        <div class="glass-panel state-panel">
            <span class="state-icon">⚠️</span>
            <h3>Extraction Failed</h3>
            <p>${msg}</p>
            <p class="mt-2 opacity-50" style="font-size:0.8rem;">
                Some websites block external requests. Try a different URL.
            </p>
        </div>
    `;
};

const renderResults = (images, sourceUrl) => {
    const resultsEl = document.getElementById('results');
    const countBadge = document.getElementById('countBadge');

    if (!images.length) {
        resultsEl.innerHTML = `
            <div class="glass-panel state-panel">
                <span class="state-icon">🔍</span>
                <h3>No Images Found</h3>
                <p>No images were detected on this page, or the site blocked the request.</p>
            </div>
        `;
        countBadge.classList.add('d-none');
        return;
    }

    const domain = (() => { try { return new URL(sourceUrl).hostname; } catch { return sourceUrl; } })();

    const cardsHtml = images.map((url, i) => {
        const ext = getExt(url);
        const name = getFilename(url);
        return `
            <div class="img-card" data-ext="${ext}" data-url="${url}" data-index="${i}">
                <div class="img-thumb-wrap">
                    <img src="${url}" alt="${name}" loading="lazy" onerror="this.closest('.img-card').remove(); updateCount();">
                    <div class="img-overlay">
                        <a href="${url}" download="${name}" target="_blank" onclick="downloadImage(event, '${url}', '${name}')">⬇ Download</a>
                    </div>
                </div>
                <div class="img-card-footer">
                    <span class="img-ext-badge">${ext}</span>
                    <span class="img-name" title="${name}">${name}</span>
                </div>
            </div>
        `;
    }).join('');

    resultsEl.innerHTML = `
        <div class="download-bar">
            <div class="result-summary">
                Found <strong>${images.length}</strong> images on <strong>${domain}</strong>
            </div>
            <div class="download-actions">
                <button class="btn btn-outline-light px-3 py-2 rounded-pill" onclick="toggleUrlPanel()" title="Show / hide image URLs">
                    📋 URLs
                </button>
                <button class="btn btn-outline-light px-3 py-2 rounded-pill" onclick="copyUrls()" title="Copy all visible URLs to clipboard">
                    ⎘ Copy URLs
                </button>
                <button class="btn btn-primary btn-glow px-4 py-2 rounded-pill" onclick="downloadAll()">
                    ⬇ Download All
                </button>
            </div>
        </div>
        <div class="url-panel" id="urlPanel">
            <div class="url-panel-header">
                <span>Image URLs <span class="url-panel-count" id="urlPanelCount"></span></span>
                <button class="url-panel-copy" onclick="copyUrls()">⎘ Copy all</button>
            </div>
            <textarea id="urlTextarea" class="url-textarea" readonly spellcheck="false"></textarea>
        </div>
        <div class="image-grid">
            ${cardsHtml}
        </div>
    `;

    // Show count badge
    countBadge.classList.remove('d-none');
    document.getElementById('visibleCount').textContent = images.length;

    // Re-apply active filter (also updates URL panel if open)
    applyFilter();
};

/* ── URL Panel ──────────────────────────────────────── */

const getVisibleUrls = () =>
    [...document.querySelectorAll('.img-card:not(.hidden)')].map(c => c.dataset.url);

const toggleUrlPanel = () => {
    const panel = document.getElementById('urlPanel');
    if (!panel) return;
    const isOpen = panel.classList.toggle('open');
    if (isOpen) refreshUrlPanel();
};

const refreshUrlPanel = () => {
    const panel = document.getElementById('urlPanel');
    if (!panel || !panel.classList.contains('open')) return;
    const urls = getVisibleUrls();
    const textarea = document.getElementById('urlTextarea');
    const countEl = document.getElementById('urlPanelCount');
    if (textarea) textarea.value = urls.join('\n');
    if (countEl) countEl.textContent = `(${urls.length})`;
};

const copyUrls = async () => {
    const urls = getVisibleUrls();
    if (!urls.length) return;
    try {
        await navigator.clipboard.writeText(urls.join('\n'));
        showToast(`✓ ${urls.length} URL${urls.length > 1 ? 's' : ''} copied!`);
    } catch {
        // Fallback: open panel so user can manually copy
        const panel = document.getElementById('urlPanel');
        if (panel && !panel.classList.contains('open')) toggleUrlPanel();
        showToast('Open the URLs panel and copy manually.', true);
    }
};

const showToast = (msg, isWarn = false) => {
    const existing = document.getElementById('imgExtractorToast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'imgExtractorToast';
    toast.className = 'img-extractor-toast' + (isWarn ? ' warn' : '');
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
};

/* ── Download ────────────────────────────────────────── */

const downloadImage = (e, url, filename) => {
    e.preventDefault();

    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename || 'image';
            a.click();
            URL.revokeObjectURL(a.href);
        })
        .catch(() => {
            // Fallback: open in new tab if CORS blocks direct download
            window.open(url, '_blank');
        });
};

const downloadAll = async () => {
    const visibleCards = [...document.querySelectorAll('.img-card:not(.hidden)')];

    if (!visibleCards.length) return;

    const btn = document.querySelector('.download-bar button');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `⏳ Downloading ${visibleCards.length}…`;

    // Sequential downloads with small delay to avoid browser blocking
    for (let i = 0; i < visibleCards.length; i++) {
        const card = visibleCards[i];
        const url = card.dataset.url;
        const name = getFilename(url);

        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = name;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch {
            window.open(url, '_blank');
        }

        btn.innerHTML = `⏳ ${i + 1}/${visibleCards.length}…`;
        await new Promise(r => setTimeout(r, 150));
    }

    btn.disabled = false;
    btn.innerHTML = original;
};

/* ── Count update after broken images removed ────────── */
const updateCount = () => {
    const visible = document.querySelectorAll('.img-card:not(.hidden)').length;
    const countEl = document.getElementById('visibleCount');
    if (countEl) countEl.textContent = visible;
    refreshUrlPanel();
};

/* ── Enter key support ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('urlInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') extractImages();
        });
    }
});
