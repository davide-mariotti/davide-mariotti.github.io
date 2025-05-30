const truthQuestions = [
    // Ricordi e momenti speciali
    "Qual è il ricordo più bello che ti viene in mente oggi?",
    "Qual è il tuo ricordo più felice d'infanzia?",
    "Racconta un sogno che ricordi bene e ti ha colpito.",
    "Hai mai avuto un momento imbarazzante che adesso ti fa ridere?",
    "Qual è stata la tua esperienza più folle in vacanza?",
    
    // Prime impressioni e sentimenti
    "Hai mai avuto una cotta a prima vista? Racconta.",
    "Qual è stata la tua prima impressione su di me?",
    "Qual è stata la tua prima cotta?",
    "Hai mai avuto un colpo di fulmine?",
    "Hai mai avuto una crush segreta su qualcuno che non avresti dovuto?",
    
    // Personalità e abitudini
    "Qual è la tua piccola abitudine che nessuno conosce?",
    "Qual è il tuo talento nascosto che pochi conoscono?",
    "Qual è la qualità che ammiri di più in te stesso/a?",
    "Cosa ti fa sentire più a tuo agio in una situazione nuova?",
    "Cosa ti fa sentire davvero vivo/a?",
    
    // Complimenti e parole belle
    "Qual è il complimento più bello che hai ricevuto?",
    "Qual è il complimento più strano che ti hanno fatto?",
    "Qual è la cosa più bella che qualcuno ti ha detto?",
    "Qual è la cosa più dolce che qualcuno ti ha detto?",
    
    // Spontaneità e follie
    "Qual è la cosa più spontanea che hai fatto ultimamente?",
    "Qual è la cosa più folle che faresti per divertimento?",
    "Qual è la cosa più pazza che hai fatto con un amico?",
    "Hai mai infranto una regola solo per divertimento?",
    "Qual è la cosa più coraggiosa che hai fatto nella vita?",
    
    // Paure e vulnerabilità
    "Qual è la tua paura più buffa o strana?",
    "Qual è la tua paura più grande?",
    "Qual è la cosa che ti fa sentire più vulnerabile?",
    
    // Romantiche e appuntamenti
    "Qual è la cosa più divertente che ti è successa in un appuntamento?",
    "Qual è stato il tuo peggior appuntamento fino ad ora?",
    "Hai mai fatto un gesto romantico che ti ha sorpreso?",
    "Qual è la cosa più romantica che hai fatto per qualcuno?",
    "Qual è la cosa più romantica che qualcuno abbia fatto per te?",
    "Qual è la cosa più romantica che ti piacerebbe fare con qualcuno?",
    "Qual è il tuo modo preferito per mostrare affetto?",
    
    // Musica e relax
    "Qual è la tua canzone preferita per rilassarti e perché?",
    "Qual è il tuo modo preferito per rilassarti dopo una giornata stressante?",
    "Qual è la tua canzone d'amore preferita e perché?",
    "Qual è la tua canzone preferita per alzare il morale?",
    
    // Felicità e passioni
    "Qual è la cosa più semplice che ti rende felice?",
    "Qual è la cosa che ti fa ridere anche nei momenti difficili?",
    "Qual è la tua più grande passione?",
    "Qual è la tua definizione di felicità?",
    "Una cosa che ti rende davvero felice senza grandi motivi?",
    
    // Bugie e segreti
    "Hai mai mentito per evitare un appuntamento?",
    "Hai mai detto 'ti amo' senza sentirlo davvero?",
    "Hai mai finto di sapere qualcosa per non sembrare ignorante?",
    "Hai mai detto una bugia per evitare di ferire qualcuno?",
    "Hai mai nascosto qualcosa a un amico? Cosa?",
    
    // Regali e cose strane
    "Qual è il regalo più bello che hai ricevuto?",
    "Qual è il regalo più strano che hai fatto o ricevuto?",
    "Qual è la cosa più strana che ti piace mangiare?",
    
    // Valori e qualità
    "Qual è la qualità che apprezzi di più in una persona?",
    "Qual è la cosa più importante che cerchi in una persona?",
    "Qual è la tua definizione di amore?",
    
    // Orgoglio e crescita
    "Hai mai fatto qualcosa di cui sei orgoglioso/a ma non l'hai mai detto a nessuno?",
    "Hai mai fatto qualcosa per cui ti sei sentito/a veramente orgoglioso/a?",
    "Qual è stato il momento in cui ti sei sentito/a più coraggioso/a?",
    
    // Viaggi e luoghi
    "Qual è il posto dove ti piacerebbe andare con qualcuno speciale?",
    "Hai mai fatto un viaggio che ti ha cambiato?",
    "Se potessi vivere in un'altra epoca, quale sceglieresti?",
    
    // Sogni e ambizioni
    "Qual è il sogno più grande che vorresti realizzare?",
    "Hai mai avuto un sogno ricorrente? Raccontalo.",
    "Qual è la cosa più spontanea che ti piacerebbe fare domani?",
    
    // Nuove domande specifiche per la situazione
    "Qual è la prima cosa che noti quando conosci qualcuno di nuovo?",
    "Se dovessi descrivermi a un amico, cosa diresti?",
    "C'è qualcosa che vorresti chiedermi ma non hai mai osato?",
    "Qual è la cosa più bella di conoscere qualcuno di nuovo?",
    "Se potessimo fermare il tempo adesso, cosa vorresti che succedesse?",
    "Cosa pensi che abbiamo in comune?",
    "Qual è la cosa che ti incuriosisce di più delle persone?",
    "Se dovessi scegliere una canzone per descrivere questo momento, quale sarebbe?",
    "Qual è la cosa più coraggiosa che hai fatto per un amico?",
    "C'è qualcosa che ti rende nervoso/a quando conosci persone nuove?",
    "Qual è il complimento più sincero che puoi farmi adesso?",
    "Se potessi leggere nella mia mente, cosa vorresti sapere?",
    "Qual è la domanda più strana che vorresti farmi?",
    "Cosa ti ha spinto a dire di sì a stare qui insieme?",
    "Qual è la cosa più divertente che hai fatto con un amico di recente?",
    
    // Ulteriori domande creative e personali
    "Qual è la bugia più innocua che dici spesso?",
    "Hai mai avuto un'ossessione strana da bambino?",
    "Qual è la cosa più imbarazzante nel tuo telefono?",
    "Se potessi avere una conversazione con te stesso di 5 anni fa, cosa diresti?",
    "Qual è la cosa più strana che hai mai sognato di notte?",
    "Hai mai fatto finta di dormire per evitare una situazione?",
    "Qual è la tua superstizione più assurda?",
    "Che cosa fai quando sei completamente solo che non faresti mai davanti ad altri?",
    "Qual è stato il momento più cringe della tua vita?",
    "Hai mai avuto un nemico immaginario da bambino?",
    "Qual è la cosa più strana che collezionavi da piccolo?",
    "Se dovessi vivere in un cartone animato, quale sceglieresti?",
    "Qual è la tua teoria del complotto più divertente (anche se non ci credi)?",
    "Hai mai parlato da solo ad alta voce? Di cosa?",
    "Qual è la cosa più infantile che fai ancora adesso?",
    "Se potessi avere un superpotere inutile, quale vorresti?",
    "Qual è la tua abitudine più strana quando sei stressato?",
    "Hai mai inventato una scusa assurda per non fare qualcosa?",
    "Qual è la cosa più strana che hai mai mangiato per sbaglio?",
    "Se la tua vita fosse un film, di che genere sarebbe?",
    "Qual è il soprannome più imbarazzante che hai mai avuto?",
    "Hai mai fatto qualcosa solo perché l'avevi visto in TV?",
    "Qual è la cosa più strana che hai fatto per noia?",
    "Se potessi eliminare una parola dal vocabolario, quale sceglieresti?",
    "Qual è stata la tua fase più imbarazzante nell'adolescenza?",
    "Hai mai avuto paura di qualcosa di completamente irrazionale?",
    "Qual è la cosa più strana che ti è capitata in ascensore?",
    "Se dovessi descrivere il tuo carattere con un animale, quale sceglieresti?",
    "Qual è la domanda più strana che ti hanno mai fatto?",
    "Hai mai fatto qualcosa solo per impressionare qualcuno? Cosa?",
    "Qual è la cosa più strana che hai fatto quando pensavi di essere solo?"
];


export { truthQuestions }; 