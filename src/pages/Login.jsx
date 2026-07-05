import React from 'react';
import LoginForm from '../components/LoginForm';
import heroCard from '../assets/hero-card.png';

/* Ícones SVG inline — estilo outline fino e elegante */
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

const IconBolt = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconChart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M7 17V13"/><path d="M12 17V9"/><path d="M17 17V11"/>
  </svg>
);

const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const IconBank = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18"/><path d="M3 10h18"/><path d="M12 3l9 7H3l9-7z"/>
    <path d="M5 10v8"/><path d="M9 10v8"/><path d="M15 10v8"/><path d="M19 10v8"/>
  </svg>
);

const IconGlobe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/>
  </svg>
);

const IconLightbulb = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6"/><path d="M10 22h4"/>
    <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>
  </svg>
);

function Login() {
  return (
    <div className="auth-body">
      {/* Blobs de fundo */}
      <div className="auth-bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="auth-noise"></div>

      <div className="auth-split">
        {/* Lado esquerdo — Hero */}
        <div className="auth-hero">
          <div className="auth-hero-content">
            <div className="logo-badge">
              <span className="logo-dot"></span>
              <span>Fin<strong>Tech</strong></span>
            </div>

            <h1 className="hero-title">
              Suas finanças,<br />
              simplificadas e no<br />
              <span className="highlight">seu controle.</span>
            </h1>

            <p className="hero-subtitle">
              Reúna todas as suas contas em um painel inteligente. Acompanhe gastos, defina metas e tome decisões melhores.
            </p>

            <div className="hero-image-wrapper">
              <div className="hero-glow"></div>
              <img src={heroCard} alt="FinTech Card" className="hero-card-img" />
            </div>

            <div className="hero-features">
              <div className="feature-badge">
                <span className="feature-icon"><IconShield /></span>
                <div>
                  <strong>Segurança total</strong>
                  <p>Criptografia de ponta</p>
                </div>
              </div>
              <div className="feature-badge">
                <span className="feature-icon"><IconBolt /></span>
                <div>
                  <strong>Tempo real</strong>
                  <p>Dados sempre atualizados</p>
                </div>
              </div>
              <div className="feature-badge">
                <span className="feature-icon"><IconChart /></span>
                <div>
                  <strong>Visão unificada</strong>
                  <p>Tudo em um só lugar</p>
                </div>
              </div>
              <div className="feature-badge">
                <span className="feature-icon"><IconTarget /></span>
                <div>
                  <strong>Metas pessoais</strong>
                  <p>Planeje seu futuro</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito — Login */}
        <div className="auth-form-side">
          <main className="auth-container">
            <LoginForm />
          </main>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="auth-trust-bar">
        <div className="trust-item">
          <span className="trust-icon"><IconBank /></span>
          <div>
            <strong>+10 mil contas</strong>
            <p>conectadas na plataforma</p>
          </div>
        </div>
        <div className="trust-divider"></div>
        <div className="trust-item">
          <span className="trust-icon"><IconGlobe /></span>
          <div>
            <strong>Todo o Brasil</strong>
            <p>Acesso de qualquer lugar</p>
          </div>
        </div>
        <div className="trust-divider"></div>
        <div className="trust-item">
          <span className="trust-icon"><IconLock /></span>
          <div>
            <strong>100% seguro</strong>
            <p>Criptografia ponta a ponta</p>
          </div>
        </div>
        <div className="trust-divider"></div>
        <div className="trust-item">
          <span className="trust-icon"><IconLightbulb /></span>
          <div>
            <strong>Inovação contínua</strong>
            <p>Tecnologia a seu favor</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
