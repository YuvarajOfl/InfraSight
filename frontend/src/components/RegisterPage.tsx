import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  User, 
  Mail, 
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Password validations
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : 'http://localhost:8000');
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.detail || 'Registration failed.');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/15 blur-[150px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full h-16 border-b border-white/5 backdrop-blur-md bg-slate-950/50 flex items-center justify-between px-6 sm:px-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight text-lg">InfraSight</span>
            <span className="text-[8px] text-slate-500 font-semibold tracking-widest block font-mono uppercase">Security & Cost Control</span>
          </div>
        </div>
      </header>

      {/* Main Form container */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-6 py-12 relative z-10 w-full">
        
        {/* Glass Register Panel */}
        <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-center space-y-6 relative overflow-hidden">
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Create your Account</h3>
            <p className="text-xs text-slate-400">Join the cloud security workspace</p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs flex items-start gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Account created successfully! Redirecting to sign in...</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="w-full space-y-4 text-left">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Email Address</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Register"
              )}
            </button>

            <div className="text-center pt-2 border-t border-white/5">
              <span className="text-xs text-slate-500">Already have an account? </span>
              <a href="/login" className="text-xs text-blue-400 hover:underline hover:text-blue-300 transition-colors font-medium">Sign in</a>
            </div>
          </form>

        </div>
      </main>

      {/* Footer bar */}
      <footer className="w-full h-12 border-t border-white/5 bg-slate-950/30 flex items-center justify-between px-6 sm:px-12 text-[10px] text-slate-500 relative z-10">
        <span>© 2026 InfraSight Platform. All rights reserved.</span>
        <span className="font-mono uppercase tracking-wider text-[8px] bg-slate-900 border border-white/5 rounded px-1.5 py-0.5">Sprint: Refactoring v2.0</span>
      </footer>

    </div>
  );
}
