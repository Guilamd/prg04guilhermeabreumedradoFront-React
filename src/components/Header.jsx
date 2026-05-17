import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();

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
      <div className="user-profile" style={{ position: 'relative' }}>
        <div className="avatar" id="userAvatar" style={{ cursor: 'pointer' }}>
          {user ? user.name.substring(0, 2).toUpperCase() : '...'}
        </div>
        <div className="profile-dropdown" id="profileDropdown">
          {user ? (
            <button onClick={logout} className="dropdown-item">Sair</button>
          ) : (
            <Link to="/login" className="dropdown-item">Fazer Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
