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

// For multipart/form-data (file uploads) — no Content-Type header, browser sets it with boundary
function _authFetch(path, opts = {}) {
  const { headers: extraHeaders, ...restOpts } = opts
  return fetch(`${BASE}${path}`, {
    ...restOpts,
    headers: { Authorization: `Bearer ${session.getAccess()}`, ...extraHeaders },
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, data }
  })
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

  sendOtp: (email) =>
    _request('/api/auth/send-otp/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyEmail: (email, code) =>
    _request('/api/auth/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),

  resendOtp: () =>
    _authRequest('/api/auth/resend-otp/', { method: 'POST' }),
}

// ---------------------------------------------------------------------------
// Home feed endpoints
// ---------------------------------------------------------------------------

export const homeApi = {
  // Returns [{article, relevance_score, recommendation_reason}]
  feed: ({ limit = 20, content_type = '' } = {}) => {
    const qs = new URLSearchParams({ limit })
    if (content_type) qs.append('content_type', content_type)
    return _authRequest(`/api/home/feed/?${qs}`)
  },

  // Aggregate: profile card + top articles + leaderboards
  aggregate: () => _authRequest('/api/home/'),
}

// ---------------------------------------------------------------------------
// Articles endpoints
// ---------------------------------------------------------------------------

export const articlesApi = {
  feed: (content_type = '') => {
    const qs = content_type ? `?content_type=${content_type}` : ''
    return _authRequest(`/api/articles/${qs}`)
  },

  myArticles: () => _authRequest('/api/articles/my/'),

  detail: (id) => _authRequest(`/api/articles/${id}/`),

  // FormData upload — content_type, file (PDF/DOCX), title?, abstract?, contributor_ids[]
  create: (formData) => _authFetch('/api/articles/', { method: 'POST', body: formData }),

  // FormData upload for update
  update: (id, formData) => _authFetch(`/api/articles/${id}/`, { method: 'PATCH', body: formData }),

  deleteArticle: (id) => _authRequest(`/api/articles/${id}/`, { method: 'DELETE' }),

  submit: (id) => _authRequest(`/api/articles/${id}/submit/`, { method: 'PATCH', body: JSON.stringify({}) }),
}

// ---------------------------------------------------------------------------
// Etalase endpoints
// ---------------------------------------------------------------------------

export const etalaseApi = {
  list: ({ pub_type = '', year = '' } = {}) => {
    const qs = new URLSearchParams()
    if (pub_type) qs.append('pub_type', pub_type)
    if (year)     qs.append('year', year)
    const q = qs.toString()
    return _authRequest(`/api/etalase/${q ? `?${q}` : ''}`)
  },
  detail: (id) => _authRequest(`/api/etalase/${id}/`),
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

  // GET /api/profiles/{user_id}/ — public, no auth required
  public: (userId) =>
    _request(`/api/profiles/${userId}/`),
}

// ---------------------------------------------------------------------------
// Contributor / Leaderboard endpoints
// ---------------------------------------------------------------------------

export const contributorApi = {
  leaderboard: ({ limit = 10 } = {}) =>
    _authRequest(`/api/contributors/leaderboard/?limit=${limit}`),

  leaderboardAllTime: ({ limit = 10 } = {}) =>
    _authRequest(`/api/contributors/leaderboard/all-time/?limit=${limit}`),

  leaderboardHistory: ({ month, year } = {}) => {
    const qs = month && year ? `?month=${month}&year=${year}` : ''
    return _authRequest(`/api/contributors/leaderboard/history/${qs}`)
  },

  list: ({ role_category = '', institution = '' } = {}) => {
    const qs = new URLSearchParams()
    if (role_category) qs.append('role_category', role_category)
    if (institution)   qs.append('institution',   institution)
    const q = qs.toString()
    return _authRequest(`/api/contributors/${q ? `?${q}` : ''}`)
  },

  detail: (userId) => _authRequest(`/api/contributors/${userId}/`),
}
