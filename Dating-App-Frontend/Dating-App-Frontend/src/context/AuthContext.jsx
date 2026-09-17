import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
      setUser({ token });
    } else {
      localStorage.removeItem('jwt_token');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData || { token: jwtToken });
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('jwt_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
