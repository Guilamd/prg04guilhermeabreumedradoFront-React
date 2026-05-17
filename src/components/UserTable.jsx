function UserTable() {
  const users = [
    { id: 1, name: 'Guilherme Medrado', email: 'guilherme@fintech.com', status: 'active' },
    { id: 2, name: 'Ana Carolina Silva', email: 'ana.silva@fintech.com', status: 'active' },
    { id: 3, name: 'Lucas Oliveira', email: 'lucas.oliveira@fintech.com', status: 'inactive' },
    { id: 4, name: 'Mariana Costa', email: 'mariana.costa@fintech.com', status: 'active' },
    { id: 5, name: 'Pedro Santos', email: 'pedro.santos@fintech.com', status: 'inactive' },
  ];

  return (
    <section className="card admin-table-card" style={{ gridColumn: '1 / -1' }}>
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Usuários Cadastrados</h3>
        <button className="btn btn-primary btn-sm">+ Novo Usuário</button>
      </div>
      <div className="table-responsive">
        <table className="activities-table admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Status</th>
              <th className="align-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="align-right">
                  <button className="action-btn edit">Editar</button>
                  <button className="action-btn delete">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default UserTable;
