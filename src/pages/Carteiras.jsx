import React, { useState } from 'react';
import ListaContas from '../components/ListaContas';
import { IconBank } from '../components/Icons';
import DatePicker from '../components/DatePicker';
import Modal from '../components/Modal';

function Carteiras() {
  const [showForm, setShowForm] = useState(false);
  const [contas, setContas] = useState([
    { id: 1, nome: 'Conta Santander', subtexto: 'Conta conectada', saldo: '1.486,45', color: '#EC0000', icone: 'bank' },
    { id: 2, nome: 'Conta Caixa Econômica', subtexto: 'Conta manual', saldo: '5.468,99', color: '#185E9C', icone: 'bank' },
    { id: 3, nome: 'Conta Inter', subtexto: 'Conta manual', saldo: '3.645,00', color: '#FF7A00', icone: 'card' },
    { id: 4, nome: 'Conta Nubank', subtexto: 'Conta conectada', saldo: '4.345,17', color: '#8A05BE', icone: 'smartphone' },
  ]);
  
  const [novaInstituicao, setNovaInstituicao] = useState('');
  const [novoSaldo, setNovoSaldo] = useState('');
  const [novaCor, setNovaCor] = useState('#8B5CF6'); // Cor padrão roxa

  const [selectedDate, setSelectedDate] = useState('2026-07-15');

  const [adjustingSaldoId, setAdjustingSaldoId] = useState(null);
  const [novoSaldoAjuste, setNovoSaldoAjuste] = useState('');

  const handleDeleteConta = (id) => {
    setContas(contas.filter(c => c.id !== id));
  };

  const handleAjustarSaldo = (id) => {
    const conta = contas.find(c => c.id === id);
    if (conta) {
      setNovoSaldoAjuste(conta.saldo);
      setAdjustingSaldoId(id);
    }
  };

  const handleSalvarAjusteSaldo = (e) => {
    e.preventDefault();
    if (!novoSaldoAjuste) return;
    setContas(contas.map(c => c.id === adjustingSaldoId ? { ...c, saldo: novoSaldoAjuste } : c));
    setAdjustingSaldoId(null);
    setNovoSaldoAjuste('');
  };

  const handleSalvarConta = () => {
    if (!novaInstituicao || !novoSaldo) return;
    const nova = {
      id: Date.now(),
      nome: novaInstituicao,
      subtexto: 'Conta manual',
      saldo: novoSaldo,
      color: novaCor,
      icone: 'bank'
    };
    setContas([...contas, nova]);
    setShowForm(false);
    setNovaInstituicao('');
    setNovoSaldo('');
    setNovaCor('#8B5CF6');
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
            <strong style={{ fontSize: '3.5rem', color: 'var(--text-primary)', lineHeight: 1 }}>R$ 0,00</strong>
          </article>

          {/* Seus Cartões */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '6px', display: 'flex' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Seus cartões</strong>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>(1)</span>
            </div>

            <article className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
              {/* Efeito de círculo de fundo */}
              <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)' }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#00B1EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '1rem' }}>Mercado Pago</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>**** 9305</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', background: 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                    Pago
                  </span>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    Fatura estimada <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </span>
                  <strong style={{ display: 'block', fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '8px' }}>R$ 0,00</strong>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Sem transações no ciclo · sync 17/jul/2026 16:17</span>
                  <div style={{ marginTop: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#F59E0B', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      Definir fechamento
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.8rem', marginLeft: '8px' }}>Vence <strong style={{ color: 'var(--text-primary)', fontWeight: '500' }}>10 de ago.</strong></span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                      Limite total
                    </span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>R$ 3,5k</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--accent-emerald)', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginBottom: '12px' }}>
                    <div style={{ width: '15%', height: '100%', background: '#3B82F6' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6' }}></div>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Usado</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <strong style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>R$ 456</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></div>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Disponível</span>
                      </div>
                      <strong style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>R$ 3,0k</strong>
                    </div>
                  </div>
                </div>
              </div>
            </article>

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
            <div style={{ position: 'relative', height: '180px', display: 'flex', alignItems: 'flex-end', paddingLeft: '32px', gap: '2%' }}>
              {/* Eixo Y */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.65rem' }}>
                <span>160</span>
                <span>120</span>
                <span>80</span>
                <span>40</span>
                <span>0</span>
              </div>
              
              {/* Barras */}
              {[
                { label: 'Mar', h: '85%', active: false },
                { label: 'Abr', h: '55%', active: false },
                { label: 'Mai', h: '50%', active: false },
                { label: 'Jun', h: '50%', active: false },
                { label: 'Jul', h: '45%', active: false },
                { label: 'Ago', h: '0%', active: true } // Vazia na referência
              ].map((bar, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ 
                    width: '80%', height: bar.h, 
                    background: bar.active ? '#fff' : 'rgba(255,255,255,0.1)', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'background 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => { if(!bar.active) e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
                  onMouseLeave={(e) => { if(!bar.active) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                  ></div>
                  <span className="text-muted" style={{ fontSize: '0.7rem', marginTop: '12px' }}>{bar.label}</span>
                </div>
              ))}
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
