import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://cqebccjmedezrofqflvh.supabase.co';
const supabaseAnonKey = 'sb_publishable_wbW6XEUiwRMS96f75Ctn2Q_dXhl-GD3';
const supabase = createClient(supabaseUrl, supabaseAnonKey); 
// ==========================================
// SCHÜLER: WARTEN AUF DEN START-SCHUSS
// ==========================================
const sessionCode = sessionStorage.getItem('laborSessionCode');

if (sessionCode) {
    // 1. Der Schüler stellt sein "Walkie-Talkie" auf denselben Kanal wie der Lehrer
    const signalChannel = supabase.channel(`signal-${sessionCode}`);

    // 2. Der Schüler lauscht auf das Event 'start_lab'
    signalChannel.on('broadcast', { event: 'start_lab' }, (payload) => {
        console.log("Signal empfangen! Der Lehrer hat das Labor gestartet.");

        // ---> HIER DEN NAMEN DEINER NEUEN SCHÜLER-SEITE EINTRAGEN <---
        window.location.href = "lab_view_students.html";
    });

    // 3. Funkgerät einschalten
    signalChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log("Warte auf Start-Signal vom Lehrer...");
        }
    });
}