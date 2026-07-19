import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.nome && !parsedUser.name) {
          parsedUser.name = parsedUser.nome;
        }
        setUser(parsedUser);
      } catch (e) {
        // Fallback for old string format
        setUser({ name: storedUser });
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, senha: password });
      const userData = response.data; // UsuarioResponseDTO
      userData.name = userData.nome; // Normaliza para o front-end
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate('/');
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/usuarios', { nome: name, email, senha: password });
      const userData = response.data;
      userData.name = userData.nome; // Normaliza para o front-end
      
      // Realiza o auto-login após registro
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate('/');
      return true;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
