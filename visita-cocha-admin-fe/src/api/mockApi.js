// mockApi simula endpoints: /auth/login, /users (CRUD) y "envía" email (simulado)


const STORAGE_KEY = 'vc_users_v1'


// usuarios por defecto
const defaultUsers = [
{ id: 'u-1', email: 'super@visita.cocha', name: 'Super Admin', roles: ['SuperAdmin'], password: 'admin123' }
]


function read() {
const raw = localStorage.getItem(STORAGE_KEY)
if (!raw) {
localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
return defaultUsers.slice()
}
return JSON.parse(raw)
}


function write(users) {
localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}


export const authLogin = async (email, password) => {
const users = read()
const u = users.find(x => x.email === email && x.password === password)
if (!u) throw { message: 'Credenciales inválidas' }
// simulamos JWT: payload con email y roles
const token = btoa(JSON.stringify({ email: u.email, roles: u.roles }))
return { token }
}


export const getUsers = async () => {
const users = read()
// omitimos password en respuesta
return users.map(({ password, ...rest }) => rest)
}


export const createUser = async ({ email, name, roles }) => {
const users = read()
if (users.find(u => u.email === email)) throw { message: 'Usuario ya existe' }
const password = Math.random().toString(36).slice(-8) // temp pass
const newUser = { id: `u-${Date.now()}`, email, name, roles, password }
users.push(newUser)
write(users)
// simulamos envío de email
simulateSendEmail(email, `Tu cuenta ha sido creada. Usuario: ${email} — Contraseña temporal: ${password}`)
return { id: newUser.id, email, name, roles }
}


export const updateUser = async (id, patch) => {
const users = read()
const idx = users.findIndex(u => u.id === id)
if (idx === -1) throw { message: 'Usuario no encontrado' }
users[idx] = { ...users[idx], ...patch }
write(users)
const { password, ...rest } = users[idx]
return rest
}


export const deleteUser = async (id) => {
let users = read()
users = users.filter(u => u.id !== id)
write(users)
return { ok: true }
}


function simulateSendEmail(to, body) {
// aquí simulamos: mostramos en consola y alerta — en producción, backend hace esto
console.info('Simulated email to', to, '', body)
// guardamos en localStorage para que el frontend pueda mostrar un registro (opcional)
const out = JSON.parse(localStorage.getItem('vc_sent_emails') || '[]')
}