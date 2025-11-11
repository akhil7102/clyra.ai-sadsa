import { redirect, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { createSupabaseServerClient } from '~/lib/auth/supabase-auth.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const url = new URL(args.request.url);
  const code = url.searchParams.get('code');

  if (code) {
    const env = (args as any)?.context?.cloudflare?.env;
    const { supabase, headers } = createSupabaseServerClient(args.request, env);
    await supabase.auth.exchangeCodeForSession(code);
    return redirect('/', { headers });
  }

  return redirect('/sign-in');
};
