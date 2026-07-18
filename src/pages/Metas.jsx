import React, { useState } from 'react';
import { IconTarget, IconMoreVertical } from '../components/Icons';
import Modal from '../components/Modal';

function Metas() {
  const [metas, setMetas] = useState([
    { id: 1, categoria: 'Alimentação', gasto: 1250, limite: 1500, color: 'var(--accent-purple)' },
    { id: 2, categoria: 'Transporte', gasto: 450, limite: 500, color: '#F59E0B' }, // Yellow/Orange
    { id: 3, categoria: 'Lazer', gasto: 300, limite: 800, color: 'var(--accent-emerald)' },
    { id: 4, categoria: 'Saúde', gasto: 150, limite: 300, color: '#3B82F6' }, // Blue
    { id: 5, categoria: 'Educação', gasto: 600, limite: 600, color: 'var(--accent-rose)' }, // Red (Estourado)
    { id: 6, categoria: 'Moradia', gasto: 2000, limite: 2500, color: 'var(--text-primary)' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaCat, setNovaCat] = useState('');
  const [novoLimite, setNovoLimite] = useState('');
  const [novaCor, setNovaCor] = useState('#8B5CF6'); // Padrão purple
  const [expandedIds, setExpandedIds] = useState([1]); // Array para permitir múltiplos abertos
  
  const mesesLista = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const [mesIndex, setMesIndex] = useState(6); // 6 = Julho
  const [anoAtual, setAnoAtual] = useState(2026);
  const mesAtual = `${mesesLista[mesIndex]} de ${anoAtual}`;
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const handleDragEnter = (targetIndex) => {
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;
    
    // Fazendo a troca (reordenação) na array de metas
    const newMetas = [...metas];
    const draggedItem = newMetas[draggedItemIndex];
    
    // Remove do índice atual e insere no novo
    newMetas.splice(draggedItemIndex, 1);
    newMetas.splice(targetIndex, 0, draggedItem);
    
    setMetas(newMetas);
    setDraggedItemIndex(targetIndex); // Atualiza o índice sendo arrastado
  };

  const handleMesAnterior = () => {
    if (mesIndex === 0) {
      setMesIndex(11);
      setAnoAtual(prev => prev - 1);
    } else {
      setMesIndex(prev => prev - 1);
    }
  };

  const handleMesSeguinte = () => {
    if (mesIndex === 11) {
      setMesIndex(0);
      setAnoAtual(prev => prev + 1);
    } else {
      setMesIndex(prev => prev + 1);
    }
  };

  const [menuOpenMetaId, setMenuOpenMetaId] = useState(null);
  const [editingMetaId, setEditingMetaId] = useState(null);

  const handleExcluirMeta = (id) => {
    setMetas(metas.filter(m => m.id !== id));
    setMenuOpenMetaId(null);
  };

  const handleSalvarMeta = (e) => {
    e.preventDefault();
    if (!novaCat || !novoLimite) return;

    if (editingMetaId) {
      // Atualizar meta existente
      setMetas(metas.map(m => m.id === editingMetaId ? {
        ...m,
        categoria: novaCat,
        limite: parseFloat(novoLimite.toString().replace(',', '.')),
        color: novaCor
      } : m));
    } else {
      // Criar nova meta
      const novaMeta = {
        id: Date.now(),
        categoria: novaCat,
        gasto: 0,
        limite: parseFloat(novoLimite.toString().replace(',', '.')),
        color: novaCor
      };
      setMetas([...metas, novaMeta]);
    }

    setIsModalOpen(false);
    setEditingMetaId(null);
    setNovaCat('');
    setNovoLimite('');
    setNovaCor('#8B5CF6');
  };
  const totalGasto = metas.reduce((acc, m) => acc + m.gasto, 0);
  let accumulatedPercent = 0;

  return (
    <section className="dashboard-grid">
      <div className="col-span-12" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Metas de Gastos</h2>
          <p className="text-muted">Defina orçamentos para categorias e acompanhe o que você já gastou no mês.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsModalOpen(true)}>
          <IconTarget size={18} />
          + Nova Meta
        </button>
      </div>

      <div className="col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
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
                // Necessário pro Firefox
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
                    <div style={{ position: 'absolute', right: 0, top: '100%', background: 'rgba(20, 22, 35, 0.95)', border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '8px', zIndex: 10, minWidth: '120px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}>
                      <button 
                        style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', borderRadius: '4px' }}
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
                  <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)', lineHeight: 1 }}>R$ {meta.gasto}</strong>
                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>de R$ {meta.limite}</span>
                </div>
                
                {/* Barra de Progresso Grossa */}
                <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${percent}%`, height: '100%', background: meta.color, borderRadius: '6px', transition: 'width 1s ease' }}></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: percent >= 95 ? 'var(--accent-rose)' : 'var(--text-secondary)' }}>
                    {percent.toFixed(1)}% utilizado
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    R$ {(meta.limite - meta.gasto).toFixed(2)} restante
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* --- NOVA SEÇÃO DE VISÃO GERAL (PIERRE STYLE) --- */}
      <div className="col-span-12" style={{ marginTop: '32px', borderTop: '1px solid var(--surface-border)', paddingTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Top Header - Resumo */}
          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong style={{ fontSize: '2.5rem', color: 'var(--text-primary)', lineHeight: 1 }}>R$ {totalGasto.toFixed(2).replace('.', ',')}</strong>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>gasto em {mesAtual}</span>
            </div>

            {/* Donut Chart (SVG Dinâmico) */}
            <div style={{ width: '80px', height: '80px', position: 'relative' }}>
              <svg viewBox="0 0 42 42" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {/* Fundo do anel */}
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                
                {/* Segmentos Dinâmicos */}
                {metas.map(meta => {
                  const percent = (meta.gasto / totalGasto) * 100;
                  if (percent === 0) return null;
                  
                  // Calculamos o gap para deixar o gráfico mais bonito
                  const segmentSize = Math.max(0, percent - 1.5);
                  const strokeDasharray = `${segmentSize} ${100 - segmentSize}`;
                  const strokeDashoffset = 100 - accumulatedPercent;
                  
                  accumulatedPercent += percent;

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
                })}
              </svg>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button 
                onClick={handleMesAnterior} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)', width: '130px', textAlign: 'center' }}>{mesAtual}</span>
              <button 
                onClick={handleMesSeguinte} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Lista de Metas (Estilo Categorias) */}
          <article className="glass-card" style={{ padding: '0' }}>
            <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Metas</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                    
                    {/* Linha Principal */}
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
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>R$ {meta.gasto}</strong>
                        <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: meta.color }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Sub-itens (Apenas pro primeiro como demo do UI) */}
                    {isExpanded && (
                      <div style={{ padding: '0 24px 20px 58px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Supermercado</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '200px', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>R$ 850</span>
                            <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `60%`, height: '100%', background: meta.color }}></div>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Restaurantes</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '200px', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>R$ 400</span>
                            <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `25%`, height: '100%', background: meta.color }}></div>
                            </div>
                          </div>
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

      {/* Modal de Nova/Editar Meta */}
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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Categoria (Nome da Meta)</label>
            <input 
              type="text" placeholder="Ex: Viagem" value={novaCat} onChange={(e) => setNovaCat(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} required
            />
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
