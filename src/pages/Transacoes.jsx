import React, { useState, useRef, useEffect } from 'react';
import { IconMoney, IconMoreVertical } from '../components/Icons';
import Modal from '../components/Modal';
import MonthSelector, { useMonthSelector } from '../components/MonthSelector';
import CustomSelect from '../components/CustomSelect';

function Transacoes() {
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const { mesAtual, mesIndex, anoAtual, handleMesAnterior, handleMesSeguinte, handleMesSelect } = useMonthSelector(6, 2026);

  // Lançamentos mockados no estado
  const [transacoes, setTransacoes] = useState([
    { id: 1, data: '16 Jul', descricao: 'Salário mensal', categoria: 'Renda', conta: 'Conta Nubank', valor: '5.200,00', tipo: 'receita' },
    { id: 2, data: '15 Jul', descricao: 'Mercado Carrefour', categoria: 'Alimentação', conta: 'Cartão Inter', valor: '345,90', tipo: 'despesa' },
    { id: 3, data: '14 Jul', descricao: 'Netflix', categoria: 'Lazer', conta: 'Cartão Nubank', valor: '39,90', tipo: 'despesa' },
    { id: 4, data: '12 Jul', descricao: 'Transferência Pix João', categoria: 'Transferência', conta: 'Conta Santander', valor: '150,00', tipo: 'receita' },
    { id: 5, data: '10 Jul', descricao: 'Conta de Luz', categoria: 'Moradia', conta: 'Conta Caixa Econômica', valor: '185,40', tipo: 'despesa' },
    { id: 6, data: '05 Jul', descricao: 'Uber', categoria: 'Transporte', conta: 'Cartão XP', valor: '24,50', tipo: 'despesa' },
    { id: 7, data: '01 Jul', descricao: 'Rendimento CDI', categoria: 'Investimentos', conta: 'Conta Inter', valor: '12,45', tipo: 'receita' },
  ]);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaDesc, setNovaDesc] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [novaData, setNovaData] = useState('');
  const [novaCat, setNovaCat] = useState('Alimentação');
  const [novoTipo, setNovoTipo] = useState('despesa');

  const [menuOpenTransacaoId, setMenuOpenTransacaoId] = useState(null);
  const [editingTransacaoId, setEditingTransacaoId] = useState(null);
  const [detalhesTransacao, setDetalhesTransacao] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setMenuOpenTransacaoId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    if (dataStr.includes('-')) {
      const partes = dataStr.split('-'); // YYYY-MM-DD
      if(partes.length === 3) {
        const dia = partes[2];
        const mesNum = parseInt(partes[1], 10);
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        if (mesNum >= 1 && mesNum <= 12) {
          return `${dia} ${meses[mesNum - 1]}`;
        }
      }
    }
    return dataStr;
  };

  const handleExcluirTransacao = (id) => {
    setTransacoes(transacoes.filter(t => t.id !== id));
    setMenuOpenTransacaoId(null);
  };

  const handleEditarTransacao = (t) => {
    setEditingTransacaoId(t.id);
    setNovaDesc(t.descricao);
    setNovoValor(t.valor);
    setNovaCat(t.categoria);
    setNovoTipo(t.tipo);
    
    // Tenta reverter "16 Jul" para "2026-07-16"
    let parsedDate = '';
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const parts = t.data.split(' ');
    if (parts.length === 2) {
       const mIndex = meses.indexOf(parts[1]);
       if (mIndex >= 0) {
           parsedDate = `${anoAtual}-${String(mIndex + 1).padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
       }
    }
    setNovaData(parsedDate);
    setIsModalOpen(true);
  };

  const handleSalvarTransacao = (e) => {
    e.preventDefault();
    if (!novaDesc || !novoValor || !novaData || !novaCat) return;

    if (editingTransacaoId) {
      setTransacoes(transacoes.map(t => t.id === editingTransacaoId ? {
        ...t,
        data: formatarData(novaData),
        descricao: novaDesc,
        categoria: novaCat,
        valor: novoValor,
        tipo: novoTipo
      } : t));
    } else {
      const novaTransacao = {
        id: Date.now(),
        data: formatarData(novaData),
        descricao: novaDesc,
        categoria: novaCat,
        conta: 'Conta Manual',
        valor: novoValor,
        tipo: novoTipo
      };
      setTransacoes([novaTransacao, ...transacoes]);
    }

    setIsModalOpen(false);
    setEditingTransacaoId(null);
    
    // Limpar form
    setNovaDesc('');
    setNovoValor('');
    setNovaData('');
    setNovaCat('Alimentação');
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditingTransacaoId(null);
    setNovaDesc('');
    setNovoValor('');
    setNovaData('');
    setNovaCat('Alimentação');
  };

  const handleDescricaoChange = (val) => {
    setNovaDesc(val);
    const v = val.toLowerCase();
    
    // Auto-categorização simples por palavras-chave
    if (v.includes('lanche') || v.includes('comida') || v.includes('restaurante') || v.includes('ifood') || v.includes('mercado') || v.includes('padaria') || v.includes('pizza')) {
      setNovaCat('Alimentação');
      setNovoTipo('despesa');
    } else if (v.includes('uber') || v.includes('99') || v.includes('onibus') || v.includes('metrô') || v.includes('combustivel') || v.includes('gasolina') || v.includes('posto')) {
      setNovaCat('Transporte');
      setNovoTipo('despesa');
    } else if (v.includes('luz') || v.includes('agua') || v.includes('aluguel') || v.includes('internet') || v.includes('condominio')) {
      setNovaCat('Moradia');
      setNovoTipo('despesa');
    } else if (v.includes('salario') || v.includes('freelance') || v.includes('rendimento') || v.includes('dividendos')) {
      setNovaCat('Renda');
      setNovoTipo('receita');
    } else if (v.includes('netflix') || v.includes('spotify') || v.includes('cinema') || v.includes('show')) {
      setNovaCat('Lazer');
      setNovoTipo('despesa');
    } else if (v.includes('farmacia') || v.includes('remedio') || v.includes('medico') || v.includes('hospital')) {
      setNovaCat('Saúde');
      setNovoTipo('despesa');
    }
  };

  const getCompanyDomain = (descricao) => {
    const desc = descricao.toLowerCase();
    if (desc.includes('netflix')) return 'netflix.com';
    if (desc.includes('uber')) return 'uber.com';
    if (desc.includes('carrefour')) return 'carrefour.com.br';
    if (desc.includes('ifood')) return 'ifood.com.br';
    if (desc.includes('amazon')) return 'amazon.com.br';
    if (desc.includes('google')) return 'google.com';
    if (desc.includes('mercado livre') || desc.includes('mercadolivre')) return 'mercadolivre.com.br';
    if (desc.includes('spotify')) return 'spotify.com';
    if (desc.includes('apple')) return 'apple.com';
    if (desc.includes('steam')) return 'steampowered.com';
    return null;
  };

  const renderIcon = (descricao, size = 16) => {
    const domain = getCompanyDomain(descricao);
    if (domain) {
      return (
        <img 
          src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`} 
          alt="Logo" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      );
    }
    return <IconMoney size={size} color="var(--text-secondary)" />;
  };

  // Filtro simples no front-end para dar a sensação de funcionamento
  const transacoesFiltradas = transacoes.filter(t => {
    const matchTexto = t.descricao.toLowerCase().includes(filtroTexto.toLowerCase()) || t.categoria.toLowerCase().includes(filtroTexto.toLowerCase());
    const matchTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;
    return matchTexto && matchTipo;
  });

  return (
    <section className="dashboard-grid">
      <div className="col-span-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', position: 'relative', zIndex: 30 }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Transações</h2>
          <p className="text-muted">Acompanhe seu extrato detalhado e encontre lançamentos específicos.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <MonthSelector 
            mesAtual={mesAtual} 
            mesIndex={mesIndex} 
            anoAtual={anoAtual}
            onMesAnterior={handleMesAnterior} 
            onMesSeguinte={handleMesSeguinte} 
            onMesSelect={handleMesSelect}
          />
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Novo Lançamento
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="glass-card col-span-12" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', padding: '16px 24px', position: 'relative', zIndex: 20 }}>
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
        <div style={{ width: '220px' }}>
          <CustomSelect 
            value={filtroTipo}
            onChange={(val) => setFiltroTipo(val)}
            options={[
              { value: 'todos', label: 'Todas as transações' },
              { value: 'receita', label: 'Somente Entradas' },
              { value: 'despesa', label: 'Somente Saídas' }
            ]}
          />
        </div>
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
        
        <div ref={listRef} style={{ display: 'flex', flexDirection: 'column' }}>
          {transacoesFiltradas.length > 0 ? transacoesFiltradas.map((t, index) => (
            <div 
              key={t.id} 
              onClick={() => setDetalhesTransacao(t)}
              style={{ display: 'grid', gridTemplateColumns: '80px 2fr 1fr 1fr 50px', gap: '16px', padding: '16px 24px', borderBottom: index < transacoesFiltradas.length - 1 ? '1px solid var(--surface-border)' : 'none', alignItems: 'center', transition: 'background 0.2s', cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div className="text-muted" style={{ fontSize: '0.9rem' }}>{t.data}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-color)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {renderIcon(t.descricao, 16)}
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setMenuOpenTransacaoId(menuOpenTransacaoId === t.id ? null : t.id); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                >
                  <IconMoreVertical size={20} />
                </button>
                {menuOpenTransacaoId === t.id && (
                  <div className="glass-card" style={{ position: 'absolute', right: '0', top: '30px', zIndex: 10, minWidth: '150px', padding: '8px 0' }}>
                    <button style={{ width: '100%', padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleEditarTransacao(t); setMenuOpenTransacaoId(null); }}>Editar</button>
                    <button style={{ width: '100%', padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--accent-rose)', textAlign: 'left', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleExcluirTransacao(t.id); setMenuOpenTransacaoId(null); }}>Excluir</button>
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Nenhuma transação encontrada com os filtros atuais.
            </div>
          )}
        </div>
        
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Mostrando {transacoesFiltradas.length} resultados</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-glass" disabled style={{ padding: '6px 12px', fontSize: '0.85rem', opacity: 0.5 }}>Anterior</button>
            <button className="btn-glass" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Próxima</button>
          </div>
        </div>
      </div>

      {/* Modal de Nova Transação / Edição */}
      <Modal isOpen={isModalOpen} onClose={fecharModal} title={editingTransacaoId ? "Editar Lançamento" : "Novo Lançamento"}>
        <form onSubmit={handleSalvarTransacao} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tipo</label>
              <CustomSelect 
                value={novoTipo}
                onChange={(val) => setNovoTipo(val)}
                options={[
                  { value: 'despesa', label: 'Despesa (Saída)' },
                  { value: 'receita', label: 'Receita (Entrada)' }
                ]}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Valor (R$)</label>
              <input 
                type="text" placeholder="0,00" value={novoValor} onChange={(e) => setNovoValor(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Descrição</label>
            <input 
              type="text" placeholder="Ex: Lanche na Padaria" value={novaDesc} onChange={(e) => handleDescricaoChange(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} required
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Categoria</label>
              <CustomSelect 
                value={novaCat}
                onChange={(val) => setNovaCat(val)}
                options={[
                  { value: 'Alimentação', label: 'Alimentação' },
                  { value: 'Moradia', label: 'Moradia' },
                  { value: 'Transporte', label: 'Transporte' },
                  { value: 'Saúde', label: 'Saúde' },
                  { value: 'Lazer', label: 'Lazer' },
                  { value: 'Educação', label: 'Educação' },
                  { value: 'Investimentos', label: 'Investimentos' },
                  { value: 'Transferência', label: 'Transferência' },
                  { value: 'Renda', label: 'Renda (Salário/Outros)' },
                  { value: 'Outros', label: 'Outros' }
                ]}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Data</label>
              <input 
                type="date" 
                value={novaData} 
                onChange={(e) => setNovaData(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', colorScheme: 'dark' }} 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '16px', padding: '14px', fontSize: '1rem', width: '100%' }}>
            Adicionar Lançamento
          </button>
        </form>
      </Modal>

      {/* Modal de Detalhes da Transação */}
      <Modal isOpen={!!detalhesTransacao} onClose={() => setDetalhesTransacao(null)} title="Detalhes da Transação">
        {detalhesTransacao && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header / Info Principal */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--surface-color)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {renderIcon(detalhesTransacao.descricao, 32)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{detalhesTransacao.descricao}</h3>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: detalhesTransacao.tipo === 'receita' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                  {detalhesTransacao.tipo === 'receita' ? '+' : '-'} R$ {detalhesTransacao.valor}
                </div>
              </div>
            </div>

            {/* Metadados */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', fontSize: '0.95rem' }}>
              <span className="text-muted">Data:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{detalhesTransacao.data} / {anoAtual}</strong>
              
              <span className="text-muted">Conta:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{detalhesTransacao.conta}</strong>
              
              <span className="text-muted">Categoria:</span>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', width: 'fit-content', color: 'var(--text-primary)' }}>
                {detalhesTransacao.categoria}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--surface-border)', margin: '8px 0' }} />

            {/* Transações Semelhantes */}
            <div>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4"/><path d="M21 11.8v2a4 4 0 0 1-4 4H4.2"/></svg>
                Transações Semelhantes
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
                {transacoes
                  .filter(t => t.id !== detalhesTransacao.id && t.categoria === detalhesTransacao.categoria)
                  .map(t => (
                    <div key={t.id} className="glass-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {renderIcon(t.descricao, 14)}
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.descricao}</strong>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>{t.data} / {anoAtual}</span>
                        </div>
                      </div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem', color: t.tipo === 'receita' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                        {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor}
                      </div>
                    </div>
                  ))}
                {transacoes.filter(t => t.id !== detalhesTransacao.id && t.categoria === detalhesTransacao.categoria).length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '24px 0' }}>
                    Nenhuma transação semelhante encontrada
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </Modal>
    </section>
  );
}

export default Transacoes;
