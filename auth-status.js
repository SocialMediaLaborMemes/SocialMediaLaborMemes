import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://cqebccjmedezrofqflvh.supabase.co'
const supabaseKey = 'sb_publishable_wbW6XEUiwRMS96f75Ctn2Q_dXhl-GD3'
const supabase = createClient(supabaseUrl, supabaseKey)


const publicPages = ['', 'index.html', 'lehrkraefte_login_or_registration.html', 'session_students_view.html', 'handreichung.html'];

async function initAuthUI() {
    console.log("Starte Auth-Check...");

    const authContainer = document.getElementById('auth-status-container');
    const actionButton = document.getElementById('action-button');

    const restrictedContent = document.getElementById('restricted-content');
    console.log(restrictedContent)
    const loginPrompt = document.getElementById('login-prompt');

    const updateAuthUI = (session) => {
        let rawPath = window.location.pathname;
        let currentPage = rawPath.substring(rawPath.lastIndexOf('/') + 1).toLowerCase();
        currentPage = currentPage.split('?')[0].split('#')[0];

        if (currentPage === "/" || !currentPage) {
            currentPage = "";
        }

        const isPublicPage = publicPages.includes(currentPage);

        if (!session) {
            // ---> NUTZER IST NICHT EINGELOGGT <---

            if (!isPublicPage) {
                console.warn("Zurück zur Login-Seite...");
                window.location.replace("lehrkraefte_login_or_registration.html");
                return;
            }

            // NEU: Handreichung - Geschützten Teil verstecken, Login-Hinweis zeigen
            if (restrictedContent) restrictedContent.style.display = 'none';
            if (loginPrompt) loginPrompt.style.display = 'block';

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

            // NEU: Handreichung - Geschützten Teil zeigen, Login-Hinweis verstecken
            if (restrictedContent) restrictedContent.style.display = 'block';
            if (loginPrompt) loginPrompt.style.display = 'none';

            if (authContainer) {
                authContainer.innerHTML = `
                    <span style="margin-right: 15px;">Eingeloggt als: <strong>${session.user.email}</strong></span>
                    <button id="global-logout-btn" style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Logout</button>
                `;

                document.getElementById('global-logout-btn').addEventListener('click', async () => {
                    console.log("Logge aus...");
                    await supabase.auth.signOut();
                    window.location.reload();
                });
            }

            if (actionButton) {
                actionButton.textContent = "Session erstellen";
                actionButton.href = "create_session.html";
            }
        }
    };

    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error("❌ Fehler beim Abfragen der Supabase Session:", error);
    }
    updateAuthUI(data.session);

    supabase.auth.onAuthStateChange((event, session) => {
        updateAuthUI(session);
    });
}

initAuthUI();