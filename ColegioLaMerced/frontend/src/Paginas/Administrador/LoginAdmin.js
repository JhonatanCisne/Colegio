import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Importar axios para las peticiones HTTP
import "../Administrador/LoginAdmin.css";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginAdmin = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Nuevo estado para indicar carga
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos
    setLoading(true); // Indicar que la petición está en curso

    try {
      // Realizar la petición GET para obtener todos los administradores
      const response = await axios.get("http://localhost:8080/api/administradores");
      const administradores = response.data; // Asumiendo que la API devuelve un array de objetos

      // Buscar si el usuario y contraseña coinciden con algún administrador
      const adminEncontrado = administradores.find(admin => 
        admin.usuario === usuario && admin.contrasena === contrasena
      );

      if (adminEncontrado) {
        // Si se encuentra el administrador, puedes guardar su información en localStorage si es necesario
        // Por ejemplo: localStorage.setItem('adminLogged', JSON.stringify(adminEncontrado));
        console.log("Administrador autenticado con éxito:", adminEncontrado);
        navigate("/AdminAlumnos");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error al autenticar:", err);
      // Puedes dar un mensaje más específico si err.response existe (errores del servidor)
      if (err.response) {
        setError("Error al conectar con el servidor. Intente de nuevo más tarde.");
      } else {
        setError("Hubo un problema de red. Verifique su conexión.");
      }
    } finally {
      setLoading(false); // Finalizar la carga, independientemente del resultado
    }
  };

  return (
    <div className="login-admin-container">
      <div className="login-card card shadow p-4">
        <h2 className="text-center mb-4">Ingreso Administrador</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="usuarioInput">Usuario</label>
            <input
              type="text"
              id="usuarioInput"
              className="form-control"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              disabled={loading} // Deshabilitar input durante la carga
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="contrasenaInput">Contraseña</label>
            <input
              type="password"
              id="contrasenaInput"
              className="form-control"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              disabled={loading} // Deshabilitar input durante la carga
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;