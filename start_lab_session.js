import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

//Teacher starts Lab session through his dashboard
const supabaseUrl = 'https://cqebccjmedezrofqflvh.supabase.co';
const supabaseAnonKey = 'sb_publishable_wbW6XEUiwRMS96f75Ctn2Q_dXhl-GD3';
const supabase = createClient(supabaseUrl, supabaseAnonKey); 
// ==========================================
// LEHRER-WERKZEUG: LABOR STARTEN
// ==========================================
const startLabBtn = document.getElementById('startLabButton');
const gespeicherterCode = sessionStorage.getItem('laborSessionCode');
if (startLabBtn && gespeicherterCode) {
    // 1. Wir erstellen einen Funkkanal speziell für DIESEN Session-Code
    const signalChannel = supabase.channel(`signal-${gespeicherterCode}`);

    // Kanal öffnen
    signalChannel.subscribe();

    startLabBtn.addEventListener('click', () => {
        console.log("Sende Start-Signal an alle Schüler...");

        // 2. Das Start-Signal ("broadcast") an alle lauschenden Schüler senden
        signalChannel.send({
            type: 'broadcast',
            event: 'start_lab',
            payload: { message: 'Go!' }
        });

        // 3. Den Lehrer kurz warten lassen (halbe Sekunde), dann selbst weiterleiten
        setTimeout(() => {
            // ---> HIER DEN NAMEN DEINER NEUEN LEHRER-SEITE EINTRAGEN <---
            window.location.href = "lab_view_teacher.html";
        }, 500);
    });
}