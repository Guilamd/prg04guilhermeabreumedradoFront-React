import React from 'react';
import { IconArrowLeft } from '../../components/Icons';
import CustomSelect from '../../components/CustomSelect';
import { getCurrencyPreference, setCurrencyPreference, getLanguagePreference, setLanguagePreference } from '../../utils/currency';
import { usePreferences } from '../../contexts/PreferencesContext';

/* Componente simples de Toggle (Switch) */
function ToggleSwitch({ label, description, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ paddingRight: '16px' }}>
        <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{label}</strong>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{description}</span>
      </div>
      <button 
        onClick={() => onChange(!checked)}
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
  const { hideBalances, setHideBalances, theme, setTheme, fluidAnimations, setFluidAnimations } = usePreferences();

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
            <CustomSelect
              value={getCurrencyPreference()}
              onChange={(val) => {
                setCurrencyPreference(val);
                window.location.reload();
              }}
              options={[
                { label: 'Real (BRL)', value: 'BRL' },
                { label: 'Dólar (USD)', value: 'USD' },
                { label: 'Euro (EUR)', value: 'EUR' }
              ]}
            />
          </div>
          
          <div>
            <label style={labelStyle}>Idioma</label>
            <CustomSelect
              value={getLanguagePreference()}
              onChange={(val) => {
                setLanguagePreference(val);
                window.location.reload();
              }}
              options={[
                { label: 'Português (Brasil)', value: 'pt-BR' },
                { label: 'English (US)', value: 'en-US' },
                { label: 'Español', value: 'es' }
              ]}
            />
          </div>
        </div>

        {/* Toggles */}
        <div style={{ marginTop: '8px' }}>
          <ToggleSwitch 
            label="Ocultar saldos por padrão" 
            description="Seus saldos já estarão borrados sempre que abrir o aplicativo." 
            checked={hideBalances}
            onChange={setHideBalances}
          />
          <ToggleSwitch 
            label="Animações fluidas" 
            description="Desative para melhorar o desempenho em dispositivos antigos." 
            checked={fluidAnimations}
            onChange={setFluidAnimations}
          />
        </div>
        
      </div>
    </div>
  );
}

export default PreferencesSettings;
