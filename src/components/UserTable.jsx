import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from './Modal';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setEditingUserId(null);
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setNome(user.nome);
    setEmail(user.email);
    setSenha(''); // Senha vazia, só será atualizada se o admin digitar algo
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nome || !email) return;

    try {
      if (editingUserId) {
        await api.put(`/usuarios/${editingUserId}`, { nome, email, senha });
      } else {
        if (!senha) return alert('Senha é obrigatória para novos usuários.');
        await api.post('/usuarios', { nome, email, senha });
      }
      setIsModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar usuário. Verifique se o e-mail já está em uso.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário.');
      }
    }
  };

  if (loading) {
    return <section className="card admin-table-card" style={{ gridColumn: '1 / -1', padding: '24px' }}>Carregando usuários...</section>;
  }

  return (
    <section className="card admin-table-card" style={{ gridColumn: '1 / -1' }}>
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 24px' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Usuários Cadastrados</h3>
        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => { resetForm(); setIsModalOpen(true); }}>+ Novo Usuário</button>
      </div>
      <div className="table-responsive" style={{ padding: '0 24px 24px' }}>
        <table className="activities-table admin-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Nome</th>
              <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>E-mail</th>
              <th style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>Data Criação</th>
              <th style={{ padding: '12px 0', color: 'var(--text-secondary)', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px 0', color: 'var(--text-primary)' }}>{user.id}</td>
                <td style={{ padding: '16px 0', color: 'var(--text-primary)' }}>{user.nome}</td>
                <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>{user.email}</td>
                <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>
                  {user.dataCriacao ? new Date(user.dataCriacao).toLocaleDateString('pt-BR') : 'N/A'}
                </td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleEditClick(user)} 
                    style={{ marginRight: '8px', background: 'transparent', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-emerald)'; e.currentTarget.style.color = '#111'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-emerald)'; }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid transparent', color: 'var(--accent-rose)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-rose)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = 'var(--accent-rose)'; }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingUserId ? "Editar Usuário" : "Novo Usuário"}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nome Completo</label>
            <input 
              type="text" placeholder="Nome do usuário" value={nome} onChange={(e) => setNome(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>E-mail</label>
            <input 
              type="email" placeholder="usuario@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Senha {editingUserId && <span style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>(deixe em branco para não alterar)</span>}
            </label>
            <input 
              type="password" placeholder="********" value={senha} onChange={(e) => setSenha(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }} 
              required={!editingUserId}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '16px', padding: '14px', fontSize: '1rem', width: '100%' }}>
            {editingUserId ? "Salvar Alterações" : "Criar Usuário"}
          </button>
        </form>
      </Modal>
    </section>
  );
}

export default UserTable;
