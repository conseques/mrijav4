const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

async function apiFetch(path, options = {}) {
  const { headers, ...restOptions } = options;
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {})
    },
    ...restOptions
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export async function registerVolunteer({ name, email, phone, password }) {
  return apiFetch('/api/auth/register-volunteer', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password })
  });
}

export async function loginVolunteer({ email, password }) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function fetchMe(token) {
  return apiFetch('/api/auth/me', {
    headers: authHeader(token)
  });
}

export async function updateProfile(token, { name, phone }) {
  return apiFetch('/api/auth/me', {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify({ name, phone })
  });
}

export async function updateSkills(token, skills) {
  return apiFetch('/api/auth/me/skills', {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify({ skills })
  });
}

// ─── Firebase token exchange (for admin panel) ────────────────────────────

export async function exchangeFirebaseToken(idToken) {
  return apiFetch('/api/auth/firebase-exchange', {
    method: 'POST',
    body: JSON.stringify({ idToken })
  });
}

// ─── Volunteer Tasks ────────────────────────────────────────────────────────

export async function fetchTasks(token) {
  return apiFetch('/api/volunteer/tasks', {
    headers: authHeader(token)
  });
}

export async function fetchMyTasks(token) {
  return apiFetch('/api/volunteer/tasks/my', {
    headers: authHeader(token)
  });
}

export async function applyToTask(token, taskId) {
  return apiFetch(`/api/volunteer/tasks/${taskId}/apply`, {
    method: 'POST',
    headers: authHeader(token)
  });
}

// ─── Admin: Volunteer Management ──────────────────────────────────────────

export async function fetchAdminVolunteers(token, status = '') {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiFetch(`/api/admin/volunteers${query}`, {
    headers: authHeader(token)
  });
}

export async function reviewVolunteer(token, userId, status) {
  return apiFetch(`/api/admin/volunteers/${userId}/review`, {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify({ status })
  });
}

export async function changeVolunteerRole(token, userId, role) {
  return apiFetch(`/api/admin/volunteers/${userId}/role`, {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify({ role })
  });
}

// ─── Admin: Tasks ──────────────────────────────────────────────────────────

export async function createTask(token, payload) {
  return apiFetch('/api/volunteer/tasks', {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(payload)
  });
}

export async function deleteTask(token, taskId) {
  return apiFetch(`/api/volunteer/tasks/${taskId}`, {
    method: 'DELETE',
    headers: authHeader(token)
  });
}

// ─── Admin: Events ─────────────────────────────────────────────────────────

export async function fetchAdminEvents(token) {
  return apiFetch('/api/admin/events', { headers: authHeader(token) });
}

export async function createEvent(token, payload) {
  return apiFetch('/api/admin/events', {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(payload)
  });
}

export async function updateEvent(token, id, payload) {
  return apiFetch(`/api/admin/events/${id}`, {
    method: 'PUT',
    headers: authHeader(token),
    body: JSON.stringify(payload)
  });
}

export async function deleteEvent(token, id) {
  return apiFetch(`/api/admin/events/${id}`, {
    method: 'DELETE',
    headers: authHeader(token)
  });
}

// ─── Admin: Past Events ────────────────────────────────────────────────────

export async function fetchAdminPastEvents(token) {
  return apiFetch('/api/admin/past-events', { headers: authHeader(token) });
}

export async function createPastEvent(token, payload) {
  return apiFetch('/api/admin/past-events', {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(payload)
  });
}

export async function updatePastEvent(token, id, payload) {
  return apiFetch(`/api/admin/past-events/${id}`, {
    method: 'PUT',
    headers: authHeader(token),
    body: JSON.stringify(payload)
  });
}

export async function deletePastEvent(token, id) {
  return apiFetch(`/api/admin/past-events/${id}`, {
    method: 'DELETE',
    headers: authHeader(token)
  });
}

// ─── Admin: Courses ────────────────────────────────────────────────────────

export async function fetchAdminCourses(token) {
  return apiFetch('/api/admin/courses', { headers: authHeader(token) });
}

export async function createCourse(token, payload) {
  return apiFetch('/api/admin/courses', {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(payload)
  });
}

export async function updateCourse(token, id, payload) {
  return apiFetch(`/api/admin/courses/${id}`, {
    method: 'PUT',
    headers: authHeader(token),
    body: JSON.stringify(payload)
  });
}

export async function deleteCourse(token, id) {
  return apiFetch(`/api/admin/courses/${id}`, {
    method: 'DELETE',
    headers: authHeader(token)
  });
}

// ─── Admin: Registrations & Memberships ────────────────────────────────────

export async function fetchAdminRegistrations(token) {
  return apiFetch('/api/admin/registrations', { headers: authHeader(token) });
}

export async function fetchAdminMemberships(token) {
  return apiFetch('/api/admin/memberships', { headers: authHeader(token) });
}

// ─── Admin: Report ─────────────────────────────────────────────────────────

export async function fetchAdminReport(token) {
  return apiFetch('/api/admin/report', { headers: authHeader(token) });
}

export async function updateAdminReport(token, payload) {
  return apiFetch('/api/admin/report', {
    method: 'PUT',
    headers: authHeader(token),
    body: JSON.stringify(payload)
  });
}
