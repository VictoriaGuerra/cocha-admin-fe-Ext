// src/auth/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>No autorizado. Inicia sesión primero.</p>;
  }

  if (!roles.includes(user.role)) {
    return <p>No tienes permisos para acceder a esta sección.</p>;
  }

  return children;
}
