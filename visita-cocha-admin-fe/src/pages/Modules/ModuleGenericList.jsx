import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BaseList from '../../components/UI/BaseList';
import { localStoreApi } from '../../api/localStoreApi';

const ModuleGenericList = () => {
  const { moduleType } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!moduleType) {
        navigate('/modules');
        return;
      }

      try {
        const data = await localStoreApi.getAll(moduleType);
        setItems(data || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [moduleType, navigate]);

  const handleCreate = () => {
    navigate(`/modules/${moduleType}/new`);
  };

  const handleEdit = (item) => {
    navigate(`/modules/${moduleType}/edit/${item.id}`);
  };

  const handleView = (item) => {
    navigate(`/modules/${moduleType}/${item.id}`);
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Está seguro de eliminar este elemento?')) {
      try {
        await localStoreApi.delete(moduleType, item.id);
        const updatedData = await localStoreApi.getAll(moduleType);
        setItems(updatedData || []);
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error al eliminar el elemento');
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  const moduleTitle = {
    attractions: 'Atracciones Turísticas',
    restaurants: 'Restaurantes',
    hotels: 'Hoteles',
    events: 'Eventos'
  }[moduleType] || moduleType;

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>{moduleTitle}</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Agregar nuevo
        </button>
      </div>

      <BaseList
        title={moduleTitle}
        items={items}
        columns={[
          { key: 'name', label: 'Nombre' },
          { key: 'description', label: 'Descripción' },
          { key: 'status', label: 'Estado' }
        ]}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ModuleGenericList;