import React from 'react';
import { IconArrowLeft } from '../../components/Icons';

function SubscriptionSettings({ onBack }) {
  return (
    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px' }}>
        <button onClick={onBack} className="btn-icon-back">
          <IconArrowLeft />
        </button>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Assinatura</h2>
      </div>

      {/* Plano Atual */}
      <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Plano Atual</span>
          <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.8rem', color: 'var(--text-primary)' }}>Plano Básico</h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Grátis para sempre.</p>
        </div>
      </div>

      {/* Upgrade Upsell */}
      <div className="glass-card" style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, rgba(130,10,209,0.1) 0%, rgba(80,227,194,0.1) 100%)',
        border: '1px solid rgba(80,227,194,0.3)',
        display: 'flex', flexDirection: 'column', gap: '20px'
      }}>
        <div>
          <span style={{ 
            background: 'var(--accent-emerald)', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', 
            padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '1px' 
          }}>
            Recomendado
          </span>
          <h3 style={{ margin: '16px 0 8px 0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Plano Premium</h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Desbloqueie o poder total das suas finanças com relatórios inteligentes, categorias ilimitadas e contas conjuntas.
          </p>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['Contas e cartões ilimitados', 'Categorização automática com IA', 'Relatórios mensais em PDF', 'Suporte prioritário'].map((benefit, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(80,227,194,0.2)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              {benefit}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <div>
            <strong style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>R$ 19,90</strong>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>/mês</span>
          </div>
          <button className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold' }} onClick={onBack}>
            Assinar Agora
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default SubscriptionSettings;
