import React from 'react';

function DashboardPendencias() {
  const itens = [
    { id: 1, nome: 'Receitas pendentes', subtexto: 'Total desse mês e dos anteriores', valor: '350,00', color: '#3B82F6' },
    { id: 2, nome: 'Despesas pendentes', subtexto: 'Total desse mês e dos anteriores', valor: '890,00', color: '#F59E0B' },
    { id: 3, nome: 'Faturas de cartão', subtexto: 'Faturas abertas que vencem esse mês', valor: '2.607,15', color: 'var(--accent-purple)' },
    { id: 4, nome: 'Saldo seguro', subtexto: 'Total das contas menos despesas pendentes', valor: '11.448,46', color: 'var(--text-primary)' },
  ];

  return (
    <article className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Pendências e alertas</h3>
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>Jul., 26</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {itens.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '3px', height: '32px', backgroundColor: item.color, borderRadius: '2px' }}></div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item.nome}</strong>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{item.subtexto}</span>
              </div>
            </div>
            <strong style={{ color: item.color, fontSize: '0.95rem' }}>R$ {item.valor}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

export default DashboardPendencias;
