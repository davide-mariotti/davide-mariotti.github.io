/* - - - - - - - - - - */
/* - - Global Main JS - */
/* - - - - - - - - - - */

document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initLoader();
  initTyping();
  initMatrix();
  markActiveNavLink();
  initMobileNavIcon();
  initFooter();
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

/* - - - Active Nav Link - - - */
function markActiveNavLink() {
  const currentUrl = window.location.pathname;
  document.querySelectorAll(".navbar-nav .nav-item").forEach(item => {
    const link = item.querySelector("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (currentUrl === href || (currentUrl === '/' && href === '/') ||
      (currentUrl.endsWith(href) && href !== '/')) {
      item.classList.add("active");
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* - - - Mobile Nav Icon - - - */
function initMobileNavIcon() {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const animatedIcon = document.querySelector(".animated-icon2");
  if (navbarToggler && animatedIcon) {
    navbarToggler.addEventListener("click", () => {
      animatedIcon.classList.toggle("open");
    });
  }
}

/* - - - Footer Copyright & Clock - - - */
function initFooter() {
  const yearSpan = document.getElementById("CopyrightYear");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const todayDataElement = document.getElementById("todayData");
  if (!todayDataElement) return;

  const update = () => {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    const formattedTime = currentDate.getHours().toString().padStart(2, '0') + ":" +
      currentDate.getMinutes().toString().padStart(2, '0') + ":" +
      currentDate.getSeconds().toString().padStart(2, '0');
    todayDataElement.textContent = formattedDate + " " + formattedTime;
  };

  update();
  setInterval(update, 1000);
}
