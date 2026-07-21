const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://codexa-backend-op1p.onrender.com/api/v1';

const getHeaders = (isFormData = false) => {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData = response.statusText || 'Something went wrong';
    try {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        errorData = data.detail || JSON.stringify(data);
      } catch {
        if (text && text.trim().startsWith('<')) {
          errorData = 'Server connection error. Please ensure the backend server is deployed and running.';
        } else {
          errorData = text || response.statusText || errorData;
        }
      }
    } catch {
      // Fallback if reading text fails
    }
    throw new Error(errorData);
  }
  if (response.status === 204) return null;
  return response.json();
};



export const api = {
  // ── Auth ──────────────────────────────────────────────────────
  auth: {
    // No public register endpoint — accounts are created on admin approval.
    login: async (email, password) => {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      return handleResponse(
        await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: getHeaders(true),
          body: formData,
        })
      );
    },
    changePassword: async (current_password, new_password) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/auth/change-password`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ current_password, new_password }),
        })
      ),
    getMe: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/auth/me`, { headers: getHeaders() })),
    updateMe: async (display_name) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ display_name }),
        })
      ),
    refresh: async () =>
      handleResponse(
        await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: getHeaders(),
        })
      ),
  },

  // ── Announcements ────────────────────────────────────────────
  announcements: {
    getAll: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/announcements/`, { headers: getHeaders() })),
    getAllAdmin: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/announcements/admin/all`, { headers: getHeaders() })),
    create: async (data) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/announcements/`, {
          method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
        })
      ),
    delete: async (id) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/announcements/${id}`, {
          method: 'DELETE', headers: getHeaders(),
        })
      ),
    deleteExpired: async () =>
      handleResponse(
        await fetch(`${API_BASE_URL}/announcements/expired`, {
          method: 'DELETE', headers: getHeaders(),
        })
      ),
  },

  // ── Events ───────────────────────────────────────────────────
  events: {
    getAll: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/events/`, { headers: getHeaders() })),
    getAllAdmin: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/events/admin/all`, { headers: getHeaders() })),
    create: async (data) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/events/`, {
          method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
        })
      ),
    register: async (id) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/events/${id}/register`, {
          method: 'POST', headers: getHeaders(),
        })
      ),
    confirmForm: async (id) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/events/${id}/confirm-form`, {
          method: 'POST', headers: getHeaders(),
        })
      ),
    delete: async (id) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/events/${id}`, {
          method: 'DELETE', headers: getHeaders(),
        })
      ),
    deleteExpired: async () =>
      handleResponse(
        await fetch(`${API_BASE_URL}/events/expired`, {
          method: 'DELETE', headers: getHeaders(),
        })
      ),
    getRegistrations: async (id) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/events/${id}/registrations`, {
          headers: getHeaders(),
        })
      ),
    updateAttendance: async (id, userId, attended, points = 10) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/events/${id}/attendance`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ user_id: userId, attended, points }),
        })
      ),
  },

  // ── Upload ───────────────────────────────────────────────────
  upload: {
    file: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return handleResponse(
        await fetch(`${API_BASE_URL}/upload/`, {
          method: 'POST',
          headers: getHeaders(true),
          body: formData,
        })
      );
    },
  },

  // ── Members ──────────────────────────────────────────────────
  members: {
    getMeProfile: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/members/me`, { headers: getHeaders() })),
    getAll: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/members/`, { headers: getHeaders() })),

    getById: async (id) =>
      handleResponse(await fetch(`${API_BASE_URL}/members/${id}`, { headers: getHeaders() })),
    update: async (id, data) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/members/${id}`, {
          method: 'PUT', headers: getHeaders(), body: JSON.stringify(data),
        })
      ),
    awardPoints: async (id, data) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/members/${id}/award_points`, {
          method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
        })
      ),
    revokePoints: async (id, entryIdx) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/members/${id}/points_history/${entryIdx}`, {
          method: 'DELETE', headers: getHeaders(),
        })
      ),
    delete: async (id) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/members/${id}`, {
          method: 'DELETE', headers: getHeaders(),
        })
      ),
  },


  // ── Projects ─────────────────────────────────────────────────
  projects: {
    getAll: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/projects/`, { headers: getHeaders() })),
    create: async (data) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/projects/`, {
          method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
        })
      ),
    delete: async (id) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/projects/${id}`, {
          method: 'DELETE', headers: getHeaders(),
        })
      ),
  },

  // ── Resources ────────────────────────────────────────────────
  resources: {
    getAll: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/resources/`, { headers: getHeaders() })),
    create: async (data) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/resources/`, {
          method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
        })
      ),
    delete: async (id) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/resources/${id}`, {
          method: 'DELETE', headers: getHeaders(),
        })
      ),
  },

  // ── Join Requests (Registration Applications) ────────────────
  joinRequests: {
    // Public: submit a registration request (no token needed)
    submit: async (data) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/join_requests/`, {
          method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
        })
      ),
    // Admin only
    getAll: async (statusFilter = '') => {
      const url = statusFilter
        ? `${API_BASE_URL}/join_requests/?status_filter=${statusFilter}`
        : `${API_BASE_URL}/join_requests/`;
      return handleResponse(await fetch(url, { headers: getHeaders() }));
    },
    updateStatus: async (id, status) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/join_requests/${id}/status`, {
          method: 'PUT', headers: getHeaders(), body: JSON.stringify({ status }),
        })
      ),
    approveAll: async () =>
      handleResponse(
        await fetch(`${API_BASE_URL}/join_requests/approve-all`, {
          method: 'POST', headers: getHeaders(),
        })
      ),
    delete: async (id) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/join_requests/${id}`, {
          method: 'DELETE', headers: getHeaders(),
        })
      ),
  },


  // ── Challenges ───────────────────────────────────────────────
  challenges: {
    getAll: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/challenges/`, { headers: getHeaders() })),
    create: async (data) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/challenges/`, {
          method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
        })
      ),
    delete: async (id) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/challenges/${id}`, {
          method: 'DELETE', headers: getHeaders(),
        })
      ),
    submit: async (id, githubUrl, comments = "") =>
      handleResponse(
        await fetch(`${API_BASE_URL}/challenges/${id}/submit?github_url=${encodeURIComponent(githubUrl)}&comments=${encodeURIComponent(comments)}`, {
          method: 'POST', headers: getHeaders(),
        })
      ),
    getSubmissions: async (id) =>
      handleResponse(await fetch(`${API_BASE_URL}/challenges/${id}/submissions`, { headers: getHeaders() })),
    getAllSubmissions: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/challenges/submissions/all`, { headers: getHeaders() })),
    getMySubmissions: async () =>
      handleResponse(await fetch(`${API_BASE_URL}/challenges/submissions/my`, { headers: getHeaders() })),
    updateSubmissionStatus: async (submissionId, status, feedback = null) =>
      handleResponse(
        await fetch(`${API_BASE_URL}/challenges/submissions/${submissionId}/status`, {
          method: 'PUT', headers: getHeaders(), body: JSON.stringify({ status, feedback }),
        })
      ),
  },
};
