// Funzioni di utilità
function getTimeInSeconds(hours, minutes, seconds) {
    return (hours * 3600) + (minutes * 60) + seconds;
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return { hours, minutes, seconds };
}

// Calcola il tempo
function calculateTime() {
    const distance = parseFloat(document.getElementById('distance').value);
    const paceMin = parseInt(document.getElementById('paceMinutes').value) || 0;
    const paceSec = parseInt(document.getElementById('paceSeconds').value) || 0;
    const distanceUnit = document.getElementById('distanceUnit').value;
    const paceUnit = document.getElementById('paceUnit').value;

    if (!distance || (paceMin === 0 && paceSec === 0)) {
        alert('Inserisci sia la distanza che il passo');
        return;
    }

    let totalSeconds = 0;
    const paceInSeconds = (paceMin * 60) + paceSec;

    // Conversione in base all'unità di misura
    if (distanceUnit === 'km' && paceUnit === 'kmh') {
        totalSeconds = distance * paceInSeconds;
    } else if (distanceUnit === 'mi' && paceUnit === 'mph') {
        totalSeconds = distance * paceInSeconds;
    } // Aggiungere altre conversioni se necessario

    const time = formatTime(totalSeconds);
    
    document.getElementById('timeHours').value = time.hours;
    document.getElementById('timeMinutes').value = time.minutes;
    document.getElementById('timeSeconds').value = time.seconds;
}

// Calcola la distanza
function calculateDistance() {
    const timeHr = parseInt(document.getElementById('timeHours').value) || 0;
    const timeMin = parseInt(document.getElementById('timeMinutes').value) || 0;
    const timeSec = parseInt(document.getElementById('timeSeconds').value) || 0;
    const paceMin = parseInt(document.getElementById('paceMinutes').value) || 0;
    const paceSec = parseInt(document.getElementById('paceSeconds').value) || 0;

    if ((timeHr === 0 && timeMin === 0 && timeSec === 0) || (paceMin === 0 && paceSec === 0)) {
        alert('Inserisci sia il tempo che il passo');
        return;
    }

    const totalTimeSeconds = getTimeInSeconds(timeHr, timeMin, timeSec);
    const paceSeconds = (paceMin * 60) + paceSec;
    
    const distance = totalTimeSeconds / paceSeconds;
    
    document.getElementById('distance').value = distance.toFixed(2);
}

// Calcola il passo
function calculatePace() {
    const distance = parseFloat(document.getElementById('distance').value);
    const timeHr = parseInt(document.getElementById('timeHours').value) || 0;
    const timeMin = parseInt(document.getElementById('timeMinutes').value) || 0;
    const timeSec = parseInt(document.getElementById('timeSeconds').value) || 0;

    if (!distance || (timeHr === 0 && timeMin === 0 && timeSec === 0)) {
        alert('Inserisci sia la distanza che il tempo');
        return;
    }

    const totalSeconds = getTimeInSeconds(timeHr, timeMin, timeSec);
    const paceSeconds = totalSeconds / distance;
    
    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceSecondsRemainder = Math.floor(paceSeconds % 60);
    
    document.getElementById('paceMinutes').value = paceMinutes;
    document.getElementById('paceSeconds').value = paceSecondsRemainder;
}

// Imposta distanza predefinita
function setPresetDistance() {
    const presetSelect = document.getElementById('presetDistance');
    const distanceInput = document.getElementById('distance');
    const distanceUnit = document.getElementById('distanceUnit');
    
    if (presetSelect.value) {
        distanceInput.value = presetSelect.value;
        distanceUnit.value = 'km';
    }
}

// Reset tutti i campi
function resetAll() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => input.value = '');
    document.getElementById('presetDistance').value = '';
    document.getElementById('distanceUnit').value = 'km';
    document.getElementById('paceUnit').value = 'kmh';
}