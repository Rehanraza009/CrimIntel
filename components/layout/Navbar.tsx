'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Search,
  Bell,
  RefreshCw,
  User,
  ChevronDown,
  Sun,
  Moon,
  BookOpen,
  Menu,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '@/lib/themeContext';
import { InvestigationStore } from '@/services/investigationStore';
import { DEMO_PROFILES } from '@/data/syntheticDataset';
import { InvestigationCase, UserProfile, InvestigationAlert } from '@/types/investigation';
import NotificationsPopover from '@/components/layout/NotificationsPopover';
import ResetDemoModal from '@/components/common/ResetDemoModal';
import { TerminologyModal } from '@/components/common/TerminologyModal';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
}

export default function Navbar({ onToggleMobileSidebar }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_PROFILES[1]);
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [alerts, setAlerts] = useState<InvestigationAlert[]>([]);
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setCurrentUser(InvestigationStore.getCurrentUser());
    setCases(InvestigationStore.getCases());
    setAlerts(InvestigationStore.getAlerts());
  }, [pathname]);

  const unreadAlerts = alerts.filter((a) => a.status === 'NEW');

  const handleRoleChange = (profile: UserProfile) => {
    InvestigationStore.setCurrentUser(profile);
    setCurrentUser(profile);
    setShowRoleMenu(false);
    window.location.reload();
  };

  const handleConfirmReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      InvestigationStore.resetToDefaults();
      setIsResetting(false);
      setShowResetModal(false);
      window.location.reload();
    }, 600);
  };

  const handleMarkAlertRead = (id: string) => {
    InvestigationStore.updateAlertStatus(id, 'REVIEWED');
    setAlerts(InvestigationStore.getAlerts());
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-[#263650] shadow-sm select-none transition-colors duration-200">
        <div className="flex items-center justify-between px-3 md:px-5 py-2.5">
          {/* Left: Mobile Toggle, MHA Label, Active Case Scope */}
          <div className="flex items-center space-x-3">
            {/* Mobile Sidebar Hamburger */}
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#16243e] transition"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Institutional Header Label */}
            <div className="flex items-center space-x-2 text-xs border-r border-slate-200 dark:border-[#263650] pr-3 hidden sm:flex">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-800 dark:text-slate-200">MHA – NCRB</span>
              <span className="text-slate-400 dark:text-slate-500">|</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Cyber Intelligence</span>
            </div>

            {/* Case Scope Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden lg:inline">
                Scope:
              </span>
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
                className="bg-slate-50 dark:bg-[#111c30] text-xs font-semibold text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-[#263650] focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[180px] sm:max-w-[220px] truncate transition"
                title="Filter views by active investigation docket"
              >
                <option value="all">Global (All 10 Cases)</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber} - {c.title.slice(0, 26)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search phone, person, vehicle plate, account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#111c30] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263650] focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </form>

          {/* Right Controls: Guide, Theme Toggle, Notifications, Reset, User Role */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Plain-Language Terminology Guide */}
            <button
              onClick={() => setShowGuideModal(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#16243e] transition border border-transparent hover:border-slate-200 dark:hover:border-[#263650]"
              title="Plain-Language Investigation Guide & Glossary"
              aria-label="Investigation terminology guide"
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
            </button>

            {/* Day / Night Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16243e] border border-slate-200 dark:border-[#263650] transition relative group"
              title={theme === 'dark' ? 'Switch to Day Mode (Light Theme)' : 'Switch to Night Mode (Dark Theme)'}
              aria-label={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 animate-in spin-in-180 duration-200" />
              )}
            </button>

            {/* Notifications Bell with Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16243e] border border-slate-200 dark:border-[#263650] transition"
                title="Investigation Notifications"
                aria-label={`Notifications (${unreadAlerts.length} unread)`}
              >
                <Bell className="w-4 h-4 text-amber-500" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>

              <NotificationsPopover
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                alerts={alerts}
                onMarkRead={handleMarkAlertRead}
              />
            </div>

            {/* Demo Reset Trigger */}
            <button
              onClick={() => setShowResetModal(true)}
              title="Reset synthetic demo data to default state"
              className="hidden lg:flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-[#263650] bg-slate-50 dark:bg-[#111c30] hover:bg-slate-100 dark:hover:bg-[#16243e] text-slate-700 dark:text-slate-200 transition"
            >
              <RefreshCw className="w-3 h-3 text-cyan-500" />
              <span>Reset Data</span>
            </button>

            {/* Role Switcher Menu (Clearly Labeled as Test/Demo) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#16243e] transition"
                aria-label="User role test menu"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="font-bold text-blue-600 dark:text-blue-400">{currentUser.role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#263650] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-[#1e2f5b]">
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Active Profile & Test Role
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                        Switch roles to test Row Level Security (RLS) views. Real deployments authenticate via Supabase Auth JWT.
                      </p>
                    </div>

                    <div className="py-1">
                      {DEMO_PROFILES.map((profile) => (
                        <button
                          key={profile.id}
                          onClick={() => handleRoleChange(profile)}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-start space-x-2.5 transition ${
                            currentUser.id === profile.id
                              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#16243e]'
                          }`}
                        >
                          <User className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 truncate">
                            <div className="font-semibold truncate">{profile.fullName}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              {profile.role} • {profile.department}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="px-3 py-2 border-t border-slate-100 dark:border-[#1e2f5b] bg-slate-50 dark:bg-[#0f172a]">
                      <Link
                        href="/settings"
                        onClick={() => setShowRoleMenu(false)}
                        className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline block text-center"
                      >
                        Profile & Security Preferences
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Resetting Demo Data */}
      <ResetDemoModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleConfirmReset}
        isResetting={isResetting}
      />

      {/* Plain-Language Terminology Guide Modal */}
      <TerminologyModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </>
  );
}
