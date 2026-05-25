// 1. Supabase importieren
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2. Supabase Konfiguration (Deine echten Daten)
const supabaseUrl = 'https://cqebccjmedezrofqflvh.supabase.co';
const supabaseAnonKey = 'sb_publishable_wbW6XEUiwRMS96f75Ctn2Q_dXhl-GD3';
const supabase = createClient(supabaseUrl, supabaseAnonKey); 
// Diese Funktion schickt den Lösch-Befehl ab
// Diese Funktion schickt den Lösch-Befehl ab (Fire & Forget)
/*
function removeStudentOnExit() {
    const sessionCode = sessionStorage.getItem('laborSessionCode');
    const myAnimalName = sessionStorage.getItem('myAnimalName');

    if (sessionCode && myAnimalName) {
        // Wir nutzen den normalen Supabase-Befehl. 
        // Ohne "await", damit er sofort und ohne zu zögern losfeuert!
        supabase
            .from('activeUsers')
            .delete()
            .eq('session_code', sessionCode)
            .eq('student_name', myAnimalName)
            .then(() => console.log("Löschbefehl im Hintergrund gesendet"));
    }
}

// Event 1: Wenn das Fenster geschlossen oder neu geladen wird
window.addEventListener('beforeunload', () => {
    removeStudentOnExit();
});

// Event 2: Wenn der Tab gewechselt wird (für Smartphones wichtig)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        removeStudentOnExit();
    }
});
*/
const leaveBtn = document.getElementById('leaveSessionBtn');

if (leaveBtn) {
    leaveBtn.addEventListener('click', async () => {
        const sessionCode = sessionStorage.getItem('laborSessionCode');
        const myAnimalName = sessionStorage.getItem('myAnimalName');

        if (sessionCode && myAnimalName) {
            console.log("Lösche Schüler aus der Datenbank...");

            // Hier nutzen wir das ganz normale, bequeme Supabase-JS
            const { error } = await supabase
                .from('activeUsers')
                .delete()
                .eq('session_code', sessionCode)
                .eq('student_name', myAnimalName);

            if (error) {
                console.error("Fehler beim Verlassen:", error);
                alert("Fehler beim Verlassen der Session.");
            } else {
                // Lokalen Speicher leeren
                sessionStorage.removeItem('laborSessionCode');
                sessionStorage.removeItem('myAnimalName');

                // Zurück zur Startseite leiten
                window.location.href = "index.html"; // <-- Deine Startseite hier eintragen
            }
        }
    });
}