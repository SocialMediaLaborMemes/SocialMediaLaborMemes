// Wir warten, bis der Button geklickt wird
document.getElementById('joinButton').addEventListener('click', async () => {

    // 1. Eingabe des Schülers auslesen
    const code = document.getElementById('sessionCodeInput').value;
    const errorMessage = document.getElementById('errorMessage');

    // Leere Eingaben abfangen
    if (!code) {
        errorMessage.innerText = "Bitte gib einen Code ein.";
        errorMessage.style.display = "block";
        return;
    }

    try {
        // 2. Den Code an Ihr Backend / Ihre Datenbank senden (Hier als Pseudo-API-Call)
        // Wenn Sie Supabase nutzen, sähe das so aus: supabase.from('sessions').select().eq('code', code)
        const response = await fetch('https://IHR_BACKEND_ODER_SUPABASE_URL/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionCode: code })
        });

        // 3. Antwort prüfen
        if (response.ok) {
            const data = await response.json();

            // 4. ERFOLG! 
            // Der Server hat idealerweise den Namen generiert (z.B. "Anonymes Nilpferd")
            // Wir speichern diese Daten im SessionStorage des Browsers
            sessionStorage.setItem('studentName', data.animalName); // z.B. "Anonymes Nilpferd"
            sessionStorage.setItem('sessionId', data.sessionId);

            // 5. Weiterleitung zum eigentlich Feed (auf Ihrer GitHub Pages Seite)
            window.location.href = "feed.html";
        } else {
            // Falscher Code
            errorMessage.innerText = "Ungültiger Code. Ist die Session schon aktiv?";
            errorMessage.style.display = "block";
        }
    } catch (error) {
        console.error("Fehler bei der Verbindung:", error);
        errorMessage.innerText = "Verbindungsfehler. Bitte sag der Lehrkraft Bescheid.";
        errorMessage.style.display = "block";
    }
});
