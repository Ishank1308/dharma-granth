import type { Metadata } from 'next';
import { JsonLd } from '@/app/components/JsonLd';
import { pathways } from '@/data/pathways';
import { courseListLd, pageLd } from '@/lib/jsonld';

const TITLE = 'Learning Pathways — Guided Scripture Study Plans';
const DESCRIPTION =
  'Step-by-step guided pathways through Hindu scriptures — structured reading plans that take you from first verse to full understanding at your own pace.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/learn/pathways/' },
};

export default function PathwaysLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={pageLd(
          [
            { name: 'Learn', path: '/learn' },
            { name: 'Pathways', path: '/learn/pathways' },
          ],
          courseListLd({
            path: '/learn/pathways',
            name: TITLE,
            description: DESCRIPTION,
            // Each pathway is a learning path; its Course data lives on /learn/<id>.
            courses: pathways.map((p) => ({ path: `/learn/${p.id}`, name: p.title })),
          }),
        )}
      />
      {children}
    </>
  );
}
