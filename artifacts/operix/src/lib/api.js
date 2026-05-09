const API_URL = import.meta.env.VITE_API_URL || '/api';
async function apiFetch(method, path, body) {
    const token = localStorage.getItem('clerk_token');
    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok)
        throw new Error(await res.text());
    return res.status === 204 ? null : res.json();
}
export const api = {
    groups: {
        list: () => apiFetch('GET', '/groups'),
        create: (d) => apiFetch('POST', '/groups', d),
        get: (id) => apiFetch('GET', `/groups/${id}`),
        update: (id, d) => apiFetch('PUT', `/groups/${id}`, d),
        delete: (id) => apiFetch('DELETE', `/groups/${id}`),
    },
    staff: {
        list: (groupId) => apiFetch('GET', `/groups/${groupId}/staff`),
        create: (groupId, d) => apiFetch('POST', `/groups/${groupId}/staff`, d),
        delete: (groupId, id) => apiFetch('DELETE', `/groups/${groupId}/staff/${id}`),
    },
    cases: {
        list: (groupId) => apiFetch('GET', `/groups/${groupId}/cases`),
        create: (groupId, d) => apiFetch('POST', `/groups/${groupId}/cases`, d),
        update: (groupId, id, d) => apiFetch('PUT', `/groups/${groupId}/cases/${id}`, d),
    },
    sessions: {
        list: (groupId) => apiFetch('GET', `/groups/${groupId}/sessions`),
        create: (groupId, d) => apiFetch('POST', `/groups/${groupId}/sessions`, d),
        end: (groupId, id) => apiFetch('DELETE', `/groups/${groupId}/sessions/${id}`),
    },
    activity: {
        list: (groupId) => apiFetch('GET', `/groups/${groupId}/activity`),
    },
    settings: {
        get: (groupId) => apiFetch('GET', `/groups/${groupId}/settings`),
        update: (groupId, d) => apiFetch('PUT', `/groups/${groupId}/settings`, d),
    },
};
