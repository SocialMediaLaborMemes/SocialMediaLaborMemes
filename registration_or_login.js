// Wir importieren Supabase direkt über ein CDN (Content Delivery Network)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ==========================================
// 1. SUPABASE KONFIGURATION (Hier deine Daten eintragen!)
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
const btnLogout = document.getElementById('btnLogout');

const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const userEmailDisplay = document.getElementById('user-email');
const messageDiv = document.getElementById('message');

// Hilfsfunktion, um Nachrichten auf dem Bildschirm anzuzeigen
function showMessage(text, isError = false) {
    messageDiv.textContent = text;
    messageDiv.className = isError ? 'error' : 'success';
}

// ==========================================
// 3. REGISTRIERUNG
// ==========================================
btnRegister.addEventListener('click', async () => {
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
        // Hinweis: Supabase verlangt standardmäßig eine E-Mail-Bestätigung!
        showMessage("Erfolgreich! Bitte prüfe deine E-Mails, um den Account zu bestätigen.", false);
    }
});

// ==========================================
// 4. LOGIN
// ==========================================
btnLogin.addEventListener('click', async () => {
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
        showMessage("Erfolgreich eingeloggt!", false);
        emailInput.value = '';
        passwordInput.value = '';
        // UI ändert sich automatisch durch den Auth-Listener unten
    }
});



// ==========================================
// 6. AUTH STATE LISTENER (Überwacht den Status)
// ==========================================
// Das ist der beste Weg! Supabase feuert dieses Event automatisch, 
// wenn man sich einloggt, ausloggt oder die Seite neu lädt und noch eingeloggt ist.
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        // Nutzer IST eingeloggt
        window.location.href = 'create_session.html';
    }
});