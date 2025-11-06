import React, { useEffect, useState } from 'react'
import * as mockApi from '../../api/mockApi'
import UserForm from './UserForm'


export default function UsersList(){
const [users, setUsers] = useState([])
const [loading, setLoading] = useState(true)
const [editing, setEditing] = useState(null)
const [showForm, setShowForm] = useState(false)


const load = async ()=>{
setLoading(true)
const data = await mockApi.getUsers()
setUsers(data)
setLoading(false)
}


useEffect(()=>{ load() }, [])


const handleCreate = ()=>{ setEditing(null); setShowForm(true) }
const handleEdit = (u)=>{ setEditing(u); setShowForm(true) }


const handleDelete = async (id)=>{
if (!confirm('Eliminar usuario?')) return
await mockApi.deleteUser(id)
await load()
}


return (
<div>
<div className="flex justify-between items-center mb-4">
<h3 className="text-xl font-semibold">Usuarios</h3>
<div>
<button onClick={handleCreate} className="px-3 py-1 bg-green-600 text-white rounded">Crear usuario</button>
</div>
</div>


{loading ? <div>Cargando...</div> : (
<div className="bg-white shadow rounded p-4">
<table className="w-full table-auto">
<thead>
<tr className="text-left"><th>Correo</th><th>Nombre</th><th>Roles</th><th>Acciones</th></tr>
</thead>
<tbody>
{users.map(u=> (
<tr key={u.id} className="border-t">
<td className="py-2">{u.email}</td>
<td>{u.name}</td>
<td>{(u.roles||[]).join(', ')}</td>
<td>
<button onClick={()=>handleEdit(u)} className="mr-2 px-2 py-1 bg-amber-500 rounded text-white">Editar</button>
<button onClick={()=>handleDelete(u.id)} className="px-2 py-1 bg-red-500 rounded text-white">Eliminar</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
)}


{showForm && <UserForm onClose={async()=>{ setShowForm(false); await load() }} editing={editing} />}
</div>
)
}