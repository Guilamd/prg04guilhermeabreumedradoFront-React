import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="dashboard-content">
          <Outlet /> {/* As páginas aninhadas serão renderizadas aqui */}
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default Layout;
