import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from './api.js';

const Ctx = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (token) {
      try { setUser(jwtDecode(token)); } catch {}
    }
  },[]);
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(jwtDecode(data.token));
    return data;
  };
  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    localStorage.setItem('token', data.token);
    setUser(jwtDecode(data.token));
    return data;
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  const changePassword = async (oldPassword, newPassword) => {
    await api.post('/users/me/password', { oldPassword, newPassword });
  };
  return <Ctx.Provider value={{ user, login, signup, logout, changePassword }}>{children}</Ctx.Provider>;
}
export const useAuth = ()=> useContext(Ctx);
