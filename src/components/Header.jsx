import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="top-header">
      <div className="greeting">
        {user ? (
          <>
            <h2>Bem-vindo(a), {user.name}!</h2>
            <p>Aqui está o resumo de suas finanças.</p>
          </>
        ) : (
          <>
            <h2>Bem-vindo(a)!</h2>
            <p>Faça login para gerenciar suas finanças.</p>
          </>
        )}
      </div>
      <div className="user-profile" ref={profileRef} style={{ position: 'relative' }}>
        <div
          className="avatar"
          id="userAvatar"
          style={{ cursor: 'pointer' }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {user ? user.name.substring(0, 2).toUpperCase() : '...'}
        </div>
        <div className={`profile-dropdown ${dropdownOpen ? 'open' : ''}`} id="profileDropdown">
          {user ? (
            <button onClick={() => { logout(); setDropdownOpen(false); }} className="dropdown-item">Sair</button>
          ) : (
            <Link to="/login" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Fazer Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

