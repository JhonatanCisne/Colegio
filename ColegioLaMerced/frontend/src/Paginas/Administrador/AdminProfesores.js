import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Administrador/AdminProfesores.css";

const cargos = ["Profesor Titular", "Profesor Auxiliar", "Profesor Invitado"];

const AdminProfesores = () => {
  const navigate = useNavigate();
  const [seccionSidebar, setSeccionSidebar] = useState("Profesores");
  const [seccionBotones, setSeccionBotones] = useState("Añadir");
  const [profesor, setProfesor] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    especialidad: "",
    contrasena: "",
  });
  const [dniBuscar, setDniBuscar] = useState("");
  const [profesorEncontrado, setProfesorEncontrado] = useState(null);
  const [errorBuscar, setErrorBuscar] = useState("");
  const [listaProfesores, setListaProfesores] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/profesores")
      .then((res) => setListaProfesores(res.data))
      .catch((err) => console.error("Error al obtener profesores:", err));
  }, []);

  const handleChange = (e) => {
    setProfesor({ ...profesor, [e.target.name]: e.target.value });
  };

  const handleAgregar = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8080/api/profesores", profesor)
      .then((res) => {
        alert("Profesor agregado!");
        setListaProfesores([...listaProfesores, res.data]);
        setProfesor({
          nombre: "",
          apellido: "",
          dni: "",
          especialidad: "",
          contrasena: "",
        });
      })
      .catch((err) => {
        alert("Error al agregar profesor.");
        console.error(err);
      });
  };

  const buscarProfesorPorDni = () => {
    axios.get(`http://localhost:8080/api/profesores/${dniBuscar}`)
      .then((res) => {
        setProfesorEncontrado(res.data);
        setProfesor(res.data);
        setErrorBuscar("");
      })
      .catch(() => {
        setProfesorEncontrado(null);
        setErrorBuscar("Profesor no encontrado");
      });
  };

  const handleModificar = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/api/profesores/${profesor.dni}`, profesor)
      .then(() => {
        alert("Profesor modificado!");
        setListaProfesores(
          listaProfesores.map((p) => (p.dni === profesor.dni ? profesor : p))
        );
        setProfesorEncontrado(null);
        setDniBuscar("");
        setProfesor({
          nombre: "",
          apellido: "",
          dni: "",
          especialidad: "",
          contrasena: "",
        });
      })
      .catch((err) => {
        alert("Error al modificar profesor.");
        console.error(err);
      });
  };

  const handleEliminar = (e) => {
    e.preventDefault();
    axios.delete(`http://localhost:8080/api/profesores/${dniBuscar}`)
      .then(() => {
        alert("Profesor eliminado!");
        setListaProfesores(listaProfesores.filter((p) => p.dni !== dniBuscar));
        setDniBuscar("");
        setErrorBuscar("");
      })
      .catch(() => {
        setErrorBuscar("Profesor no encontrado");
      });
  };

  return (
    <div className="contenedor-principal">
      <aside className="sidebar">
        <h2>Panel</h2>
        <ul>
          <li onClick={() => { setSeccionSidebar("Alumnos"); navigate("/AdminAlumnos"); }}>Alumnos</li>
          <li className={seccionSidebar === "Profesores" ? "activo" : ""} onClick={() => {
            setSeccionSidebar("Profesores");
            setSeccionBotones("Añadir");
            setProfesorEncontrado(null);
            setDniBuscar("");
            setErrorBuscar("");
          }}>Profesores</li>
          <li className="cerrar-sesion" onClick={() => { localStorage.clear(); navigate("/login"); }}>Cerrar sesión</li>
        </ul>
      </aside>

      <div className="contenido-principal">
        <div className="barra-botones">
          {["Añadir", "Modificar", "Eliminar", "Ver"].map((opcion) => (
            <button
              key={opcion}
              className={seccionBotones === opcion ? "btn-activo" : ""}
              onClick={() => {
                setSeccionBotones(opcion);
                setProfesorEncontrado(null);
                setDniBuscar("");
                setErrorBuscar("");
                setProfesor({
                  nombre: "",
                  apellido: "",
                  dni: "",
                  especialidad: "",
                  contrasena: "",
                });
              }}
            >
              {opcion}
            </button>
          ))}
        </div>

        <main className="contenido-profesor">
          {seccionBotones === "Añadir" && (
            <>
              <h2>Registrar Nuevo Profesor</h2>
              <form onSubmit={handleAgregar}>
                <div className="grupo">
                  <label>Nombre</label>
                  <input type="text" name="nombre" value={profesor.nombre} onChange={handleChange} required />
                </div>
                <div className="grupo">
                  <label>Apellido</label>
                  <input type="text" name="apellido" value={profesor.apellido} onChange={handleChange} required />
                </div>
                <div className="grupo">
                  <label>DNI</label>
                  <input type="text" name="dni" value={profesor.dni} onChange={handleChange} required />
                </div>
                <div className="grupo">
                  <label>Especialidad</label>
                  <input type="text" name="especialidad" value={profesor.especialidad} onChange={handleChange} required />
                </div>
                <div className="grupo">
                  <label>Contraseña</label>
                  <input type="password" name="contrasena" value={profesor.contrasena} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-registrar">Registrar Profesor</button>
              </form>
            </>
          )}

          {seccionBotones === "Modificar" && (
            <>
              <h2>Modificar Profesor</h2>
              <div className="grupo buscar-dni">
                <label>Buscar por DNI</label>
                <input
                  type="text"
                  value={dniBuscar}
                  onChange={(e) => setDniBuscar(e.target.value)}
                  placeholder="Ingrese DNI"
                />
                <button className="btn-buscar" onClick={buscarProfesorPorDni} disabled={!dniBuscar}>
                  Buscar
                </button>
                {errorBuscar && <p className="error">{errorBuscar}</p>}
              </div>

              {profesorEncontrado && (
                <form onSubmit={handleModificar}>
                  <div className="grupo">
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={profesor.nombre} onChange={handleChange} required />
                  </div>
                  <div className="grupo">
                    <label>Apellido</label>
                    <input type="text" name="apellido" value={profesor.apellido} onChange={handleChange} required />
                  </div>
                  <div className="grupo">
                    <label>DNI (no editable)</label>
                    <input type="text" name="dni" value={profesor.dni} readOnly />
                  </div>
                  <div className="grupo">
                    <label>Especialidad</label>
                    <input type="text" name="especialidad" value={profesor.especialidad} onChange={handleChange} required />
                  </div>
                  <div className="grupo">
                    <label>Contraseña</label>
                    <input type="password" name="contrasena" value={profesor.contrasena} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn-registrar">Guardar Cambios</button>
                </form>
              )}
            </>
          )}

          {seccionBotones === "Eliminar" && (
            <>
              <h2>Eliminar Profesor</h2>
              <form onSubmit={handleEliminar}>
                <div className="grupo">
                  <label>Ingrese DNI para eliminar</label>
                  <input
                    type="text"
                    value={dniBuscar}
                    onChange={(e) => setDniBuscar(e.target.value)}
                    placeholder="DNI"
                    required
                  />
                </div>
                {errorBuscar && <p className="error">{errorBuscar}</p>}
                <button type="submit" className="btn-eliminar">Eliminar Profesor</button>
              </form>
            </>
          )}

          {seccionBotones === "Ver" && (
            <>
              <h2>Lista de Profesores</h2>
              <table className="tabla-profesores">
                <thead>
                  <tr>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Especialidad</th>
                  </tr>
                </thead>
                <tbody>
                  {listaProfesores.length > 0 ? (
                    listaProfesores.map((p) => (
                      <tr key={p.dni}>
                        <td>{p.dni}</td>
                        <td>{p.nombre}</td>
                        <td>{p.apellido}</td>
                        <td>{p.especialidad}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4">No hay profesores para mostrar.</td></tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProfesores;
