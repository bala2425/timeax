import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Calendar, Globe, Briefcase, Eye, EyeOff, X, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any, token: string) => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Registration states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Tamil Nadu');
  const [city, setCity] = useState('Chennai');
  const [occupation, setOccupation] = useState('');
  const [schoolCompany, setSchoolCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      onSuccess(data.user, data.token);
      if (rememberMe) {
        localStorage.setItem('timex_token', data.token);
        localStorage.setItem('timex_user', JSON.stringify(data.user));
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName, username, email, mobile, dob, gender,
          country, state, city, occupation, schoolCompany, password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      onSuccess(data.user, data.token);
      if (rememberMe) {
        localStorage.setItem('timex_token', data.token);
        localStorage.setItem('timex_user', JSON.stringify(data.user));
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminDemo = () => {
    setEmail('balachandarrangan@gmail.com');
    setPassword('admin');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0B]/90 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0A0A0B] border border-white/10 rounded-3xl p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-white">
            {mode === 'login' ? 'Welcome Back to TIMEX' : 'Begin Your Time Experience'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {mode === 'login' 
              ? "Re-enter your dashboard to maintain your daily focus streak." 
              : "Set up your secure professional workspace profile."}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        )}

        {/* Demo Credentials Quick-Fill */}
        {mode === 'login' && (
          <div className="mb-6 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
            <span className="text-xs text-orange-450 font-medium">Want to test the Balachandar A admin account?</span>
            <button 
              onClick={loadAdminDemo}
              className="text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              Autofill Credentials
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          {mode === 'login' ? (
            /* LOGIN FIELDS */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-100 placeholder-slate-500 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input 
                    type={showPass ? "text" : "password"} 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your security code"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-slate-100 placeholder-slate-500 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* REGISTER FIELDS */
            <div className="grid md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your first and last name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" required value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="choose_username"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input 
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" value={mobile} onChange={e => setMobile(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input 
                    type="date" value={dob} onChange={e => setDob(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                <select 
                  value={gender} onChange={e => setGender(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                >
                  <option value="Male" className="bg-[#0A0A0B]">Male</option>
                  <option value="Female" className="bg-[#0A0A0B]">Female</option>
                  <option value="Other" className="bg-[#0A0A0B]">Other</option>
                  <option value="Prefer not to say" className="bg-[#0A0A0B]">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Occupation</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" value={occupation} onChange={e => setOccupation(e.target.value)}
                    placeholder="e.g. Software Engineer, Student"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Company / Institution</label>
                <input 
                  type="text" value={schoolCompany} onChange={e => setSchoolCompany(e.target.value)}
                  placeholder="e.g. TIMEX Corp"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Country</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" value={country} onChange={e => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">State / Region</label>
                <input 
                  type="text" value={state} onChange={e => setState(e.target.value)}
                  placeholder="e.g. Tamil Nadu"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">City</label>
                <input 
                  type="text" value={city} onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Chennai"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <input 
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                <input 
                  type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Verify password value"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Remember me & submit */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-[#0A0A0B] border-white/10 rounded focus:ring-orange-500" 
              />
              <span className="text-xs text-slate-400">Remember session credentials</span>
            </label>
            <span className="text-xs text-orange-400 hover:underline cursor-pointer">Forgot Security Code?</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold tracking-wide shadow-lg shadow-orange-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            {loading ? 'Processing Workspace...' : (mode === 'login' ? 'Access Workspace' : 'Initialize TIMEX Passport')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Modal Switch Toggle */}
        <div className="mt-6 text-center text-sm text-slate-400">
          {mode === 'login' ? (
            <>
              Don't have a TIMEX account?{' '}
              <button 
                onClick={() => setMode('register')} 
                className="text-orange-400 hover:underline font-semibold"
              >
                Sign Up Now
              </button>
            </>
          ) : (
            <>
              Already have an active account?{' '}
              <button 
                onClick={() => setMode('login')} 
                className="text-orange-400 hover:underline font-semibold"
              >
                Sign In Instead
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
