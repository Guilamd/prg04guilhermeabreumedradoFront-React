import React from 'react';

function CashFlowCard() {
  return (
    <section className="card cash-flow-card">
      <h3>Fluxo de Caixa (Evolução)</h3>
      <div className="chart-placeholder">
        <div className="chart-mockup" style={{ background: 'none', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sem dados suficientes</span>
        </div>
      </div>
    </section>
  );
}

export default CashFlowCard;
