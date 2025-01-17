class Settings {
    constructor() {
        this.controls = {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            jump: 'Space',
            run: 'ShiftLeft',
            attack: 'KeyX',
            defend: 'KeyC',
            special: 'KeyV'
        };
        
        this.audio = {
            master: 1.0,
            music: 0.7,
            effects: 0.8
        };
        
        this.ui = {
            showHUD: true,
            showDamageNumbers: true,
            showFPS: false
        };
        
        this.debug = {
            enabled: false,
            showHitboxes: false
        };

        this.loadSettings();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('gameSettings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            this.controls = { ...this.controls, ...parsed.controls };
            this.audio = { ...this.audio, ...parsed.audio };
            this.ui = { ...this.ui, ...parsed.ui };
            this.debug = { ...this.debug, ...parsed.debug };
        }
    }

    saveSettings() {
        localStorage.setItem('gameSettings', JSON.stringify({
            controls: this.controls,
            audio: this.audio,
            ui: this.ui,
            debug: this.debug
        }));
    }
} 