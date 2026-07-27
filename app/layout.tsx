import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LocaleProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Aperitivo Bar | Digital Menu',
  description:
    'Mobile-first read-only digital menu for Aperitivo Bar & Bistrot. EU Allergen Regulation 1169/2011 compliant.',
  keywords: ['aperitivo', 'digital menu', 'menu digitale', 'cocktails', 'wine bar', 'rome', 'spritz'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1E1B18',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF7F2] text-[#1E1B18] antialiased min-h-screen font-sans selection:bg-[#E64A19]/20 selection:text-[#B71C1C]">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
