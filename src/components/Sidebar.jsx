import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IconChart, IconCard, IconMoney, IconSettings, IconTarget, IconUsers, IconBell } from './Icons';
import api from '../services/api';

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user) {
      api.get('/notificacoes')
        .then(res => setNotificacoes(res.data || []))
        .catch(err => console.error('Erro ao buscar notificações:', err));
    }
  }, [user]);

  // Fecha os dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Fin<span className="text-emerald">Tech</span> {user && (user.name === 'Admin' || user.name === 'Administrador') && <span style={{ fontSize: '0.8rem', background: 'var(--accent-rose)', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>Admin</span>}</h2>
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
        {user && (user.name === 'Admin' || user.name === 'Administrador') && (
          <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            <span className="icon"><IconUsers size={18} /></span> Admin: Usuários
          </Link>
        )}
        <Link to="/configuracoes" className={`nav-link ${location.pathname === '/configuracoes' ? 'active' : ''}`}>
          <span className="icon"><IconSettings size={18} /></span> Configurações
        </Link>
      </nav>

      {/* Footer da Sidebar (Perfil e Notificações) */}
      <div 
        ref={profileRef}
        style={{ 
          marginTop: 'auto', 
          paddingTop: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'relative'
        }}
      >
        {/* Avatar e Informações do Usuário (Clicável) */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1, overflow: 'hidden', padding: '6px', borderRadius: '12px', transition: 'background 0.2s', marginLeft: '-6px' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
        >
          <div
            className="user-avatar"
            style={{ width: '42px', height: '42px', overflow: 'hidden', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-emerald))', padding: '2px', flexShrink: 0 }}
          >
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.image ? (
                <img src={user.image} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff', fontWeight: 'bold', fontSize: '0.95rem' }}>
                  {user ? user.name.substring(0, 2).toUpperCase() : 'US'}
                </span>
              )}
            </div>
          </div>
          
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ margin: '0 0 2px 0', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user ? user.name : 'Usuário'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)', boxShadow: '0 0 8px var(--accent-emerald)' }}></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Plano Grátis</span>
            </div>
          </div>
        </div>

        {/* Dropdown do Perfil */}
        <div 
          className={`profile-dropdown glass-dropdown ${dropdownOpen ? 'open' : ''}`} 
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '0',
            padding: '8px 0',
            display: dropdownOpen ? 'block' : 'none',
            minWidth: '160px',
            zIndex: 100
          }}
        >
          {user ? (
            <>
              <Link to="/configuracoes" style={{ display: 'block', padding: '8px 16px', color: 'var(--text-primary)', textDecoration: 'none' }} className="dropdown-item" onClick={() => setDropdownOpen(false)}>Configurações</Link>
              <button onClick={() => { logout(); setDropdownOpen(false); }} style={{ width: '100%', padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer' }} className="dropdown-item">Sair</button>
            </>
          ) : (
            <Link to="/login" style={{ display: 'block', padding: '8px 16px', color: 'var(--text-primary)', textDecoration: 'none' }} className="dropdown-item" onClick={() => setDropdownOpen(false)}>Fazer Login</Link>
          )}
        </div>

        {/* Notificações */}
        <div style={{ position: 'relative', marginLeft: '8px', flexShrink: 0 }}>
          <button 
            className="btn-glass bell-btn" 
            style={{ width: '40px', height: '40px', padding: '0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); setDropdownOpen(false); }}
          >
            <IconBell size={18} color="var(--text-primary)" />
            {notificacoes.length > 0 && (
              <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent-rose)', width: '6px', height: '6px', borderRadius: '50%' }}></span>
            )}
          </button>
          {/* Novo Notification Drawer (Painel Lateral) via Portal */}
          {createPortal(
            <div 
              style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '340px',
              background: 'rgba(0, 0, 0, 0.98)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.6)',
              zIndex: 9999,
              transform: notifOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()} // Previne que o click vaze
          >
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: '600' }}>Notificações</h3>
              <button 
                onClick={() => setNotifOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.8rem', lineHeight: 1, padding: '0 8px', borderRadius: '4px' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                &times;
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="custom-scrollbar">
              
              {notificacoes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Nenhuma notificação no momento.
                </div>
              ) : (
                notificacoes.map(notif => (
                  <div key={notif.id} style={{ display: 'block', textDecoration: 'none', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', marginTop: '6px', flexShrink: 0, boxShadow: '0 0 8px var(--accent-emerald)' }}></div>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Notificação</strong>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{notif.mensagem}</p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '10px' }}>
                          {notif.dataEnvio ? new Date(notif.dataEnvio).toLocaleDateString('pt-BR') : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

            </div>
          </div>,
          document.body
        )}
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;
