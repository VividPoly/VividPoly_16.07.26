import type { Metadata } from 'next';
import Script from 'next/script';
import { GeistSans } from 'geist/font/sans';
import { THEME_BOOT_SCRIPT } from '@/lib/theme';
import VpSystemThemeSync from '@/components/vividpoly/VpSystemThemeSync';
import './globals.css';
import '../styles/modern-surfaces.css';
import '../styles/light-mode-contrast.css';
import '../styles/radius-system.css';
import '../styles/knack-tokens.css';
import '../styles/knack-components.css';

const SITE_URL = 'https://vivid-poly-16-07-26.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'PP Bags & Woven Bags Exporter from India | VIVIDPOLY',
  description:
    'VIVIDPOLY exports PP woven bags, valve, laminated and custom packaging from India to global buyers. Request samples and bulk export quotes today.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'VIVIDPOLY',
    url: SITE_URL,
    title: 'PP Bags & Woven Bags Exporter from India | VIVIDPOLY',
    description:
      'VIVIDPOLY exports PP woven bags, valve, laminated and custom packaging from India to global buyers. Request samples and bulk export quotes today.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PP Bags & Woven Bags Exporter from India | VIVIDPOLY',
    description:
      'VIVIDPOLY exports PP woven bags, valve, laminated and custom packaging from India to global buyers. Request samples and bulk export quotes today.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover' as const,
  colorScheme: 'light' as const,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-theme="light"
      style={{ colorScheme: 'light' }}
      suppressHydrationWarning
      className={GeistSans.variable}
    >
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <Script id="vp-theme-boot" strategy="beforeInteractive">
          {THEME_BOOT_SCRIPT}
        </Script>
      </head>
      <body
        className={GeistSans.className}
        style={{ width: '100%', minWidth: 0, margin: 0, colorScheme: 'light' }}
      >
        <VpSystemThemeSync />
        {children}
      </body>
    </html>
  );
}
