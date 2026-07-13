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

export const metadata: Metadata = {
  title: 'VIVIDPOLY: PP Bags Exporter from India',
  description: 'VIVIDPOLY exports PP bags from India for global buyers.',
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
