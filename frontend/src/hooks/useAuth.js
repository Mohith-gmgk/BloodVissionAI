import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const saved = localStorage.getItem("bv_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("bv_user", JSON.stringify(userData));
    if (token) localStorage.setItem("bv_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("bv_user");
    localStorage.removeItem("bv_token");
    setUser(null);
  };

  const updateUser = (userData) => {
    const updated = { ...user, ...userData };
    localStorage.setItem("bv_user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
