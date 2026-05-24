// 1. Supabase aus dem Internet (CDN) importieren (ideal für GitHub Pages)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2. Deine Supabase Zugangsdaten (Hier deine eigenen eintragen!)
const supabaseUrl = 'https://cqebccjmedezrofqflvh.supabase.co'
const supabaseKey = 'sb_publishable_wbW6XEUiwRMS96f75Ctn2Q_dXhl-GD3'
const supabase = createClient(supabaseUrl, supabaseKey)

// Prüfen, ob jemand eingeloggt ist
supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
        // KEIN Nutzer eingeloggt (oder gerade ausgeloggt) -> zurück zum Login!
        window.location.href = 'lehrkraefte_login_or_registration.html';
    } else {
        // Alles gut, Nutzer darf die Seite sehen.
        console.log("Eingeloggt als:", session.user.email);
    }
});


// Kleine Hilfsfunktion, um einen zufälligen z.B. 6-stelligen Code zu erstellen
function generiereSitzungsCode(laenge) {
    const zeichen = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ergebnis = '';
    for (let i = 0; i < laenge; i++) {
        ergebnis += zeichen.charAt(Math.floor(Math.random() * zeichen.length));
    }
    return ergebnis;
}

// 3. Warten, bis die Seite geladen ist
document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("generateSessionCodeButton");
    const codeContainer = document.getElementById("sessionCodeContainer");
    const errorMessage = document.getElementById("errorMessage");

    button.addEventListener("click", async () => {

        // Button kurzzeitig deaktivieren, damit man nicht doppelt klickt
        button.disabled = true;
        button.textContent = "Generiere Code...";
        errorMessage.style.display = "none"; // Vorherige Fehler ausblenden

        // 4. Code erstellen
        const neuerCode = generiereSitzungsCode(6); // Ergibt z.B. "X7F9A2"
        console.info("generierter Sitzungscode: " + neuerCode);

        // 5. Code in Supabase speichern
        const { data, error } = await supabase
            .from('sessions') // So muss deine Tabelle in Supabase heißen
            .insert([
                {
                    session_code: neuerCode,
                    // Holt sich automatisch die ID der aktuell eingeloggten Lehrkraft:
                    user_id: (await supabase.auth.getUser()).data.user.id 
                }
            ]);

        // 6. Prüfen ob es geklappt hat
        if (error) {
            console.error("Fehler von Supabase:", error);

            // Fehlermeldung anzeigen
            errorMessage.textContent = "Fehler beim Speichern: " + error.message;
            errorMessage.style.display = "block";

            // Button wieder freigeben
            button.disabled = false;
            button.textContent = "Session Code generieren";
        } else {
            // Erfolg! Den Code auf der Webseite anzeigen
            codeContainer.textContent = "Dein Sitzungscode: " + neuerCode;
            codeContainer.style.display = "block";

            // Den Button endgültig verstecken
            button.style.display = "none";
        }
    });
});