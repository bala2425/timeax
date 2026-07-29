import React, { useState, useEffect } from 'react';
import { CheckSquare, Smartphone, Monitor, Book, Brain, Flame, Sparkles, TrendingUp, Compass, Smile, Calendar, Plus } from 'lucide-react';

interface DashboardProps {
  user: any;
  setActiveTab: (tab: string) => void;
  refreshTrigger: number;
}

export default function Dashboard({ user, setActiveTab, refreshTrigger }: DashboardProps) {
  const [routines, setRoutines] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [screenTimes, setScreenTimes] = useState<any[]>([]);
  const [reflections, setReflections] = useState<any[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [loadingSuggestion, setLoadingSuggestion] = useState<boolean>(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch routines for today
        const rtRes = await fetch(`/api/routines?userId=${user.id}&date=${todayStr}`);
        if (rtRes.ok) {
          const rtData = await rtRes.json();
          setRoutines(rtData);
        }

        // Fetch goals for today
        const gRes = await fetch(`/api/goals?userId=${user.id}&date=${todayStr}`);
        if (gRes.ok) {
          const gData = await gRes.json();
          setGoals(gData);
        }

        // Fetch screen time for today
        const stRes = await fetch(`/api/screen-time?userId=${user.id}`);
        if (stRes.ok) {
          const stData = await stRes.json();
          setScreenTimes(stData.filter((r: any) => r.date === todayStr));
        }

        // Fetch reflections to check mood
        const refRes = await fetch(`/api/reflections?userId=${user.id}`);
        if (refRes.ok) {
          const refData = await refRes.json();
          setReflections(refData.filter((r: any) => r.date === todayStr));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      }
    };

    fetchData();
  }, [user.id, todayStr, refreshTrigger]);

  // Fetch AI suggestion once on load or when screenTimes change
  useEffect(() => {
    const fetchSuggestion = async () => {
      setLoadingSuggestion(true);
      try {
        const res = await fetch(`/api/ai-suggestions?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setAiSuggestion(data.suggestion);
        }
      } catch (e) {
        console.error('Failed to load AI screen advice', e);
      } finally {
        setLoadingSuggestion(false);
      }
    };
    fetchSuggestion();
  }, [user.id, refreshTrigger]);

  // Calculations for today's percentages
  const totalRoutines = routines.length;
  const completedRoutines = routines.filter(r => r.completed).length;
  const routinePct = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const goalPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Screen time totals for today
  const totalMobile = screenTimes.reduce((sum, r) => sum + r.mobile, 0);
  const totalDesktop = screenTimes.reduce((sum, r) => sum + r.desktop, 0);
  const totalScreen = totalMobile + totalDesktop;

  const productiveScreenTime = screenTimes
    .filter(r => ['Coding', 'Study', 'Work'].includes(r.purpose))
    .reduce((sum, r) => sum + r.mobile + r.desktop, 0);

  const unproductiveScreenTime = screenTimes
    .filter(r => ['Entertainment', 'Social Media', 'Gaming', 'Movies'].includes(r.purpose))
    .reduce((sum, r) => sum + r.mobile + r.desktop, 0);

  // Overall productivity rating calculation
  const routineWeight = 0.5;
  const goalWeight = 0.3;
  const screenTimeRatio = totalScreen > 0 ? Math.min(1, productiveScreenTime / totalScreen) : 0.8;
  const rawScore = (routinePct * routineWeight) + (goalPct * 100 * goalWeight) + (screenTimeRatio * 100 * 0.2);
  const productivityScore = Math.min(100, Math.max(30, Math.round(rawScore || 70)));

  const currentMoodObj = reflections[0] || null;

  // Random placeholder motivator if AI is thinking
  const randomMantra = [
    "Lost time is never found again. Prioritize deep work.",
    "Small daily habits trigger monumental year-end compounding.",
    "Discipline beats pure motivation every single time.",
    "A 30-minute block of reading beats 3 hours of doomscrolling."
  ];

  return (
    <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900/40 via-orange-950/10 to-[#0A0A0B] border border-white/5 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Studio Engine is Live</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Hello, {user.fullName}! Let's Master Time.
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            Your metrics look consistent today. You completed <span className="text-orange-400 font-bold">{completedRoutines} of {totalRoutines}</span> habits and maintained a perfect <span className="text-orange-400 font-bold">{user.streak} days streak</span>!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="text-center">
            <span className="block text-2xl font-black text-orange-400">{productivityScore}%</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Productivity Rating</span>
          </div>
          <div className="w-px h-10 bg-white/5"></div>
          <div className="text-center">
            <span className="block text-2xl font-black text-orange-400">{user.streak}d</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current Streak</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card: Today's Routine checklist overview */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg group">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-400">
                <CheckSquare className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold text-orange-400">{routinePct}% Done</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-1">Today's Routines</h3>
            <p className="text-slate-400 text-xs mb-4">Micro-disciplines checked off</p>

            {/* Quick checklist list */}
            <div className="space-y-2 mb-6">
              {routines.slice(0, 3).map((rt, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  <span className={`w-2 h-2 rounded-full ${rt.completed ? 'bg-orange-500 animate-pulse' : 'bg-slate-700'}`}></span>
                  <span className={rt.completed ? 'text-slate-500 line-through' : 'text-slate-300'}>{rt.title}</span>
                </div>
              ))}
              {routines.length > 3 && (
                <div className="text-[11px] text-orange-400 font-medium cursor-pointer" onClick={() => setActiveTab('routine')}>
                  + {routines.length - 3} more habits pending completion...
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('routine')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 font-semibold text-xs tracking-wide transition-all cursor-pointer"
          >
            Manage Routines
          </button>
        </div>

        {/* Card: Screen Time Tracker overview */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
                <Smartphone className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold text-rose-400">{totalScreen} mins logged</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-1">Screen Time</h3>
            <p className="text-slate-400 text-xs mb-4">Mobile & Desktop analytics balance</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                <Smartphone className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                <span className="block text-sm font-extrabold text-slate-200">{totalMobile}m</span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Mobile</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                <Monitor className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                <span className="block text-sm font-extrabold text-slate-200">{totalDesktop}m</span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Desktop</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('screen')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 font-semibold text-xs tracking-wide transition-all cursor-pointer"
          >
            Screen Time Tracker
          </button>
        </div>

        {/* Card: Daily Goal Planner */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                <Compass className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold text-amber-400">{goalPct}% Complete</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-1">Today's Goals</h3>
            <p className="text-slate-400 text-xs mb-4">Core achievements planner</p>

            <div className="space-y-2 mb-6">
              {goals.length === 0 ? (
                <div className="text-xs text-slate-500 py-2">No goals recorded yet for today.</div>
              ) : (
                goals.slice(0, 3).map((g, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    <input 
                      type="checkbox" 
                      readOnly 
                      checked={g.completed} 
                      className="w-3.5 h-3.5 rounded border-white/10 text-orange-500 focus:ring-orange-500 bg-[#0A0A0B]"
                    />
                    <span className={g.completed ? 'text-slate-500 line-through' : 'text-slate-300'}>{g.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('routine')} // Goals is managed alongside checklists
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 font-semibold text-xs tracking-wide transition-all cursor-pointer"
          >
            Manage Goals
          </button>
        </div>
      </div>

      {/* AI SUGGESTIONS BAR & MOOD CONSOLE */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Dynamic AI Suggestions Panel */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-neutral-900/40 to-orange-950/20 border border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl"></div>
          <div>
            <div className="flex items-center gap-2 text-orange-400 mb-4 animate-pulse">
              <Brain className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase tracking-widest">TIMEX AI Live Recommendation</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Screen Reduction Advice</h3>
            
            {loadingSuggestion ? (
              <div className="space-y-2 py-4">
                <div className="h-3 bg-white/5 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-white/5 rounded animate-pulse w-5/6"></div>
                <div className="h-3 bg-white/5 rounded animate-pulse w-1/2"></div>
              </div>
            ) : (
              <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap py-2">
                {aiSuggestion || "• Complete today's learning diary to unlock personalized context recommendations.\n• Set a 45-minute social media restriction on your mobile device."}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
            <span className="text-[10px] text-slate-500 font-medium">Real-time computation powered by Gemini</span>
            <button
              onClick={() => setActiveTab('chatbot')}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Ask Chatbot <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mood Card */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg text-center">
          <div>
            <span className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-400 w-fit mx-auto block mb-4 animate-bounce">
              <Smile className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-100 mb-1">Mood & Reflection</h3>
            <p className="text-slate-400 text-xs mb-6">Today's psychological energy</p>

            {currentMoodObj ? (
              <div className="space-y-3">
                <span className="text-5xl block">{currentMoodObj.mood}</span>
                <span className="block text-xs font-semibold text-slate-300">
                  Rating: <span className="text-orange-400 font-bold">{"⭐".repeat(currentMoodObj.productivityRating)}</span>
                </span>
                <p className="text-[11px] text-slate-500 italic max-w-xs mx-auto overflow-hidden text-ellipsis whitespace-nowrap">
                  "{currentMoodObj.happinessFactors || 'Healthy and productive!'}"
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <span className="text-4xl block text-slate-600">😐</span>
                <p className="text-xs text-slate-500">You haven't recorded your diary reflection today.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('journal')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 font-semibold text-xs tracking-wide transition-all cursor-pointer"
          >
            Reflect on Today
          </button>
        </div>
      </div>

      {/* TIMEX Time Value Quote */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center">
        <p className="text-sm italic font-serif text-slate-400">
          "Consistency beats motivation. Small daily improvements create extraordinary results."
        </p>
      </div>
    </div>
  );
}
