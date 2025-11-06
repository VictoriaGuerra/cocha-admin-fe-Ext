// src/App.jsx
import React, { useContext } from 'react';
import Login from './components/Login';
import { AuthContext } from './auth/AuthContext';

export default function App() {
  const { user } = useContext(AuthContext);

  return user ? (
    <div className="container">
      <h1>Bienvenido {user.email}</h1>
    </div>
  ) : (
    <Login />
  );
}
