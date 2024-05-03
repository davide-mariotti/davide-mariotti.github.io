function convertToUppercase() {
    var inputText = document.getElementById("inputText").value;
    var outputText = inputText.toUpperCase();
    document.getElementById("outputText").value = outputText;
}

function convertToLowercase() {
    var inputText = document.getElementById("inputText").value;
    var outputText = inputText.toLowerCase();
    document.getElementById("outputText").value = outputText;
}

function convertToCamelcase() {
    var inputText = document.getElementById("inputText").value;
    var words = inputText.split(" ");
    var camelCaseWords = words.map(function (word, index) {
        if (index === 0) {
            return word.toLowerCase();
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    });
    var outputText = camelCaseWords.join("");
    document.getElementById("outputText").value = outputText;
}

function convertToSentenceCase() {
    var inputText = document.getElementById("inputText").value;
    var outputText = inputText.toLowerCase().replace(/(^|\. *)([a-z])/g, function (match, separator, char) {
        return separator + char.toUpperCase();
    });
    document.getElementById("outputText").value = outputText;
}

function convertToTitleCase() {
    var inputText = document.getElementById("inputText").value;
    var outputText = inputText.toLowerCase().replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
    document.getElementById("outputText").value = outputText;
}

function convertToInverseCase() {
    var inputText = document.getElementById("inputText").value;
    var outputText = "";
    for (var i = 0; i < inputText.length; i++) {
        var char = inputText[i];
        if (char === char.toUpperCase()) {
            outputText += char.toLowerCase();
        } else {
            outputText += char.toUpperCase();
        }
    }
    document.getElementById("outputText").value = outputText;
}

function copyToClipboard() {
    var outputText = document.getElementById("outputText");
    outputText.select();
    document.execCommand("copy");
    //alert("Testo copiato negli appunti!");
}

function convertToTextForUpload() {
    var inputText = document.getElementById("inputText").value;

    // Converto in lowercase
    inputText = inputText.toLowerCase();

    // Sostituzione degli spazi con '-'
    inputText = inputText.replace(/\s+/g, '-');

    // Sostituzione di caratteri speciali
    inputText = inputText.replace(/[èéêë]/g, 'e');
    inputText = inputText.replace(/[àáâãäå]/g, 'a');
    inputText = inputText.replace(/[ìíîï]/g, 'i');
    inputText = inputText.replace(/[òóôõö]/g, 'o');
    inputText = inputText.replace(/[ùúûü]/g, 'u');
    inputText = inputText.replace(/&/g, 'e');

    // Eliminazione dei caratteri specificati
    inputText = inputText.replace(/[\/()#,\.;:<>\{\}\[\]\*\+\!\?\^|]/g, '');

    // Aggiorno il textarea con il testo formattato
    document.getElementById("outputText").value = inputText;
}

function resetText() {
    // Reimposta il testo nell'input e nell'output
    document.getElementById("inputText").value = "";
    document.getElementById("outputText").value = "";
}

function updateCharacterCount() {
    var inputText = document.getElementById("inputText").value;
    var characterCount = inputText.length;
    document.getElementById("characterCount").textContent = "Characters: " + characterCount;
}