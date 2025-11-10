import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULE_TYPES } from '../../config/moduleTypes';
import ModuleCard from '../../components/UI/ModuleCard';
import '../../styles/modules.css';

const MODULE_DESCRIPTIONS = {
  attractions: 'Gestiona los atractivos turísticos de la ciudad',
  restaurants: 'Administra los restaurantes registrados',
  hotels: 'Gestiona los hoteles y alojamientos',
  events: 'Administra eventos y actividades',
  categories: 'Gestiona las categorías del sistema',
  points: 'Administra los puntos de interés',
};

export default function ModulesList() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const modulesList = Object.values(MODULE_TYPES).map(module => ({
      id: module.id,
      title: module.name,
      description: MODULE_DESCRIPTIONS[module.id] || 'Gestiona los elementos de este módulo',
      icon: `fa-solid ${module.icon || 'fa-cube'}`,
      route: `/modules/${module.id}`,
      itemCount: 0,
      lastUpdated: null
    }));
    setModules(modulesList);
  }, []);

  const handleModuleClick = (moduleId) => {
    navigate(`/modules/${moduleId}`);
  };

  return (
    <div className="modules-container">
      <h2>Módulos</h2>
      <div className="modules-grid">
        {modules.map(module => (
          <ModuleCard
            key={module.id}
            title={module.title}
            description={module.description}
            icon={module.icon}
            route={module.route}
            itemCount={module.itemCount}
            lastUpdated={module.lastUpdated}
            onClick={() => handleModuleClick(module.id)}
          />
        ))}
      </div>
      
    </div>
  );
}
