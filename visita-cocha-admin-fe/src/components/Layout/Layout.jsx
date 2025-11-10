import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import { AuthContext } from '../../auth/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="user-header">
          <div className="user-info">
            <span className="user-name">{user?.name || 'Usuario'}</span>
            <span className="user-role">{user?.role || 'Rol no definido'}</span>
          </div>
        </div>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;