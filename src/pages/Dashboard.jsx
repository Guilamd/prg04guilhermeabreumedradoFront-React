import React from 'react';
import DashboardSaldo from '../components/DashboardSaldo';
import DashboardChartCard from '../components/DashboardChartCard';
import RecentActivitiesCard from '../components/RecentActivitiesCard';
import DashboardVirtualCard from '../components/DashboardVirtualCard';
import DashboardGoals from '../components/DashboardGoals';

function Dashboard() {
  return (
    <section className="dashboard-grid" id="dashboardData">
      {/* Topo - Saldo e Ações Rápidas */}
      <div className="col-span-12">
        <DashboardSaldo />
      </div>
      
      {/* Coluna Esquerda - Gráficos e Histórico */}
      <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <DashboardChartCard />
        <RecentActivitiesCard />
      </div>

      {/* Coluna Direita - Cartão e Metas */}
      <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <DashboardVirtualCard />
        <DashboardGoals />
      </div>
    </section>
  );
}

export default Dashboard;
