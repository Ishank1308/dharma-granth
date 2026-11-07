/** One <script type="application/ld+json"> payload holding several schema.org nodes under a single @graph. */
export function jsonLdGraph(...nodes: Record<string, unknown>[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.map((node) => {
      const { ['@context']: _context, ...rest } = node;
      void _context;
      return rest;
    }),
  };
}
