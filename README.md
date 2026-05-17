# 🏦 FinTech | Gestão Financeira Pessoal

Sistema web de gestão financeira pessoal desenvolvido em React durante a disciplina de Programação Web (PRG04).

O projeto foca em automação e consolidação de múltiplas contas, oferecendo clareza total das entradas e saídas do usuário em um único painel intuitivo.

## 🎯 Objetivo
- Centralizar o controle de finanças pessoais em um único local
- Consolidar saldos e transações de múltiplas contas
- Proporcionar uma interface moderna e intuitiva (Dark Mode com Neon theme)
- Construir uma aplicação completa ao longo do semestre para a disciplina
- Aplicar conceitos modernos de desenvolvimento web utilizando React

## 🚀 Funcionalidades
- 🔐 Autenticação de usuários (Mockada via `localStorage`)
- 💰 Visão geral consolidada de saldos (Entradas e Saídas)
- 💳 Gerenciamento e acompanhamento de múltiplas carteiras/contas
- 🌐 Navegação fluida entre páginas (Dashboard, Login) com React Router DOM
- 🎨 Interface responsiva, moderna e estilizada com CSS modular

## 🏗️ Estrutura do Projeto

```text
📦 fintech
├── 📂 _backup_html       (Arquivos HTML originais de referência)
├── 📂 public             (Assets estáticos como favicon e ícones)
├── 📂 src
│   ├── 📂 assets         (Imagens importadas pelo código)
│   ├── 📂 components     (Header, Sidebar, Cards, etc.)
│   ├── 📂 contexts       (Contexts do React como AuthContext)
│   ├── 📂 css            (Estilos modulares: global, layout, auth)
│   ├── 📂 pages          (Páginas e Rotas: Dashboard, Login)
│   ├── 📄 App.jsx        (Componente principal e rotas)
│   ├── 📄 App.css        (Estilos do App)
│   ├── 📄 main.jsx       (Entry point do React)
│   └── 📄 index.css      (Estilos globais base)
│
├── 📄 eslint.config.js
├── 📄 index.html
├── 📄 package.json
├── 📄 vite.config.js
└── 📄 README.md
```

## 🛠️ Tecnologias Utilizadas

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

> *Utilizando CSS Modular para estilos (Dark Mode, Neon theme) e React Router DOM para navegação SPA.*

## 🌐 Deploy
Projeto publicado na Vercel:

🔗 [https://prg04guilhermeabreumedrado.vercel.app](https://prg04guilhermeabreumedrado.vercel.app)

## 🚀 Como Rodar

Para executar o projeto localmente, utilize os seguintes comandos:

```bash
npm install
npm run dev
```

## 📚 Conceitos Aplicados
- SPA (Single Page Application)
- Componentização e Reutilização de Código
- Gerenciamento de Estado e Context API (AuthContext)
- Navegação e Roteamento (React Router DOM)
- Armazenamento Local (localStorage) para persistência de dados de sessão mockados

---
**📝 Notas:**
- Os arquivos HTML originais estão preservados na pasta `_backup_html/` para fins de referência acadêmica e histórico do projeto.
