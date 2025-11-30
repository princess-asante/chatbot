import { errorResponse } from '@/lib/api-response';
import { authenticateUser } from '@/lib/auth';

export async function POST(req: Request) {
  const auth = await authenticateUser();

  if ('error' in auth) {
    return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }

  const { supabase, user } = auth;

  const body = await req.json();
  if (!body.name || typeof body.name !== 'string') {
    return errorResponse('Invalid chat name', 400);
  }
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
  const auth = await authenticateUser();

  if ('error' in auth) {
    return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }

  const { supabase, user } = auth;

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

