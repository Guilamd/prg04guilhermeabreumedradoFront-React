import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IconHome, IconMoney } from './Icons';

function RecentActivitiesCard() {
  const { user } = useAuth();

  return (
    <section className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Fluxo de caixa</h3>
        <a href="#" className="text-emerald" style={{ fontSize: '0.8rem', textDecoration: 'none' }}>Ver tudo</a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Grupo: Dia atual */}
        <div>
          <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '12px' }}>Dia atual</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconHome size={18} color="#fff" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Conta de luz</strong>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Conta Nubank</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong className="text-rose" style={{ display: 'block', fontSize: '0.9rem' }}>- R$ 258,00</strong>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>pago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grupo: Ontem */}
        <div>
          <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '12px' }}>Ontem</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconMoney size={18} color="#fff" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Salário</strong>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Conta Santander</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong className="text-emerald" style={{ display: 'block', fontSize: '0.9rem' }}>+ R$ 5.000,00</strong>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>recebido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecentActivitiesCard;
