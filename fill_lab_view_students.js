// 1. Supabase importieren
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2. Supabase Konfiguration (Deine echten Daten)
const supabaseUrl = 'https://cqebccjmedezrofqflvh.supabase.co';
const supabaseAnonKey = 'sb_publishable_wbW6XEUiwRMS96f75Ctn2Q_dXhl-GD3';
const supabase = createClient(supabaseUrl, supabaseAnonKey); 


document.getElementById("sessionCodeContainer").textContent = sessionStorage.getItem('laborSessionCode');