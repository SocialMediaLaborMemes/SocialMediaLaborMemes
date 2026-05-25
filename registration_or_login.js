// Wir importieren Supabase direkt über ein CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ==========================================
// 1. SUPABASE KONFIGURATION
// ==========================================
const supabaseUrl = 'https://cqebccjmedezrofqflvh.supabase.co';
const supabaseAnonKey = 'sb_publishable_wbW6XEUiwRMS96f75Ctn2Q_dXhl-GD3';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// 2. HTML ELEMENTE SAMMELN
// ==========================================
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const messageDiv = document.getElementById('message');

// Hilfsfunktion für Nachrichten
function showMessage(text, isError = false) {
    if (!messageDiv) return;
    messageDiv.textContent = text;
    messageDiv.className = isError ? 'error' : 'success';
}

// ==========================================
// 3. REGISTRIERUNG
// ==========================================
btnRegister.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) return showMessage("Bitte E-Mail und Passwort eingeben.", true);

    showMessage("Registriere...", false);

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        showMessage(`Fehler: ${error.message}`, true);
    } else {
        showMessage("Erfolgreich! Bitte prüfe deine E-Mails, um den Account zu bestätigen.", false);
    }
});


// ==========================================
// 4. LOGIN (Mausklick + Enter-Taste)
// ==========================================

// a) Klick auf den Einloggen-Button
btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    login();
});

// b) Wenn jemand die Enter-Taste drückt
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Verhindert Neuladen der Seite
        login();
    }
}

// Wir lauschen im E-Mail UND im Passwort-Feld auf "Enter"
emailInput.addEventListener('keydown', handleEnterKey);
passwordInput.addEventListener('keydown', handleEnterKey);

// Die eigentliche Login-Logik
async function login() {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) return showMessage("Bitte E-Mail und Passwort eingeben.", true);

    showMessage("Logge ein...", false);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        showMessage(`Fehler: ${error.message}`, true);
    } else {
        showMessage("Erfolgreich eingeloggt! Leite weiter...", false);
        // Felder leeren
        emailInput.value = '';
        passwordInput.value = '';
        // Direkte Weiterleitung
        window.location.href = 'create_session.html';
    }
}


// ==========================================
// 5. PRÜFEN, OB NUTZER SCHON EINGELOGGT IST
// ==========================================
async function checkCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    // Wenn eine aktive Session gefunden wurde, direkt weiterleiten!
    if (session) {
        window.location.href = 'create_session.html';
    }
}

// Wird beim Aufruf der Seite sofort 1x ausgeführt
checkCurrentSession();