import React from 'react';

function CashFlowCard() {
  return (
    <section className="glass-card col-span-8">
      <h3 style={{ marginBottom: '24px' }}>Evolução do Fluxo de Caixa</h3>
      <div className="chart-placeholder" style={{ height: '300px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="text-muted">Sem dados suficientes para gerar o gráfico</span>
      </div>
    </section>
  );
}

export default CashFlowCard;
