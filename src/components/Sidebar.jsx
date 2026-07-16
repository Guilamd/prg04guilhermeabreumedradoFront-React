import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IconChart, IconCard, IconMoney, IconSettings, IconTarget, IconUsers } from './Icons';

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Fin<span className="text-emerald">Tech</span> {user && user.name === 'Admin' && <span style={{ fontSize: '0.8rem', background: 'var(--accent-rose)', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>Admin</span>}</h2>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <span className="icon"><IconChart size={18} /></span> Dashboard
        </Link>
        <Link to="/carteiras" className={`nav-link ${location.pathname === '/carteiras' ? 'active' : ''}`}>
          <span className="icon"><IconCard size={18} /></span> Carteiras
        </Link>
        <Link to="/transacoes" className={`nav-link ${location.pathname === '/transacoes' ? 'active' : ''}`}>
          <span className="icon"><IconMoney size={18} /></span> Transações
        </Link>
        <Link to="/metas" className={`nav-link ${location.pathname === '/metas' ? 'active' : ''}`}>
          <span className="icon"><IconTarget size={18} /></span> Metas
        </Link>
        {user && user.name === 'Admin' && (
          <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            <span className="icon"><IconUsers size={18} /></span> Admin: Usuários
          </Link>
        )}
        <a href="#" className="nav-link">
          <span className="icon"><IconSettings size={18} /></span> Configurações
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
