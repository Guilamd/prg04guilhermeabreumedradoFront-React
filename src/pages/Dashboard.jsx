import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IconMoney, IconCard, IconArrowUpRight, IconArrowDownLeft, IconTrendingDown, IconTrendingUp, DynamicBankIcon } from '../components/Icons';

/* ===================== COMPONENTES INTERNOS ===================== */

/* Card de Insight (Alerta inteligente) */
function InsightCard({ user }) {
  return (
    <article className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '420px', justifyContent: 'space-between' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ color: 'var(--accent-emerald)', fontSize: '1.6rem', fontWeight: '500', marginBottom: '12px', lineHeight: 1.2 }}>
          Seu dinheiro está te esperando para uma conversa.
        </h3>
        <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
          {user ? user.name.split(' ')[0] : 'Usuário'}, seus gastos de R$74 já são mais que o dobro do mês passado. Atenção!
        </p>
      </div>

      {/* 3 Mini Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Gasto em Julho</span>
          <strong style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>R$ 74</strong>
        </div>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>vs. Mês Anterior</span>
          <strong style={{ color: 'var(--accent-rose)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IconTrendingDown size={16} /> 173%
          </strong>
        </div>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Maior Gasto</span>
          <strong style={{ color: 'var(--text-primary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconMoney size={16} color="var(--accent-emerald)" /> Transferências
          </strong>
        </div>
      </div>

      {/* Rodapé do card */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--surface-border)' }}>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>FinTech</span>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>17 de jul. de 2026</span>
      </div>
    </article>
  );
}

/* Card de Ritmo de Gastos (com gráfico de linha CSS) */
function RitmoGastosCard() {
  // Pontos do gráfico mockado (valores normalizados de 0 a 100 para altura)
  const pontos = [0, 5, 8, 12, 12, 18, 22, 35, 42, 42, 50, 55, 60, 65, 72, 80];
  const maxH = 120;

  // Criar o path SVG para a linha
  const width = 100;
  const stepX = width / (pontos.length - 1);
  const pathD = pontos.map((p, i) => {
    const x = (i * stepX);
    const y = 100 - p; // inverter Y
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <article className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '420px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Ritmo de Gastos</h3>
        <Link to="/transacoes" style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ver todas <IconArrowUpRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <strong style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>R$ 4.250</strong>
        <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-rose)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <IconArrowUpRight size={12} /> 12%
        </span>
      </div>
      <span className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '14px' }}>vs R$ 2.920 mês anterior</span>

      {/* Gráfico de Linha SVG */}
      <div style={{ flex: 1, position: 'relative', marginTop: '16px', minHeight: 0, overflow: 'hidden' }}>
        {/* Labels do eixo Y */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '8px' }}>
          {['R$ 4k', 'R$ 3k', 'R$ 2k', 'R$ 1k', 'R$ 0'].map((l, i) => (
            <span key={i} className="text-muted" style={{ fontSize: '0.65rem' }}>{l}</span>
          ))}
        </div>

        {/* SVG do gráfico */}
        <div style={{ marginLeft: '40px', height: '100%' }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            {/* Linhas de grade horizontais */}
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
            ))}
            {/* Linha do mês passado (cinza, mais suave) */}
            <path d="M 0 95 L 7 90 L 14 85 L 21 78 L 28 75 L 35 70 L 42 65 L 49 58 L 56 52 L 63 48 L 70 42 L 77 38 L 84 32 L 91 28 L 100 22" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
            {/* Linha do mês atual (vermelha/coral) */}
            <path d={pathD} fill="none" stroke="var(--accent-rose)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {/* Ponto atual */}
            <circle cx={stepX * (pontos.length - 1)} cy={100 - pontos[pontos.length - 1]} r="2.5" fill="var(--accent-rose)" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {/* Eixo X */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '40px', marginTop: '8px' }}>
          {['1', '8', '15', '22', '31'].map((d, i) => (
            <span key={i} className="text-muted" style={{ fontSize: '0.65rem' }}>{d}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

/* Card de Contas Correntes */
function ContasCorrentesCard() {
  const contas = [
    { id: 1, banco: 'Nubank', tipo: 'Conta corrente', saldo: '8.540,20', cor: '#820AD1' },
    { id: 2, banco: 'Inter', tipo: 'Conta corrente', saldo: '3.205,41', cor: '#FF7A00' },
    { id: 3, banco: 'Caixa Econômica', tipo: 'Poupança', saldo: '3.200,00', cor: '#005CA9' },
  ];
  const saldoTotal = '14.945,61';

  return (
    <article className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Contas Correntes</span>
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
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: c.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <DynamicBankIcon bankName={c.banco} size={36} type="bank" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{c.banco}</strong>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{c.tipo}</span>
              </div>
            </div>
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>R$ {c.saldo}</strong>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--surface-border)' }}>
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{contas.length} contas</span>
      </div>
    </article>
  );
}

/* Card de Limite Total Disponível */
function LimiteCartaoCard() {
  const cartoes = [
    { id: 1, banco: 'Nubank', final: '3892', vence: '10 ago', disponivel: '5.480,00', cor: '#820AD1' },
    { id: 2, banco: 'Inter', final: '7741', vence: '15 ago', disponivel: '2.100,00', cor: '#FF7A00' },
  ];
  const limiteTotal = '10.000,00';
  const limiteDisponivel = '7.580,00';

  return (
    <article className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '4px' }}>
        <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Limite Total Disponível</span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)', lineHeight: 1 }}>R$ {limiteDisponivel}</strong>
      </div>
      <span className="text-muted" style={{ fontSize: '0.85rem' }}>de R$ {limiteTotal} de limite total</span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
        {cartoes.map(c => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: c.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <DynamicBankIcon bankName={c.banco} size={36} type="card" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{c.banco}</strong>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>**** {c.final} · Vence {c.vence}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.95rem' }}>R$ {c.disponivel}</strong>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>disponível</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

/* Card de Categorias Principais */
function CategoriasCard() {
  const categorias = [
    { id: 1, nome: 'Alimentação', atual: 1250, anterior: 980, cor: '#F59E0B' },
    { id: 2, nome: 'Transporte', atual: 450, anterior: 520, cor: '#3B82F6' },
    { id: 3, nome: 'Serviços digitais', atual: 120, anterior: 220, cor: 'var(--accent-emerald)' },
    { id: 4, nome: 'Lazer', atual: 300, anterior: null, cor: 'var(--accent-purple)' },
  ];
  const maxVal = Math.max(...categorias.map(c => c.atual));

  return (
    <article className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Principais Categorias</span>
        <Link to="/metas" style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ver mais <IconArrowUpRight size={14} />
        </Link>
      </div>

      {/* Cabeçalho da mini-tabela */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 70px 60px', gap: '8px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--surface-border)' }}>
        <span className="text-muted" style={{ fontSize: '0.7rem' }}>Categoria</span>
        <span className="text-muted" style={{ fontSize: '0.7rem' }}>Atual</span>
        <span className="text-muted" style={{ fontSize: '0.7rem' }}>Variação</span>
        <span className="text-muted" style={{ fontSize: '0.7rem', textAlign: 'right' }}>Anterior</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {categorias.map(c => {
          const barWidth = (c.atual / maxVal) * 100;
          const variacao = c.anterior ? (((c.atual - c.anterior) / c.anterior) * 100).toFixed(0) : null;

          return (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 70px 60px', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.cor }}></div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{c.nome}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>R$ {c.atual}</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${barWidth}%`, height: '100%', background: c.cor, borderRadius: '2px' }}></div>
                </div>
              </div>
              <div>
                {variacao !== null ? (
                  <span style={{ 
                    fontSize: '0.75rem', fontWeight: '500',
                    color: variacao > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                    background: variacao > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                    padding: '2px 6px', borderRadius: '4px',
                    display: 'flex', alignItems: 'center', gap: '2px', width: 'fit-content'
                  }}>
                    {variacao > 0 ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />} {Math.abs(variacao)}%
                  </span>
                ) : (
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>novo</span>
                )}
              </div>
              <span className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'right' }}>
                {c.anterior ? `R$ ${c.anterior}` : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

/* Card de Transações Recentes */
function TransacoesRecentesCard() {
  const grupos = [
    {
      label: 'HOJE',
      itens: [
        { id: 1, desc: 'Mercado Carrefour', tag: 'Alimentação', tagColor: '#F59E0B', valor: '-R$ 87,40', tipo: 'despesa' },
      ]
    },
    {
      label: 'ONTEM',
      itens: [
        { id: 2, desc: 'Salário Mensal', tag: 'Renda', tagColor: 'var(--accent-emerald)', valor: '+R$ 5.200,00', tipo: 'receita' },
        { id: 3, desc: 'Netflix', tag: 'Serviços digitais', tagColor: 'var(--accent-emerald)', valor: '-R$ 39,90', tipo: 'despesa' },
      ]
    },
    {
      label: 'SEG, JUL 14',
      itens: [
        { id: 4, desc: 'Pix recebido João Silva', tag: 'Transferência - PIX', tagColor: 'var(--accent-emerald)', valor: '+R$ 150,00', tipo: 'receita' },
        { id: 5, desc: 'Uber', tag: 'Transporte', tagColor: '#3B82F6', valor: '-R$ 24,50', tipo: 'despesa' },
      ]
    },
  ];

  return (
    <article className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>Transações Recentes</h3>
        <Link to="/transacoes" style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ver todas <IconArrowUpRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {grupos.map((grupo, gi) => (
          <div key={gi}>
            <span className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.5px', display: 'block', marginBottom: '12px' }}>{grupo.label}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {grupo.itens.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', 
                      background: item.tipo === 'receita' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      {item.tipo === 'receita' 
                        ? <IconArrowDownLeft size={16} color="var(--accent-emerald)" /> 
                        : <IconArrowUpRight size={16} color="var(--accent-rose)" />
                      }
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.desc}</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>{item.tag}</span>
                    </div>
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: item.tipo === 'receita' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>{item.valor}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

/* ===================== PÁGINA DASHBOARD ===================== */

function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="dashboard-grid" id="dashboardData">
      {/* Linha 1: Insight + Ritmo de Gastos */}
      <div className="col-span-6">
        <InsightCard user={user} />
      </div>
      <div className="col-span-6">
        <RitmoGastosCard />
      </div>

      {/* Linha 2: Contas Correntes + Limite Cartão */}
      <div className="col-span-6">
        <ContasCorrentesCard />
      </div>
      <div className="col-span-6">
        <LimiteCartaoCard />
      </div>

      {/* Linha 3: Transações Recentes + Categorias */}
      <div className="col-span-8">
        <TransacoesRecentesCard />
      </div>
      <div className="col-span-4">
        <CategoriasCard />
      </div>
    </section>
  );
}

export default Dashboard;
