import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        // Fallback for old string format
        setUser({ name: storedUser });
      }
    }
  }, []);

  const login = (email, password) => {
    // Lógica de autenticação mockada
    if (email === "admin@fintech.com" && password === "1234") {
      const userData = { name: 'Admin', email: 'admin@fintech.com' };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate('/'); // Redireciona para o dashboard
      return true;
    } else if (email === "user@fintech.com" && password === "1234") {
      const userData = { name: 'Guilherme', email: 'guilherme@exemplo.com' };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate('/'); // Redireciona para o dashboard
      return true;
    }
    return false; // Falha no login
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login'); // Redireciona para a página de login
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
