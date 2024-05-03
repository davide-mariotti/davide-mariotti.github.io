function generatePassword() {
    var length = document.getElementById("length").value;
    var uppercase = document.getElementById("uppercase").checked;
    var lowercase = document.getElementById("lowercase").checked;
    var numbers = document.getElementById("numbers").checked;
    var symbols = document.getElementById("symbols").checked;

    var charset = "";
    if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()_+~`|}{[]\:;?><,./-=";

    var password = "";
    for (var i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    document.getElementById("password").value = password;
    checkPasswordSecurity(password);
}
function checkPasswordSecurity(password) {
    var securityLevel;
    if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^a-zA-Z\d]/.test(password)) {
        securityLevel = "green";
    } else if ((password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) || (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password))) {
        securityLevel = "yellow";
    } else {
        securityLevel = "red";
    }
    document.getElementById("password").className = securityLevel;
}