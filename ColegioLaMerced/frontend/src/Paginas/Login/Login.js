import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [dni, setDni] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:8080/api/profesores/login', {
        dni,
        contrasena,
      });

      localStorage.setItem('profesorLogged', JSON.stringify(response.data));

      navigate('/inicioProfesor');
    } catch (err) {
      setError('DNI o contraseña incorrectos');
      console.error('Error en login:', err);
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
