"use client";

import { useEffect, useState } from "react";

const ADMIN_PASSWORD = "urbanpeak2024";
const AUTH_KEY = "adminAuth";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(AUTH_KEY);
      setAuthenticated(stored === ADMIN_PASSWORD);
    }
    setLoading(false);
  }, []);

  const signIn = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, password);
      setAuthenticated(true);
      return true;
    }
    return false;
  };

  const signOut = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthenticated(false);
  };

  return { authenticated, loading, signIn, signOut };
}
