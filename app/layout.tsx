import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EJA Letramento Digital',
  description: 'Aprenda sobre tecnologia de forma prática e divertida',
  //manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'EJA Letramento Digital',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-icon-180.png',
    shortcut: '/icons/icon-96.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        
        {/* Favicon padrão */}
        <link rel="icon" type="image/png" href="/icons/icon-96.png" />
        
        {/* Meta tags essenciais */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EJA Letramento Digital" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileImage" content="/icons/icon-192.png" />
        <meta name="msapplication-TileColor" content="#0f172a" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}