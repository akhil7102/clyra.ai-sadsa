import { redirect } from '@remix-run/cloudflare';

export const loader = () => redirect('/sign-up');

export default function LegacySignUpRedirect() {
  return null;
}
