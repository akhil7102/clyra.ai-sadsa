import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { Form, Link, useActionData, useNavigation } from '@remix-run/react';
import { useState } from 'react';
import { getAuthUser } from '~/lib/auth/supabase-auth.server';
import { createSupabaseServerClient } from '~/lib/auth/supabase-auth.server';
import { Header } from '~/components/header/Header';

export const meta: MetaFunction = () => [
  { title: 'Sign Up - Clyra.ai' },
  { name: 'description', content: 'Create your Clyra.ai account' },
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
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !password || !confirmPassword) {
    return json({ error: 'All fields are required' }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return json({ error: 'Passwords do not match' }, { status: 400 });
  }

  if (password.length < 6) {
    return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  try {
    const env = (args as any)?.context?.cloudflare?.env;
    const { supabase, headers } = createSupabaseServerClient(args.request, env);

    console.log('Attempting to sign up user:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${new URL(args.request.url).origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Supabase sign-up error:', error);
      return json({ error: error.message }, { status: 400 });
    }

    console.log('Sign-up successful:', data);

    // Redirect to sign-in with success message
    return redirect('/sign-in?success=account-created', { headers });
  } catch (error) {
    console.error('Unexpected error during sign-up:', error);
    return json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
};

export default function SignUp() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

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
          className="backdrop-blur-xl rounded-2xl overflow-hidden w-full max-w-md transition-all duration-300"
          style={{
            background: 'rgba(10, 10, 10, 0.8)',
            border: '1px solid rgba(102, 255, 178, 0.3)',
            boxShadow: '0 0 60px rgba(102, 255, 178, 0.15), inset 0 0 30px rgba(102, 255, 178, 0.05)',
          }}
        >
          {/* Header */}
          <div className="p-8 pb-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-[#a8c0ff] via-[#66ffb2] to-[#c2e9fb] bg-clip-text text-transparent">
                  Join Clyra.ai
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Create your account to get started</p>
            </div>

            {actionData?.error && (
              <div
                className="mb-6 p-4 rounded-lg flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300"
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                }}
              >
                <span className="i-ph:warning-circle text-red-400 text-lg flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{actionData.error}</p>
              </div>
            )}

            <Form method="post" className="space-y-4 flex flex-col items-center" noValidate>
              {/* Email Field */}
              <div className="space-y-2 w-full">
                <label htmlFor="email" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider text-center">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: emailFocused ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                      border: emailFocused ? '1.5px solid rgba(102, 255, 178, 0.6)' : '1.5px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: emailFocused ? '0 0 20px rgba(102, 255, 178, 0.25)' : 'none',
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 w-full">
                <label htmlFor="password" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider text-center">
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
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 transition-all duration-300 outline-none pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: passwordFocused ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                      border: passwordFocused ? '1.5px solid rgba(102, 255, 178, 0.6)' : '1.5px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: passwordFocused ? '0 0 20px rgba(102, 255, 178, 0.25)' : 'none',
                    }}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {showPassword ? (
                      <span className="i-ph:eye-slash text-lg" />
                    ) : (
                      <span className="i-ph:eye text-lg" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2 w-full">
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider text-center">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    minLength={6}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 transition-all duration-300 outline-none pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: confirmPasswordFocused ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                      border: confirmPasswordFocused ? '1.5px solid rgba(102, 255, 178, 0.6)' : '1.5px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: confirmPasswordFocused ? '0 0 20px rgba(102, 255, 178, 0.25)' : 'none',
                    }}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <span className="i-ph:eye-slash text-lg" />
                    ) : (
                      <span className="i-ph:eye text-lg" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed mt-6"
                style={{
                  background: isSubmitting
                    ? 'rgba(102, 255, 178, 0.3)'
                    : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #66ffb2 100%)',
                  backgroundSize: '200% 200%',
                  boxShadow: isSubmitting ? 'none' : '0 0 20px rgba(102, 255, 178, 0.2)',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundPosition = '100% 0';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(102, 255, 178, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundPosition = '0% 0';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(102, 255, 178, 0.2)';
                  }
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                  {isSubmitting ? (
                    <>
                      <span className="i-ph:spinner-gap animate-spin text-lg" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <span className="i-ph:user-plus text-lg" />
                      Create Account
                    </>
                  )}
                </span>
              </button>
            </Form>
          </div>

          {/* Footer */}
          <div
            className="px-8 py-6 transition-colors duration-300"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/sign-in"
                className="font-medium bg-gradient-to-r from-cyan-400 via-green-400 to-blue-500 bg-clip-text text-transparent hover:from-cyan-300 hover:via-green-300 hover:to-blue-400 transition-all duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
