import React, { useState, useRef, useEffect } from 'react';

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial value (YYYY-MM-DD) or use current date
  const initialDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [currentView, setCurrentView] = useState({
    month: initialDate.getMonth(),
    year: initialDate.getFullYear()
  });

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

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentView(prev => {
      let m = prev.month - 1;
      let y = prev.year;
      if (m < 0) {
        m = 11;
        y--;
      }
      return { month: m, year: y };
    });
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentView(prev => {
      let m = prev.month + 1;
      let y = prev.year;
      if (m > 11) {
        m = 0;
        y++;
      }
      return { month: m, year: y };
    });
  };

  const handleDayClick = (day) => {
    const y = currentView.year;
    const m = String(currentView.month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  // Calendar logic
  const daysInMonth = new Date(currentView.year, currentView.month + 1, 0).getDate();
  const firstDayIndex = new Date(currentView.year, currentView.month, 1).getDay(); // 0 = Sunday

  const renderDays = () => {
    let days = [];
    // Empty slots for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '8px' }}></div>);
    }
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = value === `${currentView.year}-${String(currentView.month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      days.push(
        <button
          key={i}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDayClick(i); }}
          style={{
            padding: '8px 0',
            borderRadius: '50%',
            border: 'none',
            background: isSelected ? 'var(--accent-emerald)' : 'transparent',
            color: isSelected ? '#fff' : 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: isSelected ? 'bold' : 'normal',
            transition: 'background 0.2s',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  const displayDate = () => {
    if (!value) return 'Selecione uma data';
    const [y, m, d] = value.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input simulado */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          border: '1px solid var(--surface-border)', 
          background: 'rgba(0,0,0,0.2)', 
          color: 'var(--text-primary)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.95rem'
        }}
      >
        <span>{displayDate()}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>

      {/* Popover do Calendário */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          background: 'var(--bg-panel)',
          border: '1px solid var(--surface-border)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          zIndex: 100,
          width: '280px',
          backdropFilter: 'blur(20px)'
        }}>
          {/* Header do Calendário (Navegação de Meses) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button className="btn-glass" onClick={handlePrevMonth} style={{ padding: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              {meses[currentView.month]} {currentView.year}
            </strong>
            <button className="btn-glass" onClick={handleNextMonth} style={{ padding: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          {/* Dias da Semana */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px', textAlign: 'center' }}>
            {diasSemana.map(d => (
              <span key={d} style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{d}</span>
            ))}
          </div>

          {/* Grid de Dias */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
            {renderDays()}
          </div>
        </div>
      )}
    </div>
  );
}
