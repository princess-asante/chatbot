import { createClient } from '@/lib/supabase/server';

export async function authenticateUser() {
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
    .select('id')
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
