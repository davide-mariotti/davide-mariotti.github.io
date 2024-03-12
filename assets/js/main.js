(function($){

    // Imposta le dimensioni delle stelle in pixel
    var smallStarSize = 0.5;
    var mediumStarSize = 1;
    var largeStarSize = 1.5;

    function generateStar(canvas, ctx, starRadius){
        ctx.beginPath();
        ctx.arc(starRadius + (Math.random() * canvas.width), starRadius + (Math.random() * canvas.height), starRadius, 0, Math.PI*2, false);
        
        // Imposta tutte le stelle come bianche
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        ctx.shadowBlur = 3;

        ctx.fill();
    }

    $(function(){
        
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
            function(interval){
                generateStar(canvas, context, getRandomStarSize());
            }
            , 200);

        setTimeout( // Stop creating stars after 10s
            function(){ clearInterval(interval); }
            ,10000
        );

        function getRandomStarSize() {
            var sizes = [smallStarSize, mediumStarSize, largeStarSize];
            var randomIndex = Math.floor(Math.random() * sizes.length);
            return sizes[randomIndex];
        }
    });
})(jQuery);
