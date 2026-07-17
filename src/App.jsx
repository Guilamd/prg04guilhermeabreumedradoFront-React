import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Carteiras from './pages/Carteiras';
import Transacoes from './pages/Transacoes';
import Metas from './pages/Metas';
import Configuracoes from './pages/Configuracoes';

function App() {
  return (
    <Routes>
      {/* Rota para a página de login (sem o layout principal) */}
      <Route path="/login" element={<Login />} />

      {/* Rotas que usam o layout principal (Sidebar, Header, etc.) */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="carteiras" element={<Carteiras />} />
        <Route path="transacoes" element={<Transacoes />} />
        <Route path="metas" element={<Metas />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
    </Routes>
  );
}

export default App;
// Force HMR
