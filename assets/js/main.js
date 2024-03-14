var smallStarSize = 0.5;
var mediumStarSize = 1;
var largeStarSize = 1.5;

function generateStar() {
  var star = document.createElement('div');
  star.classList.add('star');
  star.style.width = getRandomStarSize() + 'px';
  star.style.height = star.style.width;
  star.style.left = Math.random() * window.innerWidth + 'px';
  star.style.top = Math.random() * window.innerHeight + 'px';
  document.body.appendChild(star);
}

var interval = setInterval(generateStar, 200);

setTimeout(function() {
  clearInterval(interval);
}, 15000);

function getRandomStarSize() {
  var sizes = [smallStarSize, mediumStarSize, largeStarSize];
  var randomIndex = Math.floor(Math.random() * sizes.length);
  return sizes[randomIndex] * 2;
}

window.onresize = function() {
  var stars = document.querySelectorAll('.star');
  stars.forEach(function(star) {
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.top = Math.random() * window.innerHeight + 'px';
  });
  };

/*--------------------------*/

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('preloader').id = 'preloader-none';
});

const textContainer = document.getElementById('text-container');
const words = ['Front-end Developer', 'Graphic Designer', 'Back-end Developer', 'DNN Specialist', 'AEM Developer', 'Video Maker'];
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
      setTimeout(simulateTyping, 1000); // Delay before deleting
    } else {
      setTimeout(simulateTyping, 150); // Typing speed
    }
  } else {
    textContainer.textContent = currentWord.substring(0, letterIndex);
    letterIndex--;
    if (letterIndex === -1) { // Aggiunto controllo per verificare se tutte le lettere sono state eliminate
      isDeleting = false;
      wordIndex++;
      if (wordIndex === words.length) {
        wordIndex = 0; // Restart from the beginning
      }
      setTimeout(simulateTyping, 500); // Delay before typing next word
    } else {
      setTimeout(simulateTyping, 100); // Deleting speed
    }
  }
}

simulateTyping();

document.addEventListener("DOMContentLoaded", function() {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const animatedIcon = document.querySelector(".animated-icon2");

    navbarToggler.addEventListener("click", function() {
        animatedIcon.classList.toggle("open");
    });
});