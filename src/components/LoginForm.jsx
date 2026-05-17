import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    const success = login(email, password);

    if (!success) {
      setError('E-mail ou senha incorretos. Tente novamente.');
    }
  };

  return (
    <section className="card login-card">
      <h2>Acessar Painel</h2>
      <p className="subtexto">Preencha seus dados para entrar no sistema.</p>
      
      <div className="test-credentials">
        <strong>Usuário:</strong> user@fintech.com | 1234 <br />
        <strong style={{ marginTop: '5px', display: 'inline-block' }}>Admin:</strong> admin@fintech.com | 1234
      </div>

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="user@fintech.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input 
            type="password" 
            id="senha" 
            name="senha" 
            placeholder="••••" 
            required 
            minLength="4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Entrar</button>

        {error && <p className="login-erro-geral" style={{ display: 'block' }}>{error}</p>}
      </form>
    </section>
  );
}

export default LoginForm;
