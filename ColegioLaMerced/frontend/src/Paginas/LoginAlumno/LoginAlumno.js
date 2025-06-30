import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginAlumno.css';

function LoginAlumno() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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
    }
  };

  return (
    <div className="login-contenedor d-flex vh-100">
      <div className="imagen-login d-none d-md-block col-md-6" />

      <div className="formulario-contenedor col-12 col-md-6 d-flex justify-content-center align-items-center">
        <form className="formulario-login w-75 p-4 rounded shadow" onSubmit={manejarSubmit}>
          <div className="text-center mb-4">
            <h2 className="mt-2">Iniciar Sesión del Alumno</h2>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <input
            type="email"
            placeholder="Correo electrónico"
            className="form-control mb-3"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
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

export default LoginAlumno;