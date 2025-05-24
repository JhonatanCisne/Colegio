import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Administrador/LoginAdmin.css";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginAdmin = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuarioValido = "admin";
    const contrasenaValida = "admin123";

    if (usuario === usuarioValido && contrasena === contrasenaValida) {
        navigate("/AdminAlumnos");
    } else {
        setError("Usuario o contraseña incorrectos");
    }
    };


  return (
    <div className="login-admin-container">
      <div className="login-card card shadow p-4">
        <h2 className="text-center mb-4">Ingreso Administrador</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Usuario</label>
            <input
              type="text"
              className="form-control"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
