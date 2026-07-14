import React, { useState } from 'react';
import ListaContas from '../components/ListaContas';
import { IconBank } from '../components/Icons';

function Carteiras() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="dashboard-grid">
      <div className="col-span-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Minhas Carteiras</h2>
          <p className="text-muted">Gerencie suas contas bancárias e integrações.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + Adicionar Banco
        </button>
      </div>

      {showForm && (
        <div className="glass-card col-span-12" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Conectar nova conta</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nome da Instituição</label>
              <input type="text" placeholder="Ex: Nubank, Itaú..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Saldo Inicial (R$)</label>
              <input type="text" placeholder="0,00" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} />
            </div>
            <button className="btn-primary" onClick={() => setShowForm(false)}>Salvar Conta</button>
          </div>
        </div>
      )}

      <div className="col-span-8">
        <ListaContas />
      </div>

      <div className="col-span-4">
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <IconBank size={48} color="var(--accent-emerald)" />
          </div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Open Finance</h4>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '24px' }}>Em breve você poderá conectar suas contas automaticamente via Open Finance.</p>
          <button className="btn-glass" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Conexão Automática</button>
        </div>
      </div>
    </section>
  );
}

export default Carteiras;
