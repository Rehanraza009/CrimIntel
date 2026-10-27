import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { ThemeProvider } from '@/lib/themeContext';

export const metadata: Metadata = {
  title: 'CRIMINTEL - AI-Powered Criminal Network Analysis System',
  description: 'Ministry of Home Affairs (MHA) – NCRB Women Safety Division. Investigation Intelligence Platform converting fragmented records into an explainable temporal knowledge graph.',
  keywords: ['CrimIntel', 'NCRB', 'MHA', 'Criminal Network Analysis', 'Investigation Intelligence', 'Knowledge Graph', 'SIH26189'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('crimintel_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved ? saved : (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
