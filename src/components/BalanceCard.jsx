import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function BalanceCard() {
  const { user } = useAuth();

  return (
    <article className="card hero-card">
      <h3>Saldo Total Consolidado</h3>
      {user ? (
        <>
          <div className="balance-amount" id="totalBalance">R$ 12.345,67</div>
          <span className="trend positive" id="balanceTrend">+2.5%</span>
        </>
      ) : (
        <>
          <div className="balance-amount" id="totalBalance">R$ 0,00</div>
          <span className="trend" id="balanceTrend" style={{ color: 'var(--text-muted)' }}>Conecte suas contas bancárias</span>
        </>
      )}
    </article>
  );
}

export default BalanceCard;
