'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

const PUBLIC_ROUTES = [
  '/',
  '/features',
  '/security',
  '/about',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isPublicRoute) {
    return (
      <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-200">
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-200">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 bg-[var(--bg-page)]">
          {children}
        </main>
      </div>
    </div>
  );
}
