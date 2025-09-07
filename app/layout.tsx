import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TipJarz - Monetize your content with direct fan support',
  description: 'A Base miniapp that allows creators to receive direct tips from their audience, fostering a direct monetization channel.',
  openGraph: {
    title: 'TipJarz',
    description: 'Monetize your content with direct fan support',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
