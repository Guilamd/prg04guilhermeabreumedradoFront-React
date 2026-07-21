import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IconMoney, IconCard, IconArrowUpRight, IconArrowDownLeft, IconTrendingDown, IconTrendingUp, DynamicBankIcon } from '../components/Icons';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/* ===================== COMPONENTES INTERNOS ===================== */

function InsightCard({ user, despesasTotais }) {
  return (
    <article className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '420px', justifyContent: 'space-between', background: 'radial-gradient(circle at top left, rgba(0, 230, 118, 0.08) 0%, rgba(0,0,0,0) 70%), var(--surface-color)', border: '1px solid rgba(0, 230, 118, 0.15)' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ color: 'var(--accent-emerald)', fontSize: '1.6rem', fontWeight: '500', marginBottom: '12px', lineHeight: 1.2 }}>
          Seu dinheiro está te esperando para uma conversa.
        </h3>
        <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
          {user ? user.name.split(' ')[0] : 'Usuário'}, seus gastos já somam R${despesasTotais.toLocaleString('pt-BR', {minimumFractionDigits: 2})}. Fique atento!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>
        <div style={{ padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
          <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Gasto Atual</span>
          <strong style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>R$ {despesasTotais.toLocaleString('pt-BR')}</strong>
        </div>
        <div style={{ padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
          <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Status</span>
          <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Sob Controle
          </strong>
        </div>
        <div style={{ padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
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

function RitmoGastosCard({ despesasTotais, transacoes }) {
  const dataMap = {};
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    dataMap[i] = 0;
  }

  if (transacoes && transacoes.length > 0) {
    transacoes.forEach(t => {
      if (t.tipoMovimentacao === 'DESPESA' && t.dataHora && t.dataHora.startsWith(currentMonth)) {
        const day = parseInt(t.dataHora.substring(8, 10), 10);
        if (dataMap[day] !== undefined) {
          dataMap[day] += t.valor;
        }
      }
    });
  }

  let cumulative = 0;
  const chartData = [];
  const currentDay = today.getDate();
  
  for (let i = 1; i <= lastDay; i++) {
    cumulative += dataMap[i];
    if (i <= currentDay || cumulative > 0) {
      chartData.push({ dia: i, gasto: cumulative });
    }
  }

  if (chartData.length === 0) {
    chartData.push({ dia: 1, gasto: 0 });
  }

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

      <div style={{ flex: 1, position: 'relative', marginTop: '16px', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-rose)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-rose)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="dia" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} minTickGap={20} />
            <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
            <Tooltip 
              contentStyle={{ background: 'rgba(0, 0, 0, 0.95)', border: '1px solid var(--surface-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--accent-rose)' }}
              formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 'Acumulado']}
              labelFormatter={(label) => `Dia ${label}`}
            />
            <Area type="monotone" dataKey="gasto" stroke="var(--accent-rose)" strokeWidth={3} fillOpacity={1} fill="url(#colorGasto)" />
          </AreaChart>
        </ResponsiveContainer>
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

function CategoriasCard({ transacoes }) {
  const gastosMap = {};
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  
  if (transacoes && transacoes.length > 0) {
    transacoes.forEach(t => {
      if (t.tipoMovimentacao === 'DESPESA' && t.dataHora && t.dataHora.startsWith(currentMonth)) {
        const catName = t.categoriaNome || 'Sem Categoria';
        if (!gastosMap[catName]) gastosMap[catName] = 0;
        gastosMap[catName] += t.valor;
      }
    });
  }

  const entradas = Object.entries(gastosMap).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...entradas.map(e => e[1]), 1);

  return (
    <article className="glass-card" style={{ padding: '28px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Principais Categorias</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {entradas.length === 0 && <span className="text-muted">Sem gastos registrados.</span>}
        {entradas.slice(0, 5).map(([nome, valor], i) => {
          const barWidth = (valor / maxVal) * 100;
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-purple)' }}></div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nome}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>R$ {valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
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
    api.get('/contas').then(res => setContas(res.data));

    // Buscar transacoes recentes
    api.get('/transacoes?size=1000').then(res => setTransacoes(res.data.content || []));
  }, []);

  const d = new Date();
  const currentMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  
  // Calcular despesas totais baseado nas transações (para unificar todas as contas e bater com o gráfico)
  const totalDespesasFront = transacoes
    .filter(t => t.tipoMovimentacao === 'DESPESA' && t.dataHora && t.dataHora.startsWith(currentMonth))
    .reduce((acc, t) => acc + t.valor, 0);

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
          <InsightCard user={user} despesasTotais={totalDespesasFront} />
        </div>
        <div className="col-span-6">
          <RitmoGastosCard despesasTotais={totalDespesasFront} transacoes={transacoes} />
        </div>

        <div className="col-span-12">
          <ContasCorrentesCard contas={contas} />
        </div>

        <div className="col-span-8">
          <TransacoesRecentesCard transacoes={transacoes} />
        </div>
        <div className="col-span-4">
          <CategoriasCard transacoes={transacoes} />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
