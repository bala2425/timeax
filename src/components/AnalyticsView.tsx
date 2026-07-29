import React, { useState, useEffect } from 'react';
import { AreaChart, Calendar, Award, FileText, Download, Printer, Brain, Compass, TrendingUp, CheckSquare, Clock } from 'lucide-react';

interface AnalyticsViewProps {
  user: any;
}

export default function AnalyticsView({ user }: AnalyticsViewProps) {
  const [activeRange, setActiveRange] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [routines, setRoutines] = useState<any[]>([]);
  const [screenTimes, setScreenTimes] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [reflections, setReflections] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resRt = await fetch(`/api/routines?userId=${user.id}&date=2026-07-05`); // load sample set
        const resSt = await fetch(`/api/screen-time?userId=${user.id}`);
        const resJr = await fetch(`/api/journals?userId=${user.id}`);
        const resRef = await fetch(`/api/reflections?userId=${user.id}`);

        if (resRt.ok) setRoutines(await resRt.json());
        if (resSt.ok) setScreenTimes(await resSt.json());
        if (resJr.ok) setJournals(await resJr.json());
        if (resRef.ok) setReflections(await resRef.json());
      } catch (e) {
        console.error('Failed to load analytics records', e);
      }
    };
    fetchData();
  }, [user.id]);

  // Calculations
  const totalScreen = screenTimes.reduce((sum, r) => sum + r.mobile + r.desktop, 0);
  const avgScreenTime = screenTimes.length > 0 ? Math.round(totalScreen / screenTimes.length) : 0;

  const productiveScreen = screenTimes
    .filter(r => ['Coding', 'Study', 'Work'].includes(r.purpose))
    .reduce((sum, r) => sum + r.mobile + r.desktop, 0);

  const routineCompletionRate = routines.length > 0 
    ? Math.round((routines.filter(r => r.completed).length / routines.length) * 100) 
    : 80;

  // Best/Worst Days calculation
  const dailyScreenTotals = screenTimes.reduce((acc: Record<string, number>, r) => {
    acc[r.date] = (acc[r.date] || 0) + r.mobile + r.desktop;
    return acc;
  }, {});

  let worstScreenTimeDay = 'N/A';
  let maxScreenVal = 0;
  Object.keys(dailyScreenTotals).forEach(d => {
    if (dailyScreenTotals[d] > maxScreenVal) {
      maxScreenVal = dailyScreenTotals[d];
      worstScreenTimeDay = d;
    }
  });

  // Export & Print actions
  const triggerPrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const reportContent = `
========================================
TIMEX PERFORMANCE REPORT - ${activeRange.toUpperCase()}
========================================
Generated For: ${user.fullName}
Date Generated: ${new Date().toLocaleDateString()}
Productivity Rating Score: ${user.productivityScore}%
Active Focus Streak: ${user.streak} Days

SUMMARY METRICS:
- Routine Success Rate: ${routineCompletionRate}%
- Avg Screen Time / Day: ${avgScreenTime} Minutes
- Productive Learning Hours: ${Math.round(productiveScreen / 60)} Hours
- Learning Journals Logged: ${journals.length} Entries

AI IMPROVEMENT REPORT:
We recommend maintaining an early routine pattern. Switch off recreational media 
at least 1 hour before sleeping, and leverage Pomodoro blocks for study cycles.
========================================
© 2026 TIMEX – Time Experience
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timex-${activeRange}-report-${user.username}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Metric,Value", `Full Name,${user.fullName}`, `Productivity Score,${user.productivityScore}`, `Routine Completion,${routineCompletionRate}%`, `Average Screen Time,${avgScreenTime} mins`, `Journals Logged,${journals.length}`]
      .map(e => e).join("\n");

    const encodedUri = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encodedUri;
    a.download = `timex-${activeRange}-data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Dataset for Area/Line Chart representing productivity points over last 5 weeks
  const weeklyTrend = [
    { label: 'Week 1', score: 65 },
    { label: 'Week 2', score: 72 },
    { label: 'Week 3', score: 80 },
    { label: 'Week 4', score: 78 },
    { label: 'Week 5', score: user.productivityScore || 85 }
  ];

  return (
    <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/5">
        <div>
          <h2 className="text-2xl font-black text-white">Advanced Performance Analytics</h2>
          <p className="text-xs text-slate-400 mt-1">Audit routines, screen-time averages, and daily learning scores over macro intervals.</p>
        </div>
        
        {/* Actions Button group */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={triggerPrint}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> Export Excel
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* Interval Navigator Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
        {['weekly', 'monthly', 'yearly'].map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range as any)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeRange === range
                ? 'bg-orange-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {range} Report
          </button>
        ))}
      </div>

      {/* RENDER DYNAMIC CARD DECKS BASED ON SELECTED INTERVAL */}
      {activeRange === 'weekly' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Trend Line Area Chart */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <AreaChart className="w-5 h-5 text-orange-400" />
                Productivity Consistency Score Trend
              </span>
              <span className="text-[10px] uppercase font-bold text-orange-450 bg-orange-500/10 px-2.5 py-1.5 rounded-full border border-orange-500/25">Score Up +15%</span>
            </div>

            {/* Custom Responsive SVG Area Chart */}
            <div className="relative h-60 w-full flex items-end justify-between px-6 pt-6 pb-2 border-b border-l border-white/5">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                {/* Generate Area polygon points */}
                <polygon
                  points="10,240 100,160 200,120 300,130 400,60 400,240 10,240"
                  className="fill-orange-500/10 stroke-none"
                />
                <polyline
                  points="10,240 100,160 200,120 300,130 400,60"
                  className="stroke-orange-500 stroke-2 fill-none"
                />
              </svg>
              {weeklyTrend.map((t, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 z-10">
                  <span className="text-[10px] font-extrabold text-orange-400 mb-2">{t.score}%</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-[#0A0A0B]"></div>
                  <span className="text-[9px] text-slate-500 font-bold mt-4">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Summary Sidebar */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-400">
                <Brain className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Weekly AI Summary</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Excellent progression. Your average Screen Time is down by **12%** compared to last week. Focus blocks are primarily spent on **Coding** and **Studying** (taking up 72% of total logged minutes).
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Productive Hours Logged</span>
                  <span className="font-bold text-white">{Math.round(productiveScreen / 60)}h</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 border-t border-white/5 pt-2">
                  <span>Diary Entries Added</span>
                  <span className="font-bold text-white">{journals.length}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0A0B] border border-white/10 mt-4">
              <div className="flex items-center gap-2 text-orange-400 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase">Weekly Badge Unlocked</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Earned "Consistency Master" badge for maintaining a 7-day habits streak!</p>
            </div>
          </div>
        </div>
      )}

      {activeRange === 'monthly' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between text-center">
            <div>
              <span className="block text-5xl font-black text-orange-450 mb-2">{routineCompletionRate}%</span>
              <h4 className="text-sm font-bold text-white mb-1">Monthly Routine Success</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">Routine completion consistency index computed across logged days.</p>
            </div>
            <div className="bg-[#0A0A0B]/80 p-4 rounded-xl border border-white/10 text-left space-y-2 mt-6">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Best Performing Day</span>
                <span className="font-bold text-orange-400">Wednesday</span>
              </div>
              <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                <span className="text-slate-500">Worst Screen Distraction Day</span>
                <span className="font-bold text-rose-450">Sunday</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between text-center">
            <div>
              <span className="block text-5xl font-black text-orange-450">+{Math.round((user.productivityScore / 10) || 8)}%</span>
              <h4 className="text-sm font-bold text-white mb-1">Monthly Growth Percentage</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">Cumulative percentage gain in attention Span focus logs.</p>
            </div>
            <div className="bg-[#0A0A0B]/80 p-4 rounded-xl border border-white/10 text-left space-y-2 mt-6">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Average Screen Time</span>
                <span className="font-bold text-white">{avgScreenTime} mins/day</span>
              </div>
              <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                <span className="text-slate-500">Most Productive Week</span>
                <span className="font-bold text-white">Week 4</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-400">
                <Brain className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">AI Improvement Report</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                **Focus Blocks Expansion**: You have maintained a strong coding rhythm. To optimize cognitive performance, increase physical cardiorespiratory activity (cardio, morning exercise) to balance seated computer tasks.
              </p>
            </div>
            <span className="text-[10px] text-slate-500 italic mt-6">Report updated today based on your weekly logs.</span>
          </div>
        </div>
      )}

      {activeRange === 'yearly' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
            <span className="block text-xs uppercase tracking-wider font-extrabold text-slate-500">Yearly Attention Metric</span>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Study & Coding Logged</span>
                <span className="font-bold text-white">1,240 Hours</span>
              </div>
              <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                <span className="text-slate-400">Total Learning Diaries Written</span>
                <span className="font-bold text-white">84 Entries</span>
              </div>
              <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                <span className="text-slate-400">Routine Checklists Handled</span>
                <span className="font-bold text-white">412 Checklists</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between">
            <div>
              <span className="block text-xs uppercase tracking-wider font-extrabold text-slate-500 mb-2">Growth charts comparison</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                TIMEX recorded a **24% overall screen reduction** in non-productive domains (recreation, infinite scrolling) over a 6-month interval comparison.
              </p>
            </div>
            <span className="text-[10px] text-orange-400 font-bold tracking-wide mt-4 uppercase flex items-center gap-1">
              <Award className="w-4 h-4" /> Earned: "Screen Time Slayer"
            </span>
          </div>

          {/* PDF Report trigger card */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Annual Ledger compilation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compile and export your full calendar year's time, goals, reflections, and routine completion records into a printable plaintext PDF database report.
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md mt-4 cursor-pointer"
            >
              Compile & Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
