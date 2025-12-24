import { authenticateUser } from '@/lib/auth';
import { createClient } from "@/lib/supabase/server";
import type { Chat, UpdateChatRequest, DeleteChatResponse } from '@/types';
import { NextResponse } from "next/server";

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

  const { data: chatWithMessages, error } = await supabase
    .from('chats')
    .select(`
      *,
      messages (
        *
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!chatWithMessages) {
    return new Response(JSON.stringify({ error: 'Chat not found' }), { status: 404 });
  }


  return new Response(JSON.stringify(chatWithMessages), { status: 200 });
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

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateUser();

  if ('error' in auth) {
    return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }

  const { supabase } = auth;

  const { id } = await params;

  try {
    const { message, role } = await req.json();

    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_id: id,
        content: message,
        role: role, // Assuming "user" as the role for now
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Message added successfully", data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add message" }, { status: 500 });
  }
}
