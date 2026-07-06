import type { Metadata, Viewport } from 'next';
import './globals.scss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppInit from '@/components/AppInit';
import { FeedbackProvider } from '@/components/FeedbackProvider';

export const metadata: Metadata = {
  title: 'My Food Book',
  description: '食事・栄養素・体重を記録するクライアント完結型アプリ',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Food Book',
  },
};

export const viewport: Viewport = {
  themeColor: '#89c997',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <FeedbackProvider>
          <AppInit />
          <Header />
          <main>{children}</main>
          <Footer />
        </FeedbackProvider>
      </body>
    </html>
  );
}
