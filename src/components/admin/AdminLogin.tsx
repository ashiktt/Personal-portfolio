import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, ArrowLeft, Key, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface AdminLoginProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onShowToast }) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { loginAdmin, profile, lockoutRemainingSeconds } = usePortfolio();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemainingSeconds > 0) {
      onShowToast('error', 'Access Locked', `Too many failed attempts. Try again in ${lockoutRemainingSeconds}s.`);
      return;
    }

    const result = loginAdmin(passcode);
    if (result.success) {
      onShowToast('success', 'Admin Authenticated', 'Welcome back, Ashikur.');
      navigate('/admin');
    } else {
      setErrorMessage(result.message);
      onShowToast('error', 'Authentication Failed', result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10 bg-[#090A0F]">
      {/* Background glow orb */}
      <div
        className="ambient-glow top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #3b82f6 0%, #1e3a8a 50%, transparent 75%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md p-8 rounded-3xl bg-[#0E1322]/95 border border-slate-800 backdrop-blur-2xl shadow-2xl shadow-black/90"
      >
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Portfolio</span>
        </button>

        {/* Lock Icon Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Private Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              Restricted to Ashikur Rahman (Site Owner)
            </p>
          </div>
        </div>

        {/* Lockout Warning Banner */}
        {lockoutRemainingSeconds > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <div>
              <div className="font-bold">Security Lockout Active</div>
              <div>Too many failed attempts. Cooldown: {lockoutRemainingSeconds}s remaining.</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Secret Passcode / Passkey</span>
              <span className="text-[11px] text-slate-500 font-mono">Owner Access Only</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={lockoutRemainingSeconds > 0}
                autoFocus
                placeholder="Enter your secret passcode"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all disabled:opacity-50 ${
                  errorMessage
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorMessage && (
              <p className="text-xs text-rose-400 mt-1">{errorMessage}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={lockoutRemainingSeconds > 0}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 transition-all"
          >
            <span>Unlock Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center space-y-2">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rate-limited brute force protection &amp; session security</span>
          </p>
          <p className="text-[10px] text-slate-600">
            Forgot passcode? Default seed: <code className="text-slate-500">ashikur2026</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
