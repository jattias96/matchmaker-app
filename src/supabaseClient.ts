import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase URL and Key must be provided in environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

(async () => {
    try {
        // Attempt to use the supabase client to ensure it's initialized correctly
        await supabase.auth.getSession();
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error);
        throw error;
    }
})();

if (process.env.NODE_ENV !== 'production') {
    console.log('Supabase client initialized with URL:', SUPABASE_URL);
    console.log('Supabase key (partial):', SUPABASE_KEY.substring(0, 10) + '...');
}