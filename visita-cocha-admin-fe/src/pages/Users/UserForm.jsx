// src/pages/Users/UserForm.jsx
import React, { useState, useEffect } from 'react'
import * as mockApi from '../../api/mockApi'
import { roles as ROLE_CONST } from '../../auth/roles'

export default function UserForm({ editing, onClose }){
	const [email, setEmail] = useState(editing?.email || '')
	const [name, setName] = useState(editing?.name || '')
	const [roles, setRoles] = useState(editing?.roles || ['Mantenedor'])
	const [moduleAccess, setModuleAccess] = useState(editing?.moduleAccess || {})
	const [availableModules, setAvailableModules] = useState([])
	const [error, setError] = useState(null)
	const [saving, setSaving] = useState(false)

	useEffect(()=>{
		let mounted = true
		const load = async ()=>{
			try{
				const mods = await mockApi.getModules()
				if(!mounted) return
				setAvailableModules(mods)
			}catch(e){ console.error(e) }
		}
		load()
		return ()=> mounted = false
	},[])

	const toggleRole = (r) => setRoles(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r])

	const toggleModule = (modId) => {
		setModuleAccess(prev => {
			const has = !!prev[modId]
			if (has){
				const copy = { ...prev }
				delete copy[modId]
				return copy
			}
			return { ...prev, [modId]: { elements: [] } }
		})
	}

	const handleElementsChange = (modId, text) => {
		const elements = text.split(',').map(s=>s.trim()).filter(Boolean)
		setModuleAccess(prev => ({ ...prev, [modId]: { elements } }))
	}

	const handleSubmit = async (e)=>{
		e.preventDefault(); setError(null); setSaving(true)
		try{
			const payload = { name, roles, moduleAccess }
			if (editing) {
				await mockApi.updateUser(editing.id, payload)
			} else {
				await mockApi.createUser({ email, name, roles, moduleAccess })
			}
			onClose()
		}catch(err){ setError(err.message || 'Error'); }
		setSaving(false)
	}

	return (
		<div className="vc-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80 }}>
			<div className="form-card" style={{ width: '100%', maxWidth: 900 }}>
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

					<label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Acceso a módulos (solo SuperAdmin puede dar acceso granular)</label>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
						<div>
							{availableModules.map(m => (
								<div key={m.id} style={{ marginBottom: 8 }}>
									<label>
										<input type="checkbox" checked={!!moduleAccess[m.id]} onChange={()=>toggleModule(m.id)} /> <span style={{ marginLeft: 8 }}>{m.name}</span>
									</label>
								</div>
							))}
						</div>
						<div>
							<small style={{ display: 'block', marginBottom: 8, color: '#6b7280' }}>Si quieres dar acceso a elementos específicos dentro del módulo, escribe los IDs separados por comas (ej: id1, id2). De lo contrario deja vacío para acceso total al módulo.</small>
							{availableModules.map(m => (
								!!moduleAccess[m.id] && (
									<div key={`el-${m.id}`} style={{ marginBottom: 10 }}>
										<label style={{ display: 'block', fontWeight: 600 }}>{m.name} — Elementos permitidos</label>
										<input
											className="input"
											placeholder="id1, id2, ..."
											value={(moduleAccess[m.id]?.elements || []).join(', ')}
											onChange={(e)=>handleElementsChange(m.id, e.target.value)}
										/>
									</div>
								)
							))}
						</div>
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