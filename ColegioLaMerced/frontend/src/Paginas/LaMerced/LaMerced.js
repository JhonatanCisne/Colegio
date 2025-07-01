import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LaMerced.css';
import logo from '../../Imagenes/Escudo.png';

// --- Iconos SVG para las tarjetas de valores ---
const AcademicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c0 5 4 5 4 5h4s4 0 4-5v-5"></path>
        <path d="M12 10v4"></path>
    </svg>
);

const ValuesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
);

const InnovationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 019 9h-2a7 7 0 00-7-7V3z"></path>
        <path d="M12 21a9 9 0 01-9-9H1a11 11 0 0011 11v-2z"></path>
        <path d="M3 12a9 9 0 019-9v2a7 7 0 00-7 7H3z"></path>
        <circle cx="12" cy="12" r="2"></circle>
    </svg>
);


function LaMerced() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src={logo} alt="Logo La Merced" className="landing-logo" />
        <h1 className="landing-title">I.E.P. Nuestra Señora de La Merced</h1>
        <p className="landing-subtitle">Villa El Salvador - Lima, Perú</p>
      </header>

      <main className="landing-main">
        <section id="about" className="landing-section">
          <h2 className="section-title">Bienvenidos a La Merced</h2>
          <p className="section-text">
            Somos una institución educativa comprometida con la excelencia académica,
            la formación en valores y el desarrollo integral de nuestros estudiantes.
            Ubicados en Villa El Salvador, fomentamos un ambiente seguro, innovador y
            motivador para que cada alumno pueda alcanzar su máximo potencial.
          </p>
        </section>

        <section id="valores" className="landing-section">
          <h2 className="section-title">Nuestros Pilares</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><AcademicIcon /></div>
              <h3 className="card-title">Excelencia Académica</h3>
              <p className="card-text">Promovemos un aprendizaje riguroso y significativo.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><ValuesIcon /></div>
              <h3 className="card-title">Respeto y Valores</h3>
              <p className="card-text">Fomentamos la honestidad, solidaridad y responsabilidad.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><InnovationIcon /></div>
              <h3 className="card-title">Innovación Educativa</h3>
              <p className="card-text">Incorporamos tecnología y metodologías modernas.</p>
            </div>
          </div>
        </section>

        <section id="login" className="landing-section login-section">
          <h2 className="section-title">Acceso al Portal Educativo</h2>
          <p className="section-text">Seleccione su tipo de usuario para ingresar:</p>
          <div className="login-buttons-container">
            <button className="login-btn" onClick={() => navigate("/LoginAlumno")}>
              Soy Alumno
            </button>
            <button className="login-btn" onClick={() => navigate("/Login")}>
              Soy Docente
            </button>
            <button className="login-btn" onClick={() => navigate("/LoginAdmin")}>
              Soy Administrador
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">Contacto</h4>
            <p>Av. Villa El Salvador 123, Lima, Perú</p>
            <p>Teléfono: +51 123 456 789</p>
            <p>Email: contacto@lamerced.edu.pe</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Enlaces Rápidos</h4>
            <ul>
              <li><a href="#about">Nosotros</a></li>
              <li><a href="#valores">Valores</a></li>
              <li><a href="#login">Ingresar al Portal</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Síguenos</h4>
            <div className="social-links">
              <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Institución Educativa La Merced. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default LaMerced;
