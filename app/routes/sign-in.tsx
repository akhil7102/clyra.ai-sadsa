import { SignIn } from '@clerk/remix';
import type { MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { PageLayout } from '~/components/layout/PageLayout';

export const meta: MetaFunction = () => [
  { title: 'Clyra.ai || Next Gen Ai Assistant' },
  { name: 'description', content: 'Sign in to continue to Clyra.ai.' },
];

export const loader = () => json({});

export default function SignInRoute() {
  return (
    <PageLayout title="Sign In" description="Welcome back! Please sign in to continue.">
      <div className="w-full flex items-center justify-center py-8">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          afterSignUpUrl="/"
          redirectUrl="/"
        />
      </div>
    </PageLayout>
  );
}
