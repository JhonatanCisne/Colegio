import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [dni, setDni] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);

  const manejarSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validación simple sin conexión a base de datos
    if (dni.trim() === '123' && contrasena.trim() === '123') {
      localStorage.setItem('alumnoId', '1'); // ID simulado
      navigate('/inicioProfesor');
    } else {
      setError('DNI o contraseña incorrectos');
    }
  };

  return (
    <div className="login-contenedor d-flex vh-100">
      <div className="imagen-login d-none d-md-block col-md-6" />

      <div className="formulario-contenedor col-12 col-md-6 d-flex justify-content-center align-items-center">
        <form className="formulario-login w-75 p-4 rounded shadow" onSubmit={manejarSubmit}>
          <h2 className="text-center mb-4">Iniciar Sesión del Profesor</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <input
            type="text"
            placeholder="DNI"
            className="form-control mb-3"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="form-control mb-3"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-escarlata w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
