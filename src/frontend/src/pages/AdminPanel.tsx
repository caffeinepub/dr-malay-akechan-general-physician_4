import React, { useState, useCallback } from "react";
import AdminDashboard from "../components/AdminDashboard";
import AdminLogin from "../components/AdminLogin";
import { useLogin } from "../hooks/useQueries";

export default function AdminPanel() {
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return (
      sessionStorage.getItem("adminSessionToken") ||
      localStorage.getItem("adminSessionToken")
    );
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  const loginMutation = useLogin();

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      setLoginError(null);
      try {
        const token = await loginMutation.mutateAsync({ username, password });
        if (token && typeof token === "string" && token.length > 0) {
          sessionStorage.setItem("adminSessionToken", token);
          localStorage.setItem("adminSessionToken", token);
          setSessionToken(token);
        } else {
          setLoginError(
            "Login failed: no session token received. Please try again.",
          );
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        // Extract meaningful error from IC trap messages
        const match = message.match(
          /Invalid credentials|Unauthorized|rejected/i,
        );
        if (match) {
          setLoginError("Invalid username or password. Please try again.");
        } else {
          setLoginError(`Login failed: ${message}`);
        }
      }
    },
    [loginMutation],
  );

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("adminSessionToken");
    localStorage.removeItem("adminSessionToken");
    setSessionToken(null);
    setLoginError(null);
  }, []);

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
