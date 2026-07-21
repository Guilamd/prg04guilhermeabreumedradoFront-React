import React, { useState } from 'react';
import ListaContas from '../components/ListaContas';
import { IconBank } from '../components/Icons';
import DatePicker from '../components/DatePicker';
import Modal from '../components/Modal';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function Carteiras() {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const [contas, setContas] = useState([]);
  const [faturasCartao, setFaturasCartao] = useState([]);

  const getCompanyDomain = (descricao) => {
    if (!descricao) return null;
    const desc = descricao.toLowerCase();
    if (desc.includes('mercado pago')) return 'mercadopago.com.br';
    if (desc.includes('nubank')) return 'nubank.com.br';
    if (desc.includes('itaú') || desc.includes('itau')) return 'itau.com.br';
    if (desc.includes('bradesco')) return 'bradesco.com.br';
    if (desc.includes('santander')) return 'santander.com.br';
    if (desc.includes('inter')) return 'bancointer.com.br';
    if (desc.includes('xp')) return 'xpi.com.br';
    return null;
  };

  React.useEffect(() => {
    api.get('/contas').then(res => {
      const mapped = res.data.map(c => ({
        ...c,
        id: c.id,
        nome: c.descricao,
        subtexto: c.ativa ? 'Ativa' : 'Inativa',
        saldo: (c.saldoAtual || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2}),
        color: '#8B5CF6',
        icone: 'bank'
      }));
      setContas(mapped);
    });
  }, []);
  
  const [novaInstituicao, setNovaInstituicao] = useState('');
  const [novoSaldo, setNovoSaldo] = useState('');
  const [novaCor, setNovaCor] = useState('#8B5CF6'); // Cor padrão roxa

  const [selectedDate, setSelectedDate] = useState('2026-07-15');

  const [adjustingSaldoId, setAdjustingSaldoId] = useState(null);
  const [novoSaldoAjuste, setNovoSaldoAjuste] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handlePrevMonth = () => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setMonth(d.getMonth() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };
  
  const handleNextMonth = () => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setMonth(d.getMonth() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Buscar faturas reais sempre que mudar o cartão selecionado
  React.useEffect(() => {
    if (contas.length > 0 && contas[currentCardIndex]) {
      const cartaoId = contas[currentCardIndex].id;
      api.get(`/faturas?contaId=${cartaoId}&size=100&sort=dataVencimento,desc`)
        .then(res => {
          // O backend retorna um Page (content)
          const data = res.data.content || [];
          // O Pageable do backend já deve trazer ordenado, mas garantimos a ordem cronológica pro gráfico
          const faturasOrdenadas = data.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));
          setFaturasCartao(faturasOrdenadas);
        })
        .catch(err => {
          console.error("Erro ao buscar faturas", err);
          setFaturasCartao([]);
        });
    }
  }, [currentCardIndex, contas]);

  const handleDeleteConta = async (id) => {
    try {
      await api.delete(`/contas/${id}`);
      setContas(contas.filter(c => c.id !== id));
    } catch(err) {
      console.error(err);
      alert('Erro ao deletar conta');
    }
  };

  const handleAjustarSaldo = (id) => {
    const conta = contas.find(c => c.id === id);
    if (conta) {
      setNovoSaldoAjuste(conta.saldo);
      setAdjustingSaldoId(id);
    }
  };

  const handleSalvarAjusteSaldo = async (e) => {
    e.preventDefault();
    if (!novoSaldoAjuste) return;

    const contaOriginal = contas.find(c => c.id === adjustingSaldoId);
    if (!contaOriginal) return;

    let valorFloat = parseFloat(novoSaldoAjuste.toString().replace(/\./g, '').replace(',', '.'));
    if (isNaN(valorFloat)) valorFloat = 0;

    const dto = {
      descricao: contaOriginal.descricao,
      saldoAtual: valorFloat,
      ativa: contaOriginal.ativa,
      usuarioId: contaOriginal.usuarioId,
      instituicaoFinanceiraId: contaOriginal.instituicaoFinanceiraId
    };

    try {
      await api.put(`/contas/${adjustingSaldoId}`, dto);
      
      const res = await api.get('/contas');
      const mapped = res.data.map(c => ({
        ...c,
        id: c.id,
        nome: c.descricao,
        subtexto: c.ativa ? 'Ativa' : 'Inativa',
        saldo: (c.saldoAtual || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2}),
        color: '#8B5CF6',
        icone: 'bank'
      }));
      setContas(mapped);

      setAdjustingSaldoId(null);
      setNovoSaldoAjuste('');
    } catch(err) {
      console.error(err);
      alert('Erro ao ajustar saldo');
    }
  };

  const handleSalvarConta = async () => {
    if (!novaInstituicao || !novoSaldo) return;
    
    let valorFloat = parseFloat(novoSaldo.toString().replace(/\./g, '').replace(',', '.'));
    if (isNaN(valorFloat)) valorFloat = 0;

    const dto = {
      descricao: novaInstituicao,
      saldoAtual: valorFloat,
      ativa: true,
      usuarioId: user ? user.id : 1
    };

    try {
      await api.post('/contas', dto);
      const res = await api.get('/contas');
      const mapped = res.data.map(c => ({
        ...c,
        id: c.id,
        nome: c.descricao,
        subtexto: c.ativa ? 'Ativa' : 'Inativa',
        saldo: (c.saldoAtual || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2}),
        color: novaCor || '#8B5CF6',
        icone: 'bank'
      }));
      setContas(mapped);
      
      setShowForm(false);
      setNovaInstituicao('');
      setNovoSaldo('');
      setNovaCor('#8B5CF6');
    } catch(err) {
      console.error(err);
      alert('Erro ao salvar conta');
    }
  };

  const saldoTotal = contas.reduce((acc, conta) => {
    // Tratamento para converter strings como "1.486,45" ou "3.645,00" para float
    const valorPuro = conta.saldo.toString().replace(/\./g, '').replace(',', '.');
    const valorFloat = parseFloat(valorPuro);
    return acc + (isNaN(valorFloat) ? 0 : valorFloat);
  }, 0);
  
  const saldoFormatado = saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Header (Top) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Minhas Carteiras</h2>
            <p className="text-muted">Gerencie suas contas bancárias e integrações.</p>
          </div>
        </div>

        {/* Patrimônio Total */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <article className="glass-card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>Patrimônio Total</span>
            <strong style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>R$ {saldoFormatado}</strong>
          </article>
          <article className="glass-card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>Bancos Conectados</span>
            <strong style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{contas.length}</strong>
          </article>
        </div>

        {/* Old Content (Contas + Open Finance) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div>
            <ListaContas contas={contas} onDeleteConta={handleDeleteConta} onAjustarSaldo={handleAjustarSaldo} />
          </div>
          <div>
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center', height: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <IconBank size={48} color="var(--accent-emerald)" />
              </div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Open Finance</h4>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '24px' }}>Em breve você poderá conectar suas contas automaticamente via Open Finance.</p>
              <button className="btn-glass" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Conexão Automática</button>
            </div>
          </div>
        </div>

        {/* Linha separadora */}
        <div style={{ borderTop: '1px solid var(--surface-border)', margin: '8px 0' }}></div>

        {/* --- NOVA SEÇÃO DE CARTÕES (PIERRE STYLE) --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Banner de Fatura Atual */}
          <article className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }}>
            <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              Fatura atual
            </span>
            <strong style={{ fontSize: '3.5rem', color: 'var(--text-primary)', lineHeight: 1 }}>
              R$ {contas.reduce((acc, c) => acc + (c.saldoAtual || 0), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </strong>
          </article>

          {/* Seus Cartões e Faturas Master Box */}
          <article className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
            {/* Carrossel de Cartões (Um por vez com Setas) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
              <button 
                onClick={() => setCurrentCardIndex(prev => prev > 0 ? prev - 1 : contas.length - 1)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', flexShrink: 0 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>

              <div style={{ flex: 1, overflow: 'hidden' }}>
                {contas.length > 0 && (() => {
                  const cartao = contas[currentCardIndex];
                  let bgColor = '#3B82F6';
                  if (cartao.descricao.toLowerCase().includes('mercado pago')) bgColor = '#00B1EA';
                  if (cartao.descricao.toLowerCase().includes('nubank')) bgColor = '#8A05BE';
                  if (cartao.descricao.toLowerCase().includes('itaú')) bgColor = '#EC7000';
                  
                  return (
                    <div style={{ padding: '32px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', animation: 'fadeIn 0.3s ease-out' }}>
                      <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)' }}></div>
                      
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                              {getCompanyDomain(cartao.descricao) ? (
                                <img src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${getCompanyDomain(cartao.descricao)}&size=128`} alt="Logo Banco" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                              )}
                            </div>
                            <div>
                              <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '1.2rem' }}>{cartao.descricao}</strong>
                              <span className="text-muted" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>**** {(Math.floor(Math.random() * 9000) + 1000)}</span>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.85rem', color: cartao.saldoAtual > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)', background: cartao.saldoAtual > 0 ? 'rgba(255, 23, 68, 0.1)' : 'rgba(0, 230, 118, 0.1)', padding: '6px 14px', borderRadius: '20px', fontWeight: '500' }}>
                            {cartao.saldoAtual > 0 ? 'Em aberto' : 'Pago'}
                          </span>
                        </div>

                        <div>
                          <span className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Fatura estimada</span>
                          <strong style={{ display: 'block', fontSize: '2.5rem', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '16px' }}>R$ {Math.abs(cartao.saldoAtual).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
                          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Vencimento previsto para o dia <strong style={{ color: 'var(--text-primary)' }}>10</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <button 
                onClick={() => setCurrentCardIndex(prev => prev < contas.length - 1 ? prev + 1 : 0)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', flexShrink: 0 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>

            {/* Gráfico de Barras com Recharts (Dados Reais) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                  </div>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Faturas anteriores</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button className="btn-glass" onClick={handlePrevMonth} style={{ padding: '4px', borderRadius: '50%', display: 'flex', cursor: 'pointer' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <DatePicker 
                    value={selectedDate} 
                    onChange={(dateStr) => setSelectedDate(dateStr)} 
                    variant="pill"
                  />
                  <button className="btn-glass" onClick={handleNextMonth} style={{ padding: '4px', borderRadius: '50%', display: 'flex', cursor: 'pointer' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
              <div style={{ height: '260px', width: '100%' }}>
                {(() => {
                  let dados = [];
                  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                  const dataAtual = new Date(selectedDate + 'T12:00:00');
                  
                  for (let i = 5; i >= 0; i--) {
                    const d = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
                    
                    const fatura = faturasCartao.find(f => {
                       const fData = new Date(f.dataVencimento || (f.mesAnoReferencia ? f.mesAnoReferencia + '-01T12:00:00' : new Date()));
                       return fData.getFullYear() === d.getFullYear() && fData.getMonth() === d.getMonth();
                    });

                    dados.push({
                      mes: mesesNomes[d.getMonth()],
                      fatura: fatura && fatura.valorTotal > 0 ? fatura.valorTotal : 0
                    });
                  }

                  return (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dados} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-main)' }} dy={10} />
                        <YAxis hide={true} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                          contentStyle={{ backgroundColor: '#0F0F11', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#FFFFFF', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                          itemStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                          formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 'Fatura']}
                          labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
                        />
                        <Bar dataKey="fatura" radius={[8, 8, 8, 8]} barSize={80}>
                          {dados.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === dados.length - 1 ? '#FFFFFF' : 'rgba(255,255,255,0.1)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
              </div>
            </div>
          </article>

        </div>
      </div>

      {/* Modal de Ajustar Saldo */}
      <Modal isOpen={!!adjustingSaldoId} onClose={() => setAdjustingSaldoId(null)} title="Ajustar Saldo">
        <form onSubmit={handleSalvarAjusteSaldo}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Novo Saldo (R$)</label>
            <input 
              type="text" 
              value={novoSaldoAjuste} 
              onChange={(e) => setNovoSaldoAjuste(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} 
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn-glass" onClick={() => setAdjustingSaldoId(null)}>Cancelar</button>
            <button type="submit" className="btn-primary">Atualizar Saldo</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default Carteiras;
