// 1. Supabase importieren
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://cqebccjmedezrofqflvh.supabase.co'
const supabaseKey = 'sb_publishable_wbW6XEUiwRMS96f75Ctn2Q_dXhl-GD3'
const supabase = createClient(supabaseUrl, supabaseKey)

async function initAuthUI() {
    // Container für den Status oben rechts
    const authContainer = document.getElementById('auth-status-container');

    // NEU: Wir suchen den dicken grünen Button auf der Startseite
    const actionButton = document.getElementById('action-button');

    if (!authContainer) {
        console.warn("Der <div> mit der ID 'auth-status-container' fehlt auf dieser HTML-Seite!");
        return;
    }

    // Funktion zum Aktualisieren der UI
    const updateAuthUI = (session) => {
        if (session) {
            // ---> NUTZER IST EINGELOGGT <---
            const email = session.user.email;

            authContainer.innerHTML = `
                <span style="margin-right: 15px;">Eingeloggt als: <strong>${email}</strong></span>
                <button id="global-logout-btn" style="padding: 5px 10px; cursor: pointer;">Logout</button>
            `;

            // Klick-Event für Logout
            document.getElementById('global-logout-btn').addEventListener('click', async () => {
                await supabase.auth.signOut();
                window.location.reload();
            });

            // NEU: Wenn der Action-Button auf der aktuellen Seite existiert, ändern wir ihn!
            if (actionButton) {
                actionButton.textContent = "Session erstellen";
                // WICHTIG: Trage hier den Namen deiner HTML-Seite ein, auf der man den Code generiert!
                actionButton.href = "create_session.html";
            }

        } else {
            // ---> NUTZER IST NICHT EINGELOGGT <---
            authContainer.innerHTML = `
                <a href="lehrkraefte_login_or_registration.html" style="text-decoration: none; padding: 5px 15px; background: #007bff; color: white; border-radius: 5px;">Einloggen</a>
            `;

            // NEU: Wieder zurücksetzen, falls der Nutzer sich ausloggt
            if (actionButton) {
                actionButton.textContent = "Lehrkräfte Login";
                actionButton.href = "lehrkraefte_login_or_registration.html";
            }
        }
    };

    // 2. Aktuellen Status abfragen
    const { data } = await supabase.auth.getSession();
    updateAuthUI(data.session);

    // 3. Auf Änderungen lauschen
    supabase.auth.onAuthStateChange((event, session) => {
        updateAuthUI(session);
    });
}

initAuthUI();