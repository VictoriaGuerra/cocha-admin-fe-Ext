// src/pages/Users/UserForm.jsx
import React, { useState } from 'react'
import * as mockApi from '../../api/mockApi'
import { roles as ROLE_CONST } from '../../auth/roles'

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
		<div className="vc-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80 }}>
			<div className="form-card" style={{ width: '100%', maxWidth: 680 }}>
				<h4 style={{ marginBottom: 12, fontSize: 18 }}>{editing ? 'Editar' : 'Crear'} usuario</h4>
				<form onSubmit={handleSubmit}>
					{!editing && (
						<>
							<label style={{ display: 'block', marginBottom: 6 }}>Correo</label>
							<input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
						</>
					)}

					<label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Nombre</label>
					<input className="input" value={name} onChange={(e)=>setName(e.target.value)} required />

					<label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Roles</label>
					<div style={{ marginBottom: 12 }}>
						{(ROLE_CONST ? Object.values(ROLE_CONST) : ['Admin','Mantenedor','SuperAdmin']).map(r => (
							<label key={r} style={{ marginRight: 12 }}>
								<input checked={roles.includes(r)} onChange={()=>toggleRole(r)} type="checkbox" /> <span style={{ marginLeft: 6 }}>{r}</span>
							</label>
						))}
					</div>

					{error && <div style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>}

					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
						<button type="button" onClick={onClose} className="btn">Cancelar</button>
						<button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Guardando...' : 'Guardar'}</button>
					</div>
				</form>
			</div>
		</div>
	)
}