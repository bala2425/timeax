import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import RoutineTracker from './components/RoutineTracker';
import ScreenTimeTracker from './components/ScreenTimeTracker';
import JournalReflection from './components/JournalReflection';
import AIChatbot from './components/AIChatbot';
import AnalyticsView from './components/AnalyticsView';
import UserProfile from './components/UserProfile';
import AdminPanel from './components/AdminPanel';
import { Bell, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Global Alert notifications system
  const [systemAlert, setSystemAlert] = useState<{ title: string; message: string } | null>(null);

  // Check if token exists in localStorage on mount to auto-login
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('timex_token');
      if (token) {
        try {
          const res = await fetch('/api/user/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            localStorage.removeItem('timex_token');
          }
        } catch (e) {
          console.error('Auto login check failed', e);
        }
      }
    };
    checkToken();
  }, []);

  const handleLoginSuccess = (userData: any, token: string) => {
    localStorage.setItem('timex_token', token);
    setUser(userData);
    setShowAuthModal(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('timex_token');
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser);
  };

  const handleRefreshDashboard = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSendSystemNotification = (alert: { title: string; message: string }) => {
    setSystemAlert(alert);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 selection:bg-orange-500 selection:text-white font-sans antialiased relative">
      {/* Background Ambient Orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Global alert banner broadcasted by the admin */}
      {systemAlert && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-neutral-900/95 border-2 border-orange-500 rounded-2xl p-4 shadow-2xl z-50 animate-fade-in flex gap-3.5 items-start">
          <Bell className="w-5 h-5 text-orange-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-black text-white">{systemAlert.title}</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">{systemAlert.message}</p>
          </div>
          <button
            onClick={() => setSystemAlert(null)}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {user ? (
        /* LOGGED IN WORKSPACE */
        <div className="flex flex-col min-h-screen">
          <Navbar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
          />
          
          <main className="flex-1 pb-16">
            {activeTab === 'dashboard' && (
              <Dashboard
                user={user}
                refreshTrigger={refreshTrigger}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'routine' && (
              <RoutineTracker
                user={user}
                onRefreshDashboard={handleRefreshDashboard}
              />
            )}
            {activeTab === 'screen' && (
              <ScreenTimeTracker
                user={user}
                onRefreshDashboard={handleRefreshDashboard}
              />
            )}
            {activeTab === 'journal' && (
              <JournalReflection
                user={user}
                onRefreshDashboard={handleRefreshDashboard}
              />
            )}
            {activeTab === 'chatbot' && (
              <AIChatbot user={user} />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsView user={user} />
            )}
            {activeTab === 'profile' && (
              <UserProfile
                user={user}
                onUpdateUser={handleUpdateUser}
                onLogout={handleLogout}
              />
            )}
            {activeTab === 'admin' && user.role === 'admin' && (
              <AdminPanel
                user={user}
                onSendSystemNotification={handleSendSystemNotification}
              />
            )}
          </main>
        </div>
      ) : (
        /* VISITOR LANDING PORTAL */
        <>
          <LandingPage
            onGetStarted={() => {
              setAuthMode('register');
              setShowAuthModal(true);
            }}
            onLoginClick={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
          />
          {showAuthModal && (
            <AuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onSuccess={handleLoginSuccess}
              defaultMode={authMode}
            />
          )}
        </>
      )}
    </div>
  );
}
