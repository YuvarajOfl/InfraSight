import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Eye, EyeOff, AlertCircle, CheckCircle, Monitor, Sun, Moon, Terminal } from 'lucide-react';
import { API_URL } from '../config';

export function SettingsPage() {
  const { user, token } = useAuth();
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Theme states
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(
    (localStorage.getItem('cg_theme') as 'dark' | 'light' | 'system') || 'dark'
  );

  const handleThemeSelection = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('cg_theme', newTheme);
    window.dispatchEvent(new Event('theme-change'));
  };

  const formatLastLogin = (isoString: string | null) => {
    const date = isoString ? new Date(isoString) : new Date();
    const day = date.getDate();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const hoursStr = hours < 10 ? '0' + hours : hours;
    return `${day} ${monthName} ${year} ${hoursStr}:${minutesStr} ${ampm}`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-350 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>User session not found. Please try logging in again.</span>
        </div>
      </div>
    );
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (!/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError("New password must contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.detail || 'Password change failed.');
      }

      setSuccess("Password changed successfully.");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Password change error:', err);
      setError(err.message || 'Password update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mask token for session view
  const formatToken = (t: string | null) => {
    if (!t) return 'None';
    if (t.length <= 25) return t;
    return `${t.substring(0, 12)}••••••••••••••••••••••••${t.substring(t.length - 12)}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-450">Configure your security profile parameters and theme preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: General settings & Session information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Account details */}
          <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" />
              Account Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Full Name</span>
                <div className="px-3.5 py-2.5 bg-slate-950/50 border border-white/5 rounded-xl text-slate-350 text-xs font-semibold select-all">
                  {user.name}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Email Address</span>
                <div className="px-3.5 py-2.5 bg-slate-950/50 border border-white/5 rounded-xl text-slate-350 text-xs font-semibold select-all">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Local Account Change Password Form */}
          {user.provider === 'local' ? (
            <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-indigo-400" />
                Change Password
              </h2>

              {error && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-350 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-4 pr-10 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-slate-100 text-xs placeholder-slate-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors"
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">New Password</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-slate-100 text-xs placeholder-slate-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Confirm New Password</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-slate-100 text-xs placeholder-slate-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">Google OAuth Controlled</h4>
                <p className="text-[11px] text-slate-455 leading-relaxed">
                  Password management is handled through your Google Account.
                </p>
              </div>
            </div>
          )}

          {/* Session Information */}
          <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              Session Information
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Authentication Method</span>
                  <span className="text-xs font-semibold text-slate-200 block">
                    {user.provider === 'google' ? 'Google OAuth' : 'Local Account'}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Session Status</span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Last Login Time</span>
                  <span className="text-xs font-semibold text-slate-200 block">
                    {formatLastLogin(localStorage.getItem('cg_last_login'))}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Session Storage Type</span>
                  <span className="text-xs font-semibold text-slate-200 block">
                    Browser LocalStorage
                  </span>
                </div>
                <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Account Type</span>
                  <span className="text-xs font-semibold text-slate-200 block">
                    {user.provider === 'google' ? 'Authenticated User' : 'Standard User'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Theme setting preferences (placeholder) */}
        <div className="space-y-6">
          <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Monitor className="h-4 w-4 text-pink-400" />
              Theme Preference
            </h2>
            <p className="text-xs text-slate-450 leading-relaxed">
              Adjust the platform display style to suit your current lighting environments.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleThemeSelection('dark')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 font-bold'
                    : 'bg-slate-950/40 border-white/5 text-slate-450 hover:bg-slate-950/60'
                }`}
              >
                <Moon className="h-4 w-4 shrink-0" />
                <span>Cyber Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeSelection('light')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 font-bold'
                    : 'bg-slate-950/40 border-white/5 text-slate-450 hover:bg-slate-950/60'
                }`}
              >
                <Sun className="h-4 w-4 shrink-0" />
                <span>Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeSelection('system')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 font-bold'
                    : 'bg-slate-950/40 border-white/5 text-slate-450 hover:bg-slate-950/60'
                }`}
              >
                <Monitor className="h-4 w-4 shrink-0" />
                <span>System Settings</span>
              </button>
            </div>
            
            <div className="text-[10px] text-slate-500 italic text-center pt-2">
              Display rendering overrides are set globally.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
