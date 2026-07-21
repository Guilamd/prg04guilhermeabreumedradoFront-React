import React, { useState, useRef, useEffect } from 'react';
import { IconMoreVertical, IconClose, IconMoney, DynamicBankIcon } from './Icons';

function ListaContas({ contas = [], onDeleteConta, onAjustarSaldo }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (e, id) => {
    e.stopPropagation(); // Prevents opening the modal when clicking the 3 dots
    setMenuOpen(menuOpen === id ? null : id);
  };

  return (
    <>
      <article ref={listRef} className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Minhas contas</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {contas.map(conta => (
            <div 
              key={conta.id} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s', borderBottom: '1px solid var(--surface-border)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              onClick={() => setSelectedAccount(conta)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                  <DynamicBankIcon bankName={conta.nome} size={24} color="#fff" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{conta.nome}</strong>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>{conta.subtexto}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="text-emerald blur-balance" style={{ fontWeight: '600', fontSize: '1.05rem' }}>
                  R$ {conta.saldo}
                </div>
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={(e) => handleMenuClick(e, conta.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                  >
                    <IconMoreVertical size={20} />
                  </button>
                  
                  {menuOpen === conta.id && (
                    <div className="glass-card" style={{ position: 'absolute', right: '0', top: '30px', zIndex: 10, minWidth: '150px', padding: '8px 0' }}>
                      <button style={{ width: '100%', padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onAjustarSaldo && onAjustarSaldo(conta.id); setMenuOpen(null); }}>Ajustar Saldo</button>
                      <button style={{ width: '100%', padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--accent-rose)', textAlign: 'left', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onDeleteConta && onDeleteConta(conta.id); setMenuOpen(null); }}>Excluir Conta</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Modal de Detalhes da Conta */}
      {selectedAccount && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '0', overflow: 'hidden' }}>
            {/* Header do Modal com cor do Banco */}
            <div style={{ background: selectedAccount.color, padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <DynamicBankIcon bankName={selectedAccount.nome} size={48} type="bank" />
                <div style={{ color: '#fff' }}>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{selectedAccount.nome}</h2>
                  <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>{selectedAccount.subtexto}</span>
                </div>
              </div>
              <button onClick={() => setSelectedAccount(null)} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                <IconClose size={20} />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px' }}>Saldo Atual</span>
                <strong className="blur-balance" style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>R$ {selectedAccount.saldo}</strong>
              </div>
              
              <h4 style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>Extrato da Conta</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Lançamento 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--surface-color)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconMoney size={16} color="var(--text-secondary)" />
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Transferência Pix</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Hoje, 14:30</span>
                    </div>
                  </div>
                  <strong className="text-emerald blur-balance" style={{ fontSize: '0.9rem' }}>+ R$ 150,00</strong>
                </div>

                {/* Lançamento 2 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--surface-color)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconMoney size={16} color="var(--text-secondary)" />
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Pagamento Boleto</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Ontem</span>
                    </div>
                  </div>
                  <strong className="text-rose blur-balance" style={{ fontSize: '0.9rem' }}>- R$ 89,90</strong>
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', marginTop: '24px' }}>+ Novo Lançamento</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListaContas;
