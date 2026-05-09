const API_URL = import.meta.env.VITE_API_URL || '/api';

async function apiFetch(method: string, path: string, body?: unknown) {
  const token = localStorage.getItem('clerk_token');
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {'Content-Type': 'application/json', ...(token && {'Authorization': `Bearer ${token}`})},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? null : res.json();
}

export const api = {
  groups: {
    list: () => apiFetch('GET', '/groups'),
    create: (d: Record<string, unknown>) => apiFetch('POST', '/groups', d),
    get: (id: string | number) => apiFetch('GET', `/groups/${id}`),
    update: (id: string | number, d: Record<string, unknown>) => apiFetch('PUT', `/groups/${id}`, d),
    delete: (id: string | number) => apiFetch('DELETE', `/groups/${id}`),
  },
  staff: {
    list: (groupId: string | number) => apiFetch('GET', `/groups/${groupId}/staff`),
    create: (groupId: string | number, d: Record<string, unknown>) => apiFetch('POST', `/groups/${groupId}/staff`, d),
    delete: (groupId: string | number, id: string | number) => apiFetch('DELETE', `/groups/${groupId}/staff/${id}`),
  },
  cases: {
    list: (groupId: string | number) => apiFetch('GET', `/groups/${groupId}/cases`),
    create: (groupId: string | number, d: Record<string, unknown>) => apiFetch('POST', `/groups/${groupId}/cases`, d),
    update: (groupId: string | number, id: string | number, d: Record<string, unknown>) => apiFetch('PUT', `/groups/${groupId}/cases/${id}`, d),
  },
  sessions: {
    list: (groupId: string | number) => apiFetch('GET', `/groups/${groupId}/sessions`),
    create: (groupId: string | number, d: Record<string, unknown>) => apiFetch('POST', `/groups/${groupId}/sessions`, d),
    end: (groupId: string | number, id: string | number) => apiFetch('DELETE', `/groups/${groupId}/sessions/${id}`),
  },
  activity: {
    list: (groupId: string | number) => apiFetch('GET', `/groups/${groupId}/activity`),
  },
  settings: {
    get: (groupId: string | number) => apiFetch('GET', `/groups/${groupId}/settings`),
    update: (groupId: string | number, d: Record<string, unknown>) => apiFetch('PUT', `/groups/${groupId}/settings`, d),
  },
};
