import React from 'react';
import { IconMoney, IconArrowUpRight, IconArrowDownLeft, IconBarcode } from './Icons';

function DashboardSaldo() {
  return (
    <article className="glass-card" style={{ padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(30, 32, 45, 0.4) 100%)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <IconMoney size={20} color="var(--text-secondary)" />
          <span className="text-muted" style={{ fontWeight: '500', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Saldo Total</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
          <h2 style={{ fontSize: '3rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>R$ 14.945,61</h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '12px', fontWeight: '500', marginBottom: '4px' }}>+ 2.5%</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <button className="btn-glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 24px', width: '100px' }}>
          <IconArrowUpRight size={24} color="var(--text-primary)" />
          <span style={{ fontSize: '0.85rem' }}>Transferir</span>
        </button>
        <button className="btn-glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 24px', width: '100px' }}>
          <IconArrowDownLeft size={24} color="var(--text-primary)" />
          <span style={{ fontSize: '0.85rem' }}>Receber</span>
        </button>
        <button className="btn-glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 24px', width: '100px' }}>
          <IconBarcode size={24} color="var(--text-primary)" />
          <span style={{ fontSize: '0.85rem' }}>Pagar</span>
        </button>
      </div>
    </article>
  );
}

export default DashboardSaldo;
