function fetchPages() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const cx = document.getElementById('cxInput').value.trim();
    const domain = document.getElementById('domainInput').value.trim();
    const pageCount = document.getElementById('pageCount').value;

    // Verifica che tutti i campi siano stati compilati
    if (!apiKey || !cx || !domain) {
        alert('Make sure you fill in all fields.');
        return;
    }

    // Effettua la richiesta API a Google Custom Search
    const pageSize = 10; // Numero di risultati per pagina
    const totalPages = Math.ceil(pageCount / pageSize); // Calcola il numero totale di pagine

    // Array per tenere traccia di tutte le promesse di richiesta
    const fetchPromises = [];

    for (let i = 0; i < totalPages; i++) {
        const startIndex = i * pageSize + 1; // Calcola l'indice di partenza per la pagina corrente

        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=site:${domain}&start=${startIndex}&num=${pageSize}`;

        // Effettua la richiesta per la pagina corrente
        const promise = fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error API request');
                }
                return response.json();
            })
            .then(data => data.items || []);

        // Aggiungi la promessa alla lista delle promesse di richiesta
        fetchPromises.push(promise);
    }

    // Esegui tutte le promesse di richiesta in parallelo
    Promise.all(fetchPromises)
        .then(pagesArrays => {
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = ''; // Cancella risultati precedenti

            // Unisci tutti gli array di pagine in un unico array
            const pages = pagesArrays.flat();

            if (pages.length > 0) {
                // Creazione del contenitore principale
                const divContainer = document.createElement('div');
                divContainer.classList.add('page-container'); // Aggiungi classe per stili CSS

                // Creazione della riga dei titoli
                const titleRow = document.createElement('div');
                titleRow.classList.add('title-row'); // Classe per la riga dei titoli

                const nameTitle = document.createElement('div');
                nameTitle.classList.add('name');
                nameTitle.textContent = 'Name';

                const descriptionTitle = document.createElement('div');
                descriptionTitle.classList.add('description');
                descriptionTitle.textContent = 'Description';

                const urlTitle = document.createElement('div');
                urlTitle.classList.add('url');
                urlTitle.textContent = 'URL';

                // Aggiungi i titoli alla riga dei titoli
                titleRow.appendChild(nameTitle);
                titleRow.appendChild(descriptionTitle);
                titleRow.appendChild(urlTitle);

                // Aggiungi la riga dei titoli al contenitore principale
                divContainer.appendChild(titleRow);

                // Itera su ogni pagina e crea un div per ciascuna
                pages.forEach(page => {
                    const pageDiv = document.createElement('div');
                    pageDiv.classList.add('page'); // Classe per singolo elemento pagina

                    const nameElement = document.createElement('div');
                    nameElement.classList.add('name');
                    nameElement.textContent = page.title;
                    
                    const descriptionElement = document.createElement('div');
                    descriptionElement.classList.add('description');
                    descriptionElement.textContent = page.snippet;
                    
                    const urlElement = document.createElement('div');
                    urlElement.classList.add('url');
                    urlElement.innerHTML = `<a href="${page.link}" target="_blank">${page.link}</a>`;

                    // Aggiungi i div di nome, descrizione e URL al div della pagina
                    pageDiv.appendChild(nameElement);
                    pageDiv.appendChild(descriptionElement);
                    pageDiv.appendChild(urlElement);

                    // Aggiungi il div della pagina al contenitore principale
                    divContainer.appendChild(pageDiv);
                });

                // Aggiungi il contenitore principale al risultato finale
                resultsContainer.appendChild(divContainer);
            } else {
                resultsContainer.textContent = 'No pages found.';
            }
        })
        .catch(error => {
            console.error('Errore:', error);
            alert('An error occurred while requesting pages.');
        });
}
