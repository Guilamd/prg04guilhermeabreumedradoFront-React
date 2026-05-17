import React from 'react';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="auth-body">
      <main className="auth-container">
        <div className="logo">
          <h1>Fin<span>Tech</span></h1>
        </div>
        
        <LoginForm />
        
        <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Link to="/" style={{ textDecoration: 'underline' }}>Voltar para Início</Link>
        </div>
      </main>
    </div>
  );
}

export default Login;
