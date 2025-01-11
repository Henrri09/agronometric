import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yeuutceyxzciqppeajrj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlldXV0Y2V5eHpjaXFwcGVhanJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwMDI0MDAsImV4cCI6MjAyMDU3ODQwMH0.ZpDnX7_ZTqyGE0NaYoEHYtDgXhzJQvLUDyHvPNXGXXk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});