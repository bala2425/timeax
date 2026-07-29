import React, { useState, useEffect } from 'react';
import { Shield, Users, MessageSquare, Quote, Bell, Trash2, Plus, Send, CheckCircle, Clock } from 'lucide-react';

interface AdminPanelProps {
  user: any;
  onSendSystemNotification: (notif: { title: string; message: string }) => void;
}

export default function AdminPanel({ user, onSendSystemNotification }: AdminPanelProps) {
  const [subTab, setSubTab] = useState<'users' | 'quotes' | 'feedback' | 'chats' | 'notifications'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);

  // Add custom quotes states
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');

  // Notification broadcast state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  const [notif, setNotif] = useState('');

  const loadAdminData = async () => {
    try {
      const resUsers = await fetch('/api/admin/users');
      const resQuotes = await fetch('/api/quotes');
      const resFeedback = await fetch('/api/feedback');
      const resChats = await fetch('/api/admin/chats');

      if (resUsers.ok) setUsers(await resUsers.json());
      if (resQuotes.ok) setQuotes(await resQuotes.json());
      if (resFeedback.ok) setFeedback(await resFeedback.json());
      if (resChats.ok) setChats(await resChats.json());
    } catch (e) {
      console.error('Error fetching admin panels', e);
    }
  };

  useEffect(() => {
    if (user.role === 'admin') {
      loadAdminData();
    }
  }, [user.role, subTab]);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Delete this user workspace profile permanently?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        setNotif('User record erased successfully.');
        setTimeout(() => setNotif(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newQuoteText.trim(), author: newQuoteAuthor.trim() || 'Unknown' })
      });
      if (res.ok) {
        const data = await res.json();
        setQuotes(prev => [...prev, data]);
        setNewQuoteText('');
        setNewQuoteAuthor('');
        setNotif('Motivational Quote added successfully!');
        setTimeout(() => setNotif(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuotes(prev => prev.filter(q => q.id !== id));
        setNotif('Quote removed.');
        setTimeout(() => setNotif(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    onSendSystemNotification({
      title: notifTitle.trim(),
      message: notifMessage.trim()
    });

    setNotifTitle('');
    setNotifMessage('');
    setNotif('Global alert notification broadcasted!');
    setTimeout(() => setNotif(''), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/5">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-orange-500" />
            TIMEX System Control Tower
          </h2>
          <p className="text-xs text-slate-400 mt-1">Superuser terminal dashboard. Audit registered user ledger tables, manage quotes, and trigger broadcast alerts.</p>
        </div>
      </div>

      {/* Save Notification banner */}
      {notif && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {notif}
        </div>
      )}

      {/* Admin Sub-Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
        <button
          onClick={() => setSubTab('users')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase ${
            subTab === 'users' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Users List ({users.length})
        </button>
        <button
          onClick={() => setSubTab('quotes')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase ${
            subTab === 'quotes' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Quote className="w-4 h-4" /> Manage Quotes ({quotes.length})
        </button>
        <button
          onClick={() => setSubTab('feedback')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase ${
            subTab === 'feedback' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Feedback desk ({feedback.length})
        </button>
        <button
          onClick={() => setSubTab('chats')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase ${
            subTab === 'chats' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Telemetry Logs ({chats.length})
        </button>
        <button
          onClick={() => setSubTab('notifications')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase ${
            subTab === 'notifications' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" /> Alert Broadcast
        </button>
      </div>

      {/* SUB-PANEL CONTENTS */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/5 shadow-xl min-h-[400px]">
        {subTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Registered Workspace Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Occupation</th>
                    <th className="py-3 px-4">Streak</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-100">{u.fullName}</td>
                      <td className="py-3.5 px-4 text-slate-400">@{u.username}</td>
                      <td className="py-3.5 px-4">{u.email}</td>
                      <td className="py-3.5 px-4 text-slate-400">{u.occupation || 'Explorer'}</td>
                      <td className="py-3.5 px-4 text-orange-400 font-bold">{u.streak} Days</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'admin' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' : 'bg-white/5 text-slate-400'
                        }`}>{u.role}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {u.id !== user.id ? (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Protected Self</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {subTab === 'quotes' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left side: Add quote form */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 h-fit">
              <h4 className="text-sm font-bold text-white">Add System Motivational Quote</h4>
              <form onSubmit={handleAddQuote} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Quote Text</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Consistency beats motivation..."
                    value={newQuoteText}
                    onChange={e => setNewQuoteText(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Author Name</label>
                  <input
                    type="text"
                    placeholder="James Clear"
                    value={newQuoteAuthor}
                    onChange={e => setNewQuoteAuthor(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Inject Quote
                </button>
              </form>
            </div>

            {/* Right side: List of active quotes */}
            <div className="lg:col-span-2 space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2">Active Quotes Carousel Repository</h4>
              {quotes.map(q => (
                <div key={q.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center gap-4">
                  <div>
                    <p className="text-xs italic text-slate-200">"{q.text}"</p>
                    <span className="block text-[10px] text-orange-400 font-bold uppercase mt-1.5">— {q.author}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteQuote(q.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {subTab === 'feedback' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">User Review Feedback desk</h3>
            <div className="space-y-3">
              {feedback.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">No feedback has been recorded from system users.</div>
              ) : (
                feedback.map(fb => (
                  <div key={fb.id} className="p-4 rounded-xl bg-[#0A0A0B] border border-white/10 space-y-2">
                    <p className="text-xs text-slate-300">"{fb.text}"</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="font-bold text-orange-400">@{fb.username}</span>
                      <span>•</span>
                      <span>{fb.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {subTab === 'chats' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Workspace Chatbot History Audit</h3>
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {chats.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">No chatbot interactions recorded yet.</div>
              ) : (
                chats.map(c => (
                  <div key={c.id} className="p-4 rounded-xl bg-[#0A0A0B] border border-white/10 flex justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                        c.sender === 'user' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                      }`}>
                        {c.sender}
                      </span>
                      <p className="text-xs text-slate-200 pt-1 leading-relaxed">{c.message}</p>
                    </div>
                    <span className="text-[9px] text-slate-600 font-mono shrink-0">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {subTab === 'notifications' && (
          <div className="max-w-xl mx-auto p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
            <div className="text-center">
              <Bell className="w-10 h-10 text-orange-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Create Workspace Alert Banner</h4>
              <p className="text-xs text-slate-500">Broadcasting will trigger a banner alert across all active user views.</p>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Notification Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Maintenance Alert"
                  value={notifTitle}
                  onChange={e => setNotifTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Alert message body</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. We will be updating the server telemetry databases on July 6th at 2:00 AM UTC. Please save your daily reflections..."
                  value={notifMessage}
                  onChange={e => setNotifMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                Broadcast Global Alert <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
