let popupTimeout;

const btnRegister = document.getElementById('copyCodeButton');

btnRegister.addEventListener('click', (e) => {
    codeKopieren(e);
});

function codeKopieren(event) {
    // .trim() entfernt versehentliche Leerzeichen oder Zeilenumbrüche am Anfang/Ende
    const codeText = document.getElementById("sessionCodeContainer").textContent.trim();

    // 1. Popup absolut SOFORT anzeigen
    zeigePopup(event.target);

    // 2. Blitzschnelle, synchrone Kopier-Methode (ohne Warten auf den Browser)
    const textarea = document.createElement("textarea");
    textarea.value = codeText;

    // Textfeld unsichtbar machen, damit es nicht auf der Seite aufblitzt
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);

    // Text markieren und sofort kopieren
    textarea.select();

    try {
        document.execCommand("copy");
        console.log("Sofort kopiert: " + codeText);
    } catch (err) {
        console.error("Fehler beim Kopieren:", err);
    } finally {
        // Unsichtbares Textfeld wieder aufräumen
        document.body.removeChild(textarea);
    }
}

function zeigePopup(zielElement) {
    const popup = document.getElementById("kopiertPopup");

    const rect = zielElement.getBoundingClientRect();

    popup.style.left = (rect.right + window.scrollX + 10) + "px";
    popup.style.top = (rect.top + window.scrollY) + "px";

    popup.classList.add("sichtbar");

    clearTimeout(popupTimeout);

    popupTimeout = setTimeout(() => {
        popup.classList.remove("sichtbar");
    }, 2000);
}