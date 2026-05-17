import React from 'react';
import BalanceCard from '../components/BalanceCard';
import WalletsSection from '../components/WalletsSection';
import CashFlowCard from '../components/CashFlowCard';
import RecentActivitiesCard from '../components/RecentActivitiesCard';

function Dashboard() {
  return (
    <section className="dashboard-grid" id="dashboardData">
      <BalanceCard />
      <WalletsSection />
      <CashFlowCard />
      <RecentActivitiesCard />
    </section>
  );
}

export default Dashboard;
