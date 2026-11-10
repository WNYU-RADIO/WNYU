import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { hookSecret } from '@/sanity/lib/hookSecret';

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string;
    }>(req, hookSecret);

    if (!isValidSignature) {
      return new Response('Invalid Signature', { status: 401 });
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 });
    }

    revalidateTag(body._type);
    return NextResponse.json({
      revalidated: true,
      type: body._type,
    });
  } catch (error: unknown) {
    // Server-side logging keeps webhook failures observable without exposing details.
    // eslint-disable-next-line no-console
    console.error('Sanity revalidation failed', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
