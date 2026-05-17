import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera o usuário do localStorage ao carregar a aplicação
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser({ name: storedUser });
    }
  }, []);

  const login = (email, password) => {
    // Lógica de autenticação mockada
    if (email === "admin@fintech.com" && password === "1234") {
      const userData = { name: 'Admin' };
      localStorage.setItem('user', userData.name);
      setUser(userData);
      navigate('/'); // Redireciona para o dashboard
      return true;
    } else if (email === "user@fintech.com" && password === "1234") {
      const userData = { name: 'Guilherme' };
      localStorage.setItem('user', userData.name);
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

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
