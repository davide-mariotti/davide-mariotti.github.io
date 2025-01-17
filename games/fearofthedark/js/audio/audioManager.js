class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.loadSounds();
        
        // Volumi predefiniti
        this.volumes = {
            master: 1,
            music: 0.7,
            effects: 0.8
        };
    }

    loadSounds() {
        // Effetti pozioni
        this.loadSound('heal', 'assets/sounds/effects/heal.mp3');
        this.loadSound('mana', 'assets/sounds/effects/mana.mp3');
        this.loadSound('buff', 'assets/sounds/effects/buff.mp3');
        this.loadSound('equip', 'assets/sounds/effects/equip.mp3');
        this.loadSound('pickup', 'assets/sounds/effects/pickup.mp3');
    }

    loadSound(name, path) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        this.sounds[name] = audio;
    }

    playSound(name) {
        if (!this.sounds[name]) return;
        
        const sound = this.sounds[name].cloneNode();
        sound.volume = this.volumes.master * this.volumes.effects;
        sound.play().catch(e => console.log('Audio playback failed:', e));
    }

    setVolume(type, value) {
        if (this.volumes.hasOwnProperty(type)) {
            this.volumes[type] = value / 100;
            
            if (type === 'master' || type === 'music') {
                if (this.music) {
                    this.music.volume = this.volumes.master * this.volumes.music;
                }
            }
        }
    }
} 