import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Administrador/AdminAlumnos.css";

const grados = [
  "Primero de primaria",
  "Segundo de primaria",
  "Tercero de primaria",
  "Cuarto de primaria",
  "Quinto de primaria",
  "Sexto de primaria",
];
const secciones = ["A", "B", "C"];

const API_BASE = "http://localhost:8080/api/alumnos"; 

const AdminAlumnos = () => {
  const navigate = useNavigate();

  const [seccionSidebar, setSeccionSidebar] = useState("Alumnos");
  const [seccionBotones, setSeccionBotones] = useState("Añadir");
  const [alumno, setAlumno] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    grado: "",
    seccion: "",
  });
  const [dniBuscar, setDniBuscar] = useState("");
  const [alumnoEncontrado, setAlumnoEncontrado] = useState(null);
  const [errorBuscar, setErrorBuscar] = useState("");
  const [listaAlumnos, setListaAlumnos] = useState([]);
  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroSeccion, setFiltroSeccion] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (seccionBotones === "Ver") {
      cargarAlumnos();
    }
  }, [seccionBotones]);

  const cargarAlumnos = async () => {
    setCargando(true);
    try {
      const resp = await fetch(API_BASE);
      if (!resp.ok) throw new Error("Error al cargar alumnos");
      const data = await resp.json();
      setListaAlumnos(data);
    } catch (error) {
      alert("Error al cargar alumnos: " + error.message);
    }
    setCargando(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumno((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumno),
      });
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Error al agregar alumno");
      }
      alert("Alumno agregado!");
      limpiarFormulario();
      if (seccionBotones === "Ver") cargarAlumnos();
    } catch (error) {
      alert(error.message);
    }
  };

  const limpiarFormulario = () => {
    setAlumno({
      nombre: "",
      apellido: "",
      dni: "",
      fechaNacimiento: "",
      grado: "",
      seccion: "",
    });
    setAlumnoEncontrado(null);
    setDniBuscar("");
    setErrorBuscar("");
  };

  const buscarAlumnoPorDni = async () => {
    if (!dniBuscar.trim()) {
      setErrorBuscar("Ingrese un DNI válido");
      return;
    }
    setErrorBuscar("");
    try {
      const resp = await fetch(`${API_BASE}/${dniBuscar.trim()}`);
      if (resp.status === 404) {
        setAlumnoEncontrado(null);
        setErrorBuscar("Alumno no encontrado");
        return;
      }
      if (!resp.ok) throw new Error("Error en la búsqueda");
      const data = await resp.json();
      setAlumnoEncontrado(data);
      setAlumno(data);
    } catch (error) {
      setAlumnoEncontrado(null);
      setErrorBuscar(error.message);
    }
  };

  const handleModificar = async (e) => {
    e.preventDefault();
    if (!alumnoEncontrado) return;

    try {
      const resp = await fetch(`${API_BASE}/${alumno.dni}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumno),
      });
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Error al modificar alumno");
      }
      alert("Alumno modificado!");
      limpiarFormulario();
      if (seccionBotones === "Ver") cargarAlumnos();
    } catch (error) {
      alert(error.message);
    }
  };

const handleEliminar = async (e) => {
  e.preventDefault();
  if (!dniBuscar.trim()) {
    setErrorBuscar("Ingrese un DNI para eliminar.");
    return;
  }
  setErrorBuscar("");
  try {
    const resp = await fetch(`${API_BASE}/${dniBuscar.trim()}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    });

    if (resp.status === 404) {
      setErrorBuscar("Alumno no encontrado");
      return;
    }

    if (!resp.ok) {
      throw new Error(`Error al eliminar alumno. Status: ${resp.status}`);
    }

    alert("Alumno eliminado!");
    limpiarFormulario();
    if (seccionBotones === "Ver") cargarAlumnos();

  } catch (error) {
    alert(error.message);
  }
};

  const alumnosFiltrados = listaAlumnos.filter(
    (a) =>
      (filtroGrado === "" || a.grado === filtroGrado) &&
      (filtroSeccion === "" || a.seccion === filtroSeccion)
  );

  return (
    <div className="contenedor-principal">
      <aside className="sidebar">
        <h2>Panel</h2>
        <ul>
          <li
            className={seccionSidebar === "Alumnos" ? "activo" : ""}
            onClick={() => {
              setSeccionSidebar("Alumnos");
              setSeccionBotones("Añadir");
              limpiarFormulario();
            }}
          >
            Alumnos
          </li>
          <li
            className={seccionSidebar === "Profesores" ? "activo" : ""}
            onClick={() => {
              setSeccionSidebar("Profesores");
              navigate("/AdminProfesores");
            }}
          >
            Profesores
          </li>
          <li
            className="cerrar-sesion"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Cerrar sesión
          </li>
        </ul>
      </aside>

      <div className="contenido-principal">
        {seccionSidebar === "Alumnos" && (
          <div className="barra-botones">
            {["Añadir", "Modificar", "Eliminar", "Ver"].map((opcion) => (
              <button
                key={opcion}
                className={seccionBotones === opcion ? "btn-activo" : ""}
                onClick={() => {
                  setSeccionBotones(opcion);
                  limpiarFormulario();
                }}
              >
                {opcion}
              </button>
            ))}
          </div>
        )}

        <main className="contenido-alumno">
          {seccionSidebar === "Alumnos" && seccionBotones === "Añadir" && (
            <>
              <h2>Registrar Nuevo Alumno</h2>
              <form onSubmit={handleAgregar}>
                <div className="grupo">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={alumno.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grupo">
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={alumno.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grupo">
                  <label>DNI</label>
                  <input
                    type="text"
                    name="dni"
                    value={alumno.dni}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grupo">
                  <label>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={alumno.fechaNacimiento}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grupo">
                  <label>Grado</label>
                  <select
                    name="grado"
                    value={alumno.grado}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un grado</option>
                    {grados.map((g, i) => (
                      <option key={i} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grupo">
                  <label>Sección</label>
                  <select
                    name="seccion"
                    value={alumno.seccion}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una sección</option>
                    {secciones.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-registrar">
                  Registrar Alumno
                </button>
              </form>
            </>
          )}

          {seccionSidebar === "Alumnos" && seccionBotones === "Modificar" && (
            <>
              <h2>Modificar Alumno</h2>
              <div className="grupo buscar-dni">
                <label>Buscar por DNI</label>
                <input
                  type="text"
                  value={dniBuscar}
                  onChange={(e) => setDniBuscar(e.target.value)}
                  placeholder="Ingrese DNI"
                />
                <button
                  className="btn-buscar"
                  onClick={buscarAlumnoPorDni}
                  disabled={!dniBuscar.trim()}
                >
                  Buscar
                </button>
                {errorBuscar && <p className="error">{errorBuscar}</p>}
              </div>

              {alumnoEncontrado && (
                <form onSubmit={handleModificar}>
                  <div className="grupo">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={alumno.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grupo">
                    <label>Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={alumno.apellido}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grupo">
                    <label>DNI (no editable)</label>
                    <input type="text" value={alumno.dni} disabled />
                  </div>
                  <div className="grupo">
                    <label>Fecha de Nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={alumno.fechaNacimiento}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grupo">
                    <label>Grado</label>
                    <select
                      name="grado"
                      value={alumno.grado}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un grado</option>
                      {grados.map((g, i) => (
                        <option key={i} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grupo">
                    <label>Sección</label>
                    <select
                      name="seccion"
                      value={alumno.seccion}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona una sección</option>
                      {secciones.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn-modificar">
                    Guardar Cambios
                  </button>
                </form>
              )}
            </>
          )}

          {seccionSidebar === "Alumnos" && seccionBotones === "Eliminar" && (
            <>
              <h2>Eliminar Alumno</h2>
              <div className="grupo buscar-dni">
                <label>Ingrese DNI del alumno a eliminar</label>
                <input
                  type="text"
                  value={dniBuscar}
                  onChange={(e) => setDniBuscar(e.target.value)}
                  placeholder="Ingrese DNI"
                />
                <button
                  className="btn-eliminar"
                  onClick={handleEliminar}
                  disabled={!dniBuscar.trim()}
                >
                  Eliminar
                </button>
                {errorBuscar && <p className="error">{errorBuscar}</p>}
              </div>
            </>
          )}

          {seccionSidebar === "Alumnos" && seccionBotones === "Ver" && (
            <>
              <h2>Lista de Alumnos</h2>
              {cargando ? (
                <p>Cargando alumnos...</p>
              ) : (
                <>
                  <div className="filtros">
                    <label>Filtrar por grado:</label>
                    <select
                      value={filtroGrado}
                      onChange={(e) => setFiltroGrado(e.target.value)}
                    >
                      <option value="">Todos</option>
                      {grados.map((g, i) => (
                        <option key={i} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>

                    <label>Filtrar por sección:</label>
                    <select
                      value={filtroSeccion}
                      onChange={(e) => setFiltroSeccion(e.target.value)}
                    >
                      <option value="">Todas</option>
                      {secciones.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <table className="tabla-alumnos">
                    <thead>
                      <tr>
                        <th>DNI</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Fecha Nacimiento</th>
                        <th>Grado</th>
                        <th>Sección</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alumnosFiltrados.map((a) => (
                        <tr key={a.dni}>
                          <td>{a.dni}</td>
                          <td>{a.nombre}</td>
                          <td>{a.apellido}</td>
                          <td>{a.fechaNacimiento}</td>
                          <td>{a.grado}</td>
                          <td>{a.seccion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminAlumnos;