import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

function WalletsSection() {
  const { user } = useAuth();
  const gridRef = useRef(null);

  const scrollLeft = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <section className="wallets-section">
      <div className="wallets-section-header">
        <h3>Minhas Carteiras</h3>
        {user && (
          <div className="wallet-controls" id="walletControls">
            <button className="scroll-btn" id="btnScrollLeft" aria-label="Rolar Esquerda" onClick={scrollLeft}>❮</button>
            <button className="scroll-btn" id="btnScrollRight" aria-label="Rolar Direita" onClick={scrollRight}>❯</button>
          </div>
        )}
      </div>
      <div className="wallets-grid" id="walletsGrid" ref={gridRef}>
        {user ? (
          <>
            <div className="card wallet-card">
              <div className="wallet-icon" style={{ background: '#4A90E2' }}>🏦</div>
              <div className="wallet-info">
                <h4>Banco Principal</h4>
                <span>R$ 8.750,00</span>
              </div>
            </div>
            <div className="card wallet-card">
              <div className="wallet-icon" style={{ background: '#50E3C2' }}>💳</div>
              <div className="wallet-info">
                <h4>Cartão de Crédito</h4>
                <span>R$ 3.595,67</span>
              </div>
            </div>
          </>
        ) : (
          <div className="card wallet-card" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderStyle: 'dashed', opacity: 0.7, width: '100%' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nenhuma carteira conectada.</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default WalletsSection;
