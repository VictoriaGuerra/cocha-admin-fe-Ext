import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseList from '../UI/BaseList';
import { AuthContext } from '../../auth/AuthContext';
import { fetchTouristAttractions, deleteTouristAttraction } from '../../api/api';

const TouristAttractionsList = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const canEdit = ['superadmin', 'admin'].includes(user?.role);
  const canDelete = user?.role === 'superadmin';

  useEffect(() => {
    loadAttractions();
  }, []);

  const loadAttractions = async () => {
    try {
      const data = await fetchTouristAttractions();
      setAttractions(data);
    } catch (err) {
      setError('Error al cargar los atractivos turísticos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(id ? `/attractions/${id}/edit` : '/attractions/new');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este atractivo turístico?')) {
      try {
        await deleteTouristAttraction(id);
        await loadAttractions();
      } catch (err) {
        setError('Error al eliminar el atractivo turístico');
        console.error(err);
      }
    }
  };

  const handleView = (id) => {
    navigate(`/attractions/${id}`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'city', label: 'Ciudad' },
    { key: 'category', label: 'Categoría' },
    { key: 'status', 
      label: 'Estado',
      render: (value) => (
        <span className={`badge badge-${value ? 'success' : 'warning'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    { key: 'createdAt', 
      label: 'Fecha creación',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <BaseList
      title="Atractivos Turísticos"
      items={attractions}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
};

export default TouristAttractionsList;