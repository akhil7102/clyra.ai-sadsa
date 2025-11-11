import { redirect } from '@remix-run/cloudflare';

export const loader = () => redirect('/');

export default function LegacySignUpRedirect() {
  return null;
}
