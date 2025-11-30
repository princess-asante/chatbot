import { authenticateUser } from '@/lib/auth';
import type { Chat, UpdateChatRequest, DeleteChatResponse } from '@/types';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateUser();

  if ('error' in auth) {
    return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }

  const { supabase, user } = auth;
  const { id } = await params;

  const { data: chat, error } = await supabase
    .from('chats')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  if (!chat) {
    return new Response(JSON.stringify({ error: 'Chat not found' }), {
      status: 404,
    });
  }

  const response: Chat = chat;
  return new Response(JSON.stringify(response), { status: 200 });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateUser();

  if ('error' in auth) {
    return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }

  const { supabase, user } = auth;
  const { id } = await params;
  const body: UpdateChatRequest = await req.json();

  const { data: chat, error } = await supabase
    .from('chats')
    .update({
      ...body,
      updated_at: new Date(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  if (!chat) {
    return new Response(JSON.stringify({ error: 'Chat not found' }), {
      status: 404,
    });
  }

  const response: Chat = chat;
  return new Response(JSON.stringify(response), { status: 200 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateUser();

  if ('error' in auth) {
    return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }

  const { supabase, user } = auth;
  const { id } = await params;

  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const response: DeleteChatResponse = { message: 'Chat deleted successfully' };
  return new Response(JSON.stringify(response), {
    status: 200,
  });
}
