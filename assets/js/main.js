/* - - - - - - - - - - */
/* - - Global Main JS - */
/* - - - - - - - - - - */

document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initLoader();
  initTyping();
  initMatrix();
  // Navbar toggler logic is now handled by Bootstrap or needs a check after load
  // Active menu logic needs to be called after menu load
});

/* - - - Stars - - - */
function initStars() {
  const smallStarSize = 0.5;
  const mediumStarSize = 1;
  const largeStarSize = 1.5;

  function generateStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    const size = getRandomStarSize();
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.top = Math.random() * window.innerHeight + 'px';
    document.body.appendChild(star);
  }

  const interval = setInterval(generateStar, 100);
  setTimeout(() => clearInterval(interval), 15000);

  function getRandomStarSize() {
    const sizes = [smallStarSize, mediumStarSize, largeStarSize];
    return sizes[Math.floor(Math.random() * sizes.length)] * 2;
  }

  window.onresize = () => {
    document.querySelectorAll('.star').forEach(star => {
      star.style.left = Math.random() * window.innerWidth + 'px';
      star.style.top = Math.random() * window.innerHeight + 'px';
    });
  };
}

/* - - - Loader - - - */
function initLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.id = 'loader-none';
}

/* - - - Typing Effect - - - */
function initTyping() {
  const textContainer = document.getElementById('text-container');
  if (!textContainer) return;

  const words = ['Front-end Developer', 'Graphic Designer', 'Back-end Developer', 'UI Designer', 'UX Designer'];
  let wordIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;

  function simulateTyping() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      textContainer.textContent = currentWord.substring(0, letterIndex + 1);
      letterIndex++;
      if (letterIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(simulateTyping, 1000);
      } else {
        setTimeout(simulateTyping, 150);
      }
    } else {
      textContainer.textContent = currentWord.substring(0, letterIndex);
      letterIndex--;
      if (letterIndex === -1) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(simulateTyping, 500);
      } else {
        setTimeout(simulateTyping, 100);
      }
    }
  }
  simulateTyping();
}

/* - - - Matrix Animation - - - */
function initMatrix() {
  const canvas = document.getElementById('matrix');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Set canvas size to parent container size or window
  const resizeCanvas = () => {
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789'.split('');
  const fontSize = 14;
  let columns = canvas.width / fontSize;

  // Reset columns on resize
  window.addEventListener('resize', () => {
    columns = canvas.width / fontSize;
    drops.length = Math.ceil(columns);
    for (let i = 0; i < drops.length; i++) {
      if (drops[i] === undefined) drops[i] = 1;
    }
  });

  const drops = [];
  for (let i = 0; i < columns; i++) drops[i] = 1;

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Slower fade for trail
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88'; // Use primary color
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  setInterval(draw, 50);
}

/* - - - Active Menu Helper - - - */
// Call this function AFTER the menu HTML is injected
window.highlightActiveMenu = function () {
  const currentUrl = window.location.pathname;
  // Handle root / -> /index.html mapping roughly
  // Or just exact match
  const menuItems = document.querySelectorAll(".navbar-nav .nav-item");

  menuItems.forEach(item => {
    const link = item.querySelector("a");
    if (link) {
      const menuItemUrl = link.getAttribute("href");
      // Simple check: is contained?
      if (currentUrl.endsWith(menuItemUrl) || (currentUrl === '/' && menuItemUrl === 'index.html')) {
        item.classList.add("active");
        link.classList.add("active");
      }
    }
  });

  // Re-initialize navbar toggler if needed (standard Bootstrap usually handles delegation, but checking logic)
  const navbarToggler = document.querySelector(".navbar-toggler");
  const animatedIcon = document.querySelector(".animated-icon2");
  if (navbarToggler && animatedIcon) {
    // Remove old listeners to avoid duplicates if re-run
    const newToggler = navbarToggler.cloneNode(true);
    navbarToggler.parentNode.replaceChild(newToggler, navbarToggler);
    newToggler.addEventListener("click", function () {
      animatedIcon.classList.toggle("open");
    });
  }
};
