import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { PageLayout } from '~/components/layout/PageLayout';
import SettingsTab from '~/components/@settings/tabs/settings/SettingsTab';
import { getAuth } from '@clerk/remix/ssr.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const { isSignedIn } = await getAuth(args);
  if (!isSignedIn) {
    return redirect('/');
  }
  return json({});
};

export const meta: MetaFunction = () => [
  { title: 'Clyra.ai || Next Gen Ai Assistant' },
  { name: 'description', content: 'Manage your preferences and profile.' },
];

export default function SettingsRoute() {
  return (
    <PageLayout title="Settings" description="Manage your preferences and profile.">
      <div className="max-w-4xl mx-auto">
        <SettingsTab />
      </div>
    </PageLayout>
  );
}
