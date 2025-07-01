import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from '../../Imagenes/Escudo.png'; 

function Login() {
  const navigate = useNavigate();
  const [dni, setDni] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.get('http://localhost:8080/api/profesores');
      const allProfesores = response.data;

      const profesorEncontrado = allProfesores.find(prof =>
        prof.dni === dni && prof.contrasena === contrasena
      );

      if (profesorEncontrado) {
        const profesorParaLocalStorage = {
            idProfesor: profesorEncontrado.idProfesor,
            nombre: profesorEncontrado.nombre,
            apellido: profesorEncontrado.apellido,
            dni: profesorEncontrado.dni,
            estado: profesorEncontrado.estado
        };
        localStorage.setItem('profesorLogged', JSON.stringify(profesorParaLocalStorage));
        navigate('/inicioProfesor');
      } else {
        setError('DNI o contraseña incorrectos');
      }
    } catch (err) {
      console.error("Error de Conexión:", err);
      setError('Ocurrió un error al intentar cargar los datos. Asegúrate de que el servidor esté funcionando.');
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
                {/* NOTA: Se ha eliminado el encabezado móvil para una vista más limpia */}
                
                <div className="form-box">
                    <h2>Acceso para Docentes</h2>
                    <p className="form-subtitle">Por favor, ingrese sus credenciales.</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={manejarSubmit}>
                        <div className="form-group">
                            <label htmlFor="dni">Usuario Docente / DNI</label>
                            <input 
                                type="text" 
                                id="dni" 
                                name="dni" 
                                placeholder="Ingresa tu DNI"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
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

export default Login;
