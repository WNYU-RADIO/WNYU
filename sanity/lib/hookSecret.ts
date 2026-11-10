import 'server-only';

const hookSecret = process.env.NEXT_PUBLIC_SANITY_HOOK_SECRET;

if (!hookSecret) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SANITY_HOOK_SECRET',
  );
}

export { hookSecret };
