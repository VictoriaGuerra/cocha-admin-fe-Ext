// src/components/Dashboard/Dashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import UserTable from './UserTable';
import ModuleTable from './ModuleTable';
import { NavLink } from 'react-router-dom';
import * as mockApi from '../../api/mockApi';
import { localStoreApi } from '../../api/localStoreApi';
import { stats as mockStats } from '../../data/statsData';
import StatsCard from './StatsCard';
import StatsChart from './StatsChart';
import '../../styles/dashboard.css';
import logo from '../../assets/images/logo.png';
import logoCocha from '../../assets/images/logoCocha.png';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [statsSummary, setStatsSummary] = useState([
    { title: 'Usuarios', value: 0 },
    { title: 'Módulos', value: 0 },
    { title: 'Eventos', value: 0 },
  ])

  const [usersList, setUsersList] = useState([])
  const [collapsed, setCollapsed] = useState(false)
  const [modules, setModules] = useState([])

  useEffect(()=>{
    let mounted = true
    const load = async ()=>{
      try{
        const list = await mockApi.getModules()
        if (mounted) setModules(list)
      }catch(e){ console.error(e) }
    }
    load()
    return ()=> mounted = false
  },[])

  useEffect(()=>{
    let mounted = true
    const loadUsers = async ()=>{
      try{
        const us = await mockApi.getUsers()
        if (mounted) setUsersList(us)
      }catch(e){ console.error(e) }
    }
    loadUsers()
    return ()=> mounted = false
  },[])

  // load counts for stats and poll periodically (simulate realtime)
  useEffect(()=>{
    let mounted = true
    const loadCounts = async ()=>{
      try{
        const users = await mockApi.getUsers()
        const mods = await mockApi.getModules()

        // count items across a few modules using localStoreApi
        const attractionItems = (await localStoreApi.getAll('attractions')) || []
        const restaurantItems = (await localStoreApi.getAll('restaurants')) || []
        const eventsItems = (await localStoreApi.getAll('events')) || []

        if (!mounted) return
        setStatsSummary([
          { title: 'Usuarios', value: users.length },
          { title: 'Módulos', value: mods.length },
          { title: 'Eventos', value: eventsItems.length },
        ])
      }catch(e){ console.error(e) }
    }

    loadCounts()
    const id = setInterval(loadCounts, 10000) // refresh every 10s
    return ()=>{ mounted = false; clearInterval(id) }
  },[])

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <aside className={`sidebar-container${collapsed ? ' collapsed' : ''}`}>
          <div style={{ padding: '18px 22px' }}>
            <img src={logo} alt="Visita Cocha" style={{ width: 140, display: 'block', marginBottom: 14 }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <img src={user?.photo || logoCocha} alt="Usuario" style={{ width: 44, height:44, objectFit:'cover', borderRadius: 8 }} />
              <div>
                <div style={{ fontWeight: 700 }}>{user?.name || user?.email || 'Usuario'}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{(user?.roles||[]).join(', ')}</div>
              </div>
            </div>
          </div>

          <nav style={{ padding: '8px 12px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="nav-item"><NavLink to="/" className={({isActive})=> isActive? 'nav-item active' : 'nav-item'} style={{ color: 'inherit', textDecoration: 'none' }}><i className="fas fa-home"></i> <span>Dashboard</span></NavLink></li>
              <li className="nav-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <NavLink to="/modules" className={({isActive})=> isActive? 'nav-item active' : 'nav-item'} style={{ color: 'inherit', textDecoration: 'none', flex: 1 }}><i className="fas fa-th-large"></i> <span>Módulos</span></NavLink>
                </div>
                {/* submenu: list modules loaded from storage */}
                <ul style={{ listStyle: 'none', paddingLeft: 12, marginTop: 6 }}>
                  {modules.map(m => (
                    <li key={m.id} style={{ marginBottom: 6 }}>
                      <NavLink to={`/modules/${m.id}`} style={{ color: '#374151', textDecoration: 'none', fontSize: 13 }}>{m.name}</NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item"><NavLink to="/users" className={({isActive})=> isActive? 'nav-item active' : 'nav-item'} style={{ color: 'inherit', textDecoration: 'none' }}><i className="fas fa-users"></i> <span>Usuarios</span></NavLink></li>
              <li className="nav-item"><NavLink to="/modules/configuracion" className={({isActive})=> isActive? 'nav-item active' : 'nav-item'} style={{ color: 'inherit', textDecoration: 'none' }}><i className="fas fa-cog"></i> <span>Configuración</span></NavLink></li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <header className="header-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="btn" onClick={()=>setCollapsed(v=>!v)} aria-label="Toggle sidebar">☰</button>
              <input placeholder="Buscar" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)', minWidth: 220 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="btn" onClick={() => {}}>🔔</button>
              <button className="btn" onClick={() => {}} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={user?.photo || logoCocha} alt="avatar" className="avatar" />
                <span style={{ display: 'inline-block' }}>{user?.name || user?.email}</span>
              </button>
              <button onClick={logout} className="btn">Cerrar sesión</button>
            </div>
          </header>

          <div className="stats-panel" style={{ marginTop: 18 }}>
            <div className="stats-grid">
              {statsSummary.map((s, i) => (
                <StatsCard
                  key={i}
                  index={i}
                  title={s.title}
                  value={s.value}
                  icon={i === 0 ? <i className="fas fa-users" /> : i === 1 ? <i className="fas fa-th-large" /> : i === 2 ? <i className="fas fa-calendar-alt" /> : <i className="fas fa-file-alt" />}
                  variant={i === 0 ? 'purple' : i === 1 ? 'orange' : i === 2 ? 'red' : 'green'}
                  tooltip={`${s.title}: ${s.value}`}
                />
              ))}
            </div>
          </div>

          <h2 style={{ marginTop: 28 }}>Gráfico de Módulos</h2>
          <StatsChart data={statsSummary.map(s => ({ name: s.title, value: s.value }))} />

          <section style={{ marginTop: 22 }}>
            <h2>Usuarios</h2>
            <UserTable users={usersList} />
          </section>

          <section style={{ marginTop: 22 }}>
            <h2>Módulos</h2>
            <ModuleTable />
          </section>
        </main>
      </div>
    </div>
  );
}
