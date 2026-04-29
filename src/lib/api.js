const BASE = import.meta.env.VITE_API_URL

async function _request(path, opts = {}) {
  const { headers: extraHeaders, ...restOpts } = opts
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    ...restOpts,
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

// ---------------------------------------------------------------------------
// Token & session storage
// ---------------------------------------------------------------------------

export const session = {
  save(access, refresh, user) {
    localStorage.setItem('rh_access', access)
    localStorage.setItem('rh_refresh', refresh)
    localStorage.setItem('rh_user', JSON.stringify(user))
  },
  clear() {
    localStorage.removeItem('rh_access')
    localStorage.removeItem('rh_refresh')
    localStorage.removeItem('rh_user')
  },
  getAccess: () => localStorage.getItem('rh_access'),
  getRefresh: () => localStorage.getItem('rh_refresh'),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('rh_user')) } catch { return null }
  },
}

function _authRequest(path, opts = {}) {
  return _request(path, {
    ...opts,
    headers: {
      Authorization: `Bearer ${session.getAccess()}`,
      ...opts.headers,
    },
  })
}

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------

export const authApi = {
  login: (email, password) =>
    _request('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (full_name, email, password, password_confirm) =>
    _request('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ full_name, email, password, password_confirm }),
    }),

  logout: (refresh) =>
    _authRequest('/api/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }),
}

// ---------------------------------------------------------------------------
// Profile endpoints
// ---------------------------------------------------------------------------

export const profilesApi = {
  me: () =>
    _authRequest('/api/profiles/me/'),

  update: (data) =>
    _authRequest('/api/profiles/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  complete: (institution, role_category, location = '') =>
    _authRequest('/api/profiles/me/complete/', {
      method: 'PATCH',
      body: JSON.stringify({
        institution,
        role_category,
        ...(location.trim() && { location: location.trim() }),
      }),
    }),
}
