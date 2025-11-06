// src/App.jsx
import React, { useContext } from 'react';
import { AuthContext } from './auth/AuthContext';
import Login from './components/Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import UsersList from './pages/Users/UsersList';
import ModulesList from './pages/Modules/ModulesList';
import ModulePage from './pages/Modules/ModulePage';
import ConfigPage from './pages/Config/ConfigPage';
import Sidebar from './components/Layout/Sidebar';
import ModuleGenericList from './pages/Modules/ModuleGenericList';
import ModuleGenericForm from './pages/Modules/ModuleGenericForm';

export default function App() {
  const { user } = useContext(AuthContext);

  if (!user) return <Login />;

  return (
    <BrowserRouter>
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/modules" element={<ModulesList />} />
            <Route path="/modules/configuracion" element={<ConfigPage />} />
            <Route path="/modules/:moduleId" element={<ModuleGenericList />} />
            <Route path="/modules/:moduleId/new" element={<ModuleGenericForm />} />
            <Route path="/modules/:moduleId/:id" element={<ModuleGenericForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
