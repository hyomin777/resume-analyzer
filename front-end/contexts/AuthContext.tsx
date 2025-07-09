import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  loggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) setLoggedIn(true);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setLoggedIn(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
