const dareChallenges = [
    // Respirazione e rilassamento
    "Fai 5 respiri profondi e raccontami cosa ti rilassa di più",
    
    // Complimenti e dichiarazioni
    "Fai un complimento originale a me",
    "Fai una dichiarazione teatrale d'amore a qualcosa fuori dalla macchina",
    "Fai una dichiarazione romantica a un oggetto nella macchina",
    "Fai un mini discorso su cosa ti piace di me",
    
    // Ricordi e racconti
    "Racconta il ricordo più divertente che ti viene in mente adesso",
    "Racconta il tuo sogno più strano",
    "Racconta il tuo primo ricordo di infanzia",
    "Racconta la tua gag più imbarazzante in meno di 30 secondi",
    "Racconta il tuo peggiore scherzo fatto o subito",
    "Fai un mini racconto inventato su una persona che vedi fuori",
    
    // Espressioni facciali
    "Fai una faccia buffa e mantienila per 10 secondi",
    "Fai una faccia sorpresa e mantienila per 10 secondi",
    "Fai una smorfia da cartoon per 15 secondi",
    "Fai un sorriso irresistibile per 15 secondi",
    "Imita la tua espressione quando ricevi un regalo",
    
    // Imitazioni
    "Imita il tuo personaggio preferito per 20 secondi",
    "Imita il verso di un animale e fallo indovinare",
    "Imita il verso di un animale raro e fallo indovinare",
    "Imita il verso di un personaggio famoso",
    "Imita un personaggio di un film famoso",
    "Imita la tua risata per 15 secondi",
    "Imita il mio modo di camminare (anche se non mi vedi)",
    
    // Canto
    "Canta il ritornello della tua canzone preferita a voce bassa",
    "Canta a bassa voce una canzone romantica",
    "Canta il ritornello di una canzone a caso",
    
    // Danza e movimento
    "Fai un piccolo passo di danza seduto",
    "Fai una piccola danza seduto/a sulla sedia",
    "Fai un esercizio di stretching che puoi fare seduto",
    
    // Creatività e poesia
    "Fai una mini poesia su quello che vedi fuori dal finestrino",
    "Fai una mini poesia su di me",
    "Fai un gioco di parole con il nome di un luogo che conosci",
    
    // Promesse e brindisi
    "Fai una promessa buffa per il prossimo anno",
    "Fai una promessa buffa per il prossimo mese",
    "Fai un brindisi immaginario a qualcosa di buffo",
    "Fai un brindisi immaginario a un ricordo felice",
    
    // Barzellette e bugie
    "Racconta una barzelletta leggera e simpatica",
    "Racconta una piccola bugia e falla sembrare vera",
    "Racconta una barzelletta e cerca di non ridere",
    
    // Scenette teatrali
    "Fai una mini scenetta come se fossi in un film drammatico",
    "Fai una dichiarazione teatrale come se fossi in un film d'azione",
    
    // Gesti dolci
    "Fai un gesto dolce verso qualcosa nella macchina",
    "Fai un complimento a qualcuno che vediamo dalla macchina",
    
    // Segreti
    "Racconta un segreto che nessuno sa di te (niente di troppo personale)",
    
    // Nuove sfide specifiche per la situazione
    "Inventa una storia epica su questo posto dove siamo parcheggiati",
    "Fai un rap improvvisato su quello che vedi dal finestrino",
    "Descrivi la colonna sonora perfetta per questo momento",
    "Fai finta di essere un commentatore sportivo che descrive la gente che passa",
    "Inventa un dialogo tra due lampioni che ci guardano",
    "Fai una recensione a 5 stelle di questa macchina come se fosse un hotel",
    "Descrivi il panorama fuori come se fossi una guida turistica",
    "Fai finta di essere un DJ e presenta la prossima canzone che ascolteremo",
    "Inventa un nome per il nostro duo e spiega perché",
    "Fai una previsione buffa su cosa succederà nei prossimi 10 minuti",
    "Inventa una conversazione tra il volante e il cambio",
    "Descrivi me come se fossi un personaggio di un libro che stai leggendo",
    "Fai finta di essere un meteorologo e dai le previsioni per i nostri stati d'animo",
    "Inventa una pubblicità per questo parcheggio",
    "Racconta cosa stanno pensando le persone che passano fuori",
    "Fai il verso di come parlerebbe un parchimetro se fosse un pirata",
    "Descrivi questa sessione come se fosse una missione spaziale",
    
    // Ulteriori sfide creative
    "Fai una telefonata immaginaria con te stesso di 10 anni fa",
    "Racconta una favola inventata usando solo cose che vedi fuori",
    "Fai l'imitazione di un presentatore TV che annuncia il nostro arrivo qui",
    "Inventa un ritornello rap con il nome di questo posto",
    "Fai finta di essere un critico d'arte che descrive il paesaggio",
    "Racconta come un bambino descriverebbe questa situazione ai nonni",
    "Fai l'imitazione di un robot che ci dà consigli sulla vita",
    "Inventa una storia horror di 30 secondi ambientata in questa macchina",
    "Fai una scenetta da televendita per vendere questa esperienza",
    "Racconta questo momento come se fosse un documentario della BBC",
    "Fai l'imitazione di come parleresti se fossi molto molto anziano",
    "Inventa un dialogo tra due nuvole che ci guardano dall'alto",
    "Fai una previsione da cartomante sul nostro futuro immediato",
    "Racconta come un alieno descriverebbe gli umani fermi in macchina",
    "Fai l'imitazione di un cronista sportivo che commenta quello che succede fuori",
    "Inventa una canzone usando solo i rumori che senti adesso",
    "Fai una recensione Tripadvisor di questo posto dove siamo",
    "Racconta una barzelletta inventata sul posto usando qualcosa che vedi",
    "Fai l'imitazione di un maestro di cerimonie che presenta il panorama",
    "Inventa un haiku su questa situazione",
    "Fai una scenetta da film d'azione usando solo le cinture di sicurezza",
    "Racconta come racconteresti questo momento a un bambino di 5 anni",
    "Fai l'imitazione di un detective che analizza l'interno della macchina",
    "Inventa una pubblicità per i tuoi capelli in questo momento",
    "Fai una mini lezione universitaria su come stare fermi in macchina",
    "Racconta questo momento come se fosse un episodio di un reality show",
    "Fai l'imitazione di un maggiordomo inglese che descrive la situazione",
    "Inventa una storia d'avventura usando solo oggetti nell'auto",
    "Fai una scenetta da soap opera drammatica su questo parcheggio",
    "Racconta come un giornalista sportivo commenterrebbe la nostra playlist",
    "Fai l'imitazione di un cowboy che descrive il paesaggio",
    "Inventa una filastrocca con i nomi dei posti che vediamo",
    "Fai una recensione da food blogger del sapore dell'aria in macchina",
    "Racconta questo momento come se fosse la scena finale di un film"
];


export { dareChallenges }; 