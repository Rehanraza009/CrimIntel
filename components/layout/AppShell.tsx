'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

const PUBLIC_ROUTES = ['/', '/features', '/security', '/about', '/auth/login', '/auth/signup'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isPublicRoute) {
    return <main className="min-h-screen bg-[#091124] text-slate-100">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b132b] text-slate-100">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#091124]">
          {children}
        </main>
      </div>
    </div>
  );
}
