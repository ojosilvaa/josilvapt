import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

const VAPID_PUBLIC = Deno.env.get('VAPID_PUBLIC')!;
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE')!;

webpush.setVapidDetails('mailto:ptjuklebson@gmail.com', VAPID_PUBLIC, VAPID_PRIVATE);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const { aluno_id, title, body } = await req.json();
  if (!aluno_id) return new Response(JSON.stringify({ error: 'aluno_id required' }), { status: 400 });

  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('id, subscription')
    .eq('aluno_id', aluno_id);

  if (!subs?.length) {
    return new Response(JSON.stringify({ sent: 0, reason: 'no_subscription' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const payload = JSON.stringify({ title: title || 'Jo Silva PT', body: body || '' });
  const staleIds: string[] = [];

  const results = await Promise.allSettled(
    subs.map(async s => {
      try {
        await webpush.sendNotification(s.subscription, payload);
      } catch (err: any) {
        // 410 Gone = subscription expired/revoked — remove it
        if (err.statusCode === 410) staleIds.push(s.id);
        throw err;
      }
    })
  );

  if (staleIds.length) {
    await supabase.from('push_subscriptions').delete().in('id', staleIds);
  }

  const sent = results.filter(r => r.status === 'fulfilled').length;
  return new Response(JSON.stringify({ sent }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
