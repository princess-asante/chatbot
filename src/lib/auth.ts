import { createClient } from '@/lib/supabase/server';
import type { AuthResult } from '@/types';

/**
 * Authenticates the current user and retrieves their database record
 * @returns AuthResult - Either successful auth with user data and Supabase client, or error with status
 */
export async function authenticateUser(): Promise<AuthResult> {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return {
      error: 'Unauthorized',
      status: 401,
    };
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, supabase_id, email, created_at')
    .eq('supabase_id', authUser.id)
    .single();

  if (!user) {
    return {
      error: 'User not found',
      status: 404,
    };
  }

  return {
    supabase,
    user,
    authUser,
  };
}
