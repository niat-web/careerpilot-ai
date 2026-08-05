import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.warn('Warning: Supabase environment variables are not fully configured.');
}

/** Service-role client for privileged server writes (bypasses RLS). */
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/** Verify a user JWT and return the authenticated user. */
export async function verifyUserToken(token: string): Promise<User | null> {
  const client = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
