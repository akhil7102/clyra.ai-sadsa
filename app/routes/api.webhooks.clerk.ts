import { json, type ActionFunctionArgs, type LoaderFunction } from '@remix-run/cloudflare';
import { Webhook } from 'svix';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

interface ClerkEmail {
  email_address: string;
}

interface ClerkUserData {
  id: string;
  email_addresses?: ClerkEmail[];
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  profile_image_url?: string | null;
  created_at?: string | number;
}

type ClerkEventType = 'user.created' | 'user.updated' | 'user.deleted';

interface ClerkEvent {
  type: ClerkEventType;
  data: ClerkUserData;
}

const getEnv = (ctx: ActionFunctionArgs['context']) =>
  (ctx as any)?.cloudflare?.env ?? process.env;

const buildName = (d: ClerkUserData) => `${d.first_name ?? ''} ${d.last_name ?? ''}`.trim();

export const action = async ({ request, context }: ActionFunctionArgs) => {
  if (request.method !== 'POST') return json({ error: 'Method Not Allowed' }, { status: 405 });

  const env = getEnv(context) as Record<string, string | undefined>;
  const CLERK_WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;
  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!CLERK_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(
      {
        error: 'Server env mis-configuration',
        missing: {
          CLERK_WEBHOOK_SECRET: !!CLERK_WEBHOOK_SECRET,
          SUPABASE_URL: !!SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
        },
      },
      { status: 500 },
    );
  }

  // 1) Read raw body for Svix verification
  const payload = await request.text();
  const headers = {
    'svix-id': request.headers.get('svix-id') || '',
    'svix-timestamp': request.headers.get('svix-timestamp') || '',
    'svix-signature': request.headers.get('svix-signature') || '',
  };

  let evt: ClerkEvent;
  try {
    evt = new Webhook(CLERK_WEBHOOK_SECRET).verify(payload, headers) as ClerkEvent;
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  // 2) Supabase (service role)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) as SupabaseClient;

  const { type: eventType, data } = evt;
  const clerkId = data.id;
  const email = data.email_addresses?.[0]?.email_address ?? null;
  const name = buildName(data);
  const avatar = data.profile_image_url ?? data.image_url ?? null;
  const createdAtIso =
    data.created_at != null ? new Date(data.created_at as any).toISOString() : new Date().toISOString();

  try {
    if (eventType === 'user.created') {
      // Create Supabase Auth user (capture supabase_id)
      const safeEmail = email ?? `user-${clerkId}@noemail.clyra.ai`;
      const { data: auth, error: authErr } = await supabase.auth.admin.createUser({
        email: safeEmail,
        email_confirm: true,
        user_metadata: { clerk_id: clerkId, name, avatar },
      });
      if (authErr || !auth?.user) throw authErr ?? new Error('Auth create failed');
      const supabaseId = auth.user.id;

      // Upsert into users (on clerk_id)
      const { error: upUsersErr } = await supabase
        .from('users')
        .upsert(
          {
            supabase_id: supabaseId,
            clerk_id: clerkId,
            email: safeEmail,
            name,
            avatar,
            created_at: createdAtIso,
          },
          { onConflict: 'clerk_id' },
        );
      if (upUsersErr) throw upUsersErr;

      // Upsert token_usage (on clerk_id) with 500 daily tokens
      const { error: upTokensErr } = await supabase
        .from('token_usage')
        .upsert({ clerk_id: clerkId, daily_tokens: 500 }, { onConflict: 'clerk_id' });
      if (upTokensErr) throw upTokensErr;

      return json({ success: true, type: eventType }, { status: 200 });
    }

    if (eventType === 'user.updated') {
      // Update DB users row (match by clerk_id)
      const patch: Record<string, unknown> = { name, avatar };
      if (email) patch.email = email;

      const { error: updErr } = await supabase.from('users').update(patch).eq('clerk_id', clerkId);
      if (updErr) throw updErr;

      // Optionally update Supabase Auth user (if we have supabase_id)
      const { data: row, error: selErr } = await supabase
        .from('users')
        .select('supabase_id')
        .eq('clerk_id', clerkId)
        .maybeSingle();
      if (selErr) throw selErr;

      if (row?.supabase_id) {
        const authUpdate: Parameters<typeof supabase.auth.admin.updateUserById>[1] = {
          user_metadata: { clerk_id: clerkId, name, avatar },
        };
        if (email) authUpdate.email = email;

        const { error: authUpdErr } = await supabase.auth.admin.updateUserById(row.supabase_id, authUpdate);
        if (authUpdErr) throw authUpdErr;
      }

      return json({ success: true, type: eventType }, { status: 200 });
    }

    if (eventType === 'user.deleted') {
      // Remove DB rows (match by clerk_id)
      const { error: delTokErr } = await supabase.from('token_usage').delete().eq('clerk_id', clerkId);
      if (delTokErr) throw delTokErr;

      const { error: delUsersErr } = await supabase.from('users').delete().eq('clerk_id', clerkId);
      if (delUsersErr) throw delUsersErr;

      return json({ success: true, type: eventType }, { status: 200 });
    }

    // Unknown type → still 200 to avoid retries, but report
    return json({ success: true, ignored: true, type: eventType }, { status: 200 });
  } catch (err: any) {
    return json({ success: false, error: err?.message ?? 'Webhook failed', type: eventType }, { status: 500 });
  }
};

export const loader: LoaderFunction = () => new Response('Method Not Allowed', { status: 405 });