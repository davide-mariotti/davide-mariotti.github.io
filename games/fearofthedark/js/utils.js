// Funzioni di utilità
const Utils = {
    // Genera un numero casuale tra min e max
    random: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Carica un'immagine
    loadImage: (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    getAssetPath: (path) => {
        path = path.replace(/^\//, '').replace(/^games\/fearofthedark\//, '');
        
        if (window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost')) {
            return path;
        }
        
        return window.location.pathname.includes('/games/fearofthedark/') 
            ? path 
            : `games/fearofthedark/${path}`;
    }
}; 