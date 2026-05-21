import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { Suspense } from 'react';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0806',
};

export const metadata: Metadata = {
  title: 'NoMoreQuiet — The Place Where Silence Finds Its Voice',
  description: 'A global reflective writing house for people who are stuck. Write freely. Be heard without judgment. Built on the coordinates of Rtanj pyramid, Serbia.',
  icons: {
    icon: [
      { url: '/assets/images/ikona2-1777358983549.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className="grain-overlay bg-void text-cream font-cormorant antialiased overflow-x-hidden"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
        }}
      >
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#110e0a',
              border: '1px solid rgba(200,130,42,0.25)',
              color: '#f0e8d8',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '15px',
              fontWeight: 300,
            },
          }}
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fnomorequie6253back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.18" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}