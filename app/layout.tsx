import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

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
    <html lang="en" className="dark">
      <body className="antialiased bg-[#091124] text-slate-100">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
