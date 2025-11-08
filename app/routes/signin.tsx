import { redirect } from '@remix-run/cloudflare';

export const loader = () => redirect('/sign-in');

export default function LegacySignInRedirect() {
  return null;
}
