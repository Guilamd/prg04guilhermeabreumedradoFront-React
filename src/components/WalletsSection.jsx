import React, { useRef } from 'react';
import { IconBank, IconCard } from './Icons';
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
    <section className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Minhas Carteiras</h3>
        {user && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-glass" onClick={scrollLeft} style={{ padding: '4px 12px' }}>❮</button>
            <button className="btn-glass" onClick={scrollRight} style={{ padding: '4px 12px' }}>❯</button>
          </div>
        )}
      </div>
      <div 
        ref={gridRef}
        style={{ 
          display: 'flex', 
          gap: '16px', 
          overflowX: 'auto', 
          paddingBottom: '8px',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none'
        }}
      >
        {user ? (
          <>
            <div className="glass-card" style={{ minWidth: '220px', display: 'flex', gap: '16px', alignItems: 'center', padding: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(74, 144, 226, 0.2)', color: '#4A90E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconBank size={24} /></div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Banco Principal</h4>
                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>R$ 8.750,00</span>
              </div>
            </div>
            <div className="glass-card" style={{ minWidth: '220px', display: 'flex', gap: '16px', alignItems: 'center', padding: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(80, 227, 194, 0.2)', color: '#50E3C2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconCard size={24} /></div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cartão de Crédito</h4>
                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>R$ 3.595,67</span>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-card" style={{ width: '100%', textAlign: 'center', padding: '32px', borderStyle: 'dashed' }}>
            <span className="text-muted">Nenhuma carteira conectada.</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default WalletsSection;
