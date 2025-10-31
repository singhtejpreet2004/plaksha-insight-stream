/**
 * Local authentication system for Plaksha monitoring
 * No cloud dependencies - uses localStorage
 */

const AUTH_KEY = 'plaksha_auth_token';
const CREDENTIALS = {
  username: 'DixonIoT',
  password: 'P@ssw0rd@123'
};

export interface AuthUser {
  username: string;
  loginTime: string;
}

export const login = (username: string, password: string): boolean => {
  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    const user: AuthUser = {
      username,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(AUTH_KEY);
  return !!token;
};

export const getCurrentUser = (): AuthUser | null => {
  const token = localStorage.getItem(AUTH_KEY);
  if (!token) return null;
  try {
    return JSON.parse(token);
  } catch {
    return null;
  }
};
