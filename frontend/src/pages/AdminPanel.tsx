import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import { useActor } from '../hooks/useActor';
import { useLogin } from '../hooks/useQueries';

export default function AdminPanel() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');
  const { actor } = useActor();
  const loginMutation = useLogin();

  useEffect(() => {
    const stored =
      localStorage.getItem('adminSessionToken') ||
      sessionStorage.getItem('adminSessionToken');
    if (stored && actor) {
      actor
        .validateSessionToken(stored)
        .then(() => setSessionToken(stored))
        .catch(() => {
          localStorage.removeItem('adminSessionToken');
          sessionStorage.removeItem('adminSessionToken');
          setSessionToken(null);
        });
    }
  }, [actor]);

  const handleLogin = async (username: string, password: string) => {
    setLoginError('');
    try {
      const token = await loginMutation.mutateAsync({ username, password });
      sessionStorage.setItem('adminSessionToken', token);
      localStorage.setItem('adminSessionToken', token);
      setSessionToken(token);
    } catch {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminSessionToken');
    localStorage.removeItem('adminSessionToken');
    setSessionToken(null);
  };

  if (!sessionToken) {
    return (
      <AdminLogin
        onLogin={handleLogin}
        error={loginError}
        isLoading={loginMutation.isPending}
      />
    );
  }

  return <AdminDashboard sessionToken={sessionToken} onLogout={handleLogout} />;
}
