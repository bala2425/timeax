import React, { useState, useEffect } from 'react';
import { Clock, Flame, ShieldAlert, LogOut, User as UserIcon, Calendar, Menu, X } from 'lucide-react';

interface NavbarProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Navbar({ user, activeTab, setActiveTab, onLogout }: NavbarProps) {
  const [time, setTime] = useState(new Date());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hr = time.getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    if (hr < 21) return 'Good evening';
    return 'Good night';
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'routine', label: 'Routines' },
    { id: 'screen', label: 'Screen Time' },
    { id: 'journal', label: 'Diary & Reflection' },
    { id: 'chatbot', label: 'TIMEX AI' },
    { id: 'analytics', label: 'Reports' },
    { id: 'profile', label: 'Passport' }
  ];

  if (user && user.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Hub' });
  }

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <nav className="sticky top-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="p-2 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl shadow-lg shadow-orange-500/20">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 block">TIMEX</span>
            <span className="text-[10px] font-medium tracking-widest text-slate-500 uppercase">Time Experience</span>
          </div>
        </div>

        {/* Live Clock & Contextual Welcome (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
          <div className="flex items-center gap-2 border-r border-white/5 pr-4">
            <Clock className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-sm font-mono font-semibold text-white w-24 tracking-wider">{timeStr}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{dateStr}</span>
          </div>
          <div className="text-xs text-slate-300 font-medium pl-2 border-l border-white/5">
            {getGreeting()}, <span className="text-white font-semibold">{user?.fullName || 'Explorer'}</span>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* User Badge & Logout */}
        <div className="hidden md:flex items-center gap-4">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold">
            <Flame className="w-4 h-4 fill-orange-500/20 animate-pulse" />
            <span>{user?.streak || 0}d Streak</span>
          </div>

          {/* User Profile Thumbnail */}
          <div className="flex items-center gap-2">
            <img
              src={user?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
              alt="Profile"
              className="w-9 h-9 rounded-xl object-cover border-2 border-orange-500/20"
            />
            <button
              onClick={onLogout}
              title="Logout session"
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>{user?.streak || 0}d</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0A0B] border-b border-white/5 px-6 py-4 space-y-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-mono font-bold text-white">{timeStr}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">{dateStr}</span>
          </div>
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={user?.profilePicture}
                alt="Profile"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-xs font-semibold text-slate-300">{user?.fullName}</span>
            </div>
            <button
              onClick={() => {
                onLogout();
                setMobileOpen(false);
              }}
              className="text-xs text-rose-400 font-semibold hover:underline flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
