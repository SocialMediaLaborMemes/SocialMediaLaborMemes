// 1. Supabase importieren
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2. Supabase Konfiguration (Deine echten Daten)
const supabaseUrl = 'https://cqebccjmedezrofqflvh.supabase.co';
const supabaseAnonKey = 'sb_publishable_wbW6XEUiwRMS96f75Ctn2Q_dXhl-GD3';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 3. HTML-Elemente holen
const inputField = document.getElementById('sessionCodeInput');
const btnCheck = document.getElementById('joinButton');
const messageBox = document.getElementById('errorMessage');

// 4. Unsere Tier-Liste (für die Schüler)
const unproblematicAnimals = [
    "Anonymes Alpaka", "Anonymes Axolotl", "Anonymes Chamäleon", "Anonymes Eichhörnchen", "Anonymes Erdmännchen", "Anonymes Faultier", "Anonymes Fohlen", "Anonymes Frettchen", "Anonymes Gürteltier", "Anonymes Kaninchen", "Anonymes Känguru", "Anonymes Lama", "Anonymes Meerschweinchen", "Anonymes Murmeltier", "Anonymes Nashorn", "Anonymes Nilpferd", "Anonymes Opossum", "Anonymes Quokka", "Anonymes Rehkitz", "Anonymes Rentier", "Anonymes Rotkehlchen", "Anonymes Schnabeltier", "Anonymes Seepferdchen", "Anonymes Walross", "Anonymes Wiesel", "Anonymes Zebra", "Anonymer Adler", "Anonymer Bär", "Anonymer Biber", "Anonymer Dachs", "Anonymer Delfin", "Anonymer Eisbär", "Anonymer Elch", "Anonymer Elefant", "Anonymer Falke", "Anonymer Flamingo", "Anonymer Frosch", "Anonymer Fuchs", "Anonymer Gecko", "Anonymer Gepard", "Anonymer Hamster", "Anonymer Hirsch", "Anonymer Igel", "Anonymer Kakadu", "Anonymer Kiwi", "Anonymer Koala", "Anonymer Kolibri", "Anonymer Leguan", "Anonymer Leopard", "Anonymer Löwe", "Anonymer Luchs", "Anonymer Marienkäfer", "Anonymer Maulwurf", "Anonymer Nasenbär", "Anonymer Oktopus", "Anonymer Otter", "Anonymer Panda", "Anonymer Panther", "Anonymer Papagei", "Anonymer Pelikan", "Anonymer Pinguin", "Anonymer Rochen", "Anonymer Salamander", "Anonymer Schmetterling", "Anonymer Schwan", "Anonymer Seehund", "Anonymer Seelöwe", "Anonymer Tiger", "Anonymer Tukan", "Anonymer Wal", "Anonymer Waschbär", "Anonymer Wolf", "Anonymer Wombat", "Anonyme Ameise", "Anonyme Amsel", "Anonyme Antilope", "Anonyme Auster", "Anonyme Biene", "Anonyme Ente", "Anonyme Eule", "Anonyme Fledermaus", "Anonyme Forelle", "Anonyme Gazelle", "Anonyme Giraffe", "Anonyme Grille", "Anonyme Heuschrecke", "Anonyme Hummel", "Anonyme Kaulquappe", "Anonyme Krabbe", "Anonyme Lerche", "Anonyme Libelle", "Anonyme Meeresschildkröte", "Anonyme Meise", "Anonyme Möwe", "Anonyme Muschel", "Anonyme Nachtigall", "Anonyme Raupe", "Anonyme Rennmaus", "Anonyme Robbe", "Anonyme Schildkröte", "Anonyme Schwalbe", "Anonyme Seekuh", "Anonyme Taube", "Anonyme Wachtel", "Anonyme Zikade"
];

// 5. Klick-Event für den Button
btnCheck.addEventListener('click', async () => {
    // Eingabe auslesen und Leerzeichen am Rand entfernen
    const enteredCode = inputField.value.trim();
    console.log(enteredCode);

    // Wenn nichts eingegeben wurde
    if (!enteredCode) {
        messageBox.style.color = "red";
        messageBox.textContent = "Bitte gib einen Code ein.";
        return;
    }

    messageBox.style.color = "black";
    messageBox.textContent = "Prüfe Code...";

    try {
        console.log("Supabase gestartet - Prüfe Session");
        const { data, error } = await supabase
            .from('sessions')            // <-- Ggf. anpassen!
            .select('*')
            .eq('session_code', enteredCode);

        // Gab es einen Datenbank-Fehler?
        if (error) {
            console.error("Datenbank-Fehler:", error);
            messageBox.style.color = "red";
            messageBox.textContent = "Fehler bei der Serververbindung.";
            return;
        }

        // Prüfen, ob Ergebnisse gefunden wurden
        if (data && data.length > 0) {
            console.log("Session gefunden!");
            messageBox.style.color = "orange";
            messageBox.textContent = "Code gültig! Zuweisung eines Tieres...";

            // ==========================================
            // LOGIK: TIER ZUWEISEN & EINTRAGEN
            // ==========================================
            let success = false;
            let attempts = 0;
            let assignedAnimal = "";

            while (!success && attempts < 3) {
                attempts++;

                // 1. Welche Tiere sind in DIESER Session schon vergeben?
                const { data: existingUsers, error: fetchError } = await supabase
                    .from('activeUsers')
                    .select('student_name') // Spalte in der du die Namen speicherst
                    .eq('session_code', enteredCode);

                if (fetchError) {
                    console.error("Fehler beim Abrufen der Namen:", fetchError);
                    messageBox.style.color = "red";
                    messageBox.textContent = "Fehler beim Abrufen der Namen.";
                    return;
                }

                // ['Anonymes Alpaka', 'Anonymer Bär', ...]
                const usedNames = existingUsers.map(user => user.student_name);

                // 2. Filtere die vergebenen Namen heraus
                const availableAnimals = unproblematicAnimals.filter(
                    animal => !usedNames.includes(animal)
                );

                if (availableAnimals.length === 0) {
                    messageBox.style.color = "red";
                    messageBox.textContent = "Das Labor ist voll! Keine Tiere mehr übrig.";
                    return;
                }

                // 3. Zufälliges, noch freies Tier wählen
                const randomIndex = Math.floor(Math.random() * availableAnimals.length);
                assignedAnimal = availableAnimals[randomIndex];

                // 4. Versuch: Den Schüler mit dem Tier eintragen
                const { error: insertError } = await supabase
                    .from('activeUsers')
                    .insert([
                        {
                            session_code: enteredCode,
                            student_name: assignedAnimal
                        }
                    ]);

                if (insertError) {
                    // Wenn Fehlercode 23505 (Unique Constraint Verletzung) -> Neu versuchen
                    if (insertError.code === '23505') {
                        console.log("Tier wurde weggeschnappt, neuer Versuch...");
                        // Schleife läuft nochmal
                    } else {
                        console.error("Fehler beim Eintragen:", insertError);
                        messageBox.style.color = "red";
                        messageBox.textContent = "Fehler beim Betreten der Session.";
                        return;
                    }
                } else {
                    // Erfolgreich eingetragen!
                    success = true;
                }
            }

            // Wenn nach 3 Versuchen erfolgreich:
            if (success) {
                console.log("Erfolgreich eingetragen als:", assignedAnimal);
                messageBox.style.color = "green";
                messageBox.textContent = "Erfolg! Leite weiter...";

                // Daten für die nächste Seite speichern (damit der Schüler weiß, wie er heißt!)
                sessionStorage.setItem('laborSessionCode', enteredCode);
                sessionStorage.setItem('myAnimalName', assignedAnimal);

                // Weiterleitung
                window.location.href = "session_students_view.html";
            } else {
                messageBox.style.color = "red";
                messageBox.textContent = "Konnte nicht beitreten. Bitte versuche es noch einmal.";
            }

        } else {
            console.log("Session nicht gefunden");
            messageBox.style.color = "red";
            messageBox.textContent = "Ungültiger Code. Es gibt keine aktive Session mit diesem Code.";
        }
        console.log("Ende der Logik");

    } catch (err) {
        console.error("Unerwarteter Fehler:", err);
        messageBox.style.color = "red";
        messageBox.textContent = "Ein unerwarteter Fehler ist aufgetreten.";
    }
});