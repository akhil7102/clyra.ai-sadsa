import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { getAuth } from '@clerk/remix/ssr.server';
import { PageLayout } from '~/components/layout/PageLayout';
import SettingsTab from '~/components/@settings/tabs/settings/SettingsTab';
import { SignedIn, SignedOut } from '@clerk/remix';
import { Link } from '@remix-run/react';

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect('/sign-in');
  return json({});
};

export const meta: MetaFunction = () => [
  { title: 'Clyra.ai || Next Gen Ai Assistant' },
  { name: 'description', content: 'Manage your preferences and profile.' },
];

export default function SettingsRoute() {
  return (
    <PageLayout title="Settings" description="Manage your preferences and profile.">
      <SignedIn>
        <div className="max-w-4xl mx-auto">
          <SettingsTab />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="mx-auto max-w-md rounded-xl border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 p-6 text-center">
          <p className="text-bolt-elements-textPrimary mb-4">Please sign in to view settings.</p>
          <Link className="inline-flex items-center gap-2 rounded-lg px-4 py-2 border border-accent-200/60 text-accent-600 hover:bg-white/10 transition-colors" to="/sign-in">
            <span className="i-ph:sign-in" /> Sign In
          </Link>
        </div>
      </SignedOut>
    </PageLayout>
  );
}
