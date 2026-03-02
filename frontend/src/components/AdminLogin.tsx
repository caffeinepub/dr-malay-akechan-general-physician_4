import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Eye, EyeOff, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

export default function AdminLogin({ onLogin, error, isLoading }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || isLoading) return;
    await onLogin(username.trim(), password.trim());
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'oklch(0.08 0.018 240)' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, oklch(0.72 0.18 195 / 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div
        className="relative w-full max-w-md rounded-2xl p-8"
        style={{
          background: 'oklch(0.12 0.022 240)',
          border: '1px solid oklch(0.72 0.18 195 / 0.20)',
          boxShadow: '0 24px 64px oklch(0.08 0.018 240 / 0.80)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'oklch(0.72 0.18 195 / 0.12)',
              border: '1px solid oklch(0.72 0.18 195 / 0.30)',
            }}
          >
            <Lock className="w-6 h-6" style={{ color: 'oklch(0.72 0.18 195)' }} />
          </div>
          <h1
            className="font-heading font-bold text-2xl mb-1"
            style={{ color: 'oklch(0.96 0.012 220)' }}
          >
            Admin Login
          </h1>
          <p className="text-sm" style={{ color: 'oklch(0.68 0.012 230)' }}>
            Sign in to manage your site
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-6 px-4 py-3 rounded-xl text-sm font-medium"
            style={{
              background: 'oklch(0.55 0.22 25 / 0.15)',
              border: '1px solid oklch(0.55 0.22 25 / 0.40)',
              color: 'oklch(0.80 0.15 25)',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold mb-2"
              style={{ color: 'oklch(0.82 0.010 220)' }}
            >
              Username
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'oklch(0.55 0.015 230)' }}
              />
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                disabled={isLoading}
                className="admin-input pl-10"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
              style={{ color: 'oklch(0.82 0.010 220)' }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'oklch(0.55 0.015 230)' }}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={isLoading}
                className="admin-input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'oklch(0.55 0.015 230)' }}
                tabIndex={-1}
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, oklch(0.65 0.185 195), oklch(0.58 0.175 240))',
              color: 'oklch(0.98 0.005 220)',
              boxShadow: '0 4px 16px oklch(0.65 0.185 195 / 0.30)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
            style={{ color: 'oklch(0.65 0.012 230)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
