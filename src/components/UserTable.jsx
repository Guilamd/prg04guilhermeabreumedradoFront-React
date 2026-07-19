import React, { useState, useEffect } from 'react';
import api from '../services/api';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        {/* Futuro: Implementar modal de Novo Usuário */}
        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Novo Usuário</button>
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
                  {/* Futuro: Implementar edição */}
                  <button onClick={() => alert('Edição em breve')} className="action-btn edit" style={{ marginRight: '8px', background: 'transparent', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleDelete(user.id)} className="action-btn delete" style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--accent-rose)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Excluir</button>
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
    </section>
  );
}

export default UserTable;
