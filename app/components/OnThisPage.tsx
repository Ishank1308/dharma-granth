import '@/app/styles/long-read.css';

/**
 * The contents list for a long page: a disclosure that opens to one row per section, each a
 * link to that section's heading id. Plain markup and CSS (app/styles/long-read.css), with no
 * hooks and no script, so it is in the exported HTML and works before the page hydrates.
 *
 * It starts closed when it has more than four rows: on a phone an open list of eight sections
 * is more than half a screen between the title and the first paragraph. With four rows or
 * fewer it starts open, since hiding two links behind a tap saves nothing.
 *
 * The page it sits in takes `.long-read` on its <main>, which also keeps a heading reached
 * from here clear of the sticky header.
 */
export interface OnThisPageItem {
  /** The id of the heading (or section) the row jumps to. */
  id: string;
  /** English label. With `hi` it is one half of a two-language label. */
  en?: string;
  /** Hindi label. */
  hi?: string;
}

export function OnThisPage({
  items,
  className = '',
  open,
}: {
  items: Array<OnThisPageItem | false | null | undefined>;
  className?: string;
  /** Overrides the default (open with four rows or fewer). */
  open?: boolean;
}) {
  const rows = items.filter((item): item is OnThisPageItem => Boolean(item && (item.en || item.hi)));
  if (rows.length < 2) return null;
  const startsOpen = open ?? rows.length <= 4;

  return (
    <nav aria-label="On this page" className={`on-this-page ${className}`}>
      <details className="apple-group" open={startsOpen}>
        <summary className="apple-row">
          <span>
            <span data-bi="en">On this page</span>{' '}
            <span lang="hi" data-bi="hi" className="on-this-page-second font-devanagari font-normal">
              इस पृष्ठ पर
            </span>
          </span>
          <span className="on-this-page-count">{rows.length}</span>
          <span className="on-this-page-chevron" aria-hidden="true">
            ›
          </span>
        </summary>
        <ol>
          {rows.map((row, i) => {
            const bi = Boolean(row.en && row.hi);
            return (
              <li key={row.id}>
                <a className="apple-row" href={`#${row.id}`}>
                  <span className="on-this-page-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    {row.hi && (
                      <span lang="hi" data-bi={bi ? 'hi' : undefined} className="font-devanagari">
                        {row.hi}
                      </span>
                    )}
                    {bi && ' '}
                    {row.en && (
                      <span data-bi={bi ? 'en' : undefined} className={bi ? 'on-this-page-second' : undefined}>
                        {row.en}
                      </span>
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </details>
    </nav>
  );
}
