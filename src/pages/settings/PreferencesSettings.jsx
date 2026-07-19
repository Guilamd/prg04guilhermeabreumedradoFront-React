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

function PreferencesSettings({ onBack }) {
  const selectStyle = {
    width: '100%', padding: '14px', borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', appearance: 'none'
  };

  const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' };

  return (
    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px' }}>
        <button onClick={onBack} className="btn-icon-back">
          <IconArrowLeft />
        </button>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Preferências</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Seção Moeda / Idioma */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Moeda Principal</label>
            <div style={{ position: 'relative' }}>
              <select style={selectStyle} defaultValue="BRL">
                <option value="BRL" style={{ color: '#000' }}>Real (BRL)</option>
                <option value="USD" style={{ color: '#000' }}>Dólar (USD)</option>
                <option value="EUR" style={{ color: '#000' }}>Euro (EUR)</option>
              </select>
              <div style={{ position: 'absolute', right: '16px', top: '16px', pointerEvents: 'none' }}>▼</div>
            </div>
          </div>
          
          <div>
            <label style={labelStyle}>Idioma</label>
            <div style={{ position: 'relative' }}>
              <select style={selectStyle} defaultValue="pt-BR">
                <option value="pt-BR" style={{ color: '#000' }}>Português (Brasil)</option>
                <option value="en-US" style={{ color: '#000' }}>English (US)</option>
                <option value="es" style={{ color: '#000' }}>Español</option>
              </select>
              <div style={{ position: 'absolute', right: '16px', top: '16px', pointerEvents: 'none' }}>▼</div>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ marginTop: '8px' }}>
          <ToggleSwitch 
            label="Ocultar saldos por padrão" 
            description="Seus saldos já estarão borrados sempre que abrir o aplicativo." 
            defaultChecked={false} 
          />
          <ToggleSwitch 
            label="Modo escuro (Dark Mode)" 
            description="Utilizar o visual Glassmorphism Neon." 
            defaultChecked={true} 
          />
          <ToggleSwitch 
            label="Animações fluidas" 
            description="Desative para melhorar o desempenho em dispositivos antigos." 
            defaultChecked={true} 
          />
        </div>
        
      </div>
    </div>
  );
}

export default PreferencesSettings;
