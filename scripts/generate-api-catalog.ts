/**
 * Regenerate the committed API discovery files from lib/api-catalog.ts:
 *   public/.well-known/api-catalog  (RFC 9727, Content-Type: application/linkset+json)
 *   public/openapi.json             (OpenAPI 3.1)
 *
 * Run: npx tsx scripts/generate-api-catalog.ts
 * The outputs are committed so the static export (dist/) always ships them.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { buildApiCatalog, buildOpenApiDocument } from '../lib/api-catalog';

const ROOT = resolve(__dirname, '..');

const catalogPath = join(ROOT, 'public', '.well-known', 'api-catalog');
mkdirSync(dirname(catalogPath), { recursive: true });
writeFileSync(catalogPath, `${JSON.stringify(buildApiCatalog(), null, 2)}\n`, 'utf8');

const openapiPath = join(ROOT, 'public', 'openapi.json');
writeFileSync(openapiPath, `${JSON.stringify(buildOpenApiDocument(), null, 2)}\n`, 'utf8');

console.log('✓ Wrote public/.well-known/api-catalog and public/openapi.json');
