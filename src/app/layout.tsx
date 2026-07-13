import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { metadataDefaults } from '@/lib/seo/metadata';

import './globals.css';

export const metadata: Metadata = metadataDefaults;

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
