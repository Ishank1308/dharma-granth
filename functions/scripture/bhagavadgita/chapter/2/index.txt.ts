interface R2ObjectLike {
  body: ReadableStream<Uint8Array>;
  httpEtag?: string;
}

interface R2BucketLike {
  get(key: string): Promise<R2ObjectLike | null>;
}

interface RscCanaryEnv {
  RSC_EDGE_CANARY?: string;
  SCRIPTURES?: R2BucketLike;
  SCRIPTURES_R2_PREFIX?: string;
}

interface PagesContext {
  env: RscCanaryEnv;
  next: () => Promise<Response>;
}

/**
 * Byte-preserving RSC canary. The static HTML remains authoritative; this
 * route only serves the matching Next.js Flight payload from R2 when the
 * canary flag and binding are both configured.
 */
export async function onRequest(context: PagesContext): Promise<Response> {
  if (context.env.RSC_EDGE_CANARY !== 'bhagavadgita' || !context.env.SCRIPTURES) {
    return context.next();
  }

  const prefix = context.env.SCRIPTURES_R2_PREFIX || 'rsc';
  const key = `${prefix}/scripture/bhagavadgita/chapter/2/index.txt`;

  try {
    const object = await context.env.SCRIPTURES.get(key);
    if (!object) return context.next();

    const headers = new Headers({
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Content-Type': 'text/plain; charset=utf-8',
      // public/_headers does not reach Function responses; RSC payloads stay out of the index (CLAUDE.md rule 6).
      'X-Robots-Tag': 'noindex',
    });
    if (object.httpEtag) headers.set('ETag', object.httpEtag);

    return new Response(object.body, { headers });
  } catch {
    return context.next();
  }
}
