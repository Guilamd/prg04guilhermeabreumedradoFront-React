import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      {/* Rota para a página de login (sem o layout principal) */}
      <Route path="/login" element={<Login />} />

      {/* Rotas que usam o layout principal (Sidebar, Header, etc.) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="admin" element={<Admin />} />
        {/* Outras páginas com o mesmo layout podem ser adicionadas aqui no futuro */}
        {/* Ex: <Route path="carteiras" element={<Carteiras />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
