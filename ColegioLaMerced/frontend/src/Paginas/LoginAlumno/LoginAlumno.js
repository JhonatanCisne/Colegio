import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginAlumno.css'; // Asegúrate de que este archivo CSS se importe

// --- Importa tu imagen del escudo ---
// Asegúrate de que la ruta sea correcta según la estructura de tu proyecto.
import logo from '../../Imagenes/Escudo.png'; 

function LoginAlumno() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/alumnos');
      if (!response.ok) {
        throw new Error('Error al obtener los datos de los alumnos');
      }
      const alumnos = await response.json();

      const alumnoEncontrado = alumnos.find(
        (alumno) => alumno.correo === correo && alumno.contrasena === contrasena
      );

      if (alumnoEncontrado) {
        localStorage.setItem('alumnoId', alumnoEncontrado.idAlumno);
        navigate('/inicio');
      } else {
        setError('Correo o contraseña incorrectos');
      }
    } catch (err) {
      setError('Hubo un problema al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
      console.error('Error de autenticación:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
        {/* Lado izquierdo: Branding y Logo (se oculta en móvil) */}
        <div className="branding-side">
            <div className="logo-container">
                <img src={logo} alt="Escudo del Colegio" className="logo-monochrome" />
            </div>
            <h1>I.E.P. Nuestra Señora de</h1>
            <h2>LA MERCED</h2>
            <p className="footer-text">"La Merced un colegio que inspira, motiva y prepara a los líderes del mañana"</p>
        </div>

        {/* Lado derecho: Formulario de Login */}
        <div className="form-side">
            <div className="form-wrapper">
                
                <div className="form-box">
                    <h2>Acceso para Alumnos</h2>
                    <p className="form-subtitle">Por favor, ingrese sus credenciales.</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={manejarSubmit}>
                        <div className="form-group">
                            <label htmlFor="correo">Correo Electrónico</label>
                            <input 
                                type="email" 
                                id="correo" 
                                name="correo" 
                                placeholder="tucorreo@ejemplo.com"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="••••••••"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-button" disabled={isLoading}>
                            {isLoading ? 'Verificando...' : 'Ingresar'}
                        </button>
                    </form>

                    <div className="forgot-password">
                        <a href="#">¿Olvidaste tu contraseña?</a>
                    </div>
                </div>

                <p className="copyright">
                    &copy;{new Date().getFullYear()} I.E.P. Nuestra Señora de la Merced. Todos los derechos reservados.
                </p>
            </div>
        </div>
    </div>
  );
}

export default LoginAlumno;