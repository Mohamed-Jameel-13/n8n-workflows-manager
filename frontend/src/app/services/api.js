const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const user = api.getCurrentUser();
  if (user && user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }
  return headers;
}

export const api = {
  // Auth Session Helpers
  getCurrentUser() {
    try {
      const stored = localStorage.getItem('autoflow_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('autoflow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('autoflow_user');
    }
  },

  logout() {
    localStorage.removeItem('autoflow_user');
  },

  // Auth Endpoints
  async login(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid credentials');
    }
    const data = await res.json();
    this.setCurrentUser(data);
    return data;
  },

  async signup(data) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Signup failed');
    }
    const result = await res.json();
    this.setCurrentUser(result);
    return result;
  },

  // Automations
  async getAutomations(type, query) {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.set('type', type);
    if (query) params.set('query', query);
    const url = `${API_BASE_URL}/automations${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch automations from database');
    return await res.json();
  },

  async getAutomation(id) {
    const res = await fetch(`${API_BASE_URL}/automations/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Automation not found');
    return await res.json();
  },

  async createAutomation(data) {
    const res = await fetch(`${API_BASE_URL}/automations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create automation');
    }
    return await res.json();
  },

  async updateAutomation(id, data) {
    const res = await fetch(`${API_BASE_URL}/automations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update automation');
    return await res.json();
  },

  async toggleAutomationStatus(id) {
    const res = await fetch(`${API_BASE_URL}/automations/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to toggle status');
    return await res.json();
  },

  async runAutomation(id) {
    const res = await fetch(`${API_BASE_URL}/automations/${id}/run`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to trigger automation execution');
    }
    return await res.json();
  },

  async deleteAutomation(id) {
    const res = await fetch(`${API_BASE_URL}/automations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete automation');
    return await res.json();
  },

  // Workflows
  async getWorkflows() {
    const res = await fetch(`${API_BASE_URL}/workflows`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch workflows');
    return await res.json();
  },

  async createWorkflow(data) {
    const res = await fetch(`${API_BASE_URL}/workflows`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create workflow');
    return await res.json();
  },

  async toggleWorkflowStatus(id) {
    const res = await fetch(`${API_BASE_URL}/workflows/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to toggle workflow status');
    return await res.json();
  },

  async deleteWorkflow(id) {
    const res = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete workflow');
    return await res.json();
  },

  // Activity
  async getActivities() {
    const res = await fetch(`${API_BASE_URL}/activity`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch activities');
    return await res.json();
  },

  exportActivityCsvUrl() {
    return `${API_BASE_URL}/activity/export-csv`;
  },

  // Dashboard
  async getDashboardKpi() {
    const res = await fetch(`${API_BASE_URL}/dashboard/kpi`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch KPI data');
    return await res.json();
  },

  async getDashboardChart() {
    const res = await fetch(`${API_BASE_URL}/dashboard/chart`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch chart data');
    return await res.json();
  },

  async getDashboardRecent() {
    const res = await fetch(`${API_BASE_URL}/dashboard/recent`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch recent runs');
    return await res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE_URL}/settings`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  },

  async updateProfile(profile) {
    const res = await fetch(`${API_BASE_URL}/settings/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Failed to update profile');
    }
    return await res.json();
  },

  async updateWorkspace(workspace) {
    const res = await fetch(`${API_BASE_URL}/settings/workspace`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(workspace),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || 'Failed to update workspace');
    }
    return await res.json();
  },

  async generateApiKey(name) {
    const res = await fetch(`${API_BASE_URL}/settings/api-keys`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to generate API key');
    return await res.json();
  },

  async revokeApiKey(id) {
    const res = await fetch(`${API_BASE_URL}/settings/api-keys/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to revoke API key');
    return await res.json();
  },

  // n8n Live Integration
  async checkN8nHealth() {
    const res = await fetch(`${API_BASE_URL}/n8n/health`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to perform health check');
    return await res.json();
  },

  async testN8nConnection(baseUrl, apiKey) {
    const res = await fetch(`${API_BASE_URL}/n8n/test-connection`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ baseUrl, apiKey }),
    });
    if (!res.ok) throw new Error('Connection test failed');
    return await res.json();
  },

  async syncN8nWorkflows() {
    const res = await fetch(`${API_BASE_URL}/n8n/sync-workflows`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Workflow sync failed');
    }
    return await res.json();
  },

  async getN8nWorkflows() {
    const res = await fetch(`${API_BASE_URL}/n8n/workflows`, { headers: getAuthHeaders() });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch n8n workflows');
    }
    return await res.json();
  },
};
