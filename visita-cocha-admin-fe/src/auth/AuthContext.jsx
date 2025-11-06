// src/auth/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import * as mockApi from '../api/mockApi';

export const AuthContext = createContext();

const CURRENT_USER_KEY = 'vc_current_user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try{
      const raw = localStorage.getItem(CURRENT_USER_KEY)
      return raw ? JSON.parse(raw) : null
    }catch(e){ return null }
  });

  // async login using mockApi
  const login = async (email, password) => {
    try{
      await mockApi.authLogin(email, password)
      const users = await mockApi.getUsers()
      const u = users.find(x => x.email === email)
      const newUser = u ? { ...u } : { email, name: email, roles: ['SuperAdmin'] }
      setUser(newUser)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
      return true
    }catch(e){
      console.log('Login fallido', e)
      return false
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY)
    console.log('Sesión cerrada');
  };

  // update profile (persist to users storage and local current user)
  const updateProfile = async (id, patch) => {
    try{
      const updated = await mockApi.updateUser(id, patch)
      const merged = { ...user, ...updated }
      setUser(merged)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(merged))
      return merged
    }catch(e){ throw e }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
