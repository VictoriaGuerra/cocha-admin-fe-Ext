import React, { useEffect, useState } from 'react'
import * as mockApi from '../../api/mockApi'
import ModuleForm from './ModuleForm'

export default function ModulesList(){
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = async ()=>{
    setLoading(true)
    const data = await mockApi.getModules()
    setModules(data)
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  const handleCreate = ()=>{ setEditing(null); setShowForm(true) }
  const handleEdit = (m)=>{ setEditing(m); setShowForm(true) }

  const handleDelete = async (id)=>{
    if (!confirm('Eliminar módulo?')) return
    await mockApi.deleteModule(id)
    await load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 className="text-xl font-semibold">Módulos</h3>
        <div>
          <button onClick={handleCreate} className="px-3 py-1 bg-green-600 text-white rounded">Crear Módulo</button>
        </div>
      </div>

      {loading ? <div>Cargando...</div> : (
        <div className="form-card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                <th style={{ padding: 12 }}>Nombre</th>
                <th style={{ padding: 12 }}>Estado</th>
                <th style={{ padding: 12 }}>Roles permitidos</th>
                <th style={{ padding: 12 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {modules.map(m=> (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: 12 }}>{m.name}</td>
                  <td style={{ padding: 12 }}>{m.status}</td>
                  <td style={{ padding: 12 }}>{(m.allowedRoles||[]).join(', ')}</td>
                  <td style={{ padding: 12 }}>
                    <button onClick={()=>handleEdit(m)} className="btn" style={{ marginRight: 8 }}>Editar</button>
                    <button onClick={()=>handleDelete(m.id)} className="btn btn-primary" style={{ background: '#ef4444', border: 'none' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <ModuleForm editing={editing} onClose={async()=>{ setShowForm(false); await load() }} />}
    </div>
  )
}
