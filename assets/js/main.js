(function ($) {

  // Imposta le dimensioni delle stelle in pixel
  var smallStarSize = 0.5;
  var mediumStarSize = 1;
  var largeStarSize = 1.5;

  function generateStar(canvas, ctx, starRadius) {
    ctx.beginPath();
    ctx.arc(starRadius + (Math.random() * canvas.width), starRadius + (Math.random() * canvas.height), starRadius, 0, Math.PI * 2, false);

    // Imposta tutte le stelle come bianche
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    ctx.shadowBlur = 3;

    ctx.fill();
  }

  $(function () {

    var canvas = document.getElementById("space");
    var context = canvas.getContext("2d");

    // Funzione per ridisegnare le stelle dopo il ridimensionamento della finestra
    function redrawStars() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      for (var i = 0; i < 30; i++) { // Puoi cambiare il numero di stelle da generare
        generateStar(canvas, context, getRandomStarSize());
      }
    }

    // Gestore per l'evento di ridimensionamento della finestra
    window.onresize = redrawStars;

    // Inizializza il canvas e genera le stelle
    redrawStars();

    interval = setInterval(
      function (interval) {
        generateStar(canvas, context, getRandomStarSize());
      }
      , 200);

    setTimeout( // Stop creating stars after 10s
      function () { clearInterval(interval); }
      , 10000
    );

    function getRandomStarSize() {
      var sizes = [smallStarSize, mediumStarSize, largeStarSize];
      var randomIndex = Math.floor(Math.random() * sizes.length);
      return sizes[randomIndex];
    }
  });
})(jQuery);


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



