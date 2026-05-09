import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("campushub_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const persistSession = (payload) => {
    localStorage.setItem("campushub_token", payload.token);
    localStorage.setItem("campushub_user", JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: async (credentials) => {
        const { data } = await api.post("/auth/login", credentials);
        persistSession(data);
        return data.user;
      },
      signup: async (payload) => {
        const { data } = await api.post("/auth/register", payload);
        persistSession(data);
        return data.user;
      },
      loginWithGoogle: async (payload) => {
        const { data } = await api.post("/auth/google", payload);
        persistSession(data);
        return data.user;
      },
      logout: () => {
        localStorage.removeItem("campushub_token");
        localStorage.removeItem("campushub_user");
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
