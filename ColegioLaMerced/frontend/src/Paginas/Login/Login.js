import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const manejarSubmit = (e) => {
    e.preventDefault(); // Evita que se recargue la página
    // Aquí podrías agregar validación más adelante
    navigate('/inicio'); // Redirige a la página Inicio
  };

  return (
    <div className="login-contenedor d-flex vh-100">
      <div className="imagen-login d-none d-md-block col-md-6"></div>

      <div className="formulario-contenedor col-12 col-md-6 d-flex justify-content-center align-items-center">
        <form
          className="formulario-login w-75 p-4 rounded shadow"
          onSubmit={manejarSubmit}
        >
          <h2 className="text-center mb-4">asas</h2>
          <input type="text" placeholder="Usuario" className="form-control mb-3" />
          <input type="password" placeholder="Contraseña" className="form-control mb-3" />
          <button type="submit" className="btn btn-escarlata w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
