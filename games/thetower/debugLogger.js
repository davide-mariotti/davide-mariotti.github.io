class DebugLogger {
    constructor() {
        this.debugConsole = document.getElementById('debug-console');
        this.maxLines = 100;
        this.originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            clear: console.clear || function() {} // Fallback se clear non esiste
        };
    }

    log(...args) {
        this.originalConsole.log(...args);
        this.addToDebugConsole(args);
    }

    warn(...args) {
        this.originalConsole.warn(...args);
        this.addToDebugConsole(args, 'warn');
    }

    error(...args) {
        this.originalConsole.error(...args);
        this.addToDebugConsole(args, 'error');
    }

    addToDebugConsole(args, type = 'log') {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : arg
        ).join(' ');

        const lineElement = document.createElement('div');
        lineElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        if (type === 'warn') {
            lineElement.style.color = 'yellow';
        } else if (type === 'error') {
            lineElement.style.color = 'red';
        }

        this.debugConsole.appendChild(lineElement);

        // Limita il numero di linee
        while (this.debugConsole.childNodes.length > this.maxLines) {
            this.debugConsole.removeChild(this.debugConsole.firstChild);
        }

        // Scrolla automaticamente verso il basso
        this.debugConsole.scrollTop = this.debugConsole.scrollHeight;
    }

    clear() {
        if (typeof this.originalConsole.clear === 'function') {
            this.originalConsole.clear();
        }
        while (this.debugConsole.firstChild) {
            this.debugConsole.removeChild(this.debugConsole.firstChild);
        }
    }
}

const debugLogger = new DebugLogger();

// Sostituisci i metodi console globali
console.log = (...args) => debugLogger.log(...args);
console.warn = (...args) => debugLogger.warn(...args);
console.error = (...args) => debugLogger.error(...args);
console.clear = () => debugLogger.clear();
