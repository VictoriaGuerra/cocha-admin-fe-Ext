import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../auth/AuthContext'
import '../../styles/profile.css'

export default function ConfigPage() {
  const { user, updateProfile } = useContext(AuthContext)
  const [form, setForm] = useState({
    name: '',
    email: '',
    photo: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        photo: user.photo || ''
      }))
    }
  }, [user])

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    
    // Validar tamaño máximo (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no debe superar los 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm(prev => ({ ...prev, photo: reader.result }))
      setError('')
    }
    reader.onerror = () => setError('Error al leer el archivo')
    reader.readAsDataURL(file)
  }

  const validatePassword = () => {
    if (!form.currentPassword) {
      setError('Ingresa tu contraseña actual')
      return false
    }
    if (form.newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres')
      return false
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }
    return true
  }

  const handleSave = async (ev) => {
    ev.preventDefault()
    setError('')
    setSuccess('')
    
    // Validar campos requeridos
    if (!form.name.trim() || !form.email.trim()) {
      setError('Nombre y correo son requeridos')
      return
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Ingresa un correo válido')
      return
    }

    setSaving(true)
    try {
      const updateData = {
        name: form.name.trim(),
        email: form.email.trim(),
        photo: form.photo
      }

      if (isChangingPassword) {
        if (!validatePassword()) {
          setSaving(false)
          return
        }
        updateData.currentPassword = form.currentPassword
        updateData.newPassword = form.newPassword
      }

      await updateProfile(user.id, updateData)
      setSuccess('¡Perfil actualizado correctamente!')
      setIsChangingPassword(false)
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch(e) {
      console.error(e)
      setError(e.message || 'Error al actualizar el perfil')
    }
    setSaving(false)
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <i className="fas fa-user-circle"></i>
        <h2 className="profile-title">Configuración de perfil</h2>
      </div>

      <div className="profile-card">
        <form onSubmit={handleSave} className="profile-form">
          <div className="profile-avatar">
            <div className="avatar-container">
              {form.photo ? (
                <img src={form.photo} alt="Avatar" />
              ) : (
                <div className="avatar-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
            <div className="file-input-container">
              <label className="file-input-button">
                <i className="fas fa-camera"></i>
                Cambiar foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="file-input"
                />
              </label>
            </div>
          </div>

          <div className="profile-form-fields">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="form-input"
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="form-input"
                placeholder="tu@correo.com"
              />
            </div>

            <div className="password-group">
              <h3 className="password-title">Cambiar contraseña</h3>
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={isChangingPassword}
                  onChange={e => setIsChangingPassword(e.target.checked)}
                /> Quiero cambiar mi contraseña
              </label>

              {isChangingPassword && (
                <>
                  <div className="form-group">
                    <label className="form-label">Contraseña actual</label>
                    <input
                      type="password"
                      value={form.currentPassword}
                      onChange={e => setForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nueva contraseña</label>
                    <input
                      type="password"
                      value={form.newPassword}
                      onChange={e => setForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </>
              )}
            </div>

            {error && <div className="error-message"><i className="fas fa-exclamation-circle"></i> {error}</div>}
            {success && <div className="success-message"><i className="fas fa-check-circle"></i> {success}</div>}

            <div className="form-actions">
              <button type="submit" className="save-button" disabled={saving}>
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
