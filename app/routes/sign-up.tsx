import { SignUp } from '@clerk/remix';
import type { MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { PageLayout } from '~/components/layout/PageLayout';

export const meta: MetaFunction = () => [
  { title: 'Clyra.ai || Next Gen Ai Assistant' },
  { name: 'description', content: 'Create your Clyra.ai account.' },
];

export const loader = () => json({});

export default function SignUpRoute() {
  return (
    <PageLayout title="Create your account" description="Start building with Clyra.ai.">
      <div className="w-full flex items-center justify-center py-8">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignInUrl="/"
          afterSignUpUrl="/"
          redirectUrl="/"
        />
      </div>
    </PageLayout>
  );
}
