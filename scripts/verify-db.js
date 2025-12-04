
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('reservations').select('*').limit(5);

    if (error) {
        console.error('Connection failed:', error.message);
    } else {
        console.log('Connection successful!');
        console.log('Current reservations count:', data.length);
        console.log('Sample data:', data);
    }
}

checkConnection();
