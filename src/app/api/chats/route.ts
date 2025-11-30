import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('supabase_id', authUser.id)
    .single();

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  const body = await req.json();
  const chatTitle = body.name ? body.name : 'Untitled Chat';

  // Create chat
  const { data: chat, error } = await supabase
    .from('chats')
    .insert({
      user_id: user.id,
      chat_title: chatTitle,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .select()
    .single();

  if (error) {
    console.log("Create chat error:", error.message);
    return new Response(JSON.stringify({ error: 'Failed to create chat' }), { status: 500 });
  }

  return new Response(JSON.stringify(chat), { status: 201 });
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('supabase_id', authUser.id)
    .single();

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  }

  const { data: chats, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ chats }), { status: 200 });
}

