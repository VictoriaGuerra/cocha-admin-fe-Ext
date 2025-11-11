// Adapter que selecciona entre backend real (axios) y mockApi localStorage
// Usa la variable VITE_USE_BACKEND = 'true' para activar llamadas reales.
// Mantiene las mismas firmas que mockApi para minimizar cambios en el resto del código.
import api from './api'
import * as mockApi from './mockApi'
import { BACKEND_ENDPOINTS } from '../config/backendEndpoints'

const useBackend = import.meta.env.VITE_USE_BACKEND === 'true'
export const USE_BACKEND = useBackend

// Helper para manejar errores y degradar a mock si hay fallo duro del backend (solo lectura básica)
async function safeBackend(fn, fallback){
  if (!useBackend) return fallback()
  try { return await fn() } catch (e){
    console.warn('[api adapter] Fallo backend:', e?.message || e)
    throw e
  }
}

// AUTH
export async function authLogin(email, password){
  return safeBackend(async ()=>{
    // Tu backend expone POST /login
    const { data } = await api.post('/login', { email, password })
    if (data?.token) localStorage.setItem('access_token', data.token)
    return { token: data?.token }
  }, () => mockApi.authLogin(email, password))
}

// Obtener usuario autenticado (si tu backend expone /auth/me)
export async function getMe(hintEmail){
  return safeBackend(async ()=>{
    const { data } = await api.get('/auth/me')
    return data
  }, async () => {
    const users = await mockApi.getUsers()
    if (hintEmail) return users.find(u=>u.email===hintEmail) || users[0] || null
    return users[0] || null
  })
}

// CONTENT (lectura) — usa solo backend cuando está activo
function contentPath(moduleId){
  return BACKEND_ENDPOINTS[moduleId] || null
}

export async function getContentList(moduleId){
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('USE_BACKEND=false, habilita VITE_USE_BACKEND para usar API real')
  if (!path) throw new Error(`No hay endpoint mapeado para módulo: ${moduleId}`)
  const { data } = await api.get(path)
  return Array.isArray(data) ? data : (data?.items || [])
}

export async function getContentById(moduleId, id){
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('USE_BACKEND=false, habilita VITE_USE_BACKEND para usar API real')
  if (!path) throw new Error(`No hay endpoint mapeado para módulo: ${moduleId}`)
  const { data } = await api.get(`${path}/${encodeURIComponent(id)}`)
  return data
}

export async function createContent(moduleId, payload){
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('Solo disponible en modo backend')
  if (!path) throw new Error(`No hay endpoint para crear en módulo ${moduleId}`)
  const { data } = await api.post(path, payload)
  return data
}

export async function updateContent(moduleId, id, payload){
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('Solo disponible en modo backend')
  if (!path) throw new Error(`No hay endpoint para actualizar en módulo ${moduleId}`)
  const { data } = await api.put(`${path}/${encodeURIComponent(id)}`, payload)
  return data
}

export async function deleteContent(moduleId, id){
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('Solo disponible en modo backend')
  if (!path) throw new Error(`No hay endpoint para eliminar en módulo ${moduleId}`)
  const { data } = await api.delete(`${path}/${encodeURIComponent(id)}`)
  return data || { ok: true }
}

// USERS
export async function getUsers(){
  return safeBackend(async ()=>{
    const { data } = await api.get('/users')
    return Array.isArray(data) ? data : []
  }, () => mockApi.getUsers())
}

export async function createUser(payload){
  return safeBackend(async ()=>{
    const { data } = await api.post('/users', payload)
    return data
  }, () => mockApi.createUser(payload))
}

export async function updateUser(id, patch){
  return safeBackend(async ()=>{
    const { data } = await api.put(`/users/${id}`, patch)
    return data
  }, () => mockApi.updateUser(id, patch))
}

export async function deleteUser(id){
  return safeBackend(async ()=>{
    const { data } = await api.delete(`/users/${id}`)
    return data || { ok: true }
  }, () => mockApi.deleteUser(id))
}

// PASSWORD RESET / FIRST LOGIN
export async function requestPasswordReset(email, options){
  return safeBackend(async ()=>{
    const { data } = await api.post('/auth/password/reset/request', { email, ...options })
    return data || { ok: true }
  }, () => mockApi.requestPasswordReset(email, options))
}

export async function verifyResetCode(email, code){
  return safeBackend(async ()=>{
    const { data } = await api.post('/auth/password/reset/verify', { email, code })
    return data || { ok: true }
  }, () => mockApi.verifyResetCode(email, code))
}

export async function resetPassword(email, code, newPassword){
  return safeBackend(async ()=>{
    const { data } = await api.post('/auth/password/reset/confirm', { email, code, newPassword })
    return data || { ok: true }
  }, () => mockApi.resetPassword(email, code, newPassword))
}

export async function completeInitialPasswordSetup(email, newPassword){
  return safeBackend(async ()=>{
    const { data } = await api.post('/auth/password/initial', { email, newPassword })
    return data
  }, () => mockApi.completeInitialPasswordSetup(email, newPassword))
}

// MODULES
export async function getModules(){
  return safeBackend(async ()=>{
    const { data } = await api.get('/modules')
    return Array.isArray(data) ? data : []
  }, () => mockApi.getModules())
}

export async function createModule(payload){
  return safeBackend(async ()=>{
    const { data } = await api.post('/modules', payload)
    return data
  }, () => mockApi.createModule(payload))
}

export async function updateModule(id, patch){
  return safeBackend(async ()=>{
    const { data } = await api.put(`/modules/${id}`, patch)
    return data
  }, () => mockApi.updateModule(id, patch))
}

export async function deleteModule(id){
  return safeBackend(async ()=>{
    const { data } = await api.delete(`/modules/${id}`)
    return data || { ok: true }
  }, () => mockApi.deleteModule(id))
}

// SIMULATED EMAILS (solo mock; si hay backend podrías buscar /dev/emails)
export function getSentEmails(){
  return mockApi.getSentEmails()
}
export function clearSentEmails(){
  return mockApi.clearSentEmails()
}

// Nota: si tu backend devuelve formas diferentes, ajusta este adaptador sin tocar el resto del código.
