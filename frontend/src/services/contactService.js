const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new Error('Cannot connect to the backend. Make sure Spring Boot is running on port 8080.');
  }

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const data = await response.json();
      message = data.detail || data.message || data.error || message;
      if (data.errors) message = Object.values(data.errors).join(' ');
    } catch {
      if (response.status === 404) message = 'Contact not found.';
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const contactService = {
  getAll: (name = '') => {
    const query = name.trim() ? `?name=${encodeURIComponent(name.trim())}` : '';
    return request(`/contacts${query}`);
  },
  create: (contact) => request('/contacts', { method: 'POST', body: JSON.stringify(contact) }),
  update: (id, contact) => request(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(contact) }),
  remove: (id) => request(`/contacts/${id}`, { method: 'DELETE' })
};
