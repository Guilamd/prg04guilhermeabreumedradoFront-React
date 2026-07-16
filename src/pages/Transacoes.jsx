import React, { useState } from 'react';
import { IconMoney, IconMoreVertical } from '../components/Icons';

function Transacoes() {
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // Lançamentos mockados
  const transacoes = [
    { id: 1, data: '16 Jul', descricao: 'Salário mensal', categoria: 'Renda', conta: 'Conta Nubank', valor: '5.200,00', tipo: 'receita' },
    { id: 2, data: '15 Jul', descricao: 'Mercado Carrefour', categoria: 'Alimentação', conta: 'Cartão Inter', valor: '345,90', tipo: 'despesa' },
    { id: 3, data: '14 Jul', descricao: 'Netflix', categoria: 'Lazer', conta: 'Cartão Nubank', valor: '39,90', tipo: 'despesa' },
    { id: 4, data: '12 Jul', descricao: 'Transferência Pix João', categoria: 'Transferência', conta: 'Conta Santander', valor: '150,00', tipo: 'receita' },
    { id: 5, data: '10 Jul', descricao: 'Conta de Luz', categoria: 'Moradia', conta: 'Conta Caixa Econômica', valor: '185,40', tipo: 'despesa' },
    { id: 6, data: '05 Jul', descricao: 'Uber', categoria: 'Transporte', conta: 'Cartão XP', valor: '24,50', tipo: 'despesa' },
    { id: 7, data: '01 Jul', descricao: 'Rendimento CDI', categoria: 'Investimentos', conta: 'Conta Inter', valor: '12,45', tipo: 'receita' },
  ];

  // Filtro simples no front-end para dar a sensação de funcionamento
  const transacoesFiltradas = transacoes.filter(t => {
    const matchTexto = t.descricao.toLowerCase().includes(filtroTexto.toLowerCase()) || t.categoria.toLowerCase().includes(filtroTexto.toLowerCase());
    const matchTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;
    return matchTexto && matchTipo;
  });

  return (
    <section className="dashboard-grid">
      <div className="col-span-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Transações</h2>
          <p className="text-muted">Acompanhe seu extrato detalhado e encontre lançamentos específicos.</p>
        </div>
        <button className="btn-primary">
          + Novo Lançamento
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="glass-card col-span-12" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', padding: '16px 24px' }}>
        <input 
          type="text" 
          placeholder="Buscar por nome ou categoria..." 
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
          style={{ 
            flex: 1, 
            padding: '12px 16px', 
            borderRadius: '8px', 
            border: '1px solid var(--surface-border)', 
            background: 'rgba(0,0,0,0.2)', 
            color: 'var(--text-primary)',
            outline: 'none'
          }} 
        />
        <select 
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          style={{ 
            padding: '12px 16px', 
            borderRadius: '8px', 
            border: '1px solid var(--surface-border)', 
            background: 'rgba(0,0,0,0.2)', 
            color: 'var(--text-primary)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="todos" style={{ background: 'var(--bg-color)' }}>Todas as transações</option>
          <option value="receita" style={{ background: 'var(--bg-color)' }}>Somente Entradas</option>
          <option value="despesa" style={{ background: 'var(--bg-color)' }}>Somente Saídas</option>
        </select>
      </div>

      {/* Tabela de Transações */}
      <div className="glass-card col-span-12" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 2fr 1fr 1fr 50px', gap: '16px', padding: '16px 24px', borderBottom: '1px solid var(--surface-border)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <div>Data</div>
          <div>Descrição</div>
          <div>Conta/Cartão</div>
          <div style={{ textAlign: 'right' }}>Valor</div>
          <div></div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {transacoesFiltradas.length > 0 ? transacoesFiltradas.map((t, index) => (
            <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '80px 2fr 1fr 1fr 50px', gap: '16px', padding: '16px 24px', borderBottom: index < transacoesFiltradas.length - 1 ? '1px solid var(--surface-border)' : 'none', alignItems: 'center', transition: 'background 0.2s', cursor: 'pointer' }}
                 onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div className="text-muted" style={{ fontSize: '0.9rem' }}>{t.data}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-color)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconMoney size={16} color="var(--text-secondary)" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{t.descricao}</strong>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>{t.categoria}</span>
                </div>
              </div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>{t.conta}</div>
              <div style={{ textAlign: 'right', fontWeight: '600', fontSize: '0.95rem', color: t.tipo === 'receita' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                  <IconMoreVertical size={20} />
                </button>
              </div>
            </div>
          )) : (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Nenhuma transação encontrada com os filtros atuais.
            </div>
          )}
        </div>
        
        {/* Paginação */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Mostrando {transacoesFiltradas.length} resultados</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-glass" disabled style={{ padding: '6px 12px', fontSize: '0.85rem', opacity: 0.5 }}>Anterior</button>
            <button className="btn-glass" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Próxima</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Transacoes;
