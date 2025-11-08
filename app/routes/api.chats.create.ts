import { json, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { getAuth } from '@clerk/remix/ssr.server';
import { getServerSupabase } from '~/lib/supabase/server';

export async function action(args: ActionFunctionArgs) {
  const { userId } = await getAuth(args);
  if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

  if (args.request.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 });

  const supabase = getServerSupabase((args as any)?.context?.cloudflare?.env);

  try {
    const { title } = (await args.request.json()) as { title?: string };
    const { data, error } = await supabase
      .from('chats')
      .insert({ user_id: userId, title: (title || 'New Chat').slice(0, 120) })
      .select('id, title, created_at')
      .single();

    if (error) return json({ error: error.message }, { status: 500 });

    return json({ chat: data });
  } catch (e: any) {
    return json({ error: e?.message || 'Failed to create chat' }, { status: 500 });
  }
}
