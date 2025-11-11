import { redirect } from '@remix-run/cloudflare';

export const loader = () => redirect('/');

export default function LegacySignInRedirect() {
  return null;
}
