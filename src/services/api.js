import axios from 'axios';

// Instância base do Axios configurada para a porta padrão do Spring Boot
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Token JWT em todas as requisições (Fase 3)
api.interceptors.request.use(
  (config) => {
    // Se no futuro tivermos um token no localStorage:
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tratamento global de erros da API
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Acesso não autorizado. Redirecionando ou limpando sessão...');
      // Futuramente, pode limpar localStorage e redirecionar para /login
    }
    return Promise.reject(error);
  }
);

export default api;
