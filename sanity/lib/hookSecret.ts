import 'server-only';

const hookSecret = process.env.SANITY_HOOK_SECRET;

if (!hookSecret) {
  throw new Error('Missing environment variable: SANITY_HOOK_SECRET');
}

export { hookSecret };
