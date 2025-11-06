import React, { useState } from 'react'
import * as mockApi from '../../api/mockApi'


export default function UserForm({ editing, onClose }){
const [email, setEmail] = useState(editing?.email || '')
const [name, setName] = useState(editing?.name || '')
const [roles, setRoles] = useState(editing?.roles || ['Mantenedor'])
const [error, setError] = useState(null)
const [saving, setSaving] = useState(false)


const toggleRole = (r) => setRoles(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r])


const handleSubmit = async (e)=>{
e.preventDefault(); setError(null); setSaving(true)
try{
if (editing) {
await mockApi.updateUser(editing.id, { name, roles })
} else {
await mockApi.createUser({ email, name, roles })
}
onClose()
}catch(err){ setError(err.message || 'Error'); }
setSaving(false)
}


return (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center">
<div className="bg-white p-6 rounded shadow w-full max-w-lg">
<h4 className="text-lg font-semibold mb-4">{editing ? 'Editar' : 'Crear'} usuario</h4>
<form onSubmit={handleSubmit}>
{!editing && (
<>
<label className="block mb-1">Correo</label>
<input className="w-full mb-3 p-2 border rounded" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
</>
)}


<label className="block mb-1">Nombre</label>
<input className="w-full mb-3 p-2 border rounded" value={name} onChange={(e)=>setName(e.target.value)} required />


<label className="block mb-1">Roles</label>
<div className="mb-3">
{['Admin','Mantenedor','SuperAdmin'].map(r => (
<label key={r} className="mr-3"><input checked={roles.includes(r)} onChange={()=>toggleRole(r)} type="checkbox" /> {r}</label>
))}
</div>


{error && <div className="text-red-600 mb-2">{error}</div>}


<div className="flex justify-end">
<button type="button" onClick={onClose} className="mr-2 px-3 py-1 border rounded">Cancelar</button>
<button type="submit" disabled={saving} className="px-3 py-1 bg-sky-600 text-white rounded">{saving ? 'Guardando...' : 'Guardar'}</button>
</div>
</form>
</div>
</div>
)
}