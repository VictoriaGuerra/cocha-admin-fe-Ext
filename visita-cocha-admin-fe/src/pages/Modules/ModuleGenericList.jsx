import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BaseList from '../../components/UI/BaseList';
import { localStoreApi } from '../../api/localStoreApi';
import { MODULE_TYPES } from '../../config/moduleTypes';

export default function ModuleGenericList(){
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const moduleType = Object.values(MODULE_TYPES).find(m => m.id === moduleId) || { id: moduleId, name: moduleId };

  useEffect(()=>{
    let mounted = true
    const load = async ()=>{
      setLoading(true)
      const data = await localStoreApi.getAll(moduleId)
      if(!mounted) return
      setItems(data)
      setLoading(false)
    }
    load()
    return ()=> mounted = false
  },[moduleId])

  const handleEdit = (id)=>{
    navigate(`/modules/${moduleId}/${id}`)
  }
  const handleCreate = ()=>{
    navigate(`/modules/${moduleId}/new`)
  }
  const handleDelete = async (id)=>{
    if(!confirm('¿Eliminar este elemento?')) return
    await localStoreApi.delete(moduleId, id)
    const data = await localStoreApi.getAll(moduleId)
    setItems(data)
  }
  const handleView = (id)=>{ navigate(`/modules/${moduleId}/${id}`) }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'status', label: 'Estado' },
    { key: 'createdAt', label: 'Creado', render: (v)=> v ? new Date(v).toLocaleString() : '' }
  ]

  if(loading) return <div>Cargando {moduleType.name}...</div>

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h2 style={{margin:0}}>{moduleType.name}</h2>
        <div>
          <button className="btn btn-primary" onClick={handleCreate}>+ Agregar nuevo</button>
        </div>
      </div>

      <BaseList
        title={moduleType.name}
        items={items}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        canEdit={true}
        canDelete={true}
      />
    </div>
  )
}
