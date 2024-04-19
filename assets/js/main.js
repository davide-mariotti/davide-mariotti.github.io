/* - - - - - - - - - - */
/* - Simulating Star - */
/* - - - - - - - - - - */

document.addEventListener('DOMContentLoaded', function() {
  // Generates and animates stars of varying sizes across the viewport
  var smallStarSize = 0.5;
  var mediumStarSize = 1;
  var largeStarSize = 1.5;

  // Function to create a new star element with random size and position
  function generateStar() {
      var star = document.createElement('div');
      star.classList.add('star');
      star.style.width = getRandomStarSize() + 'px';
      star.style.height = star.style.width;
      star.style.left = Math.random() * window.innerWidth + 'px';
      star.style.top = Math.random() * window.innerHeight + 'px';
      document.body.appendChild(star);
  }

  // Generate stars every 100 milliseconds
  var interval = setInterval(generateStar, 100);

  // Stop generating stars after 15 seconds
  setTimeout(function() {
      clearInterval(interval);
  }, 15000);

  // Function to get a random star size from predefined values
  function getRandomStarSize() {
      var sizes = [smallStarSize, mediumStarSize, largeStarSize];
      var randomIndex = Math.floor(Math.random() * sizes.length);
      return sizes[randomIndex] * 2; // Doubles the size for visual effect
  }

  // Update star positions when the window is resized
  window.onresize = function() {
      var stars = document.querySelectorAll('.star');
      stars.forEach(function(star) {
          star.style.left = Math.random() * window.innerWidth + 'px';
          star.style.top = Math.random() * window.innerHeight + 'px';
      });
  };
});

/* - - - - - - - - - - */
/* - - Page Loader - - */
/* - - - - - - - - - - */

// Hide loader element when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('loader').id = 'loader-none';
});

/* - - - - - - - - - - */
/* - - Typing Jobs - - */
/* - - - - - - - - - - */

document.addEventListener('DOMContentLoaded', function() {
  // Simulates typing effect by progressively displaying and deleting words in a loop
  const textContainer = document.getElementById('text-container');
  const words = ['Front-end Developer', 'Graphic Designer', 'Back-end Developer', 'DNN Specialist', 'AEM Developer', 'Video Maker'];
  let wordIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;

  function simulateTyping() {
    if (!textContainer) {
      return;
    }

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
        wordIndex++;
        if (wordIndex === words.length) {
          wordIndex = 0;
        }
        setTimeout(simulateTyping, 500);
      } else {
        setTimeout(simulateTyping, 100);
      }
    }
  }

  if (textContainer) {
    simulateTyping();
  }
});

/* - - - - - - - - - - */
/* - - Mobile menu - - */
/* - - - - - - - - - - */
document.addEventListener("DOMContentLoaded", function () {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const animatedIcon = document.querySelector(".animated-icon2");

  navbarToggler.addEventListener("click", function () {
    animatedIcon.classList.toggle("open");
  });
});

/* - - - - - - - - - - */
/* - Adjust height - */
/* - - - - - - - - - - */
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners after the DOM content is loaded
  window.addEventListener('load', adjustHeight);
  window.addEventListener('resize', adjustHeight);

  function adjustHeight() {
      var div1 = document.getElementById('introduction1');
      var div2 = document.getElementById('matrix');

      // Check if div1 and div2 exist
      if (!div1 || !div2) {
          return; // Exit function if either element is not found
      }

      // Reset height to auto to measure the natural height
      div1.style.height = 'auto';
      div2.style.height = 'auto';

      var maxHeight = Math.max(div1.clientHeight, div2.clientHeight);

      div1.style.height = maxHeight + 'px';
      div2.style.height = maxHeight + 'px';

      var div1Width = div1.clientWidth;
      var div1Height = div1.clientHeight;

      div2.style.width = div1Width + 'px';
      div2.setAttribute('width', div1Width + 'px');
      div2.setAttribute('height', div1Height + 'px');
  }
});


/* - - - - - - - - - - */
/* - Matrix Animation - */
/* - - - - - - - - - - */

document.addEventListener('DOMContentLoaded', function() {
  // Initialising the canvas
  var canvas = document.getElementById('matrix');
  if (!canvas) {
      return; // Exit if canvas element is not found
  }
  var ctx = canvas.getContext('2d');

  // Setting the width and height of the canvas
  canvas.width = window.innerWidth;

  // Setting up the letters
  var letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ';
  letters = letters.split('');

  // Setting up the columns
  var fontSize = 10,
      columns = canvas.width / fontSize;

  // Setting up the drops
  var drops = [];
  for (var i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  // Setting up the draw function
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, .1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < drops.length; i++) {
      var text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillStyle = '#2c9f45';
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      drops[i]++;
      if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
        drops[i] = 0;
      }
    }
  }

  setInterval(draw, 50); // Loop the animation
});

/* - - - - - - - - - - */
/* - CopyrightYear - - */
/* - currentDate - - - */
/* - - - - - - - - - - */
document.addEventListener('DOMContentLoaded', function() {
  var currentYear = new Date().getFullYear();
  var copyrightYearElement = document.getElementById("CopyrightYear");
  if (copyrightYearElement) {
      copyrightYearElement.textContent = currentYear;
  }

  // Function to add leading zero to single-digit numbers
  function addLeadingZero(number) {
      return number < 10 ? "0" + number : number;
  }

  // Function to update the time
  function updateTime() {
      // Get the current date and time
      var currentDate = new Date();

      // Format the date as desired (e.g., "March 15, 2024")
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var formattedDate = currentDate.toLocaleDateString('en-US', options);

      // Format the time as "HH:mm:ss"
      var formattedTime = addLeadingZero(currentDate.getHours()) + ":" +
                          addLeadingZero(currentDate.getMinutes()) + ":" +
                          addLeadingZero(currentDate.getSeconds());

      // Set the formatted date and time as the text content of the todayData element
      var todayDataElement = document.getElementById("todayData");
      if (todayDataElement) {
          todayDataElement.textContent = formattedDate + " " + formattedTime;
      }
  }

  // Update the time every second
  setInterval(updateTime, 1000);

  // Call updateTime once to display the time immediately when the page loads
  updateTime();
});
