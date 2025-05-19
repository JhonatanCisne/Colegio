import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function Login() {
  return (
    <div className="login-contenedor d-flex vh-100">
      <div className="imagen-login d-none d-md-block col-md-6"></div>

      <div className="formulario-contenedor col-12 col-md-6 d-flex justify-content-center align-items-center">
        <form className="formulario-login w-75 p-4 rounded shadow">
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
          <input type="text" placeholder="Usuario" className="form-control mb-3" />
          <input type="password" placeholder="Contraseña" className="form-control mb-3" />
          <button type="submit" className="btn btn-escarlata w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
