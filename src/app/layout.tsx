import type { Metadata } from 'next';
import Script from 'next/script';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';
import { CustomCursor } from '@/components/ui/CustomCursor';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://saisrikar.in'),
  title: 'Sai Srikar | AI & Data Science Web Portfolio',
  description:
    'Portfolio of Sai Srikar, AI & Data Science student at Rajalakshmi Engineering College specializing in Cybersecurity.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta name="theme-color" content="#F9FAFB" id="theme-color-meta" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600&family=Syne:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/style.css" />
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <script src="https://unpkg.com/lucide@latest"></script>
      </head>
      <body>
        <CustomCursor />
        <AnalyticsTracker />
        {children}
        <Script src="/script.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
