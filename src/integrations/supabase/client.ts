import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yeuutceyxzciqppeajrj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlldXV0Y2V5eHpjaXFwcGVhanJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyODA2MzEsImV4cCI6MjA1MTg1NjYzMX0.t_c8tr8PgDE5bxKbwbK4VmKhtberILwE0nW1Ec8wmqw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});