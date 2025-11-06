// mockApi simula endpoints: /auth/login, /users (CRUD) y "envía" email (simulado)


const STORAGE_KEY = 'vc_users_v1'


// usuarios por defecto
const defaultUsers = [
{ id: 'u-1', email: 'super@visita.cocha', name: 'Super Admin', roles: ['SuperAdmin'], password: 'admin123' }
]

const MODULES_KEY = 'vc_modules_v1'

const defaultModules = [
	{ id: 'm-1', name: 'Atractivos Turísticos', status: 'Activo' },
	{ id: 'm-2', name: 'Restaurantes', status: 'Activo' },
	{ id: 'm-3', name: 'Hoteles', status: 'Activo' },
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

function readModules(){
	const raw = localStorage.getItem(MODULES_KEY)
	if (!raw){
		localStorage.setItem(MODULES_KEY, JSON.stringify(defaultModules))
		return defaultModules.slice()
	}
	return JSON.parse(raw)
}

function writeModules(mods){
	localStorage.setItem(MODULES_KEY, JSON.stringify(mods))
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

// Modules CRUD (localStorage)
export const getModules = async () => {
	const mods = readModules()
	return mods.slice()
}

export const createModule = async ({ name, status = 'Activo' }) => {
	const mods = readModules()
	if (mods.find(m => m.name === name)) throw { message: 'Módulo ya existe' }
	const newMod = { id: `m-${Date.now()}`, name, status, allowedRoles: ['Admin','Mantenedor'] }
	mods.push(newMod)
	writeModules(mods)
	// notify admin (simulado)
	try{ simulateSendEmail('super@visita.cocha', `Nuevo módulo creado: ${name}`) }catch(e){/* ignore */}
	return newMod
}

export const updateModule = async (id, patch) => {
	const mods = readModules()
	const idx = mods.findIndex(m => m.id === id)
	if (idx === -1) throw { message: 'Módulo no encontrado' }
	mods[idx] = { ...mods[idx], ...patch }
	writeModules(mods)
	return mods[idx]
}

export const deleteModule = async (id) => {
	let mods = readModules()
	mods = mods.filter(m => m.id !== id)
	writeModules(mods)
	return { ok: true }
}




// helper to persist simulated emails
function saveSimulatedEmail(to, body){
	const key = 'vc_sent_emails'
	const out = JSON.parse(localStorage.getItem(key) || '[]')
	out.push({ id: `e-${Date.now()}`, to, body, date: new Date().toISOString() })
	localStorage.setItem(key, JSON.stringify(out))
}

function simulateSendEmail(to, body) {
	console.info('Simulated email to', to, '', body)
	saveSimulatedEmail(to, body)
}