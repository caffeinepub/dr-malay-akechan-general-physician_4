import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Shield, Eye, EyeOff, ArrowLeft, Loader2, Zap } from 'lucide-react';
import { useLogin } from '../hooks/useQueries';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = await loginMutation.mutateAsync({ username, password });
      onLoginSuccess(token);
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-800 flex items-center justify-center relative overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(oklch(0.75 0.18 200 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.18 200 / 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md px-4">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm font-body mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Homepage
        </Link>

        {/* Login Card */}
        <div className="bg-navy-700 border border-cyan-500/20 rounded-card shadow-card-dark p-8 animate-border-glow">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-card bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center glow-cyan-sm">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="text-center">
              <h1 className="font-display font-bold text-2xl text-white">Admin Access</h1>
              <p className="text-slate-400 text-sm font-body mt-1">Secure administrative portal</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium font-body text-slate-400 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full px-4 py-3 rounded-sharp tech-input text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium font-body text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-sharp tech-input text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-sharp bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 rounded-sharp bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-800 font-display font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 glow-cyan-sm hover:glow-cyan"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
          <span className="text-slate-500 text-xs font-body">Secure connection established</span>
        </div>
      </div>
    </div>
  );
}
