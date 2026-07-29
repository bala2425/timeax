import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, TrendingUp, AlertCircle, Plus, Sparkles, PieChart, BarChart2 } from 'lucide-react';

interface ScreenTimeTrackerProps {
  user: any;
  onRefreshDashboard: () => void;
}

const CATEGORIES = [
  'Study', 'Work', 'Coding', 'Entertainment', 'Social Media', 'Gaming', 'YouTube', 'Movies', 'Other'
] as const;

export default function ScreenTimeTracker({ user, onRefreshDashboard }: ScreenTimeTrackerProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [mobile, setMobile] = useState('');
  const [desktop, setDesktop] = useState('');
  const [purpose, setPurpose] = useState<typeof CATEGORIES[number]>('Coding');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [aiAdvice, setAiAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const loadRecords = async () => {
    try {
      const res = await fetch(`/api/screen-time?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (e) {
      console.error('Failed to load screen times', e);
    }
  };

  const loadAIAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const res = await fetch(`/api/ai-suggestions?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setAiAdvice(data.suggestion);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAdvice(false);
    }
  };

  useEffect(() => {
    loadRecords();
    loadAIAdvice();
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile && !desktop) return;

    try {
      const res = await fetch('/api/screen-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          date: selectedDate,
          mobile: Number(mobile) || 0,
          desktop: Number(desktop) || 0,
          purpose
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRecords(prev => [...prev, data]);
        setMobile('');
        setDesktop('');
        loadAIAdvice();
        onRefreshDashboard();
      }
    } catch (err) {
      console.error('Failed to save screen record', err);
    }
  };

  // Calculations
  const totalMobile = records.reduce((sum, r) => sum + r.mobile, 0);
  const totalDesktop = records.reduce((sum, r) => sum + r.desktop, 0);
  const grandTotal = totalMobile + totalDesktop;

  // Productive Purpose = Coding, Study, Work
  const productiveMins = records
    .filter(r => ['Coding', 'Study', 'Work'].includes(r.purpose))
    .reduce((sum, r) => sum + r.mobile + r.desktop, 0);

  const wastedMins = grandTotal - productiveMins;

  // Category summary map
  const catSummary = records.reduce((acc: Record<string, number>, r) => {
    acc[r.purpose] = (acc[r.purpose] || 0) + r.mobile + r.desktop;
    return acc;
  }, {});

  let highestCategory = 'None';
  let highestVal = 0;
  Object.keys(catSummary).forEach(cat => {
    if (catSummary[cat] > highestVal) {
      highestVal = catSummary[cat];
      highestCategory = cat;
    }
  });

  // Calculate Highs and Lows based on daily totals
  const dailyTotals = records.reduce((acc: Record<string, number>, r) => {
    acc[r.date] = (acc[r.date] || 0) + r.mobile + r.desktop;
    return acc;
  }, {});

  let lowestDayStr = 'N/A';
  let lowestDayVal = Infinity;
  let highestDayStr = 'N/A';
  let highestDayVal = 0;

  Object.keys(dailyTotals).forEach(d => {
    const val = dailyTotals[d];
    if (val < lowestDayVal) {
      lowestDayVal = val;
      lowestDayStr = d;
    }
    if (val > highestDayVal) {
      highestDayVal = val;
      highestDayStr = d;
    }
  });

  if (lowestDayVal === Infinity) lowestDayVal = 0;

  // Generate dataset for SVG bar chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const total = dailyTotals[dateStr] || 0;
    return {
      date: dateStr,
      displayDate: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      total
    };
  }).reverse();

  const maxDailyVal = Math.max(...last7Days.map(d => d.total), 120);

  return (
    <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
      {/* Intro Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white">Screen Time Log & Analytics</h2>
        <p className="text-slate-400 text-xs mt-1">Regulate your digital attention. Balance productive deep work (coding/studying) against low-attention distractions.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-center shadow-md">
          <span className="text-2xl font-black text-white">{grandTotal}m</span>
          <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-1">Total Screen Time</span>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-center shadow-md">
          <span className="text-2xl font-black text-orange-400">{productiveMins}m</span>
          <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-1">Productive Time</span>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-center shadow-md">
          <span className="text-2xl font-black text-rose-400">{wastedMins}m</span>
          <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-1">Recreational Time</span>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-center shadow-md">
          <span className="text-lg font-extrabold text-orange-400 line-clamp-1">{highestCategory}</span>
          <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-1">Most Used Category</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Log Input Panel */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Plus className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold text-white">Log Active Screen Block</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Date</label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mobile (mins)</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-slate-100 placeholder-slate-600 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Desktop (mins)</label>
                <div className="relative">
                  <Monitor className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={desktop}
                    onChange={e => setDesktop(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-slate-100 placeholder-slate-600 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Purpose Category</label>
              <select
                value={purpose}
                onChange={e => setPurpose(e.target.value as any)}
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-[#0A0A0B]">{cat}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Log Active Time Block
            </button>
          </form>

          {/* Highs & Lows Analytics */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
            <span className="block text-xs uppercase font-bold text-slate-500 tracking-wider">Screen Extremes</span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Lowest Tracked Day</span>
              <span className="font-semibold text-orange-400">{lowestDayStr !== 'N/A' ? `${lowestDayVal} mins (${lowestDayStr})` : 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
              <span className="text-slate-400">Highest Tracked Day</span>
              <span className="font-semibold text-rose-400">{highestDayStr !== 'N/A' ? `${highestDayVal} mins (${highestDayStr})` : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Analytics Display Panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Beautiful Custom SVG Chart */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-bold text-white">Weekly Screen Time Distribution</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Daily combined minutes</span>
            </div>

            {/* Custom Responsive SVG Bar Chart */}
            <div className="relative h-64 w-full flex items-end justify-between px-4 pt-6 pb-2 border-b border-l border-white/10">
              {last7Days.map((d, index) => {
                const heightPercentage = Math.max(8, (d.total / maxDailyVal) * 80); // cap to fit SVG cleanly
                return (
                  <div key={index} className="flex flex-col items-center flex-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-[#0A0A0B] text-white text-[10px] font-bold px-2 py-1 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {d.total} mins
                    </div>
                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercentage}%` }}
                      className="w-8 rounded-t bg-gradient-to-t from-orange-600 to-rose-500 group-hover:from-orange-500 group-hover:to-rose-400 transition-all duration-300 shadow-lg shadow-orange-600/10 cursor-pointer"
                    ></div>
                    {/* Label */}
                    <span className="text-[10px] text-slate-500 font-medium mt-3">{d.displayDate}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Suggestions Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900/40 to-orange-950/20 border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-2 text-orange-400 mb-4 animate-pulse">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase tracking-widest">TIMEX AI Guard</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Personalized Habits Advice</h3>

            {loadingAdvice ? (
              <div className="space-y-2 py-4">
                <div className="h-3 bg-white/5 rounded animate-pulse w-4/5"></div>
                <div className="h-3 bg-white/5 rounded animate-pulse w-5/6"></div>
              </div>
            ) : (
              <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
                {aiAdvice || "Log screen records to calculate precise habits coaching insights."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
