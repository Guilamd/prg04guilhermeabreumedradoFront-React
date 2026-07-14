import React from 'react';

function ResumoMensal() {
  return (
    <article className="glass-card" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>receita mensal</p>
        <h3 className="text-emerald" style={{ fontSize: '1.8rem', fontWeight: '700' }}>R$ 13.883,00</h3>
      </div>
      <div style={{ width: '1px', height: '50px', background: 'var(--surface-border)' }}></div>
      <div style={{ textAlign: 'center' }}>
        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>despesa mensal</p>
        <h3 className="text-rose" style={{ fontSize: '1.8rem', fontWeight: '700' }}>R$ 12.802,36</h3>
      </div>
    </article>
  );
}

export default ResumoMensal;
