import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './EstilosBarraLateral.css';
import logo from '../Imagenes/Escudo.png';

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const CoursesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const AttendanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const AnnounceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

function BarraDeNavegacionLateralProfesor({ nombre }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo La Merced" className="sidebar-logo" />
          <h2 className="sidebar-title">La Merced</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/inicioProfesor" className="nav-link">
            <HomeIcon />
            <span>Inicio</span>
          </NavLink>
          <NavLink to="/cursosProfesor" className="nav-link">
            <CoursesIcon />
            <span>Cursos</span>
          </NavLink>
          <NavLink to="/asistenciaProfesor" className="nav-link">
            <AttendanceIcon />
            <span>Asistencia</span>
          </NavLink>
          <NavLink to="/anunciosProfesor" className="nav-link">
            <AnnounceIcon />
            <span>Anuncios</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{nombre ? nombre.charAt(0) : 'P'}</div>
            <span className="user-name">{nombre || 'Profesor'}</span>
          </div>
          <Link to="/" className="logout-button">
            <LogoutIcon />
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </aside>

      <header className="mobile-header">
        <div className="mobile-header-logo">
            <img src={logo} alt="Logo La Merced" />
            <span>La Merced</span>
        </div>
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <MenuIcon />
        </button>
      </header>
      {isMobileMenuOpen && (
        <nav className="mobile-nav">
          <NavLink to="/inicioProfesor" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Inicio</NavLink>
          <NavLink to="/cursosProfesor" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Cursos</NavLink>
          <NavLink to="/asistenciaProfesor" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Asistencia</NavLink>
          <NavLink to="/anunciosProfesor" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Anuncios</NavLink>
          <Link to="/" className="nav-link logout" onClick={() => setIsMobileMenuOpen(false)}>Cerrar Sesión</Link>
        </nav>
      )}
    </>
  );
}

export default BarraDeNavegacionLateralProfesor;
