import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  activeTeamId: string | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  setActiveTeam: (teamId: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTeamId, setActiveTeamId] = useState<string | null>(() =>
    localStorage.getItem("activeTeamId"),
  );

  const login = useCallback((userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setActiveTeamId(null);
    localStorage.removeItem("user");
    localStorage.removeItem("activeTeamId");
  }, []);

  const setActiveTeam = useCallback((teamId: string | null) => {
    setActiveTeamId(teamId);
    if (teamId) {
      localStorage.setItem("activeTeamId", teamId);
    } else {
      localStorage.removeItem("activeTeamId");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, activeTeamId, login, logout, setActiveTeam }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
