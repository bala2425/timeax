import React from 'react';
import { Clock, Shield, Flame, BookOpen, Brain, Award, ArrowRight, Star, Heart, HelpCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
}

export default function LandingPage({ onGetStarted, onLoginClick }: LandingPageProps) {
  const stats = [
    { value: '15,000+', label: 'Active Mindful Users' },
    { value: '4.8M+', label: 'Focused Hours Tracked' },
    { value: '35%', label: 'Avg Screen Time Reduction' },
    { value: '92%', label: 'Consistency Goal Rate' }
  ];

  const features = [
    {
      icon: <Flame className="w-6 h-6 text-orange-400" />,
      title: 'Daily Routine Tracker',
      description: 'Track healthy micro-habits, physical workouts, hydration, and sleep with seamless automated timestamps.'
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-400" />,
      title: 'Screen Time Analytics',
      description: 'Understand desktop vs. mobile usage across categories (Social, Coding, Entertainment) with interactive SVG charts.'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      title: 'Reflective Learning Journal',
      description: 'Ask yourself structured daily reflection questions to turn mistakes into powerful future skills.'
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      title: 'Specialized TIMEX AI',
      description: 'A dedicated server-side Gemini assistant optimized purely to answer productivity, exercise, and study technique questions.'
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: 'Bento Performance Analytics',
      description: 'Stunning visual breakdowns over weekly, monthly, and yearly intervals, complete with downloadable PDF reports.'
    },
    {
      icon: <Shield className="w-6 h-6 text-rose-400" />,
      title: 'Secure Full-Stack Architecture',
      description: 'Robust server-side database emulation, JWT mock sessions, role-based access, and admin analytics control panels.'
    }
  ];

  const faqs = [
    {
      q: 'What is TIMEX?',
      a: 'TIMEX (Time Experience) is a premium full-stack ecosystem designed to shift your relationship with time from a passive resource to an active driver of discipline, wellness, and knowledge.'
    },
    {
      q: 'How does the AI Assistant work?',
      a: 'The server-side chatbot runs on Gemini. It acts as a specialized guide that answers topics related strictly to wellness, time management, nutrition, and productivity. If you ask unrelated questions, it politely guides you back.'
    },
    {
      q: 'Is my tracked data secure?',
      a: 'Yes, all routines, learning journals, and reflections are securely saved within our server-side database file structure, offering isolated user environments.'
    }
  ];

  return (
    <div className="min-h-screen text-slate-100 bg-[#0A0A0B] font-sans selection:bg-orange-500 selection:text-white">
      {/* Decorative Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0A0A0B]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl shadow-lg shadow-orange-500/20">
              <Clock className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              TIMEX <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">v1.0</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="px-5 py-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 font-medium shadow-md shadow-orange-500/20 active:scale-95 transition-all text-white cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 text-center md:pt-28">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 mb-8 backdrop-blur-sm shadow-inner">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
          <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Reclaim Your Attention Span</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Every <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-white bg-clip-text text-transparent">Second</span> Matters.
        </h1>
        
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-12">
          TIMEX helps you build better habits, reduce screen time, improve productivity, and discover the true value of time. Step into an intentional layout for micro-discipline.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 font-semibold shadow-lg shadow-orange-500/30 active:scale-95 transition-all text-white flex items-center justify-center gap-2 group cursor-pointer"
          >
            Create Your Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={onLoginClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 font-semibold text-slate-200 active:scale-95 transition-all cursor-pointer"
          >
            Sign In to Dashboard
          </button>
        </div>

        {/* Bento/Glass Cards showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm text-center shadow-lg hover:border-white/10 transition-all">
              <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-xs font-medium text-slate-400 tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Features */}
      <section className="bg-white/2 border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Designed for High-Fidelity Accountability
            </h2>
            <p className="text-slate-400">
              TIMEX combines deep logging tables with specialized artificial intelligence to build streaks that survive screen distractions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feat, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all hover:translate-y-[-4px] shadow-xl relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl w-fit mb-6 shadow-inner">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motivational Time Quotes Carousel */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-neutral-900/40 to-orange-950/20 border border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl"></div>
          
          <Clock className="w-12 h-12 text-orange-400 mx-auto mb-6 animate-pulse" />
          <p className="text-xl md:text-2xl italic font-serif text-slate-100 leading-relaxed mb-6">
            "Discipline is choosing between what you want now and what you want most. Lost time is never found again."
          </p>
          <div className="text-sm font-semibold tracking-wider text-orange-400 uppercase">
            — BALACHANDAR A, FOUNDER OF TIMEX
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-black/20 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <HelpCircle className="w-8 h-8 text-orange-400" />
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400">Everything you need to know about starting your TIMEX journey.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/5">
                <h3 className="font-semibold text-slate-100 mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">TIMEX – Time Experience</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Helping individuals understand the absolute value of time by aligning habits, tracking distractions, and empowering learning.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Founder & Contact</h4>
            <div className="text-sm text-slate-400 space-y-2">
              <p><strong>Founder:</strong> Balachandar A</p>
              <p><strong>Email:</strong> <a href="mailto:balachandarrangan@gmail.com" className="hover:text-white transition-colors">balachandarrangan@gmail.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+918438461479" className="hover:text-white transition-colors">+91 8438461479</a></p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Quick Navigation</h4>
            <div className="text-sm text-slate-400 grid grid-cols-2 gap-2">
              <a href="#about" className="hover:text-white transition-colors">About Us</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#help" className="hover:text-white transition-colors">Help Center</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center text-xs text-slate-500">
          © 2026 TIMEX – Time Experience. All Rights Reserved. Designed for the ultimate time optimization experience.
        </div>
      </footer>
    </div>
  );
}
