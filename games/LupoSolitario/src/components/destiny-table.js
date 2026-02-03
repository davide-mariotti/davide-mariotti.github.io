// Destiny Table - Random number generation (reused from original code)

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function getRandomDestinyNumber() {
    const destinyNumbers = [
        1, 5, 7, 3, 6, 9, 0, 1, 7, 9,
        3, 9, 2, 8, 1, 7, 4, 9, 7, 8,
        6, 1, 0, 7, 3, 0, 5, 4, 6, 7,
        0, 2, 8, 9, 2, 9, 6, 0, 2, 4,
        5, 9, 6, 4, 8, 2, 8, 5, 6, 3,
        0, 3, 1, 3, 9, 7, 5, 0, 1, 5,
        5, 8, 2, 5, 1, 3, 6, 4, 3, 9,
        7, 0, 4, 8, 6, 4, 5, 1, 4, 2,
        4, 6, 8, 3, 2, 0, 1, 7, 2, 5,
        8, 3, 7, 0, 9, 6, 2, 4, 8, 1
    ];

    shuffleArray(destinyNumbers);
    return destinyNumbers.pop();
}

// Create a visual destiny table roller component
export function createDestinyRoller(onRoll) {
    const container = document.createElement('div');
    container.className = 'destiny-roller';
    container.innerHTML = `
    <div class="destiny-display">
      <span class="destiny-number" id="destiny-number">?</span>
    </div>
    <button class="btn btn-primary btn-large" id="roll-destiny">
      🎲 Lancia il Destino
    </button>
  `;

    const button = container.querySelector('#roll-destiny');
    const display = container.querySelector('#destiny-number');

    button.addEventListener('click', () => {
        // Animate the roll
        animateRoll(display, () => {
            const number = getRandomDestinyNumber();
            display.textContent = number;
            if (onRoll) onRoll(number);
        });
    });

    return container;
}

function animateRoll(element, callback) {
    let count = 0;
    const interval = setInterval(() => {
        element.textContent = Math.floor(Math.random() * 10);
        count++;
        if (count > 10) {
            clearInterval(interval);
            callback();
        }
    }, 100);
}
