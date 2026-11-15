'use client';

import dynamic from 'next/dynamic';

/**
 * The reader's dialog (see ReaderDialogImpl), loaded after the page is interactive. Its sheet
 * animation needs framer-motion (42 KB gzip), and every reading page imports this dialog though
 * none shows it until a tap; loading it here keeps that library out of the first download.
 * Closed dialogs render nothing, so there is no server HTML to lose.
 */
export const ReaderDialog = dynamic(() => import('./ReaderDialogImpl').then((m) => m.ReaderDialog), { ssr: false });
