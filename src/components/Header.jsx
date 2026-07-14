import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IconBell } from './Icons';

function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);

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
    <header className="top-header">
      <div className="greeting">
        {user ? (
          <>
            <h2>Bem-vindo(a), {user.name}!</h2>
            <p>Aqui está o resumo de suas finanças.</p>
          </>
        ) : (
          <>
            <h2>Bem-vindo(a)!</h2>
            <p>Faça login para gerenciar suas finanças.</p>
          </>
        )}
      </div>
      <div className="header-user" ref={profileRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '24px' }}>
        
        {/* Notificações */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-glass" 
            style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
          >
            <IconBell size={20} color="var(--text-primary)" />
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--accent-rose)', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--bg-color)' }}></span>
          </button>
          
          <div 
            className={`glass-card ${notifOpen ? 'open' : ''}`} 
            style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              padding: '16px',
              display: notifOpen ? 'block' : 'none',
              minWidth: '280px',
              zIndex: 20
            }}
          >
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Notificações</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Conta vencendo amanhã</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Sua fatura do cartão vence no dia 15.</p>
              </div>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Transferência recebida</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Você recebeu um PIX de R$ 250,00.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Perfil */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-avatar"
            id="userAvatar"
            style={{ cursor: 'pointer' }}
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
          >
            {user ? user.name.substring(0, 2).toUpperCase() : '...'}
          </div>
          <div 
            className={`profile-dropdown ${dropdownOpen ? 'open' : ''}`} 
            id="profileDropdown"
            style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              background: 'var(--surface-color)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 0',
              backdropFilter: 'var(--glass-blur)',
              display: dropdownOpen ? 'block' : 'none',
              minWidth: '150px',
              zIndex: 20
            }}
          >
            {user ? (
              <button onClick={() => { logout(); setDropdownOpen(false); }} style={{ width: '100%', padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer' }} className="dropdown-item">Sair</button>
            ) : (
              <Link to="/login" style={{ display: 'block', padding: '8px 16px', color: 'var(--text-primary)', textDecoration: 'none' }} className="dropdown-item" onClick={() => setDropdownOpen(false)}>Fazer Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

