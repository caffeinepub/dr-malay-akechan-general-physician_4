import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import { useActor } from '../hooks/useActor';

export default function AdminPanel() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const { actor } = useActor();

  useEffect(() => {
    // Check both localStorage and sessionStorage for backward compatibility
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

  const handleLoginSuccess = (token: string) => {
    // Store in both for compatibility with EditableField which reads sessionStorage
    sessionStorage.setItem('adminSessionToken', token);
    localStorage.setItem('adminSessionToken', token);
    setSessionToken(token);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminSessionToken');
    localStorage.removeItem('adminSessionToken');
    setSessionToken(null);
  };

  if (!sessionToken) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard sessionToken={sessionToken} onLogout={handleLogout} />;
}
