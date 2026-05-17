# 🏦 FinTech | Gestão Financeira Pessoal

O **FinTech** é uma aplicação web de gestão financeira pessoal focada em automação e consolidação de múltiplas contas, onde o usuário pode ter clareza total de suas entradas e saídas em um único painel.

Este projeto está sendo desenvolvido para a disciplina de **Programação Web (PRG04)**, com o objetivo de construir uma aplicação completa ao longo do semestre.

---

## 🛠️ Tecnologias

- **React 19** + **Vite 8**
- **React Router DOM** (navegação SPA)
- **CSS modular** (Dark Mode, Neon theme)

## 📂 Estrutura do Projeto

```
├── _backup_html/          → Arquivos HTML antigos (referência)
├── public/                → Assets estáticos (favicon, ícones)
├── src/
│   ├── assets/            → Imagens importadas pelo código
│   ├── components/        → Componentes reutilizáveis (Header, Sidebar, Cards...)
│   ├── contexts/          → Contexts do React (AuthContext)
│   ├── css/               → Estilos modulares (global, layout, components, auth)
│   ├── pages/             → Páginas/Rotas (Dashboard, Login)
│   ├── App.jsx            → Componente principal + rotas
│   ├── App.css            → Estilos do App
│   ├── main.jsx           → Entry point do React
│   └── index.css          → Estilos globais base
├── index.html             → HTML entry point do Vite
├── package.json
├── vite.config.js
└── eslint.config.js
```

## 🚀 Como Rodar

```bash
npm install
npm run dev
```

## 📝 Notas

- Os arquivos HTML originais estão preservados em `_backup_html/` para referência.
- O sistema de autenticação é mockado via `localStorage`.
