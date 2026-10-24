/**
 * API catalog source of truth (RFC 9727).
 *
 * The catalog itself is published as the static file
 * `public/.well-known/api-catalog` (Content-Type: application/linkset+json
 * via `public/_headers`), and the machine-readable descriptions it points at
 * live in `public/openapi.json`. Run `npm run generate:api-catalog` after
 * editing this file to regenerate both committed copies.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev').replace(/\/+$/, '');

export const OPENAPI_HREF = `${SITE_URL}/openapi.json`;
export const API_DOCS_HREF = `${SITE_URL}/api-docs/`;
export const HEALTH_HREF = `${SITE_URL}/api/health`;

export interface CatalogLink {
  href: string;
  type?: string;
}

export interface CatalogEntry {
  anchor: string;
  'service-desc': CatalogLink[];
  'service-doc': CatalogLink[];
  /** RFC 9727 Appendix A uses `service-status`; `status` is also accepted by scanners. */
  status: CatalogLink[];
  'service-status': CatalogLink[];
}

export interface ApiCatalog {
  linkset: CatalogEntry[];
}

function entry(anchor: string): CatalogEntry {
  return {
    anchor,
    'service-desc': [{ href: OPENAPI_HREF, type: 'application/openapi+json' }],
    'service-doc': [{ href: API_DOCS_HREF }],
    status: [{ href: HEALTH_HREF }],
    'service-status': [{ href: HEALTH_HREF }],
  };
}

/**
 * One entry per public API surface. Anchors are absolute production URLs so
 * automated scanners can resolve them without knowing the request host.
 */
export function buildApiCatalog(): ApiCatalog {
  return {
    linkset: [
      entry(`${SITE_URL}/api/feedback`),
      entry(`${SITE_URL}/chapter-index.json`),
      entry(`${SITE_URL}/search-index/verses.json`),
    ],
  };
}

/** OpenAPI 3.1 document describing every path referenced by the catalog. */
export function buildOpenApiDocument() {
  return {
    openapi: '3.1.0',
    info: {
      title: 'Dharma Granth API',
      version: '1.0.0',
      description:
        'Public machine-readable interfaces of Dharma Granth: the clarity-feedback collector, the deployment health check, and the static scripture search indexes. Scripture pages themselves are server-rendered HTML; these endpoints are the parts meant for automated clients.',
      contact: { name: 'Dharma Granth', url: SITE_URL },
    },
    servers: [{ url: SITE_URL, description: 'Production' }],
    tags: [
      { name: 'Feedback', description: 'Anonymous clarity votes on explanations.' },
      { name: 'Health', description: 'Deployment health check.' },
      { name: 'Content indexes', description: 'Static JSON indexes behind global search.' },
    ],
    paths: {
      '/api/feedback': {
        post: {
          tags: ['Feedback'],
          operationId: 'submitFeedback',
          summary: 'Submit an anonymous clarity vote',
          description:
            'Records one counter per verse, rating and reason. No text, account, address or identifier is accepted or stored. Returns 503 until the FEEDBACK KV binding is configured (see docs/feedback-collection.md).',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FeedbackSubmission' },
              },
            },
          },
          responses: {
            '204': { description: 'Vote counted (no body).' },
            '400': { description: 'Invalid JSON or submission shape.' },
            '413': { description: 'Body exceeds 1024 bytes.' },
            '503': { description: 'Feedback collection is not configured on this deployment.' },
          },
        },
        get: {
          tags: ['Feedback'],
          operationId: 'readFeedback',
          summary: 'Read aggregated clarity counters (editors)',
          description: 'Requires the x-editorial-token header and the EDITORIAL_TOKEN secret; without them the endpoint behaves as not found.',
          security: [{ editorialToken: [] }],
          responses: {
            '200': {
              description: 'Aggregated counters per verse.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['verses'],
                    properties: {
                      verses: { type: 'array', items: { $ref: '#/components/schemas/FeedbackVerse' } },
                      truncated: { type: 'boolean' },
                    },
                  },
                },
              },
            },
            '401': { description: 'Wrong or missing editorial token.' },
            '404': { description: 'Not configured (no token secret or KV binding).' },
          },
        },
      },
      '/api/health': {
        get: {
          tags: ['Health'],
          operationId: 'getHealth',
          summary: 'Service health check',
          description: 'Liveness probe for monitors and for the `status` links in /.well-known/api-catalog.',
          responses: {
            '200': {
              description: 'Service is up.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/HealthStatus' },
                },
              },
            },
          },
        },
      },
      '/chapter-index.json': {
        get: {
          tags: ['Content indexes'],
          operationId: 'getChapterIndex',
          summary: 'Chapter title index',
          description: 'Static build-time index of chapter titles ({v, counts, chapters}) fetched lazily by global search.',
          responses: {
            '200': {
              description: 'Chapter index.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ChapterIndex' },
                },
              },
            },
          },
        },
      },
      '/search-index/verses.json': {
        get: {
          tags: ['Content indexes'],
          operationId: 'getVerseIndex',
          summary: 'Verse search index',
          description: 'Static build-time index of every verse that has its own page ({v, scriptures, rows}), fetched lazily by global search.',
          responses: {
            '200': {
              description: 'Verse index.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/VerseIndex' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        editorialToken: { type: 'apiKey', in: 'header', name: 'x-editorial-token' },
      },
      schemas: {
        FeedbackSubmission: {
          type: 'object',
          required: ['refKey', 'rating'],
          properties: {
            refKey: {
              type: 'string',
              pattern: '^[a-z0-9-]{1,40}:[0-9]{1,4}:[0-9A-Za-z.-]{1,12}$',
              example: 'bhagavadgita:2:47',
              description: '"scripture:chapter:verse" reference.',
            },
            rating: { type: 'string', enum: ['yes', 'partly', 'no'] },
            reasons: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['language', 'example', 'long', 'context', 'source', 'vocabulary', 'source-concern', 'textual', 'other'],
              },
              description: 'Fixed reason ids; ignored when rating is "yes".',
            },
          },
        },
        FeedbackVerse: {
          type: 'object',
          required: ['refKey', 'yes', 'partly', 'no', 'reasons'],
          properties: {
            refKey: { type: 'string', example: 'bhagavadgita:2:47' },
            yes: { type: 'integer', minimum: 0 },
            partly: { type: 'integer', minimum: 0 },
            no: { type: 'integer', minimum: 0 },
            reasons: { type: 'object', additionalProperties: { type: 'integer', minimum: 0 } },
          },
        },
        HealthStatus: {
          type: 'object',
          required: ['status', 'service'],
          properties: {
            status: { type: 'string', enum: ['ok'], example: 'ok' },
            service: { type: 'string', example: 'dharma-granth' },
            time: { type: 'string', format: 'date-time' },
          },
        },
        ChapterIndex: {
          type: 'object',
          required: ['v', 'counts', 'chapters'],
          properties: {
            v: { type: 'integer', const: 1 },
            counts: { type: 'object', additionalProperties: { type: 'integer', minimum: 0 } },
            chapters: {
              type: 'array',
              items: { type: 'array', minItems: 3, maxItems: 4, items: {} },
              description: '[scriptureId, chapterNumber, title, titleSanskrit?].',
            },
          },
        },
        VerseIndex: {
          type: 'object',
          required: ['v', 'scriptures', 'rows'],
          properties: {
            v: { type: 'integer', const: 1 },
            scriptures: { type: 'array', items: { type: 'string' } },
            rows: {
              type: 'array',
              items: { type: 'array', minItems: 9, maxItems: 9, items: {} },
              description: '[scriptureIndex, chapter, verseSlug, sanskrit, transliteration, hindi, english, explanation, flags].',
            },
          },
        },
      },
    },
  };
}
