import React, { useState, useRef, useEffect } from 'react';

const mesesLista = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export function useMonthSelector(initialMonth = 6, initialYear = 2026) {
  const [mesIndex, setMesIndex] = useState(initialMonth);
  const [anoAtual, setAnoAtual] = useState(initialYear);

  const mesAtual = `${mesesLista[mesIndex]} de ${anoAtual}`;

  const handleMesSelect = (e) => {
    const val = e.target.value;
    if (val) {
      const [y, m] = val.split('-');
      setAnoAtual(parseInt(y, 10));
      setMesIndex(parseInt(m, 10) - 1);
    }
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

  return { mesAtual, mesIndex, anoAtual, handleMesAnterior, handleMesSeguinte, handleMesSelect };
}

export default function MonthSelector({ mesAtual, mesIndex, anoAtual, onMesAnterior, onMesSeguinte, onMesSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempYear, setTempYear] = useState(anoAtual || new Date().getFullYear());

  const toggleDropdown = () => {
    if (!isOpen) setTempYear(anoAtual); // reseta ano temporário ao abrir
    setIsOpen(!isOpen);
  };

  const handleMonthClick = (mIndex) => {
    if (onMesSelect) {
      // Simula o evento do input native
      onMesSelect({ target: { value: `${tempYear}-${String(mIndex + 1).padStart(2, '0')}` } });
    }
    setIsOpen(false);
  };

  const mesesAbreviados = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
      <svg onClick={onMesAnterior} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" style={{ cursor: 'pointer' }}><polyline points="15 18 9 12 15 6"></polyline></svg>
      
      <div 
        onClick={toggleDropdown}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--surface-border)', padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" style={{ pointerEvents: 'none' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-primary)', width: '135px', textAlign: 'center', pointerEvents: 'none' }}>{mesAtual}</span>
      </div>

      <svg onClick={onMesSeguinte} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" style={{ cursor: 'pointer' }}><polyline points="9 18 15 12 9 6"></polyline></svg>

      {/* Popover Customizado */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px',
          background: 'var(--bg-color)', border: '1px solid var(--surface-border)', borderRadius: '12px',
          padding: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 100, width: '220px'
        }}>
          {/* Seletor de Ano */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button className="btn-glass" style={{ padding: '4px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setTempYear(prev => prev - 1); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{tempYear}</strong>
            <button className="btn-glass" style={{ padding: '4px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setTempYear(prev => prev + 1); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          {/* Grid de Meses */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {mesesAbreviados.map((mesStr, index) => {
              const isSelected = index === mesIndex && tempYear === anoAtual;
              return (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); handleMonthClick(index); }}
                  style={{
                    padding: '8px 0', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer',
                    background: isSelected ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.03)',
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    border: 'none', transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { if(!isSelected) e.target.style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseOut={(e) => { if(!isSelected) e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  {mesStr}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
