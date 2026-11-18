import type { ReactNode } from 'react';
import { AshShell, ASH_INIT_SCRIPT } from './AshShell';
import './ashtavakra.css';

/**
 * The site's own primary navigation, breadcrumbs and two public themes are the
 * only chrome for Ashtavakra too. Keep its local reading preferences for
 * backwards compatibility, but do not inject a second book-specific navbar
 * between the site header and the scripture page.
 */
export default function AshtavakraLayout({ children }: { children: ReactNode }) {
  return (
    <AshShell>
      <script dangerouslySetInnerHTML={{ __html: ASH_INIT_SCRIPT }} />
      {children}
    </AshShell>
  );
}
