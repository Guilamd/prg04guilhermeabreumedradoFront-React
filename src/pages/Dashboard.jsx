import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IconMoney, IconCard, IconArrowUpRight, IconArrowDownLeft, IconTrendingDown, IconTrendingUp, DynamicBankIcon } from '../components/Icons';
import api from '../services/api';

/* ===================== COMPONENTES INTERNOS ===================== */

function InsightCard({ user, despesasTotais }) {
  return (
    <article className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '420px', justifyContent: 'space-between' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ color: 'var(--accent-emerald)', fontSize: '1.6rem', fontWeight: '500', marginBottom: '12px', lineHeight: 1.2 }}>
          Seu dinheiro está te esperando para uma conversa.
        </h3>
        <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
          {user ? user.name.split(' ')[0] : 'Usuário'}, seus gastos já somam R${despesasTotais.toLocaleString('pt-BR', {minimumFractionDigits: 2})}. Fique atento!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Gasto Atual</span>
          <strong style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>R$ {despesasTotais.toLocaleString('pt-BR')}</strong>
        </div>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Status</span>
          <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Sob Controle
          </strong>
        </div>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Maior Gasto</span>
          <strong style={{ color: 'var(--text-primary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconMoney size={16} color="var(--accent-emerald)" /> Alimentação
          </strong>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--surface-border)' }}>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>FinTech</span>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Resumo Mensal</span>
      </div>
    </article>
  );
}

function RitmoGastosCard({ despesasTotais }) {
  const pontos = [0, 5, 8, 12, 12, 18, 22, 35, 42, 42, 50, 55, 60, 65, 72, 80];
  const width = 100;
  const stepX = width / (pontos.length - 1);
  const pathD = pontos.map((p, i) => {
    const x = (i * stepX);
    const y = 100 - p; 
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <article className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '420px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Despesas Totais</h3>
        <Link to="/transacoes" style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ver todas <IconArrowUpRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <strong style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>R$ {despesasTotais.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
      </div>
      <span className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '14px' }}>Mês atual</span>

      <div style={{ flex: 1, position: 'relative', marginTop: '16px', minHeight: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '8px' }}>
          {['Max', '', 'Med', '', '0'].map((l, i) => (
            <span key={i} className="text-muted" style={{ fontSize: '0.65rem' }}>{l}</span>
          ))}
        </div>
        <div style={{ marginLeft: '40px', height: '100%' }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
            ))}
            <path d="M 0 95 L 7 90 L 14 85 L 21 78 L 28 75 L 35 70 L 42 65 L 49 58 L 56 52 L 63 48 L 70 42 L 77 38 L 84 32 L 91 28 L 100 22" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
            <path d={pathD} fill="none" stroke="var(--accent-rose)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <circle cx={stepX * (pontos.length - 1)} cy={100 - pontos[pontos.length - 1]} r="2.5" fill="var(--accent-rose)" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '40px', marginTop: '8px' }}>
          {['1', '8', '15', '22', '31'].map((d, i) => (
            <span key={i} className="text-muted" style={{ fontSize: '0.65rem' }}>{d}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function ContasCorrentesCard({ contas }) {
  const saldoTotal = contas.reduce((acc, c) => acc + (c.saldoAtual || 0), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2});

  return (
    <article className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Suas Contas</span>
        <Link to="/carteiras" style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <IconArrowUpRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
        <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)', lineHeight: 1 }}>R$ {saldoTotal}</strong>
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>saldo total</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {contas.map(c => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-color)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <DynamicBankIcon bankName={c.descricao} size={36} type="bank" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{c.descricao}</strong>
              </div>
            </div>
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>R$ {(c.saldoAtual || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function TransacoesRecentesCard({ transacoes }) {
  return (
    <article className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>Transações Recentes</h3>
        <Link to="/transacoes" style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ver todas <IconArrowUpRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {transacoes.slice(0, 6).map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: item.tipoMovimentacao === 'RECEITA' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                {item.tipoMovimentacao === 'RECEITA' 
                  ? <IconArrowDownLeft size={16} color="var(--accent-emerald)" /> 
                  : <IconArrowUpRight size={16} color="var(--accent-rose)" />
                }
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.titulo}</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>{item.categoriaNome || 'Sem Categoria'}</span>
              </div>
            </div>
            <strong style={{ fontSize: '0.9rem', color: item.tipoMovimentacao === 'RECEITA' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
              {item.tipoMovimentacao === 'RECEITA' ? '+' : '-'} R$ {item.valor.toLocaleString('pt-BR', {minimumFractionDigits:2})}
            </strong>
          </div>
        ))}
        {transacoes.length === 0 && <span className="text-muted">Nenhuma transação recente.</span>}
      </div>
    </article>
  );
}

function CategoriasCard({ gastosMap }) {
  const entradas = Object.entries(gastosMap || {});
  const maxVal = Math.max(...entradas.map(e => e[1]), 1);

  return (
    <article className="glass-card" style={{ padding: '28px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Principais Categorias</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {entradas.length === 0 && <span className="text-muted">Sem gastos registrados.</span>}
        {entradas.map(([nome, valor], i) => {
          const barWidth = (valor / maxVal) * 100;
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-purple)' }}></div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{nome}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>R$ {valor.toLocaleString('pt-BR')}</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${barWidth}%`, height: '100%', background: 'var(--accent-purple)', borderRadius: '2px' }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

/* ===================== PÁGINA DASHBOARD ===================== */

function Dashboard() {
  const { user } = useAuth();
  const nomeUsuario = user ? user.name.split(' ')[0] : 'Usuário';

  const [resumo, setResumo] = useState({ totalDespesas: 0, totalReceitas: 0, gastosPorCategoria: {} });
  const [contas, setContas] = useState([]);
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    // Buscar contas
    api.get('/contas').then(res => {
      setContas(res.data);
      if (res.data.length > 0) {
        // Buscar resumo da primeira conta
        const contaId = res.data[0].id;
        const d = new Date();
        const mesAno = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        api.get(`/transacoes/resumo?contaId=${contaId}&mesAno=${mesAno}`)
           .then(r => setResumo(r.data));
      }
    });

    // Buscar transacoes recentes
    api.get('/transacoes').then(res => setTransacoes(res.data.content || []));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Bem-vindo(a), {nomeUsuario}!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Aqui está o resumo de suas finanças reais da API.</p>
        </div>
      </div>

      <section className="dashboard-grid" id="dashboardData">
        <div className="col-span-6">
          <InsightCard user={user} despesasTotais={resumo.totalDespesas || 0} />
        </div>
        <div className="col-span-6">
          <RitmoGastosCard despesasTotais={resumo.totalDespesas || 0} />
        </div>

        <div className="col-span-12">
          <ContasCorrentesCard contas={contas} />
        </div>

        <div className="col-span-8">
          <TransacoesRecentesCard transacoes={transacoes} />
        </div>
        <div className="col-span-4">
          <CategoriasCard gastosMap={resumo.gastosPorCategoria} />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
