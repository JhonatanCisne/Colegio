// src/Login.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';  // Aquí puedes poner estilos personalizados

function Login() {
  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <form className="login-form p-4 shadow rounded bg-light">
        <h2 className="mb-4 text-center">Iniciar sesión</h2>
        
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input type="email" className="form-control" id="email" placeholder="usuario@ejemplo.com" />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input type="password" className="form-control" id="password" placeholder="Contraseña" />
        </div>

        <button type="submit" className="btn btn-primary w-100">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
