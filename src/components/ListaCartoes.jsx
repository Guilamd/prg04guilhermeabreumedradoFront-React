import React from 'react';
import { IconCard, DynamicBankIcon } from './Icons';

function ListaCartoes() {
  const cartoes = [
    { id: 1, nome: 'Inter', subtexto: 'Cartão manual', limite: '5.000,00', fatura: '0,00', color: '#FF7A00', icon: <IconCard size={20} color="#fff" /> },
    { id: 2, nome: 'Cartão Nubank', subtexto: 'Cartão conectado', limite: '10.156,56', fatura: '-2.607,15', color: '#8A05BE', icon: <IconCard size={20} color="#fff" /> },
    { id: 3, nome: 'Cartão Itaú', subtexto: 'Cartão conectado', limite: '2.500,00', fatura: '-450,00', color: '#EC0000', icon: <IconCard size={20} color="#fff" /> },
    { id: 4, nome: 'Cartão XP', subtexto: 'Cartão manual', limite: '15.000,00', fatura: '-1.200,00', color: '#000000', icon: <IconCard size={20} color="#fff" /> },
  ];

  return (
    <article className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Meus cartões</h3>
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{cartoes.length} cartões</span>
      </div>
      
      {/* Contêiner com Scroll */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
        {cartoes.map(cartao => (
          <div key={cartao.id} style={{ paddingBottom: '16px', borderBottom: '1px solid var(--surface-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: cartao.color, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <DynamicBankIcon bankName={cartao.nome} size={40} type="card" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{cartao.nome}</strong>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>{cartao.subtexto}</span>
                </div>
              </div>
              <a href="#" className="text-emerald" style={{ fontSize: '0.8rem', textDecoration: 'none' }}>Ver fatura</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
              <div>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Limite Disponível</span>
                <strong style={{ fontSize: '0.9rem' }}>R$ {cartao.limite}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="text-muted" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Fatura atual</span>
                <strong style={{ fontSize: '0.9rem', color: cartao.fatura.startsWith('-') ? 'var(--text-primary)' : 'var(--text-primary)' }}>R$ {cartao.fatura}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ListaCartoes;
