import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IconSettings, IconMoney, IconCard, IconTarget, IconClose } from '../components/Icons';

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

  const iniciais = user ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';
  const nomeUsuario = user ? user.name : 'Usuário';

  /* Conta quantas carteiras existem (mock) */
  const totalBancos = 4;

  return (
    <section style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>

        {/* Avatar + Nome */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-emerald) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', fontWeight: 'bold', color: '#fff',
            }}>
              {iniciais}
            </div>
            {/* Botão de editar foto */}
            <button style={{
              position: 'absolute', bottom: '0', right: '0',
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'var(--surface-color)', border: '2px solid var(--bg-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>{nomeUsuario}</h2>
        </div>

        {/* Cards de Resumo (Plano + Conexões) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
          <div style={{
            padding: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <IconTarget size={20} color="var(--text-secondary)" />
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Grátis</strong>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Plano</span>
          </div>
          <div style={{
            padding: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <IconCard size={20} color="var(--text-secondary)" />
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{totalBancos} Bancos</strong>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Conexões</span>
          </div>
        </div>

        {/* Seção: Geral */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', paddingLeft: '4px' }}>Geral</span>
          <MenuItem icon={<IconUser size={18} color="var(--text-secondary)" />} label="Perfil" />
          <MenuItem icon={<IconSettings size={18} color="var(--text-secondary)" />} label="Preferências" />
          <MenuItem icon={<IconCard size={18} color="var(--text-secondary)" />} label="Assinatura" />
        </div>

        {/* Seção: Segurança */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', paddingLeft: '4px' }}>Segurança</span>
          <MenuItem icon={<IconShield size={18} color="var(--text-secondary)" />} label="Alterar senha" />
          <MenuItem icon={<IconBellSmall size={18} color="var(--text-secondary)" />} label="Notificações" />
        </div>

        {/* Seção: Conta */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', paddingLeft: '4px' }}>Conta</span>
          <MenuItem icon={<IconLogout size={18} color="var(--accent-rose)" />} label="Encerrar sessão" onClick={logout} danger />
          <MenuItem icon={<IconTrash size={18} color="var(--accent-rose)" />} label="Excluir minha conta" danger />
        </div>

      </div>
    </section>
  );
}

export default Configuracoes;
