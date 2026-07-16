import React from 'react';
import { IconTarget, IconMoreVertical } from '../components/Icons';

function Metas() {
  const metas = [
    { id: 1, categoria: 'Alimentação', gasto: 1250, limite: 1500, color: 'var(--accent-purple)' },
    { id: 2, categoria: 'Transporte', gasto: 450, limite: 500, color: '#F59E0B' }, // Yellow/Orange
    { id: 3, categoria: 'Lazer', gasto: 300, limite: 800, color: 'var(--accent-emerald)' },
    { id: 4, categoria: 'Saúde', gasto: 150, limite: 300, color: '#3B82F6' }, // Blue
    { id: 5, categoria: 'Educação', gasto: 600, limite: 600, color: 'var(--accent-rose)' }, // Red (Estourado)
    { id: 6, categoria: 'Moradia', gasto: 2000, limite: 2500, color: 'var(--text-primary)' },
  ];

  return (
    <section className="dashboard-grid">
      <div className="col-span-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Metas de Gastos</h2>
          <p className="text-muted">Defina orçamentos para categorias e acompanhe o que você já gastou no mês.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconTarget size={18} />
          + Nova Meta
        </button>
      </div>

      <div className="col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {metas.map(meta => {
          const percent = Math.min((meta.gasto / meta.limite) * 100, 100);
          
          // Lógica de cores baseada no percentual (verde < 75%, amarelo > 75%, vermelho > 95%)
          let barColor = meta.color;
          if (percent >= 95) barColor = 'var(--accent-rose)'; // Quase estourando ou estourado
          else if (percent >= 75 && barColor !== 'var(--accent-rose)') barColor = '#F59E0B'; // Atenção

          return (
            <article key={meta.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: meta.color }}></div>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>{meta.categoria}</h3>
                </div>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <IconMoreVertical size={20} />
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end' }}>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)', lineHeight: 1 }}>R$ {meta.gasto}</strong>
                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>de R$ {meta.limite}</span>
                </div>
                
                {/* Barra de Progresso Grossa */}
                <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${percent}%`, height: '100%', background: barColor, borderRadius: '6px', transition: 'width 1s ease' }}></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: percent >= 95 ? 'var(--accent-rose)' : 'var(--text-secondary)' }}>
                    {percent.toFixed(1)}% utilizado
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    R$ {(meta.limite - meta.gasto).toFixed(2)} restante
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Metas;
