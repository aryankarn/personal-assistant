import { createContext } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  loading: true,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {}
});