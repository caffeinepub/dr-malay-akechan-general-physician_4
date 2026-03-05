import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface AdminEditContextValue {
  isAdminLoggedIn: boolean;
}

const AdminEditContext = createContext<AdminEditContextValue>({
  isAdminLoggedIn: false,
});

export function AdminEditProvider({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const token =
      sessionStorage.getItem("adminSessionToken") ||
      localStorage.getItem("adminSessionToken");
    return !!(token && token.length > 0);
  });

  useEffect(() => {
    const checkToken = () => {
      const token =
        sessionStorage.getItem("adminSessionToken") ||
        localStorage.getItem("adminSessionToken");
      setIsAdminLoggedIn(!!(token && token.length > 0));
    };

    // Listen for storage changes (logout from another tab, etc.)
    window.addEventListener("storage", checkToken);

    // Also poll periodically in case sessionStorage changes within the same tab
    const interval = setInterval(checkToken, 1000);

    return () => {
      window.removeEventListener("storage", checkToken);
      clearInterval(interval);
    };
  }, []);

  return (
    <AdminEditContext.Provider value={{ isAdminLoggedIn }}>
      {children}
    </AdminEditContext.Provider>
  );
}

export function useAdminEdit(): AdminEditContextValue {
  return useContext(AdminEditContext);
}
