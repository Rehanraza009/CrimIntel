'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Shield,
  Search,
  Bell,
  RefreshCw,
  User,
  CheckCircle2,
  ChevronDown,
  Lock,
  Layers,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { InvestigationStore } from '@/services/investigationStore';
import { DEMO_PROFILES } from '@/data/syntheticDataset';
import { InvestigationCase, UserProfile } from '@/types/investigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_PROFILES[1]);
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setCurrentUser(InvestigationStore.getCurrentUser());
    const caseList = InvestigationStore.getCases();
    setCases(caseList);
    const alerts = InvestigationStore.getAlerts();
    setUnreadAlertsCount(alerts.filter(a => a.status === 'NEW').length);
  }, [pathname]);

  const handleRoleChange = (profile: UserProfile) => {
    InvestigationStore.setCurrentUser(profile);
    setCurrentUser(profile);
    setShowRoleMenu(false);
    window.location.reload();
  };

  const handleResetDemoData = () => {
    InvestigationStore.resetToDefaults();
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      window.location.reload();
    }, 800);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d1633] border-b border-[#1e2f5b] shadow-sm select-none">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left: Organization & Case Context */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400 border-r border-[#1e2f5b] pr-4 hidden md:flex">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-200">MHA – NCRB</span>
            <span className="text-slate-500">|</span>
            <span>Women Safety Division</span>
          </div>

          {/* Quick Case Scope Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Active Scope:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => {
                setSelectedCaseId(e.target.value);
                if (e.target.value === 'all') {
                  router.push('/dashboard');
                } else {
                  router.push(`/cases/${e.target.value}`);
                }
              }}
              className="bg-[#132042] text-xs text-slate-200 font-medium px-2.5 py-1.5 rounded border border-[#23386e] focus:outline-none focus:border-blue-500 max-w-[200px] truncate"
            >
              <option value="all">Global (All Cases)</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} - {c.title.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center w-80 max-w-sm">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search phone, name, account, plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111d3d] text-xs text-slate-100 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-md border border-[#223565] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </form>

        {/* Right: Actions, Alerts, Role Selector, User Profile */}
        <div className="flex items-center space-x-3">
          {/* Demo Data Reset Button */}
          <button
            onClick={handleResetDemoData}
            title="Reload Synthetic / Anonymized Demo Data"
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded border border-[#263e79] bg-[#14234b] hover:bg-[#1a2f64] text-slate-200 transition"
          >
            <RefreshCw className={`w-3 h-3 text-cyan-400 ${resetSuccess ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{resetSuccess ? 'Resetting...' : 'Reset Demo Data'}</span>
          </button>

          {/* Alerts Bell */}
          <Link
            href="/alerts"
            className="relative p-1.5 rounded bg-[#132042] border border-[#23386e] hover:bg-[#1b2d5c] text-slate-300 transition"
            title="Investigation Alerts"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            )}
          </Link>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 px-2.5 py-1 bg-[#132042] border border-[#263e79] rounded text-xs text-slate-200 hover:bg-[#1b2d5c] transition"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="font-semibold text-blue-300">{currentUser.role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#101b38] border border-[#263e79] rounded-lg shadow-xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-[#1e2f5b] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role (Test RLS)
                </div>
                {DEMO_PROFILES.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleRoleChange(profile)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-start space-x-2 hover:bg-[#182952] transition ${
                      currentUser.id === profile.id ? 'bg-[#182952] text-blue-300' : 'text-slate-300'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="font-semibold">{profile.fullName}</div>
                      <div className="text-[10px] text-slate-400">
                        {profile.role} • {profile.department}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Badge */}
          <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-[#1e2f5b]">
            <div className="w-7 h-7 rounded-full bg-blue-900 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-200">
              {currentUser.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left text-xs">
              <div className="font-medium text-slate-200 leading-tight">{currentUser.fullName}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{currentUser.badgeNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
