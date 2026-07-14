import React from 'react';

function DashboardChartCard() {
  // Dados mockados para um gráfico simples feito com CSS
  const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const maxBarHeight = 120; // px
  
  return (
    <article className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, marginBottom: '4px' }}>Fluxo de Caixa</h3>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Receitas e despesas dos últimos 7 dias</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></div>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Receitas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-rose)' }}></div>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Despesas</span>
          </div>
        </div>
      </div>
      
      {/* Gráfico Visual Mockado em CSS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', paddingBottom: '8px', borderBottom: '1px solid var(--surface-border)' }}>
        {dias.map((dia, index) => {
          // Valores aleatórios para a demonstração visual
          const receitaH = Math.random() * maxBarHeight;
          const despesaH = Math.random() * (maxBarHeight * 0.8);
          
          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: maxBarHeight }}>
                {/* Barra de Despesa */}
                <div style={{ width: '8px', height: `${despesaH}px`, background: 'var(--accent-rose)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                {/* Barra de Receita */}
                <div style={{ width: '8px', height: `${receitaH}px`, background: 'var(--accent-emerald)', borderRadius: '4px 4px 0 0' }}></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Eixo X */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px' }}>
        {dias.map((dia, index) => (
          <span key={index} className="text-muted" style={{ fontSize: '0.75rem', width: '30px', textAlign: 'center' }}>{dia}</span>
        ))}
      </div>
    </article>
  );
}

export default DashboardChartCard;
