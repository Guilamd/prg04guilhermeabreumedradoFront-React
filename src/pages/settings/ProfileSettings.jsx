import React, { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IconArrowLeft } from '../../components/Icons';
import api from '../../services/api';

function ProfileSettings({ onBack }) {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [nome, setNome] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [telefone, setTelefone] = useState('(11) 99999-9999');

  const iniciais = user ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (user && user.id) {
        await api.put(`/usuarios/${user.id}/perfil`, {
          nome,
          email
        });
      }
      updateUser({ name: nome, email: email });
      alert('Perfil atualizado com sucesso!');
      onBack();
    } catch(err) {
      console.error(err);
      alert('Erro ao atualizar perfil.');
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px', borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s'
  };

  const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' };

  return (
    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px' }}>
        <button type="button" onClick={onBack} className="btn-icon-back">
          <IconArrowLeft />
        </button>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Perfil</h2>
      </div>

      {/* Avatar Edição */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-emerald) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.2rem', fontWeight: 'bold', color: '#fff',
          }}>
            {user?.image ? (
              <img src={user.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              iniciais
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="btn-edit-avatar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Formulário */}
      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleSave}>
        <div>
          <label style={labelStyle}>Nome Completo</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>Telefone</label>
          <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={inputStyle} />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '16px', padding: '14px', borderRadius: '12px', fontSize: '1rem' }}>
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}

export default ProfileSettings;
