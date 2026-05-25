// Auf Seite 1 (Login-Seite)
const btnLaborBetreten = document.getElementById('joinSessionButton');

btnLaborBetreten.addEventListener('click', () => {
    // 1. Den aktuell generierten Code holen
    const codeText = document.getElementById("sessionCodeContainer").textContent.trim();

    if (codeText === "") {
        alert("Bitte erstelle zuerst einen Session-Code!");
        return; // Bricht ab, wenn noch kein Code da ist
    }

    // 2. Code im Browser-Gedächtnis speichern
    sessionStorage.setItem("laborSessionCode", codeText);
    console.log(codeText)

    // 3. Zur anderen Seite weiterleiten
    window.location.href = "session_teachers_view.html"; // Hier dein richtiges Ziel eintragen
});