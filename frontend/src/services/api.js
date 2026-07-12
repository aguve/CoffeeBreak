const API_BASE = '/CoffeeBreak/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`API Error ${response.status}: ${text || response.statusText}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  productos: {
    getAll: () => request('/productos'),
    getById: (id) => request(`/productos/${id}`),
    getByCategory: (categoryId) => request(`/productos/categoria/${categoryId}`),
  },

  categorias: {
    getAll: () => request('/categorias'),
  },

  auth: {
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, contrasena: password }),
      }),
    register: (data) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  pedidos: {
    create: (pedido) =>
      request('/pedidos', {
        method: 'POST',
        body: JSON.stringify(pedido),
      }),
    getByClient: (clientId) => request(`/pedidos/cliente/${clientId}`),
  },
};
