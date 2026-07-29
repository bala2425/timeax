import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Trash2, Plus, Clock, Target, Calendar } from 'lucide-react';

interface RoutineTrackerProps {
  user: any;
  onRefreshDashboard: () => void;
}

export default function RoutineTracker({ user, onRefreshDashboard }: RoutineTrackerProps) {
  const [routines, setRoutines] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [newRoutine, setNewRoutine] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Load items based on selected date
  const loadItems = async () => {
    try {
      // Get routines
      const rtRes = await fetch(`/api/routines?userId=${user.id}&date=${selectedDate}`);
      if (rtRes.ok) {
        const rtData = await rtRes.json();
        setRoutines(rtData);
      }

      // Get goals
      const gRes = await fetch(`/api/goals?userId=${user.id}&date=${selectedDate}`);
      if (gRes.ok) {
        const gData = await gRes.json();
        setGoals(gData);
      }
    } catch (e) {
      console.error('Failed to load tasks', e);
    }
  };

  useEffect(() => {
    loadItems();
  }, [user.id, selectedDate]);

  const handleToggleRoutine = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/routines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      if (res.ok) {
        setRoutines(prev => prev.map(r => r.id === id ? { ...r, completed: !currentStatus, completedAt: !currentStatus ? new Date().toISOString() : undefined } : r));
        onRefreshDashboard();
      }
    } catch (e) {
      console.error('Toggle routine failed', e);
    }
  };

  const handleAddRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutine.trim()) return;

    try {
      const res = await fetch('/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, date: selectedDate, title: newRoutine.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setRoutines(prev => [...prev, data]);
        setNewRoutine('');
        onRefreshDashboard();
      }
    } catch (e) {
      console.error('Failed to add custom routine task', e);
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    try {
      const res = await fetch(`/api/routines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRoutines(prev => prev.filter(r => r.id !== id));
        onRefreshDashboard();
      }
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  // Goal Planner Functions
  const handleToggleGoal = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      if (res.ok) {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !currentStatus } : g));
        onRefreshDashboard();
      }
    } catch (e) {
      console.error('Toggle goal failed', e);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, date: selectedDate, title: newGoal.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setGoals(prev => [...prev, data]);
        setNewGoal('');
        onRefreshDashboard();
      }
    } catch (e) {
      console.error('Failed to add goal', e);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGoals(prev => prev.filter(g => g.id !== id));
        onRefreshDashboard();
      }
    } catch (e) {
      console.error('Delete goal failed', e);
    }
  };

  // Calculations
  const completedRoutines = routines.filter(r => r.completed).length;
  const totalRoutines = routines.length;
  const routinePercentage = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const goalPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
      {/* Date Picker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/5">
        <div>
          <h2 className="text-2xl font-black text-white">Daily Tasks & Goals Checklist</h2>
          <p className="text-xs text-slate-400 mt-1">Select any date to view historical checklists or log today's focus points.</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-orange-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none text-sm font-semibold cursor-pointer"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* SECTION 1: ROUTINES TRACKER */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/5 border border-white/5 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-white">1. Daily Routines Checklist</h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
              {routinePercentage}% Completed
            </div>
          </div>

          {/* Form to add custom habits */}
          <form onSubmit={handleAddRoutine} className="flex gap-2">
            <input
              type="text"
              value={newRoutine}
              onChange={e => setNewRoutine(e.target.value)}
              placeholder="Add a custom routine habit... (e.g. Code for 2 hours)"
              className="flex-1 bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          {/* List of routines */}
          <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {routines.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">No routines set for this date. Click 'Add' or select another date.</div>
            ) : (
              routines.map(rt => (
                <div
                  key={rt.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    rt.completed 
                      ? 'bg-white/5 border-white/5 opacity-75' 
                      : 'bg-white/5 border-white/10 hover:border-orange-500/40'
                  }`}
                >
                  <div 
                    onClick={() => handleToggleRoutine(rt.id, rt.completed)}
                    className="flex items-center gap-3.5 flex-1 cursor-pointer"
                  >
                    {rt.completed ? (
                      <CheckSquare className="w-5 h-5 text-orange-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 shrink-0 hover:text-orange-400" />
                    )}
                    <div className="space-y-1">
                      <span className={`text-sm font-medium ${rt.completed ? 'text-slate-500 line-through' : 'text-slate-250'}`}>
                        {rt.title}
                      </span>
                      {rt.completedAt && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" />
                          Logged at {new Date(rt.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteRoutine(rt.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900/50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION 2: GOALS PLANNER */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-white">2. Daily Goal Planner</h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
              {goalPercentage}% Complete
            </div>
          </div>

          {/* Goal progress indicator */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-neutral-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-orange-500 transition-all duration-500"
                  strokeDasharray={`${goalPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-250">
                {goalPercentage}%
              </span>
            </div>
            <div>
              <span className="block text-xs uppercase font-bold text-slate-500 tracking-wider">Today's Focus Status</span>
              <p className="text-xs text-slate-300 mt-0.5">
                {completedGoals} of {totalGoals} target achievements logged as complete.
              </p>
            </div>
          </div>

          {/* Goal Form */}
          <form onSubmit={handleAddGoal} className="flex gap-2">
            <input
              type="text"
              value={newGoal}
              onChange={e => setNewGoal(e.target.value)}
              placeholder="Target milestone..."
              className="flex-1 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center gap-0.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>

          {/* Goals List */}
          <div className="space-y-2">
            {goals.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">No goals listed. Add your first goal above.</div>
            ) : (
              goals.map(g => (
                <div
                  key={g.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    g.completed
                      ? 'bg-white/5 border-white/5 opacity-75'
                      : 'bg-white/5 border-white/10 hover:border-orange-500/40'
                  }`}
                >
                  <div
                    onClick={() => handleToggleGoal(g.id, g.completed)}
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={g.completed}
                      className="w-4.5 h-4.5 text-orange-500 bg-[#0A0A0B] border-white/10 rounded focus:ring-orange-500"
                    />
                    <span className={`text-xs font-medium ${g.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                      {g.title}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(g.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
