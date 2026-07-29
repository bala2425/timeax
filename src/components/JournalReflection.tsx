import React, { useState, useEffect } from 'react';
import { BookOpen, Smile, Star, Save, Clock, HelpCircle, CheckCircle } from 'lucide-react';

interface JournalReflectionProps {
  user: any;
  onRefreshDashboard: () => void;
}

const MOODS = ['😊', '😃', '😐', '😔', '😴'] as const;

export default function JournalReflection({ user, onRefreshDashboard }: JournalReflectionProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Reflection States
  const [productivityRating, setProductivityRating] = useState(5);
  const [timeWasters, setTimeWasters] = useState('');
  const [happinessFactors, setHappinessFactors] = useState('');
  const [mood, setMood] = useState<typeof MOODS[number]>('😊');

  // Journal States
  const [learnedToday, setLearnedToday] = useState('');
  const [skillPracticed, setSkillPracticed] = useState('');
  const [mistakesMade, setMistakesMade] = useState('');
  const [improveTomorrow, setImproveTomorrow] = useState('');

  const [notif, setNotif] = useState('');
  const [loading, setLoading] = useState(false);

  // Load existing data if any exists for the selected date
  useEffect(() => {
    const loadDayData = async () => {
      try {
        // Fetch reflections
        const refRes = await fetch(`/api/reflections?userId=${user.id}`);
        if (refRes.ok) {
          const refData = await refRes.json();
          const dayRef = refData.find((r: any) => r.date === selectedDate);
          if (dayRef) {
            setProductivityRating(dayRef.productivityRating);
            setTimeWasters(dayRef.timeWasters);
            setHappinessFactors(dayRef.happinessFactors);
            setMood(dayRef.mood);
          } else {
            // Reset to defaults
            setProductivityRating(5);
            setTimeWasters('');
            setHappinessFactors('');
            setMood('😊');
          }
        }

        // Fetch journals
        const jRes = await fetch(`/api/journals?userId=${user.id}`);
        if (jRes.ok) {
          const jData = await jRes.json();
          const dayJ = jData.find((j: any) => j.date === selectedDate);
          if (dayJ) {
            setLearnedToday(dayJ.learnedToday);
            setSkillPracticed(dayJ.skillPracticed);
            setMistakesMade(dayJ.mistakesMade);
            setImproveTomorrow(dayJ.improveTomorrow);
          } else {
            // Reset to empty
            setLearnedToday('');
            setSkillPracticed('');
            setMistakesMade('');
            setImproveTomorrow('');
          }
        }
      } catch (e) {
        console.error('Failed to load day data', e);
      }
    };

    loadDayData();
  }, [user.id, selectedDate]);

  const handleSaveReflection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          date: selectedDate,
          productivityRating,
          timeWasters,
          happinessFactors,
          mood
        })
      });

      if (res.ok) {
        setNotif('Daily reflection saved securely!');
        setTimeout(() => setNotif(''), 3000);
        onRefreshDashboard();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJournal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          date: selectedDate,
          learnedToday,
          skillPracticed,
          mistakesMade,
          improveTomorrow
        })
      });

      if (res.ok) {
        setNotif('Learning journal entry saved securely!');
        setTimeout(() => setNotif(''), 3000);
        onRefreshDashboard();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
      {/* Date Header Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/5">
        <div>
          <h2 className="text-2xl font-black text-white">Daily Diary & Self-Reflection</h2>
          <p className="text-xs text-slate-400 mt-1">Reflect on productivity, track mood patterns, and log key learning milestones.</p>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-orange-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none text-sm font-semibold cursor-pointer"
          />
        </div>
      </div>

      {/* Save Notification banner */}
      {notif && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2 animate-pulse">
          <CheckCircle className="w-5 h-5" />
          {notif}
        </div>
      )}

      {/* Split Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* PANEL 1: DAILY REFLECTION */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <Smile className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-white">1. Daily Reflection & Mood</h3>
            </div>

            {/* Mood selector */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">How is your current mood state?</label>
              <div className="flex gap-3 justify-between max-w-sm">
                {MOODS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`text-3xl p-3.5 rounded-xl border transition-all ${
                      mood === m 
                        ? 'bg-orange-500/20 border-orange-500 scale-110 shadow-lg' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Stars rating */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Rate your today's productivity level</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setProductivityRating(star)}
                    className="p-1 hover:scale-115 transition-transform cursor-pointer"
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        star <= productivityRating 
                          ? 'text-orange-400 fill-orange-400' 
                          : 'text-slate-700'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Distraction/Time Wasters Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">What wasted your valuable time today?</label>
              <input
                type="text"
                placeholder="e.g. Spent too long scrolling reels, unnecessary chat..."
                value={timeWasters}
                onChange={e => setTimeWasters(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Happy Factors Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">What made you happy or content today?</label>
              <input
                type="text"
                placeholder="e.g. Finished coding features ahead of plan, walked offline..."
                value={happinessFactors}
                onChange={e => setHappinessFactors(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSaveReflection}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            <Save className="w-4 h-4" /> Save Today's Reflection
          </button>
        </div>

        {/* PANEL 2: LEARNING JOURNAL */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <BookOpen className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-white">2. Daily Learning Journal</h3>
            </div>

            {/* Q1: Learned today */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">What did you learn today?</label>
              <textarea
                rows={2}
                placeholder="Key concepts, insights, or coding patterns read..."
                value={learnedToday}
                onChange={e => setLearnedToday(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            {/* Q2: Skills practiced */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">What new skill did you practice?</label>
              <textarea
                rows={2}
                placeholder="Framer motion animations, API proxy, etc..."
                value={skillPracticed}
                onChange={e => setSkillPracticed(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            {/* Q3: Mistakes made */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">What mistakes did you make today?</label>
              <textarea
                rows={2}
                placeholder="Spent too long on complex route bugs..."
                value={mistakesMade}
                onChange={e => setMistakesMade(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            {/* Q4: Improve tomorrow */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">What will you improve tomorrow?</label>
              <textarea
                rows={2}
                placeholder="Set time-blocks before launching editor..."
                value={improveTomorrow}
                onChange={e => setImproveTomorrow(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleSaveJournal}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            <Save className="w-4 h-4" /> Commit Learning Diary Entry
          </button>
        </div>

      </div>
    </div>
  );
}
