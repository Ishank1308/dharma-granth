import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { StartHere } from './StartHere';

export const metadata: Metadata = {
  title: 'Start Here · कहाँ से शुरू करें?',
  description: 'Four short questions to find a helpful place to begin. No account; your answers stay on your device.',
  alternates: { canonical: '/start-here/' },
  openGraph: {
    title: 'Start Here · कहाँ से शुरू करें?',
    description:
      'Four short questions to find a helpful place to begin. No account; your answers stay on your device.',
    url: '/start-here/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function StartHerePage() {
  return <StartHere />;
}
