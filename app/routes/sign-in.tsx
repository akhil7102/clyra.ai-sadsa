import { redirect, type LoaderFunctionArgs } from '@remix-run/cloudflare';

export const meta = () => [] as const;

export const loader = async (_args: LoaderFunctionArgs) => redirect('/');

export const action = async () => redirect('/');

export default function SignIn() { return null; }
