import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  console.log("Webhook received");
  
  try {
    const payload = await req.text();
    const svixHeaders = Object.fromEntries(req.headers);

    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error('CLERK_WEBHOOK_SECRET is not set');
      return new Response('Server configuration error', { status: 500 });
    }

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    
    let evt: any;
    try {
      evt = wh.verify(payload, svixHeaders);
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('Event type:', evt.type);

    if (evt.type === 'user.created') {
      const { id, email_addresses, first_name, last_name } = evt.data;
      
      const { error } = await supabase.from('users').insert({
        clerk_id: id,
        email: email_addresses[0]?.email_address || '',
        f_name: first_name || 'User',
        l_name: last_name || '',
      });

      if (error) {
        console.error('Database insert error:', error);
        return new Response('Database error', { status: 500 });
      }

      console.log('User created successfully:', id);
    } else {
      console.log('Event type not handled:', evt.type);
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response('Internal server error', { status: 500 });
  }
}