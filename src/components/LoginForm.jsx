import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* Ícones SVG para os inputs */
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 4l-10 8L2 4"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = ({ visible, onClick }) => (
  <button type="button" className="input-eye" onClick={onClick} aria-label="Mostrar senha">
    {visible ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    )}
  </button>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

function LoginForm({ onToggleForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);

    if (!success) {
      setError('E-mail ou senha incorretos. Tente novamente.');
    }
  };

  return (
    <section className="card login-card">
      <h2>Bem-vindo<span className="highlight-text">(a)!</span></h2>
      <p className="subtexto">Acesse sua conta para continuar</p>
      <div className="card-line"></div>


      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <div className="form-group">
          <label htmlFor="email">E-MAIL</label>
          <div className="input-wrapper">
            <span className="input-icon"><MailIcon /></span>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="seu@email.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="senha">SENHA</label>
          <div className="input-wrapper">
            <span className="input-icon"><LockIcon /></span>
            <input 
              type={showPassword ? 'text' : 'password'}
              id="senha" 
              name="senha" 
              placeholder="Mínimo 4 caracteres" 
              required 
              minLength="4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <EyeIcon visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          <span className="btn-arrow">→</span> Entrar
        </button>

        {error && <p className="login-erro-geral" style={{ display: 'block' }}>{error}</p>}
      </form>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Ainda não tem uma conta? {' '}
          <span 
            onClick={onToggleForm} 
            style={{ color: 'var(--accent-purple)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Registre-se
          </span>
        </p>
      </div>

      <div className="card-security" style={{ marginTop: '16px' }}>
        <ShieldIcon />
        <span>Seus dados estão protegidos com segurança</span>
      </div>
    </section>
  );
}

export default LoginForm;
