import React from "react";
import { useNavigate } from "react-router-dom";
import "./LaMerced.css";
import logo from "../../Imagenes/Escudo.jpg"; // Ajusta la ruta según donde esté tu logo

function LaMerced() {
  const navigate = useNavigate();

  return (
    <div className="lamerced-container">
      <header className="header">
        <div className="header-content">
          <img src={logo} alt="Logo La Merced" className="logo" />
          <h1>Institución Educativa La Merced</h1>
          <p>Villa El Salvador - Lima, Perú</p>
        </div>
      </header>

      <main>
        <section id="about" className="about-section">
          <h2>Bienvenidos a La Merced</h2>
          <p>
            Somos una institución educativa comprometida con la excelencia académica,
            la formación en valores y el desarrollo integral de nuestros estudiantes.
            Ubicados en Villa El Salvador, fomentamos un ambiente seguro, innovador y
            motivador para que cada alumno pueda alcanzar su máximo potencial.
          </p>
        </section>

        <section id="valores" className="values-section">
          <h3>Nuestros Valores</h3>
          <div className="values-cards">
            <div className="card">
              <h4>Excelencia Académica</h4>
              <p>Promovemos un aprendizaje riguroso y significativo.</p>
            </div>
            <div className="card">
              <h4>Respeto y Valores</h4>
              <p>Fomentamos la honestidad, solidaridad y responsabilidad.</p>
            </div>
            <div className="card">
              <h4>Innovación</h4>
              <p>Incorporamos tecnología y metodologías modernas.</p>
            </div>
          </div>
        </section>

        <section id="login" className="login-section">
          <h2>Acceso al Sistema</h2>
          <p>Seleccione su tipo de usuario para ingresar:</p>
          <div className="buttons-container">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate("/LoginAlumno")}
            >
              Ingresar como Alumno
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate("/Login")}
            >
              Ingresar como Profesor
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section contacto">
            <h4>Contacto</h4>
            <p>Dirección: Av. Villa El Salvador 123, Lima, Perú</p>
            <p>Teléfono: +51 123 456 789</p>
            <p>Email: contacto@lamerced.edu.pe</p>
          </div>
          <div className="footer-section enlaces">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><a href="#about">Nosotros</a></li>
              <li><a href="#valores">Valores</a></li>
              <li><a href="#login">Ingresar</a></li>
            </ul>
          </div>
          <div className="footer-section redes">
            <h4>Síguenos</h4>
            <p>
              {/* Aquí podrías agregar iconos de redes sociales */}
              Facebook | Twitter | Instagram
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Institución Educativa La Merced - Villa El Salvador, Perú
        </div>
      </footer>
    </div>
  );
}

export default LaMerced;