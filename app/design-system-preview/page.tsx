import type { Metadata } from 'next';
import { DesignSystemPreview } from './preview';

export const metadata: Metadata = {
  title: 'Design system preview',
  robots: { index: false, follow: false },
};

export default function DesignSystemPreviewPage() {
  return <DesignSystemPreview />;
}
