import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import '../../styles/common.css';
import '../../styles/dashboard.css';

export default function Sidebar(){
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <aside className="sidebar-container">
      <div className="sidebar-top" style={{padding:20}}>
        <div className="logo" style={{display:'flex',alignItems:'center',gap:12}}>
          <img src="/logo192.png" alt="logo" style={{width:56}} />
          <div>
            <div style={{fontWeight:700,color:'#333'}}>Visita Cocha</div>
            <div style={{fontSize:12,color:'#777'}}>{user?.name || user?.email}</div>
          </div>
        </div>
      </div>

      <nav className="nav-list" style={{padding:'0 12px 12px 12px'}}>
        <NavLink to="/" className={({isActive})=> isActive? 'nav-item active':'nav-item'}> <i className="fas fa-tachometer-alt"></i> <span>Dashboard</span></NavLink>
        <NavLink to="/modules" className={({isActive})=> isActive? 'nav-item active':'nav-item'}> <i className="fas fa-th-large"></i> <span>Módulos</span></NavLink>
        <NavLink to="/modules/attractions" className={({isActive})=> isActive? 'nav-item active':'nav-item'}> <i className="fas fa-landmark"></i> <span>Atractivos</span></NavLink>
        <NavLink to="/modules/restaurants" className={({isActive})=> isActive? 'nav-item active':'nav-item'}> <i className="fas fa-utensils"></i> <span>Restaurantes</span></NavLink>
        <NavLink to="/modules/events" className={({isActive})=> isActive? 'nav-item active':'nav-item'}> <i className="fas fa-calendar-alt"></i> <span>Eventos</span></NavLink>
        <NavLink to="/modules/hotels" className={({isActive})=> isActive? 'nav-item active':'nav-item'}> <i className="fas fa-hotel"></i> <span>Hoteles</span></NavLink>
        <NavLink to="/modules/categories" className={({isActive})=> isActive? 'nav-item active':'nav-item'}> <i className="fas fa-tags"></i> <span>Categorías</span></NavLink>
        <NavLink to="/modules/announcements" className={({isActive})=> isActive? 'nav-item active':'nav-item'}> <i className="fas fa-bullhorn"></i> <span>Anuncios</span></NavLink>
        <NavLink to="/modules/points" className={({isActive})=> isActive? 'nav-item active':'nav-item'}> <i className="fas fa-map-marker-alt"></i> <span>Puntos</span></NavLink>
        <NavLink to="/users" className={({isActive})=> isActive? 'nav-item active':'nav-item'}> <i className="fas fa-users"></i> <span>Usuarios</span></NavLink>
        <NavLink to="/modules/configuracion" className={({isActive})=> isActive? 'nav-item active':'nav-item'}> <i className="fas fa-cog"></i> <span>Configuración</span></NavLink>
      </nav>

      <div style={{marginTop:'auto',padding:16}}>
        <button className="btn btn-ghost" onClick={handleLogout} style={{width:'100%'}}> <i className="fas fa-sign-out-alt"></i> Cerrar sesión</button>
      </div>
    </aside>
  )
}
