import React from 'react';

function DashboardVirtualCard() {
  return (
    <article className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Meu Cartão</h3>
      
      {/* Desenho do Cartão de Crédito */}
      <div style={{ 
        width: '100%', 
        height: '180px', 
        borderRadius: '16px', 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        position: 'relative', 
        overflow: 'hidden',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {/* Efeito de brilho de fundo */}
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '150px', height: '150px', background: 'var(--accent-purple)', filter: 'blur(60px)', opacity: 0.4, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '100px', height: '100px', background: 'var(--accent-emerald)', filter: 'blur(50px)', opacity: 0.3, borderRadius: '50%' }}></div>

        {/* Topo do cartão */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontWeight: '600', letterSpacing: '1px', color: '#fff', fontSize: '1.1rem' }}>FinTech</span>
          <div style={{ width: '32px', height: '24px', background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)', borderRadius: '4px' }}></div>
        </div>
        
        {/* Número e Nome */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '3px', fontSize: '1.2rem', marginBottom: '12px' }}>
            **** **** **** 3892
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <span style={{ color: '#fff', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Guilherme A. Medrado</span>
            <span style={{ color: '#fff', fontSize: '0.8rem' }}>12/28</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Limite disponível</span>
          <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>R$ 5.480,00</strong>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Fatura atual</span>
          <strong className="text-rose" style={{ fontSize: '1.1rem' }}>R$ 1.845,90</strong>
        </div>
      </div>
    </article>
  );
}

export default DashboardVirtualCard;
