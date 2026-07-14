import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function BalanceCard() {
  const { user } = useAuth();

  return (
    <article className="glass-card col-span-12" style={{ padding: '32px', marginBottom: '24px' }}>
      <h3 className="text-muted" style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Saldo Total Consolidado</h3>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
          <div className="balance-amount" style={{ fontSize: '3rem', fontWeight: '700', letterSpacing: '-1px' }}>
            R$ 12.345,67
          </div>
          <span className="text-emerald" style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '8px' }}>
            +2.5% este mês
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
          <div className="balance-amount text-muted" style={{ fontSize: '3rem', fontWeight: '700' }}>
            R$ 0,00
          </div>
          <span className="text-muted" style={{ marginBottom: '8px' }}>Conecte suas contas bancárias</span>
        </div>
      )}
    </article>
  );
}

export default BalanceCard;
