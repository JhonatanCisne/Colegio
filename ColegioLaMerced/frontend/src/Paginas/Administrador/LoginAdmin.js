import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "../Administrador/LoginAdmin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from '../../Imagenes/Escudo.png'; 

function LoginAdmin() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.get("http://localhost:8080/api/administradores");
      const administradores = response.data;

      const adminEncontrado = administradores.find(admin => 
        admin.usuario === usuario && admin.contrasena === contrasena
      );

      if (adminEncontrado) {
        navigate("/AdminAlumnos");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error al autenticar:", err);
      if (err.response) {
        setError("Error al conectar con el servidor. Intente de nuevo más tarde.");
      } else {
        setError("Hubo un problema de red. Verifique su conexión.");
      }
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
                    <h2>Acceso de Administrador</h2>
                    <p className="form-subtitle">Por favor, ingrese sus credenciales.</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="usuario">Usuario</label>
                            <input 
                                type="text" 
                                id="usuario" 
                                name="usuario" 
                                placeholder="Ingresa tu usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
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
                </div>

                <p className="copyright">
                    &copy;{new Date().getFullYear()} I.E.P. Nuestra Señora de la Merced. Todos los derechos reservados.
                </p>
            </div>
        </div>
    </div>
  );
}

export default LoginAdmin;