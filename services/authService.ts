const API_BASE =
  (import.meta as any).env.VITE_API_URL || 'http://localhost:4000';

export interface AuthUser {
  id: number;
  username: string;
  preferred_lang?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const signup = async (
  username: string,
  password: string,
  preferredLang: string,
): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, preferredLang }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Signup failed');
  }
  return res.json();
};

export const login = async (
  username: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Login failed');
  }
  return res.json();
};

export const getMe = async (token: string) => {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error('Failed to load user data');
  }
  return res.json();
};

export const saveStateRemote = async (token: string, state: any) => {
  try {
    const res = await fetch(`${API_BASE}/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(state),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        // Token expired
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        throw new Error('Session expired');
      }
      throw new Error('Failed to save data');
    }
  } catch (err) {
    console.error('Failed to save state remotely:', err);
    // Don't throw - allow app to continue with local storage
  }
};


