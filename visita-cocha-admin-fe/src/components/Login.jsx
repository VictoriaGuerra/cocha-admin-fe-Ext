import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import '../styles/login.css'; 

import logo from '../assets/images/logo.png';        // Logo principal
import logoCocha from '../assets/images/logoCocha.png'; // Escudo Cochabamba
export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => { 
      if (!login(email, password)) {
        setError('Usuario o contraseña incorrecta');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="login-container">
      {/* Logo principal */}
      <div className="login-logo">
        <img src={logo} alt="Visita Cocha Logo" />
      </div>

      <p className="welcome-message">Bienvenido a Visita Cocha — Admin</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <i className="fas fa-envelope input-icon"></i>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock input-icon"></i>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn-login" type="submit" disabled={loading}>
          {loading && <div className="spinner"></div>}
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="secondary-actions">
        <a href="#" className="forgot-password">Olvidaste tu contraseña?</a>
      </div>

      <p className="superadmin-text">Solo SuperAdmin puede ingresar</p>

      {/* Escudo Cochabamba pequeño centrado */}
      <div className="login-footer">
        <img src={logoCocha} alt="Escudo de Cochabamba" className="cocha-shield" />
      </div>
    </div>
  );
}
