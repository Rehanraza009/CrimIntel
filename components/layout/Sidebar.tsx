'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  LayoutDashboard,
  FolderOpen,
  UploadCloud,
  Users2,
  Share2,
  Clock,
  FileCheck2,
  AlertOctagon,
  FileText,
  Search,
  History,
  Sliders,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  LogOut,
  Info
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';

export default function Sidebar() {
  const pathname = usePathname();
  const currentUser = InvestigationStore.getCurrentUser();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Cases', href: '/cases', icon: FolderOpen },
    { name: 'Data Ingestion', href: '/import', icon: UploadCloud },
    { name: 'Entity Explorer', href: '/entities', icon: Users2 },
    { name: 'Network Analysis', href: '/network', icon: Share2 },
    { name: 'Temporal Timeline', href: '/timeline', icon: Clock },
    { name: 'Evidence Vault', href: '/evidence', icon: FileCheck2 },
    { name: 'Investigation Alerts', href: '/alerts', icon: AlertOctagon },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Global Search', href: '/search', icon: Search },
    { name: 'Audit Logs', href: '/audit', icon: History },
    { name: 'Settings', href: '/settings', icon: Sliders },
    ...(currentUser.role === 'ADMIN' ? [{ name: 'Admin Console', href: '/admin', icon: ShieldCheck }] : []),
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#091124] border-r border-[#18274d] flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#18274d] bg-[#0c1630]">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="font-black text-sm tracking-wider text-slate-100 flex items-center space-x-1.5">
              <span>CRIMINTEL</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-1 py-0.2 rounded border border-blue-400/30">v1.0</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-tight">
              MHA – NCRB Cyber Intelligence
            </div>
          </div>
        </Link>
      </div>

      {/* Synthetic Data Notice Pill */}
      <div className="mx-3 mt-3 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 flex items-center justify-between">
        <span className="font-semibold">DEMO ENVIRONMENT</span>
        <span className="text-[9px] text-amber-400/80">Synthetic Data</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Investigation Core
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
                  : 'text-slate-300 hover:bg-[#132042] hover:text-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
            </Link>
          );
        })}

        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mt-4 mb-2">
          Public & Security
        </div>
        <Link
          href="/"
          className="flex items-center space-x-2.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Landing Overview</span>
        </Link>
        <Link
          href="/security"
          className="flex items-center space-x-2.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Security & Chain Specs</span>
        </Link>
      </nav>

      {/* Bottom User Card */}
      <div className="p-3 border-t border-[#18274d] bg-[#0c1630]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-blue-700/30 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300">
              {currentUser.fullName.slice(0, 1)}
            </div>
            <div className="text-left text-xs max-w-[120px] truncate">
              <div className="font-semibold text-slate-200 truncate">{currentUser.fullName}</div>
              <div className="text-[10px] text-blue-300 font-mono">{currentUser.role}</div>
            </div>
          </div>
          <Link
            href="/auth/login"
            className="p-1.5 text-slate-400 hover:text-rose-400 transition"
            title="Sign Out / Switch Account"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
