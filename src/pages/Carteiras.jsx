import React, { useState } from 'react';
import ListaContas from '../components/ListaContas';
import { IconBank } from '../components/Icons';
import DatePicker from '../components/DatePicker';
import Modal from '../components/Modal';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Carteiras() {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const [contas, setContas] = useState([]);

  const getCompanyDomain = (descricao) => {
    if (!descricao) return null;
    const desc = descricao.toLowerCase();
    if (desc.includes('mercado pago')) return 'mercadopago.com.br';
    if (desc.includes('nubank')) return 'nubank.com.br';
    if (desc.includes('itaú') || desc.includes('itau')) return 'itau.com.br';
    if (desc.includes('bradesco')) return 'bradesco.com.br';
    if (desc.includes('santander')) return 'santander.com.br';
    if (desc.includes('inter')) return 'bancointer.com.br';
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
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            + Adicionar Banco
          </button>
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

        {/* Add Bank Form */}
        {showForm && (
          <div className="glass-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Conectar nova conta</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nome da Instituição</label>
                <input 
                  type="text" placeholder="Ex: Nubank, Itaú..." 
                  value={novaInstituicao} onChange={(e) => setNovaInstituicao(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Saldo Inicial (R$)</label>
                <input 
                  type="text" placeholder="0,00" 
                  value={novoSaldo} onChange={(e) => setNovoSaldo(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cor</label>
                <input 
                  type="color" 
                  value={novaCor} onChange={(e) => setNovaCor(e.target.value)}
                  style={{ width: '48px', height: '48px', padding: '0', border: 'none', borderRadius: '8px', background: 'transparent', cursor: 'pointer' }} 
                />
              </div>
              <button className="btn-primary" onClick={handleSalvarConta}>Salvar Conta</button>
            </div>
          </div>
        )}

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

          {/* Seus Cartões */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '6px', display: 'flex' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Seus cartões</strong>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>({contas.length})</span>
            </div>

            {contas.map((cartao, idx) => {
              let bgColor = '#3B82F6';
              if (cartao.descricao.toLowerCase().includes('mercado pago')) bgColor = '#00B1EA';
              if (cartao.descricao.toLowerCase().includes('nubank')) bgColor = '#8A05BE';
              if (cartao.descricao.toLowerCase().includes('itaú')) bgColor = '#EC7000';
              
              return (
                <article key={cartao.id || idx} className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)' }}></div>
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {getCompanyDomain(cartao.descricao) ? (
                            <img 
                              src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${getCompanyDomain(cartao.descricao)}&size=128`} 
                              alt="Logo Banco" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                          )}
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '1rem' }}>{cartao.descricao}</strong>
                          <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>**** {(Math.floor(Math.random() * 9000) + 1000)}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: cartao.saldoAtual > 0 ? 'var(--accent-red)' : 'var(--accent-emerald)', background: cartao.saldoAtual > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                        {cartao.saldoAtual > 0 ? 'Em aberto' : 'Pago'}
                      </span>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <span className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        Fatura estimada <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                      </span>
                      <strong style={{ display: 'block', fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '8px' }}>R$ {Math.abs(cartao.saldoAtual).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{cartao.saldoAtual > 0 ? 'Existem transações no ciclo' : 'Sem transações no ciclo'}</span>
                      <div style={{ marginTop: '12px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#F59E0B', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          Definir fechamento
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.8rem', marginLeft: '8px' }}>Vence <strong style={{ color: 'var(--text-primary)', fontWeight: '500' }}>10 do prox. mês</strong></span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Alerta de Fatura Estimada */}
            <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '16px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span style={{ fontSize: '0.85rem', color: '#F59E0B', lineHeight: 1.4 }}>
                Fatura estimada. Compras recentes podem levar 1-3 dias para aparecer via Open Finance. O app do banco pode mostrar um valor maior.
              </span>
            </div>
          </div>

          {/* Faturas Anteriores */}
          <article className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '6px', display: 'flex' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"></path></svg>
                </div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Faturas anteriores</strong>
              </div>
              
              <DatePicker 
                value={selectedDate} 
                onChange={(dateStr) => setSelectedDate(dateStr)} 
              />
            </div>

            {/* Gráfico de Barras */}
            {/* Gráfico de Barras com Recharts */}
            <div style={{ height: '220px', width: '100%', marginTop: '16px' }}>
              {(() => {
                const totalFatura = contas.reduce((acc, c) => acc + (c.saldoAtual || 0), 0);
                
                const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                const dataAtual = new Date(selectedDate);
                const mesAtualIndex = dataAtual.getMonth();
                
                const dados = [];
                const multiplicadores = [1.2, 0.8, 1.1, 0.9, 0.95, 1.0]; 
                
                for (let i = 5; i >= 0; i--) {
                  let indexMes = mesAtualIndex - i;
                  if (indexMes < 0) indexMes += 12;
                  
                  dados.push({
                    mes: mesesNomes[indexMes],
                    fatura: totalFatura > 0 ? totalFatura * multiplicadores[5-i] : 0,
                  });
                }
                
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickFormatter={(val) => Math.round(val)} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F8FAFC' }}
                        itemStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                        formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 'Fatura']}
                        labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
                      />
                      <Bar dataKey="fatura" fill="var(--accent-purple)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                );
              })()}
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
