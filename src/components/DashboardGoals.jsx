import React from 'react';

function DashboardGoals() {
  const metas = [
    { id: 1, categoria: 'Alimentação', gasto: 1250, limite: 1500, color: 'var(--accent-purple)' },
    { id: 2, categoria: 'Transporte', gasto: 450, limite: 500, color: '#F59E0B' },
    { id: 3, categoria: 'Lazer', gasto: 300, limite: 800, color: 'var(--accent-emerald)' },
  ];

  return (
    <article className="glass-card" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, marginBottom: '24px' }}>Limites de Gastos</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {metas.map(meta => {
          const percent = Math.min((meta.gasto / meta.limite) * 100, 100);
          return (
            <div key={meta.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{meta.categoria}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  R$ {meta.gasto} <span style={{ opacity: 0.5 }}>/ {meta.limite}</span>
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${percent}%`, height: '100%', background: meta.color, borderRadius: '3px', transition: 'width 1s ease' }}></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="btn-glass" style={{ width: '100%', marginTop: '24px', fontSize: '0.85rem', padding: '8px' }}>
        Definir nova meta
      </button>
    </article>
  );
}

export default DashboardGoals;
