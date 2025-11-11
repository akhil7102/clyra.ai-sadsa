import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { Form, Link, useActionData, useNavigation, useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import { getAuthUser } from '~/lib/auth/supabase-auth.server';
import { createSupabaseServerClient } from '~/lib/auth/supabase-auth.server';
import { Header } from '~/components/header/Header';

export const meta: MetaFunction = () => [
  { title: 'Sign In - Clyra.ai' },
  { name: 'description', content: 'Sign in to your Clyra.ai account' },
];

export const loader = async (args: LoaderFunctionArgs) => {
  const { user } = await getAuthUser(args);
  if (user) {
    return redirect('/');
  }
  return json({});
};

export const action = async (args: ActionFunctionArgs) => {
  const formData = await args.request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return json({ error: 'Email and password are required' }, { status: 400 });
  }

  try {
    const env = (args as any)?.context?.cloudflare?.env;
    const { supabase, headers } = createSupabaseServerClient(args.request, env);

    console.log('Attempting to sign in user:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase sign-in error:', error);
      return json({ error: error.message }, { status: 400 });
    }

    console.log('Sign-in successful:', data);

    return redirect('/', { headers });
  } catch (error) {
    console.error('Unexpected error during sign-in:', error);
    return json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
};

export default function SignIn() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === 'submitting';
  const [showPassword, setShowPassword] = useState(false);
  const successMessage = searchParams.get('success');

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-black">
        <div className="gradient-background" />
        <div className="glow-overlay" />
        <div className="diffusion-layer" />
        <div className="shimmer-layer" />
        <div className="grain-texture" />
      </div>

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 py-8">
        <div
          className="backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden w-full max-w-md"
          style={{
            background: 'rgba(10, 10, 10, 0.7)',
            border: '1px solid rgba(102, 255, 178, 0.2)',
            boxShadow: '0 0 60px rgba(102, 255, 178, 0.15)',
          }}
        >
          {/* Header */}
          <div className="p-8 pb-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold mb-2">
                <span className="bg-gradient-to-r from-[#a8c0ff] via-[#66ffb2] to-[#c2e9fb] bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </h1>
              <p className="text-gray-400">Sign in to continue to Clyra.ai</p>
            </div>

            {successMessage === 'account-created' && (
              <div
                className="mb-6 p-4 rounded-lg"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                }}
              >
                <p className="text-green-400 text-sm">
                  Account created successfully! Please sign in.
                </p>
              </div>
            )}

            {actionData?.error && (
              <div
                className="mb-6 p-4 rounded-lg"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <p className="text-red-400 text-sm">{actionData.error}</p>
              </div>
            )}

            <Form method="post" className="space-y-6" noValidate>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(102, 255, 178, 0.5)';
                    e.target.style.boxShadow = '0 0 20px rgba(102, 255, 178, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    minLength={6}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 transition-all duration-200 outline-none pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(102, 255, 178, 0.5)';
                      e.target.style.boxShadow = '0 0 20px rgba(102, 255, 178, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {showPassword ? (
                      <span className="i-ph:eye-slash text-xl" />
                    ) : (
                      <span className="i-ph:eye text-xl" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #66ffb2)',
                  backgroundSize: '200% 200%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundPosition = '100% 0';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(102, 255, 178, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundPosition = '0% 0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <span className="i-ph:spinner-gap animate-spin text-xl" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span className="i-ph:sign-in text-xl" />
                      Sign In
                    </>
                  )}
                </span>
              </button>
            </Form>
          </div>

          {/* Footer */}
          <div
            className="px-8 py-6"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/sign-up"
                className="font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-400 transition-all"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
