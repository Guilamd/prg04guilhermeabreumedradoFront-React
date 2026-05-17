import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>Fin<span>Tech</span> {user && user.name === 'Admin' && <span className="badge">Admin</span>}</h1>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <span className="icon">📊</span> Dashboard
        </Link>
        <a href="#" className="nav-item">
          <span className="icon">💳</span> Carteiras
        </a>
        <a href="#" className="nav-item">
          <span className="icon">💸</span> Transações
        </a>
        <a href="#" className="nav-item">
          <span className="icon">🎯</span> Metas
        </a>
        {user && user.name === 'Admin' && (
          <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
            <span className="icon">👥</span> Admin: Usuários
          </Link>
        )}
        <a href="#" className="nav-item">
          <span className="icon">⚙️</span> Configurações
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
