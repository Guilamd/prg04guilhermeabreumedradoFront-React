import React, { useState } from 'react';
import { IconArrowLeft } from '../../components/Icons';

/* Componente simples de Toggle (Switch) */
function ToggleSwitch({ label, description, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ paddingRight: '16px' }}>
        <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{label}</strong>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{description}</span>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px',
          background: checked ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.1)',
          position: 'relative', border: 'none', cursor: 'pointer', transition: 'background 0.3s'
        }}
      >
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
          position: 'absolute', top: '3px', left: checked ? '23px' : '3px', transition: 'left 0.3s'
        }} />
      </button>
    </div>
  );
}

function SecuritySettings({ onBack }) {
  const inputStyle = {
    width: '100%', padding: '14px', borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s'
  };

  const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' };

  return (
    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px' }}>
        <button onClick={onBack} className="btn-icon-back">
          <IconArrowLeft />
        </button>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Segurança e Senhas</h2>
      </div>

      {/* Alterar Senha */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Alterar Senha</h3>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => { e.preventDefault(); onBack(); }}>
          <div>
            <label style={labelStyle}>Senha Atual</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Nova Senha</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Confirmar Nova Senha</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
          </div>
          <button className="btn-primary" style={{ marginTop: '8px', padding: '14px', borderRadius: '12px', fontSize: '1rem' }}>
            Atualizar Senha
          </button>
        </form>
      </div>

      {/* Proteção Extra */}
      <div style={{ marginTop: '8px' }}>
        <ToggleSwitch 
          label="Autenticação em 2 Fatores (2FA)" 
          description="Exigir código de verificação enviado por e-mail ou app autenticador ao fazer login em novos dispositivos." 
          defaultChecked={false} 
        />
        <ToggleSwitch 
          label="Alertas de Acesso" 
          description="Receber e-mail sempre que um novo dispositivo fizer login na sua conta." 
          defaultChecked={true} 
        />
      </div>

      <button onClick={onBack} className="btn-danger-outline">
        Desconectar de todos os dispositivos
      </button>

    </div>
  );
}

export default SecuritySettings;
