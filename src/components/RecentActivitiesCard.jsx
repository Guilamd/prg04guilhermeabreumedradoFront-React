import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function RecentActivitiesCard() {
  const { user } = useAuth();

  return (
    <section className="card recent-activities-card">
      <h3>Atividades Recentes</h3>
      <div className="table-responsive">
        <table className="activities-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th className="align-right">Valor</th>
            </tr>
          </thead>
          <tbody id="activitiesBody">
            {user ? (
              <>
                <tr>
                  <td>Hoje</td>
                  <td>Alimentação</td>
                  <td>Almoço</td>
                  <td className="align-right expense">- R$ 25,00</td>
                </tr>
                <tr>
                  <td>Ontem</td>
                  <td>Salário</td>
                  <td>Adiantamento</td>
                  <td className="align-right income">+ R$ 1.500,00</td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                  Nenhuma transação encontrada. Faça login para sincronizar dados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentActivitiesCard;
