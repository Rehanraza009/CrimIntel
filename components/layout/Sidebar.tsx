'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  LayoutDashboard,
  FolderOpen,
  Users2,
  Share2,
  Clock,
  UploadCloud,
  FileCheck2,
  AlertOctagon,
  FileText,
  Search,
  History,
  Sliders,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Info,
  X,
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const currentUser = InvestigationStore.getCurrentUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('crimintel_sidebar_collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('crimintel_sidebar_collapsed', String(next));
  };

  const navGroups = [
    {
      group: 'Workspace',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Cases', href: '/cases', icon: FolderOpen },
        { name: 'Entities', href: '/entities', icon: Users2 },
        { name: 'Network Analysis', href: '/network', icon: Share2 },
        { name: 'Timeline', href: '/timeline', icon: Clock },
      ],
    },
    {
      group: 'Evidence & Analysis',
      items: [
        { name: 'Data Import', href: '/import', icon: UploadCloud },
        { name: 'Evidence Vault', href: '/evidence', icon: FileCheck2 },
        { name: 'Items Requiring Review', href: '/alerts', icon: AlertOctagon },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Global Search', href: '/search', icon: Search },
      ],
    },
    {
      group: 'Administration',
      items: [
        { name: 'Audit Logs', href: '/audit', icon: History },
        { name: 'Settings', href: '/settings', icon: Sliders },
        ...(currentUser.role === 'ADMIN'
          ? [{ name: 'Admin Console', href: '/admin', icon: ShieldCheck }]
          : []),
      ],
    },
    {
      group: 'Public Information',
      items: [
        { name: 'Product Overview', href: '/', icon: Info },
        { name: 'Security & Integrity', href: '/security', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-50 md:z-20 h-screen flex flex-col bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-[#263650] shadow-md transition-all duration-300 select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[#263650] flex items-center justify-between bg-slate-50 dark:bg-[#0c1630]">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center space-x-3 group min-w-0"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-blue-500" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="font-black text-sm tracking-wider text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                  <span>CRIMINTEL</span>
                  <span className="text-[10px] bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 font-mono px-1 py-0.2 rounded border border-blue-400/30">
                    v1.0
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight truncate">
                  MHA – NCRB Cyber Intelligence
                </div>
              </div>
            )}
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Tag Notice */}
        {!isCollapsed && (
          <div className="mx-3 mt-3 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-700 dark:text-amber-300 flex items-center justify-between">
            <span className="font-semibold">DEMO MODE</span>
            <span className="text-[9px] text-amber-600/90 dark:text-amber-400/80">Synthetic Records</span>
          </div>
        )}

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!isCollapsed ? (
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1">
                  {group.group}
                </div>
              ) : (
                <div className="h-px bg-slate-200 dark:bg-[#1e2f5b] my-2" />
              )}

              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && item.href !== '/' && pathname?.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg transition group ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/40 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16243e] hover:text-slate-900 dark:hover:text-white'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </div>
                    {!isCollapsed && isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Collapse Toggle & User Info */}
        <div className="p-3 border-t border-slate-200 dark:border-[#263650] bg-slate-50 dark:bg-[#0c1630] space-y-2">
          {/* Collapse/Expand Toggle on Desktop */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex w-full items-center justify-center p-1.5 rounded-lg border border-slate-200 dark:border-[#263650] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-500 dark:text-slate-400 text-xs transition"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center space-x-1.5">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px] font-medium">Collapse</span>
              </div>
            )}
          </button>

          {/* User Sign-out Row */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-300 dark:border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300 flex-shrink-0">
                {currentUser.fullName.slice(0, 1)}
              </div>
              {!isCollapsed && (
                <div className="text-left text-xs truncate max-w-[130px]">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                    {currentUser.role}
                  </div>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Link
                href="/auth/login"
                className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                title="Sign Out / Switch Account"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
