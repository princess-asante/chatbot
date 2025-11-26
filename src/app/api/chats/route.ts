import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Parse request body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  // Validate title
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  if (!title) {
    return new Response(
      JSON.stringify({ error: "Title is required and must be a non-empty string" }),
      { status: 422 }
    );
  }

  // Get or create user
  let { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  // if (!user) {
  //   const { data: newUser, error: insertError } = await supabase
  //     .from('users')
  //     .insert({ clerk_id: userId, first_name: 'User', last_name: '', email: '' })
  //     .select()
  //     .single();

  //   if (insertError) {
  //     return new Response(JSON.stringify({ error: 'Failed to create user' }), { status: 500 });
  //   }
  //   user = newUser;
  // }

  // Create chat
  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .insert({
      user_id: user!.id,
      chat_title: title,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .select()
    .single();

  if (chatError) {
    return new Response(JSON.stringify({ error: 'Failed to create chat' }), { status: 500 });
  }

  return new Response(JSON.stringify(chat), { status: 201 });
}

// GET /api/chats - List user's chats
export async function GET(req: Request) {
  const { userId } = await auth();

  console.log("Fetching chats for userId:", userId);

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
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