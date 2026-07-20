import React, { useState, useRef, useEffect } from 'react';
import { IconTarget, IconMoreVertical } from '../components/Icons';
import Modal from '../components/Modal';
import DatePicker from '../components/DatePicker';
import api from '../services/api';

function Metas() {
  const [metas, setMetas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [transacoes, setTransacoes] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaCat, setNovaCat] = useState('');
  const [novoLimite, setNovoLimite] = useState('');
  const [novaCor, setNovaCor] = useState('#8B5CF6'); // Padrão purple
  const [expandedIds, setExpandedIds] = useState([]); 
  
  const [selectedDate, setSelectedDate] = useState('2026-07-15');

  const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const mesAtual = mesesNomes[parseInt(selectedDate.split('-')[1], 10) - 1];
  
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const handleDragEnter = (targetIndex) => {
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;
    const newMetas = [...metas];
    const draggedItem = newMetas[draggedItemIndex];
    newMetas.splice(draggedItemIndex, 1);
    newMetas.splice(targetIndex, 0, draggedItem);
    setMetas(newMetas);
    setDraggedItemIndex(targetIndex); 
  };

  const [menuOpenMetaId, setMenuOpenMetaId] = useState(null);
  const [editingMetaId, setEditingMetaId] = useState(null);
  const metasRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (metasRef.current && !metasRef.current.contains(event.target)) {
        setMenuOpenMetaId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const carregarDados = () => {
    // 1. Categorias
    api.get('/categorias').then(res => setCategorias(res.data));
    
    // 2. Metas e Transacoes
    Promise.all([
      api.get('/metas-orcamento'),
      api.get('/transacoes?size=1000')
    ]).then(([metasRes, transacoesRes]) => {
       const todasTrans = transacoesRes.data.content || [];
       setTransacoes(todasTrans);
       const prefixoMes = selectedDate.substring(0, 7);
       
       const gastosPorCat = {};
       todasTrans.forEach(t => {
         if (t.dataHora && t.dataHora.startsWith(prefixoMes) && t.tipoMovimentacao === 'DESPESA') {
           if (!gastosPorCat[t.categoriaId]) gastosPorCat[t.categoriaId] = 0;
           gastosPorCat[t.categoriaId] += t.valor;
         }
       });

       const cores = ['#8B5CF6', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#EC4899'];
       const metasMapeadas = metasRes.data
         .filter(m => m.mesAnoReferencia === prefixoMes)
         .map((m, i) => ({
            id: m.id,
            categoriaId: m.categoriaId,
            categoria: m.categoriaNome,
            limite: m.valorLimite,
            gasto: gastosPorCat[m.categoriaId] || 0,
            color: cores[i % cores.length]
         }));
         
       setMetas(metasMapeadas);
    }).catch(err => console.error("Erro ao carregar dados:", err));
  };

  useEffect(() => {
    carregarDados();
  }, [selectedDate]);

  const handleExcluirMeta = async (id) => {
    try {
      await api.delete(`/metas-orcamento/${id}`);
      setMenuOpenMetaId(null);
      carregarDados();
    } catch(err) {
      console.error(err);
      alert('Erro ao excluir meta');
    }
  };

  const handleSalvarMeta = async (e) => {
    e.preventDefault();
    if (!novaCat || !novoLimite) return;

    const catEncontrada = categorias.find(c => c.nome === novaCat);
    const catId = catEncontrada ? catEncontrada.id : (categorias[0] ? categorias[0].id : 1);

    const dto = {
      valorLimite: parseFloat(novoLimite.toString().replace(',', '.')),
      mesAnoReferencia: selectedDate.substring(0, 7),
      categoriaId: catId
    };

    try {
      if (editingMetaId) {
        await api.put(`/metas-orcamento/${editingMetaId}`, dto);
      } else {
        await api.post('/metas-orcamento', dto);
      }

      setIsModalOpen(false);
      setEditingMetaId(null);
      setNovaCat('');
      setNovoLimite('');
      setNovaCor('#8B5CF6');
      
      carregarDados();
    } catch(err) {
      console.error(err);
      alert('Erro ao salvar meta');
    }
  };

  const totalGasto = metas.reduce((acc, m) => acc + m.gasto, 0);

  return (
    <section className="dashboard-grid">
      <div className="col-span-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Metas de Gastos</h2>
          <p className="text-muted" style={{ margin: 0 }}>Defina orçamentos para categorias e acompanhe o que você já gastou no mês.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsModalOpen(true)}>
          <IconTarget size={18} />
          + Nova Meta
        </button>
      </div>

      <div ref={metasRef} className="col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {metas.map((meta, index) => {
          const percent = Math.min((meta.gasto / meta.limite) * 100, 100);
          
          let cardStyle = { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'all 0.3s' };

          if (percent >= 95) {
            cardStyle.border = '1px solid rgba(239, 68, 68, 0.4)';
            cardStyle.boxShadow = '0 0 15px rgba(239, 68, 68, 0.1)';
          } else if (percent >= 75) {
            cardStyle.border = '1px solid rgba(245, 158, 11, 0.4)';
          }

          return (
            <article 
              key={meta.id} 
              className="glass-card" 
              style={{
                ...cardStyle, 
                cursor: 'grab', 
                opacity: draggedItemIndex === index ? 0.4 : 1,
                transform: draggedItemIndex === index ? 'scale(0.98)' : 'scale(1)'
              }}
              draggable
              onDragStart={(e) => {
                setDraggedItemIndex(index);
                if (e.dataTransfer) {
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/html', e.target.parentNode);
                  e.dataTransfer.setDragImage(e.target, 20, 20);
                }
              }}
              onDragEnter={() => handleDragEnter(index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={() => setDraggedItemIndex(null)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: meta.color }}></div>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>{meta.categoria}</h3>
                </div>
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setMenuOpenMetaId(menuOpenMetaId === meta.id ? null : meta.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                  >
                    <IconMoreVertical size={20} />
                  </button>
                  {menuOpenMetaId === meta.id && (
                    <div className="glass-dropdown" style={{ position: 'absolute', right: 0, top: '100%', padding: '8px 0', minWidth: '120px', zIndex: 100 }}>
                      <button 
                        style={{ display: 'block', width: '100%', padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => {
                          setNovaCat(meta.categoria);
                          setNovoLimite(meta.limite.toString().replace('.', ','));
                          setNovaCor(meta.color);
                          setEditingMetaId(meta.id);
                          setIsModalOpen(true);
                          setMenuOpenMetaId(null);
                        }}
                      >
                        Editar
                      </button>
                      <button 
                        style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--accent-rose)', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', marginTop: '4px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => handleExcluirMeta(meta.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end' }}>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)', lineHeight: 1 }}>R$ {meta.gasto.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>de R$ {meta.limite.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                </div>
                
                <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${percent}%`, height: '100%', background: meta.color, borderRadius: '6px', transition: 'width 1s ease' }}></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: percent >= 95 ? 'var(--accent-rose)' : 'var(--text-secondary)' }}>
                    {percent.toFixed(1)}% utilizado
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    R$ {Math.max(0, meta.limite - meta.gasto).toLocaleString('pt-BR', {minimumFractionDigits: 2})} restante
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="col-span-12" style={{ marginTop: '32px', borderTop: '1px solid var(--surface-border)', paddingTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 40px', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong style={{ fontSize: '2.5rem', color: 'var(--text-primary)', lineHeight: 1 }}>R$ {totalGasto.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>gasto nas metas em {mesAtual}</span>
            </div>

            <div style={{ width: '80px', height: '80px', position: 'relative' }}>
              <svg viewBox="0 0 42 42" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                
                {(() => {
                  let acc = 0;
                  return metas.map(meta => {
                    const percent = totalGasto > 0 ? (meta.gasto / totalGasto) * 100 : 0;
                    if (percent === 0) return null;
                    
                    const gap = percent > 2 ? 1.5 : 0;
                    const segmentSize = Math.max(0.5, percent - gap);
                    const strokeDasharray = `${segmentSize} ${100 - segmentSize}`;
                    const strokeDashoffset = 100 - acc;
                    
                    acc += percent;

                    return (
                      <circle
                        key={meta.id}
                        cx="21" cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke={meta.color}
                        strokeWidth="6"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                      />
                    );
                  });
                })()}
              </svg>
            </div>

            <DatePicker 
              value={selectedDate} 
              onChange={(dateStr) => setSelectedDate(dateStr)} 
            />
          </div>

          <article className="glass-card" style={{ padding: '0' }}>
            <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Metas e Orçamentos</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {metas.length === 0 && <span className="text-muted" style={{ padding: '24px' }}>Nenhuma meta encontrada para este mês.</span>}
              {metas.map((meta, index) => {
                const percent = Math.min((meta.gasto / meta.limite) * 100, 100);
                const isExpanded = expandedIds.includes(meta.id);
                
                const toggleExpand = () => {
                  setExpandedIds(prev => 
                    prev.includes(meta.id) ? prev.filter(id => id !== meta.id) : [...prev, meta.id]
                  );
                };

                return (
                  <div key={meta.id} style={{ borderBottom: index < metas.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div 
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', cursor: 'pointer' }}
                      onClick={toggleExpand}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: meta.color }}></div>
                        </div>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{meta.categoria}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '200px', justifyContent: 'flex-end' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>R$ {meta.gasto.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
                        <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: meta.color }}></div>
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <div style={{ 
                        padding: '16px 24px', 
                        background: 'rgba(0,0,0,0.2)', 
                        borderTop: '1px solid rgba(255,255,255,0.02)'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {transacoes
                            .filter(t => t.categoriaId === meta.categoriaId && t.dataHora && t.dataHora.startsWith(selectedDate.substring(0, 7)) && t.tipoMovimentacao === 'DESPESA')
                            .map(t => (
                              <div 
                                key={t.id} 
                                style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center', 
                                  padding: '12px 16px', 
                                  background: 'rgba(255,255,255,0.03)',
                                  borderRadius: '12px',
                                  borderLeft: `3px solid ${meta.color}`,
                                  transition: 'background 0.2s',
                                  cursor: 'default'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: meta.color, opacity: 0.5 }}></div>
                                  <div>
                                    <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500' }}>{t.titulo}</strong>
                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{t.dataHora.substring(8,10)}/{t.dataHora.substring(5,7)}</span>
                                  </div>
                                </div>
                                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '600' }}>
                                  R$ {t.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                </span>
                              </div>
                            ))}
                          {transacoes.filter(t => t.categoriaId === meta.categoriaId && t.dataHora && t.dataHora.startsWith(selectedDate.substring(0, 7)) && t.tipoMovimentacao === 'DESPESA').length === 0 && (
                            <div className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                              Nenhuma despesa registrada nesta categoria no mês selecionado.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingMetaId(null);
          setNovaCat('');
          setNovoLimite('');
          setNovaCor('#8B5CF6');
        }} 
        title={editingMetaId ? "Editar Meta" : "Nova Meta de Gastos"}
      >
        <form onSubmit={handleSalvarMeta} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Categoria</label>
            <select 
              value={novaCat} 
              onChange={(e) => setNovaCat(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', appearance: 'none' }} 
              required
            >
              <option value="" disabled hidden>Selecione uma categoria...</option>
              {categorias.map(c => (
                <option key={c.id} value={c.nome} style={{ background: 'var(--surface-primary)' }}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Limite (R$)</label>
              <input 
                type="text" placeholder="Ex: 500,00" value={novoLimite} onChange={(e) => setNovoLimite(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cor do Gráfico</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="color" 
                  value={novaCor} 
                  onChange={(e) => setNovaCor(e.target.value)}
                  style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '8px', background: 'transparent', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cor personalizada</span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '16px', padding: '14px', fontSize: '1rem', width: '100%' }}>
            {editingMetaId ? "Salvar Alterações" : "Criar Meta"}
          </button>
        </form>
      </Modal>

    </section>
  );
}

export default Metas;
