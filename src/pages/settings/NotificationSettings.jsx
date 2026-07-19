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

function NotificationSettings({ onBack }) {
  return (
    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px' }}>
        <button onClick={onBack} className="btn-icon-back">
          <IconArrowLeft />
        </button>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Notificações</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: 'var(--text-primary)' }}>Notificações Push (Celular)</h3>
          <div className="glass-card" style={{ padding: '0 20px' }}>
            <ToggleSwitch 
              label="Transações" 
              description="Seja avisado sempre que uma transação for criada, editada ou excluída." 
              defaultChecked={true} 
            />
            <ToggleSwitch 
              label="Vencimento de Faturas" 
              description="Receba alertas 3 dias antes do vencimento do seu cartão de crédito." 
              defaultChecked={true} 
            />
            <ToggleSwitch 
              label="Metas Atingidas" 
              description="Celebre sempre que alcançar uma meta financeira (ex: Viagem)." 
              defaultChecked={true} 
            />
          </div>
        </div>

        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: 'var(--text-primary)' }}>E-mail</h3>
          <div className="glass-card" style={{ padding: '0 20px' }}>
            <ToggleSwitch 
              label="Resumo Semanal" 
              description="Receba um e-mail toda segunda-feira com o resumo dos seus gastos da semana anterior." 
              defaultChecked={false} 
            />
            <ToggleSwitch 
              label="Dicas e Novidades" 
              description="Fique por dentro das atualizações do App e dicas financeiras."
              defaultChecked={false} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default NotificationSettings;
