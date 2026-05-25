import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://cqebccjmedezrofqflvh.supabase.co'
const supabaseKey = 'sb_publishable_wbW6XEUiwRMS96f75Ctn2Q_dXhl-GD3'
const supabase = createClient(supabaseUrl, supabaseKey)

// Hier alle Seiten eintragen, die OHNE Login betreten werden dürfen (alles klein geschrieben!)
const publicPages = ['', 'index.html', 'lehrkraefte_login_or_registration.html', 'session_students_view.html'];

async function initAuthUI() {
    console.log("Starte Auth-Check...");

    const authContainer = document.getElementById('auth-status-container');
    const actionButton = document.getElementById('action-button');

    const updateAuthUI = (session) => {
        // 1. Die URL sehr robust auslesen (schneidet Ordnerpfade, Parameter und Hashes weg)
        let rawPath = window.location.pathname;
        let currentPage = rawPath.substring(rawPath.lastIndexOf('/') + 1).toLowerCase();

        // Entfernt eventuelle Anhängsel wie ?session=123 oder #top
        currentPage = currentPage.split('?')[0].split('#')[0];

        if (currentPage === "/" || !currentPage) {
            currentPage = "";
        }

        const isPublicPage = publicPages.includes(currentPage);

        console.log("Aktuelle Seite:", currentPage === "" ? "[Startseite]" : currentPage);
        console.log("Ist diese Seite ohne Login erlaubt?", isPublicPage ? "Ja" : "Nein");
        console.log("Supabase Login Status:", session ? "EINGELOGGT" : "NICHT EINGELOGGT");

        if (!session) {
            // ---> NUTZER IST NICHT EINGELOGGT <---

            if (!isPublicPage) {
                console.warn("Zurück zur Login-Seite...");
                // .replace wirft den Nutzer raus, ohne dass er den "Zurück"-Button im Browser nutzen kann
                window.location.replace("lehrkraefte_login_or_registration.html");
                return; // Funktion hier SOFORT abbrechen!
            }

            // Normales UI Update für öffentliche Seiten (z.B. der Button oben rechts)
            if (authContainer) {
                authContainer.innerHTML = `
                    <a href="lehrkraefte_login_or_registration.html" style="text-decoration: none; padding: 5px 15px; background: #007bff; color: white; border-radius: 5px;">Einloggen</a>
                `;
            }
            if (actionButton) {
                actionButton.textContent = "Lehrkräfte Login";
                actionButton.href = "lehrkraefte_login_or_registration.html";
            }
        } else {
            // ---> NUTZER IST EINGELOGGT <---
            if (authContainer) {
                authContainer.innerHTML = `
                    <span style="margin-right: 15px;">Eingeloggt als: <strong>${session.user.email}</strong></span>
                    <button id="global-logout-btn" style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Logout</button>
                `;

                // Klick-Event für den Logout-Button
                document.getElementById('global-logout-btn').addEventListener('click', async () => {
                    console.log("Logge aus...");
                    await supabase.auth.signOut(); // Löscht die Session im Browser

                    // Nach dem Logout sofort neu laden, damit der Rauswurf-Mechanismus von oben greift
                    window.location.reload();
                });
            }

            if (actionButton) {
                actionButton.textContent = "Session erstellen";
                actionButton.href = "create_session.html";
            }
        }
    };

    // 2. Aktuellen Status abfragen (wird direkt beim Seitenaufbau ausgeführt)
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error("❌ Fehler beim Abfragen der Supabase Session:", error);
    }
    updateAuthUI(data.session);

    // 3. Auf spätere Änderungen lauschen (z.B. wenn man in einem anderen Tab ausloggt)
    supabase.auth.onAuthStateChange((event, session) => {
        updateAuthUI(session);
    });
}

initAuthUI();