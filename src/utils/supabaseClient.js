import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yceistqppvgqbzbnoocp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZWlzdHFwcHZncWJ6Ym5vb2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTMzMDQsImV4cCI6MjA1ODU4OTMwNH0.umfGBCdKHRhq1m0aqCQQdyie0EQE4qsZxrWxqyozxUY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
}); 