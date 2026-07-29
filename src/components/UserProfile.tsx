import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, Award, Flame, Download, Key, Shield, Trash2, CheckCircle } from 'lucide-react';

interface UserProfileProps {
  user: any;
  onUpdateUser: (updatedUser: any) => void;
  onLogout: () => void;
}

export default function UserProfile({ user, onUpdateUser, onLogout }: UserProfileProps) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName || '');
  const [username, setUsername] = useState(user.username || '');
  const [mobile, setMobile] = useState(user.mobile || '');
  const [occupation, setOccupation] = useState(user.occupation || '');
  const [schoolCompany, setSchoolCompany] = useState(user.schoolCompany || '');
  
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [notif, setNotif] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, mobile, occupation, schoolCompany })
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateUser(data);
        setEditing(false);
        setNotif('Profile passport updated successfully!');
        setTimeout(() => setNotif(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    try {
      const res = await fetch(`/api/user/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      if (res.ok) {
        setNewPassword('');
        setChangingPassword(false);
        setNotif('Security code/password updated successfully!');
        setTimeout(() => setNotif(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportData = async () => {
    try {
      const resRoutines = await fetch(`/api/routines?userId=${user.id}&date=2026-07-05`); // mock date
      const resScreen = await fetch(`/api/screen-time?userId=${user.id}`);
      const resJournals = await fetch(`/api/journals?userId=${user.id}`);
      const resReflections = await fetch(`/api/reflections?userId=${user.id}`);

      const routines = resRoutines.ok ? await resRoutines.json() : [];
      const screenTime = resScreen.ok ? await resScreen.json() : [];
      const journals = resJournals.ok ? await resJournals.json() : [];
      const reflections = resReflections.ok ? await resReflections.json() : [];

      const exportObj = {
        profile: user,
        routines,
        screenTime,
        journals,
        reflections,
        exportedAt: new Date().toISOString()
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `timex-profile-export-${user.username}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setNotif('All focus & habits data exported as JSON!');
      setTimeout(() => setNotif(''), 3000);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: Are you absolutely sure you want to delete your TIMEX workspace? This is irreversible.')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        onLogout();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in p-6 max-w-4xl mx-auto">
      {/* Notifications banner */}
      {notif && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {notif}
        </div>
      )}

      {/* Profile Card Container */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Stats */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto">
            <img
              src={user.profilePicture}
              alt="Avatar"
              className="w-full h-full rounded-2xl object-cover border-4 border-white/10 shadow-xl"
            />
            <span className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-xl border-4 border-[#0A0A0B] shadow-md">
              <Flame className="w-4 h-4 fill-white" />
            </span>
          </div>

          <div>
            <h3 className="text-xl font-black text-white">{user.fullName}</h3>
            <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">@{user.username}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
            <div className="bg-[#0A0A0B]/80 p-3 rounded-xl border border-white/10">
              <span className="block text-xl font-bold text-orange-400">{user.streak}d</span>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Current Streak</span>
            </div>
            <div className="bg-[#0A0A0B]/80 p-3 rounded-xl border border-white/10">
              <span className="block text-xl font-bold text-orange-450">{user.productivityScore}%</span>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Productivity Score</span>
            </div>
          </div>
        </div>

        {/* Right Column: Passport details / forms */}
        <div className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/5 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-white">TIMEX User Passport</h3>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
            >
              {editing ? 'Cancel' : 'Edit Passport'}
            </button>
          </div>

          {editing ? (
            /* EDIT FORM */
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Full Name</label>
                  <input
                    type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Username</label>
                  <input
                    type="text" required value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Mobile Phone</label>
                  <input
                    type="text" value={mobile} onChange={e => setMobile(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Occupation</label>
                  <input
                    type="text" value={occupation} onChange={e => setOccupation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">School / College / Company</label>
                  <input
                    type="text" value={schoolCompany} onChange={e => setSchoolCompany(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow transition-colors cursor-pointer"
              >
                Save Passport Changes
              </button>
            </form>
          ) : (
            /* DISPLAY PASSPORT DETAILS */
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                  <Mail className="w-4.5 h-4.5 text-slate-500" />
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold uppercase">Email Address</span>
                    <span className="text-slate-200 font-medium">{user.email}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                  <Phone className="w-4.5 h-4.5 text-slate-500" />
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold uppercase">Phone Number</span>
                    <span className="text-slate-200 font-medium">{user.mobile || 'Not set'}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                  <Briefcase className="w-4.5 h-4.5 text-slate-500" />
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold uppercase">Occupation / Field</span>
                    <span className="text-slate-200 font-medium">{user.occupation || 'Explorer'}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                  <User className="w-4.5 h-4.5 text-slate-500" />
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold uppercase">Company / School</span>
                    <span className="text-slate-200 font-medium">{user.schoolCompany || 'TIMEX Member'}</span>
                  </div>
                </div>
              </div>

              {/* Achievements Badges list */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Unlocked Time Badges</span>
                <div className="flex flex-wrap gap-2">
                  {user.achievements?.map((ach: string) => (
                    <div
                      key={ach}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{ach}</span>
                    </div>
                  )) || <span className="text-xs text-slate-500">No achievement badges unlocked yet. Keep tracking!</span>}
                </div>
              </div>
            </div>
          )}

          {/* UTILITY ACTIONS ROW */}
          <div className="pt-6 border-t border-white/5 flex flex-wrap gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export TIMEX Ledger
            </button>

            <button
              onClick={() => setChangingPassword(!changingPassword)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 cursor-pointer"
            >
              <Key className="w-4 h-4" /> Change Security Code
            </button>

            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-300 cursor-pointer ml-auto"
            >
              <Trash2 className="w-4 h-4" /> Reset Workspace
            </button>
          </div>

          {/* Change password mini block */}
          {changingPassword && (
            <form onSubmit={handleChangePassword} className="bg-[#0A0A0B] p-4 rounded-xl border border-white/10 space-y-3 mt-4 animate-fade-in">
              <label className="block text-xs font-bold text-slate-400 uppercase">Set New Security Code / Password</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs"
                >
                  Commit Code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
