window.onload = () => {
    // Code aus dem Browser-Gedächtnis laden
    const gespeicherterCode = sessionStorage.getItem("laborSessionCode");
    const sessionCodeContainer = document.getElementById("sessionCodeContainer");
    const meinName = sessionStorage.getItem("myAnimalName");
    if (meinName) {
        document.getElementById("greetingMessage").textContent = `Willkommen im Labor, ${meinName}!`;
    }

    

    if (gespeicherterCode) {
        console.log("Willkommen im Labor! Session:", gespeicherterCode);
        sessionCodeContainer.textContent = gespeicherterCode
        // Hier kannst du jetzt deine Datenbank/Firebase abfragen und die Session starten
    } else {
        console.log("Kein Code gefunden. Bitte logge dich neu ein.");
        // window.location.href = "index.html"; 
    }
};
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://cqebccjmedezrofqflvh.supabase.co'
const supabaseAnonKey = 'sb_publishable_wbW6XEUiwRMS96f75Ctn2Q_dXhl-GD3'
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// LIVE-SCHÜLER-DASHBOARD (Supabase Realtime)
// ==========================================

// 1. Wir holen uns den Container, in den die Pillen kommen
const studentList = document.getElementById('student-list');
const gespeicherterCode = sessionStorage.getItem("laborSessionCode");

// 2. Hilfsfunktion: Erstellt ein neues "student-badge" und fügt es ein
// 1. Pille hinzufügen (mit Identifikations-Marker)
function addStudentToUI(student, container) {
    const badge = document.createElement('div');
    badge.className = 'student-badge';

    const displayName = student.student_name || "Unbekannt";
    badge.textContent = displayName;

    // WICHTIG: Wir geben der Pille ein Attribut, damit wir sie später finden können!
    // Entweder die Datenbank-ID (student.id) oder den Namen (student.student_name)
    // Wir nutzen hier den Namen als ID-Ersatz, da er durch unser Script pro Session einzigartig ist.
    badge.setAttribute('data-studentname', displayName);

    container.appendChild(badge);
}

// 2. NEU: Pille entfernen
function removeStudentFromUI(studentName, container) {
    // Finde das HTML-Element, das den entsprechenden Namen als Attribut hat
    const badgeToRemove = container.querySelector(`[data-studentname="${studentName}"]`);

    if (badgeToRemove) {
        // Wenn es existiert -> löschen! (Optional kannst du hier auch eine CSS-Animation ergänzen)
        badgeToRemove.remove();
    }
}

// 3. Live-Überwachung (auf INSERT und DELETE)
function subscribeToNewStudents(currentSessionCode, container) {
    console.log("Starte Live-Überwachung für Code:", currentSessionCode);

    supabase
        .channel('student-joins')
        .on(
            'postgres_changes',
            {
                event: '*', // WICHTIG: '*' statt 'INSERT', um ALLES abzufangen
                schema: 'public',
                table: 'activeUsers',
                filter: `session_code=eq.${currentSessionCode}`
            },
            (payload) => {
                if (payload.eventType === 'INSERT') {
                    console.log("LIVE UPDATE: Ein neuer Schüler ist beigetreten!", payload.new);
                    addStudentToUI(payload.new, container);
                }
                else if (payload.eventType === 'DELETE') {
                    console.log("LIVE UPDATE: Ein Schüler hat verlassen!", payload.old);

                    // Supabase schickt beim Löschen standardmäßig nur die ID (Primary Key) im "old" Payload mit.
                    // Falls du nach der ID suchst: removeStudentFromUI(payload.old.id, container)

                    // Weil wir Supabase nicht gesagt haben, dass wir die ganze gelöschte Zeile brauchen,
                    // laden wir stattdessen zur Sicherheit einfach die aktuelle Liste komplett neu!
                    // Das ist der zuverlässigste Weg.
                    loadExistingStudents(currentSessionCode, container);
                }
            }
        )
        .subscribe((status) => {
            console.log("Realtime Status:", status);
        });
}

// 3. Alle SCHON VORHANDENEN Schüler laden (wichtig bei Seite-Neu-Laden)
async function loadExistingStudents(currentSessionCode, container) {
    const { data, error } = await supabase
        .from('activeUsers')
        .select('*')
        .eq('session_code', currentSessionCode);

    if (error) {
        console.error("Fehler beim Laden der Teilnehmer:", error);
        return;
    }

    if (data) {
        // Zuerst Liste leeren (falls schon was drin stand)
        studentList.innerHTML = '';
        // Für jeden gefundenen Schüler eine Pille malen
        data.forEach(student => addStudentToUI(student, container));
    }
}



const checkStudentList = document.getElementById('student-list');

// Nur wenn wir auf dem Lehrer-Dashboard sind (wo es die Liste gibt),
// starten wir die Abfragen:
if (checkStudentList) {
    loadExistingStudents(gespeicherterCode, studentList);
    subscribeToNewStudents(gespeicherterCode, studentList);
} else {
    console.log("Schüler-Ansicht erkannt: Live-Dashboard wird hier nicht geladen.");
}