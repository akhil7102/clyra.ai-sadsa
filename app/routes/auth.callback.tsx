import { redirect, type LoaderFunctionArgs } from '@remix-run/cloudflare';

// This route is used by Clerk for authentication callbacks
export const loader = async (_args: LoaderFunctionArgs) => {
  // Redirect to home page after authentication
  return redirect('/');
};
