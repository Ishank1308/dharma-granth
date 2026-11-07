/**
 * Cloudflare Pages Function for /api/health.
 *
 * Liveness probe for monitors and for the `status` / `service-status` links
 * in /.well-known/api-catalog (RFC 9727). No bindings are needed; it never
 * reads or stores request data.
 */

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export const onRequest = (context: { request: Request }) => {
  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    return json({ error: 'Method not allowed.' }, 405);
  }
  if (context.request.method === 'HEAD') {
    return new Response(null, {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }
  return json({ status: 'ok', service: 'dharma-granth', time: new Date().toISOString() });
};
