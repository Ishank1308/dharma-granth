export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';

/** Absolute, trailing-slash URL (the site is exported with trailingSlash). */
export function absUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean.endsWith('/') ? clean : `${clean}/`}`;
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}

/** A detail page: breadcrumb trail plus one main entity (Article, DefinedTerm, ...). */
export function pageLd(crumbs: Crumb[], main: Record<string, unknown>) {
  return { '@context': 'https://schema.org', '@graph': [main, breadcrumbLd(crumbs)] };
}

export function articleLd(opts: { path: string; headline: string; description: string; languages?: string[] }) {
  return {
    '@type': 'Article',
    '@id': `${absUrl(opts.path)}#article`,
    headline: opts.headline,
    description: opts.description,
    url: absUrl(opts.path),
    mainEntityOfPage: absUrl(opts.path),
    inLanguage: opts.languages ?? ['en', 'hi'],
    isAccessibleForFree: true,
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function definedTermLd(opts: { path: string; name: string; alt?: string[]; description: string; setPath: string; setName: string }) {
  return {
    '@type': 'DefinedTerm',
    '@id': `${absUrl(opts.path)}#term`,
    name: opts.name,
    ...(opts.alt?.length ? { alternateName: opts.alt } : {}),
    description: opts.description,
    url: absUrl(opts.path),
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: opts.setName, url: absUrl(opts.setPath) },
  };
}

export interface CourseLdInput {
  path: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  minutes: number;
  outcomes: string[];
  prerequisites?: string;
  lessons: { title: string; description: string; minutes: number }[];
}

/**
 * schema.org Course for a free, self-paced learning path. Only facts the data
 * holds are emitted: no ratings, price or instructor are invented.
 */
export function courseLd(c: CourseLdInput) {
  const url = absUrl(c.path);
  return {
    '@type': 'Course',
    '@id': `${url}#course`,
    name: c.name,
    description: c.description,
    url,
    inLanguage: ['en', 'hi', 'sa'],
    isAccessibleForFree: true,
    educationalLevel: c.level.charAt(0).toUpperCase() + c.level.slice(1),
    timeRequired: `PT${Math.max(1, Math.round(c.minutes))}M`,
    ...(c.prerequisites ? { coursePrerequisites: c.prerequisites } : {}),
    ...(c.outcomes.length ? { teaches: c.outcomes } : {}),
    provider: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Dharma Granth', sameAs: SITE_URL },
    offers: { '@type': 'Offer', category: 'Free', price: 0, priceCurrency: 'INR' },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${Math.max(1, Math.round(c.minutes))}M`,
    },
    hasPart: c.lessons.map((l, i) => ({
      '@type': 'LearningResource',
      position: i + 1,
      name: l.title,
      description: l.description,
      timeRequired: `PT${Math.max(1, Math.round(l.minutes))}M`,
    })),
  };
}

/**
 * A listing page for courses: a CollectionPage with an ItemList whose items
 * point at each course's own page (which carries the full Course data). Google's
 * course carousel takes URLs only, so no course is described twice.
 */
export function courseListLd(opts: { path: string; name: string; description: string; courses: { path: string; name: string }[] }) {
  const url = absUrl(opts.path);
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: opts.name,
    description: opts.description,
    url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.courses.length,
      itemListElement: opts.courses.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absUrl(c.path),
        name: c.name,
      })),
    },
  };
}

export function faqLd(opts: { path: string; items: { question: string; answer: string }[] }) {
  return {
    '@type': 'FAQPage',
    '@id': `${absUrl(opts.path)}#faq`,
    mainEntity: opts.items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  };
}

export interface ReadingListItem {
  id: string;
  name: string;
  nameHi?: string;
  description: string;
  minutes: number;
  teaches?: string;
  prerequisites?: string[];
  parts: { name: string; description?: string }[];
}

/**
 * A listing page whose items have no pages of their own (they live on the
 * listing). Each item is a LearningResource; `@id` is a fragment of the page.
 */
export function readingListLd(opts: { path: string; name: string; description: string; items: ReadingListItem[] }) {
  const url = absUrl(opts.path);
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: opts.name,
    description: opts.description,
    url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'LearningResource',
          '@id': `${url}#${it.id}`,
          name: it.name,
          ...(it.nameHi ? { alternateName: it.nameHi } : {}),
          description: it.description,
          inLanguage: ['en', 'hi'],
          isAccessibleForFree: true,
          timeRequired: `PT${Math.max(1, Math.round(it.minutes))}M`,
          ...(it.teaches ? { teaches: it.teaches } : {}),
          ...(it.prerequisites?.length ? { competencyRequired: it.prerequisites.join('; ') } : {}),
          provider: { '@id': `${SITE_URL}/#organization` },
          hasPart: it.parts.map((p, n) => ({
            '@type': 'CreativeWork',
            position: n + 1,
            name: p.name,
            ...(p.description ? { description: p.description } : {}),
          })),
        },
      })),
    },
  };
}
