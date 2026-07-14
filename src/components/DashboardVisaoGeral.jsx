import React from 'react';

function DashboardVisaoGeral() {
  const itens = [
    { id: 1, nome: 'Receitas', valor: '13.883,00', color: 'var(--accent-emerald)', sign: '' },
    { id: 2, nome: 'Despesas', valor: '12.802,36', color: 'var(--accent-rose)', sign: '' },
    { id: 3, nome: 'Despesas no crédito', valor: '2.607,15', color: '#F59E0B', sign: '' },
  ];

  return (
    <article className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Visão geral do mês</h3>
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>Jul., 26</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {itens.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '3px', height: '16px', backgroundColor: item.color, borderRadius: '2px' }}></div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item.nome}</strong>
            </div>
            <strong style={{ color: item.color, fontSize: '0.95rem' }}>{item.sign}R$ {item.valor}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

export default DashboardVisaoGeral;
