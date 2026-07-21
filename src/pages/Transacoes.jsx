import React, { useState, useRef, useEffect } from 'react';
import { IconMoney, IconMoreVertical, IconSearch, IconCalendar, IconArrowDownRight, IconArrowUpRight, IconArrowLeftRight } from '../components/Icons';
import Modal from '../components/Modal';
import CustomSelect from '../components/CustomSelect';
import DatePicker from '../components/DatePicker';
import api from '../services/api';

function Transacoes() {
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroConta, setFiltroConta] = useState('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroOrdem, setFiltroOrdem] = useState('recentes');
  const [mostrarOcultos, setMostrarOcultos] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState('2026-07-15');
  const anoAtual = new Date().getFullYear();

  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [contas, setContas] = useState([]);

  useEffect(() => {
    // Buscar categorias e contas ao montar
    api.get('/categorias').then(res => setCategorias(res.data));
    api.get('/contas').then(res => setContas(res.data));
  }, []);

  useEffect(() => {
    // Buscar transacoes (por enquanto buscando todas, idealmente passaria o mês)
    api.get('/transacoes').then(res => {
      const content = res.data.content || [];
      const mapped = content.map(t => ({
        id: t.id,
        data: formatarData(t.dataHora ? t.dataHora.substring(0, 10) : ''),
        descricao: t.titulo,
        categoria: t.categoriaNome || 'Sem Categoria',
        conta: t.contaDescricao || 'Conta Manual',
        valor: typeof t.valor === 'number' ? t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : t.valor,
        valorRaw: typeof t.valor === 'number' ? t.valor : parseFloat(t.valor) || 0,
        dataHoraRaw: t.dataHora,
        tipo: t.tipoMovimentacao === 'RECEITA' ? 'receita' : 'despesa'
      }));
      setTransacoes(mapped);
    });
  }, [selectedDate]);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaDesc, setNovaDesc] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [novaData, setNovaData] = useState('');
  const [novaCat, setNovaCat] = useState('Alimentação');
  const [novaCatCustom, setNovaCatCustom] = useState('');
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

  const handleSalvarTransacao = async (e) => {
    e.preventDefault();
    if (!novaDesc || !novoValor || !novaData || !novaCat) return;

    let valorNumerico = parseFloat(novoValor.toString().replace(/\./g, '').replace(',', '.'));
    if (isNaN(valorNumerico)) valorNumerico = 0;

    let finalCatNome = novaCat;
    if (novaCat === 'new') {
      if (!novaCatCustom.trim()) { alert("Digite o nome da nova categoria"); return; }
      finalCatNome = novaCatCustom.trim();
    }

    let cat = categorias.find(c => c.nome.toLowerCase() === finalCatNome.toLowerCase());
    let catId = cat ? cat.id : null;

    if (!catId) {
      try {
        const novaCategoriaReq = {
          nome: finalCatNome,
          corHexadecimal: '#8B5CF6',
          ativa: true
        };
        const catRes = await api.post('/categorias', novaCategoriaReq);
        catId = catRes.data.id;
        
        setCategorias(prev => [...prev, catRes.data]);
      } catch (err) {
        console.error("Erro ao criar categoria", err);
        alert("Erro ao criar categoria");
        return;
      }
    }

    const contaId = contas.length > 0 ? contas[0].id : 1;

    const dto = {
      titulo: novaDesc,
      valor: valorNumerico,
      dataHora: `${novaData}T12:00:00`,
      origem: 'MANUAL',
      tipoMovimentacao: novoTipo === 'receita' ? 'RECEITA' : 'DESPESA',
      tipoPagamento: 'PIX',
      status: 'CONCLUIDA',
      contaId: contaId,
      categoriaId: catId
    };

    try {
      if (editingTransacaoId) {
        await api.put(`/transacoes/${editingTransacaoId}`, dto);
      } else {
        await api.post('/transacoes', dto);
      }
      
      // Recarregar a lista
      const res = await api.get('/transacoes');
      const content = res.data.content || [];
      const mapped = content.map(t => ({
        id: t.id,
        data: formatarData(t.dataHora ? t.dataHora.substring(0, 10) : ''),
        descricao: t.titulo,
        categoria: t.categoriaNome || 'Sem Categoria',
        conta: t.contaDescricao || 'Conta Manual',
        valor: typeof t.valor === 'number' ? t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : t.valor,
        valorRaw: typeof t.valor === 'number' ? t.valor : parseFloat(t.valor) || 0,
        dataHoraRaw: t.dataHora,
        tipo: t.tipoMovimentacao === 'RECEITA' ? 'receita' : 'despesa'
      }));
      setTransacoes(mapped);
    } catch (err) {
      console.error("Erro ao salvar transação:", err);
      alert("Erro ao salvar transação.");
    }

    setIsModalOpen(false);
    setEditingTransacaoId(null);
    
    // Limpar form
    setNovaDesc('');
    setNovoValor('');
    setNovaData('');
    setNovaCat('Alimentação');
    setNovaCatCustom('');
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditingTransacaoId(null);
    setNovaDesc('');
    setNovoValor('');
    setNovaData('');
    setNovaCat('Alimentação');
    setNovaCatCustom('');
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

  // Filtros Avançados
  const transacoesFiltradas = transacoes.filter(t => {
    const matchTexto = t.descricao.toLowerCase().includes(filtroTexto.toLowerCase()) || t.categoria.toLowerCase().includes(filtroTexto.toLowerCase());
    const matchTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;
    const matchConta = filtroConta === 'todas' || t.conta === filtroConta;
    const matchCategoria = filtroCategoria === 'todas' || t.categoria === filtroCategoria;
    
    // Filtrar pelo mês selecionado no DatePicker
    let matchMes = true;
    if (t.dataHoraRaw) {
       const tData = new Date(t.dataHoraRaw);
       const sData = new Date(selectedDate + 'T12:00:00');
       if (tData.getFullYear() !== sData.getFullYear() || tData.getMonth() !== sData.getMonth()) {
         matchMes = false;
       }
    }

    return matchTexto && matchTipo && matchConta && matchCategoria && matchMes;
  }).sort((a, b) => {
    const timeA = new Date(a.dataHoraRaw || 0).getTime();
    const timeB = new Date(b.dataHoraRaw || 0).getTime();
    return filtroOrdem === 'recentes' ? timeB - timeA : timeA - timeB;
  });

  const totais = transacoesFiltradas.reduce((acc, curr) => {
    const val = curr.valorRaw || 0;
    if (curr.tipo === 'despesa') acc.despesas += val;
    if (curr.tipo === 'receita') acc.receitas += val;
    return acc;
  }, { despesas: 0, receitas: 0 });
  const saldo = totais.receitas - totais.despesas;

  return (
    <section className="dashboard-grid">
      {/* 1. Barra de Filtros Superior */}
      <div className="col-span-12" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', position: 'relative', zIndex: 30, paddingBottom: '4px', flexWrap: 'wrap' }}>
        <div style={{ minWidth: '150px' }}>
          <DatePicker 
            value={selectedDate} 
            onChange={(dateStr) => setSelectedDate(dateStr)} 
            variant="this-month"
          />
        </div>
        <div style={{ minWidth: '160px' }}>
          <CustomSelect 
            value={filtroConta} 
            onChange={(val) => setFiltroConta(val)} 
            options={[{ value: 'todas', label: 'Todas Contas' }, ...contas.map(c => ({ value: c.descricao, label: c.descricao }))]} 
          />
        </div>
        <div style={{ minWidth: '180px' }}>
          <CustomSelect value={filtroTipo} onChange={(val) => setFiltroTipo(val)} options={[{ value: 'todos', label: 'Todas Transações' }, { value: 'receita', label: 'Receitas' }, { value: 'despesa', label: 'Despesas' }]} />
        </div>
        <div style={{ minWidth: '180px' }}>
          <CustomSelect 
            value={filtroOrdem} 
            onChange={(val) => setFiltroOrdem(val)} 
            options={[{ value: 'recentes', label: 'Data (mais recentes)' }, { value: 'antigas', label: 'Data (mais antigas)' }]} 
          />
        </div>
        <div style={{ minWidth: '140px' }}>
          <CustomSelect 
            value={filtroCategoria} 
            onChange={(val) => setFiltroCategoria(val)} 
            options={[{ value: 'todas', label: 'Categorias' }, ...categorias.map(c => ({ value: c.nome, label: c.nome }))]} 
          />
        </div>
        <div 
          onClick={() => setMostrarOcultos(!mostrarOcultos)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          <div style={{ width: '36px', height: '20px', borderRadius: '20px', background: mostrarOcultos ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.3s' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: mostrarOcultos ? '18px' : '2px', transition: 'left 0.3s' }}></div>
          </div>
          <span>Mostrar ocultos</span>
        </div>
      </div>

      {/* 2. Grid de Resumos 2x2 */}
      <div className="col-span-12" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>#</span>
          <div>
            <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Total</span>
            <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{transacoesFiltradas.length}</strong>
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <IconArrowDownRight size={24} color="var(--accent-rose)" />
          <div>
            <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Despesas</span>
            <strong className="blur-balance" style={{ fontSize: '1.4rem', color: 'var(--accent-rose)' }}>R$ {totais.despesas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <IconArrowUpRight size={24} color="var(--accent-emerald)" />
          <div>
            <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Receitas</span>
            <strong className="blur-balance" style={{ fontSize: '1.4rem', color: 'var(--accent-emerald)' }}>R$ {totais.receitas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <IconArrowLeftRight size={24} color="var(--accent-emerald)" />
          <div>
            <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px' }}>Saldo</span>
            <strong className="blur-balance" style={{ fontSize: '1.4rem', color: 'var(--accent-emerald)' }}>R$ {saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
          </div>
        </div>
      </div>

      {/* 3. Barra de Busca e Botão */}
      <div className="col-span-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', color: 'var(--text-secondary)', display: 'flex' }}>
            <IconSearch size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar transações..." 
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 16px 10px 40px', 
              borderRadius: '8px', 
              border: '1px solid var(--surface-border)', 
              background: 'rgba(0,0,0,0.2)', 
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.9rem'
            }} 
          />
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Nova Transação
        </button>
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
              <div className="blur-balance" style={{ textAlign: 'right', fontWeight: '600', fontSize: '0.95rem', color: t.tipo === 'receita' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
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
                  <div className="glass-dropdown" style={{ position: 'absolute', right: '0', top: '30px', zIndex: 9999, minWidth: '150px', padding: '8px 0' }}>
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
                  ...categorias.map(c => ({ value: c.nome, label: c.nome })),
                  { value: 'new', label: '➕ Criar Nova Categoria...' }
                ]}
              />
              {novaCat === 'new' && (
                <input 
                  type="text" placeholder="Nome da nova categoria" 
                  value={novaCatCustom} onChange={(e) => setNovaCatCustom(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-purple)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', marginTop: '8px' }} required
                />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Data</label>
              <DatePicker 
                value={novaData} 
                onChange={(dateStr) => setNovaData(dateStr)} 
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
                <div className="blur-balance" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: detalhesTransacao.tipo === 'receita' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
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
                      <div className="blur-balance" style={{ fontWeight: '600', fontSize: '0.9rem', color: t.tipo === 'receita' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
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
