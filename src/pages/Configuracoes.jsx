import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileSettings from './settings/ProfileSettings';
import PreferencesSettings from './settings/PreferencesSettings';
import SubscriptionSettings from './settings/SubscriptionSettings';
import SecuritySettings from './settings/SecuritySettings';
import NotificationSettings from './settings/NotificationSettings';
import { IconSettings, IconMoney, IconCard, IconTarget, IconClose } from '../components/Icons';
import api from '../services/api';

/* Ícone de seta para a direita (chevron) */
const IconChevronRight = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

/* Ícone de usuário (perfil) */
const IconUser = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

/* Ícone de escudo (segurança) */
const IconShield = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

/* Ícone de sino (notificações) */
const IconBellSmall = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

/* Ícone de logout */
const IconLogout = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

/* Ícone de lixeira */
const IconTrash = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

/* Componente de item do menu */
function MenuItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: 'none',
        borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s',
        color: danger ? 'var(--accent-rose)' : 'var(--text-primary)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {icon}
        <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{label}</span>
      </div>
      <IconChevronRight size={18} color="var(--text-secondary)" />
    </button>
  );
}

function Configuracoes() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(5);

  useEffect(() => {
    let timer;
    if (isDeleteModalOpen && deleteCountdown > 0) {
      timer = setTimeout(() => setDeleteCountdown(deleteCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [isDeleteModalOpen, deleteCountdown]);

  const iniciais = user ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';
  const nomeUsuario = user ? user.name : 'Usuário';

  /* Conta quantas carteiras existem (mock) */
  const totalBancos = 4;

  if (activeTab === 'profile') return <section style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}><ProfileSettings user={user} onBack={() => setActiveTab('menu')} /></section>;
  if (activeTab === 'preferences') return <section style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}><PreferencesSettings onBack={() => setActiveTab('menu')} /></section>;
  if (activeTab === 'subscription') return <section style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}><SubscriptionSettings onBack={() => setActiveTab('menu')} /></section>;
  if (activeTab === 'security') return <section style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}><SecuritySettings onBack={() => setActiveTab('menu')} /></section>;
  if (activeTab === 'notifications') return <section style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}><NotificationSettings onBack={() => setActiveTab('menu')} /></section>;

  return (
    <section style={{ display: 'flex', justifyContent: 'center', padding: '16px 0', animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>

        {/* Avatar + Nome */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-emerald) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', fontWeight: 'bold', color: '#fff',
            }}>
              {user?.image ? (
                <img src={user.image} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                iniciais
              )}
            </div>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>{nomeUsuario}</h2>
        </div>

        {/* Cards de Resumo (Plano + Conexões) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
          <button 
            onClick={() => setActiveTab('subscription')}
            style={{
              padding: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: 'none',
              display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <IconTarget size={20} color="var(--text-secondary)" />
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Grátis</strong>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Plano</span>
          </button>
          <button 
            onClick={() => navigate('/carteiras')}
            style={{
              padding: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: 'none',
              display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <IconCard size={20} color="var(--text-secondary)" />
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{totalBancos} Bancos</strong>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Conexões</span>
          </button>
        </div>

        {/* Seção: Geral */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', paddingLeft: '4px' }}>Geral</span>
          <MenuItem icon={<IconUser size={18} color="var(--text-secondary)" />} label="Perfil" onClick={() => setActiveTab('profile')} />
          <MenuItem icon={<IconSettings size={18} color="var(--text-secondary)" />} label="Preferências" onClick={() => setActiveTab('preferences')} />
          <MenuItem icon={<IconCard size={18} color="var(--text-secondary)" />} label="Assinatura" onClick={() => setActiveTab('subscription')} />
        </div>

        {/* Seção: Segurança */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', paddingLeft: '4px' }}>Segurança</span>
          <MenuItem icon={<IconShield size={18} color="var(--text-secondary)" />} label="Alterar senha" onClick={() => setActiveTab('security')} />
          <MenuItem icon={<IconBellSmall size={18} color="var(--text-secondary)" />} label="Notificações" onClick={() => setActiveTab('notifications')} />
        </div>

        {/* Seção: Conta */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', paddingLeft: '4px' }}>Conta</span>
          <MenuItem icon={<IconLogout size={18} color="var(--accent-rose)" />} label="Encerrar sessão" onClick={logout} danger />
          <MenuItem icon={<IconTrash size={18} color="var(--accent-rose)" />} label="Excluir minha conta" onClick={() => { setIsDeleteModalOpen(true); setDeleteCountdown(5); }} danger />
        </div>

        {/* Informações do Sistema */}
        <div style={{ marginTop: '24px', textAlign: 'center', opacity: 0.6 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <p style={{ margin: '0 0 4px 0' }}>© 2026 <strong>FinTech</strong> — Guilherme Abreu Medrado</p>
            <p style={{ margin: '0' }}>PRG04 — Programação Web</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.65rem' }}>Versão 1.0.0</p>
          </div>
        </div>

      </div>

      {/* Modal de Exclusão de Conta */}
      {isDeleteModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ padding: '32px', maxWidth: '400px', width: '90%', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <IconTrash size={32} color="var(--accent-rose)" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>Excluir Conta?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>
              Esta ação é irreversível. Sua conta será permanentemente excluída do aplicativo.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <button 
                className={deleteCountdown === 0 ? 'btn-danger-outline' : ''}
                disabled={deleteCountdown > 0}
                onClick={async () => {
                  if (user && user.id) {
                    try {
                      await api.delete(`/usuarios/${user.id}`);
                      alert('Conta excluída com sucesso!');
                      logout();
                    } catch(err) {
                      console.error(err);
                      alert('Erro ao excluir conta.');
                    }
                  } else {
                    logout();
                  }
                }}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: deleteCountdown > 0 ? 'not-allowed' : 'pointer',
                  background: deleteCountdown > 0 ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.1)',
                  color: deleteCountdown > 0 ? 'var(--text-muted)' : 'var(--accent-rose)',
                  transition: 'all 0.3s'
                }}
              >
                {deleteCountdown > 0 ? `Excluir Conta (${deleteCountdown}s)` : 'Sim, Excluir Minha Conta'}
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', border: '1px solid var(--surface-border)', cursor: 'pointer',
                  background: 'transparent', color: 'var(--text-primary)', transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default Configuracoes;
