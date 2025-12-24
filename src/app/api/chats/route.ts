import { errorResponse } from '@/lib/api-response';
import { authenticateUser } from '@/lib/auth';
import type { CreateChatRequest, CreateChatResponse, GetChatsResponse } from '@/types';

export async function POST(req: Request) {
  const auth = await authenticateUser();

  if ('error' in auth) {
    return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }

  const { supabase, user } = auth;

  const body: CreateChatRequest = await req.json();
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

  const response: CreateChatResponse = chat;
  return new Response(JSON.stringify(response), { status: 201 });
}

export async function GET(_req: Request) {
  const auth = await authenticateUser();

  if ('error' in auth) {
    return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }

  const { supabase, user } = auth;

  const { data: chats, error } = await supabase
    .from('chats')
    .select(`
      *,
      messages (
        *
      )
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching chats:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  // Debug: Log the raw response
  console.log('Chats fetched:', JSON.stringify(chats, null, 2));
  console.log('Number of chats:', chats?.length);

  // Debug: Check each chat's messages
  chats?.forEach((chat: any, index: number) => {
    console.log(`Chat ${index} (id: ${chat.id}):`, {
      chat_title: chat.chat_title,
      messages_count: chat.messages?.length || 0,
      messages: chat.messages
    });
  });

  const response: GetChatsResponse = { chats: chats || [] };
  return new Response(JSON.stringify(response), { status: 200 });
}

