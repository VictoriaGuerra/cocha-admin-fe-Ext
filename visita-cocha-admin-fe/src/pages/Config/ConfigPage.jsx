import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../auth/AuthContext'

export default function ConfigPage(){
  const { user, updateProfile } = useContext(AuthContext)
  const [form, setForm] = useState({ name: '', email: '', photo: '' })
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    if (user) setForm({ name: user.name || '', email: user.email || '', photo: user.photo || '' })
  },[user])

  const handleFile = (e)=>{
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ()=> setForm(f => ({ ...f, photo: reader.result }))
    reader.readAsDataURL(file)
  }

  const handleSave = async (ev)=>{
    ev.preventDefault()
    if (!user) return
    setSaving(true)
    try{
      await updateProfile(user.id, { name: form.name, email: form.email, photo: form.photo })
      alert('Perfil actualizado')
    }catch(e){ console.error(e); alert('Error al guardar') }
    setSaving(false)
  }

  return (
    <div>
      <h2>Configuración de perfil</h2>
      <div className="form-card" style={{ maxWidth: 760, marginTop: 12 }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <div>
              <div style={{ width: 96, height: 96, borderRadius: 12, overflow: 'hidden', background: '#f3f4f6' }}>
                {form.photo ? <img src={form.photo} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ padding: 18, color: '#9ca3af' }}>Foto</div>}
              </div>
              <input type="file" accept="image/*" onChange={handleFile} style={{ marginTop: 8 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Nombre</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} className="input" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border-color)' }} />

              <label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Correo</label>
              <input value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} className="input" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border-color)' }} />

              <div style={{ marginTop: 14 }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar perfil'}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
