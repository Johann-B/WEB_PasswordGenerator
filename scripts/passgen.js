/*
**  Job
**
**  07/2021
*/

const upperCaseAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerCaseAlpha = "abcdefghijklmnopqrstuvwxyz";
const digits = "0123456789";
const specialChars = "+-.?!_$%@#";

var strengthOutput = document.getElementById("strength-output");
var displayStrength = document.getElementById("display-result").querySelector('p');
var yourPassword = document.getElementById("your-password");
var copyState = document.getElementById("copy-state");
var copyButton = document.getElementById("copy-button");
var rangeValue = document.getElementById("range-value");
var lengthRange = document.getElementById("pass-length");
var upperCheckbox = document.getElementById("upper-chars");
var lowerCheckbox = document.getElementById("lower-chars");
var digitCheckbox = document.getElementById("digit-chars");
var specCharsCheckbox = document.getElementById("special-chars");


// Fonction de copie vers le presse-papiers

function copyToClipboard() {
    copyButton.classList.remove('show-element');
    copyButton.classList.add('hide-element');
    copyState.classList.remove('hide-element');
    copyState.classList.add('show-element');

    navigator.clipboard.writeText(yourPassword.value).then(function() {
        copyState.textContent = "Mot de passe copié !";
        copyState.style.color = "green";
    }, function() {
        copyState.textContent = "Échec de la copie !";
        copyState.style.color = "red";
    });
}


// Fonction de "calcul" de la force du mot de passe

function getPasswordStrength(nbOfChars, length) {
    var combinations = BigInt(Math.round(((Math.pow(parseInt(nbOfChars), (parseInt(length) + 1)) - 1) / (parseInt(nbOfChars) - 1))) - 1);
    
    if(combinations >= 19681767848550768574464) {
        strengthOutput.textContent = "FORT";
        displayStrength.className = "strong-password";
    } else if(combinations < 732376025552520) {
        strengthOutput.textContent = "FAIBLE";
        displayStrength.className = "weak-password";
    } else {
        strengthOutput.textContent = "MOYEN";
        displayStrength.className = "medium-password";
    }
}


// Fonction de génération du mot de passe

function generatePassword() {
    var selectedChars = "";
    var password = "";

    if(upperCheckbox.checked) {
        selectedChars += upperCaseAlpha;
        password += upperCaseAlpha[Math.floor(Math.random() * upperCaseAlpha.length)];
    }

    if(lowerCheckbox.checked) {
        selectedChars += lowerCaseAlpha;
        password += lowerCaseAlpha[Math.floor(Math.random() * lowerCaseAlpha.length)];
    }

    if(digitCheckbox.checked) {
        selectedChars += digits;
        password += digits[Math.floor(Math.random() * digits.length)];
    }

    if(specCharsCheckbox.checked) {
        selectedChars += specialChars;
        password += specialChars[Math.floor(Math.random() * specialChars.length)];
    }

    
    // Appel de la méthode de "calcul" de force du mot de passe
    getPasswordStrength(selectedChars.length, lengthRange.value);


    // Tant que le mot de passe n'a pas la longueur désirée,
    // on ajoute un caractère aléatoire

    while (password.length < lengthRange.value) {
		password += selectedChars[Math.floor(Math.random() * selectedChars.length)];
	}

    
    // Mélange des caractères pour le mot de passe final

    var passwordArray = password.split('');
    var finalPassword = "";

    for (var i = 0, j = password.length; i < j; i++) {
		var nb = Math.floor(Math.random() * passwordArray.length);
		finalPassword += passwordArray[nb];
		passwordArray.splice(nb,1);
	}

    yourPassword.textContent = finalPassword;
    
    copyState.classList.remove('show-element');
    copyState.classList.add('hide-element');
    copyButton.classList.remove('hide-element');
    copyButton.classList.add('show-element');
}


// Fonction pour garder au moins une Checkbox cochée

function preventAllUnchecked(c) {
    var elmt = this;
    var checkboxesChecked = document.getElementById('all-checkboxes').querySelectorAll('input[type=checkbox]:checked');
    
    if(checkboxesChecked.length < 1) {
        c.preventDefault();
        elmt.checked = true;
        return;
    }
    
    generatePassword();
}


// Ecouteurs d'événements

lengthRange.addEventListener('input', generatePassword);
lengthRange.addEventListener('input', function(){
    rangeValue.textContent = lengthRange.value;
});

document.getElementById("generate-button").addEventListener('click', generatePassword);
document.getElementById("copy-button").addEventListener('click', copyToClipboard);

document.getElementById("all-checkboxes").querySelectorAll("input[type=checkbox]").forEach(function(e) {
    e.addEventListener('click', preventAllUnchecked);
});

if(document.readyState !== 'loading') {
    rangeValue.textContent = lengthRange.value;
    generatePassword();
} else {
    rangeValue.textContent = lengthRange.value;
    document.addEventListener('DOMContentLoaded', generatePassword);
}
