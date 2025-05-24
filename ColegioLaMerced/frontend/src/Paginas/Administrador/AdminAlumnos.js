import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Administrador/AdminAlumnos.css";

const grados = [
  "Primero de Primaria",
  "Segundo de Primaria",
  "Tercero de Primaria",
  "Cuarto de Primaria",
  "Quinto de Primaria",
  "Sexto de Primaria",
];
const secciones = ["A", "B", "C"];

const alumnosEjemplo = [
  { dni: "12345678", nombre: "Juan", apellido: "Pérez", grado: "Primero de Primaria", seccion: "A", fechaNacimiento: "2015-05-10" },
  { dni: "87654321", nombre: "Ana", apellido: "García", grado: "Tercero de Primaria", seccion: "B", fechaNacimiento: "2013-11-01" },
];

const AdminAlumnos = () => {
  const navigate = useNavigate();

  const [seccionSidebar, setSeccionSidebar] = useState("Alumnos"); // Sidebar activo
  const [seccionBotones, setSeccionBotones] = useState("Añadir"); // Acción dentro de Alumnos
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
  const [listaAlumnos, setListaAlumnos] = useState(alumnosEjemplo);
  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroSeccion, setFiltroSeccion] = useState("");

  // Manejador inputs añadir/modificar
  const handleChange = (e) => {
    setAlumno({ ...alumno, [e.target.name]: e.target.value });
  };

  // Agregar alumno
  const handleAgregar = (e) => {
    e.preventDefault();
    setListaAlumnos([...listaAlumnos, alumno]);
    alert("Alumno agregado!");
    setAlumno({
      nombre: "",
      apellido: "",
      dni: "",
      fechaNacimiento: "",
      grado: "",
      seccion: "",
    });
  };

  // Buscar alumno por DNI para modificar
  const buscarAlumnoPorDni = () => {
    const encontrado = listaAlumnos.find((a) => a.dni === dniBuscar);
    if (encontrado) {
      setAlumnoEncontrado(encontrado);
      setAlumno(encontrado);
      setErrorBuscar("");
    } else {
      setAlumnoEncontrado(null);
      setErrorBuscar("Alumno no encontrado");
    }
  };

  // Modificar alumno
  const handleModificar = (e) => {
    e.preventDefault();
    if (!alumnoEncontrado) return;
    setListaAlumnos(
      listaAlumnos.map((a) =>
        a.dni === alumno.dni ? { ...alumno } : a
      )
    );
    alert("Alumno modificado!");
    setAlumnoEncontrado(null);
    setDniBuscar("");
    setAlumno({
      nombre: "",
      apellido: "",
      dni: "",
      fechaNacimiento: "",
      grado: "",
      seccion: "",
    });
  };

  // Eliminar alumno
  const handleEliminar = (e) => {
    e.preventDefault();
    const alumnoExistente = listaAlumnos.find((a) => a.dni === dniBuscar);
    if (!alumnoExistente) {
      setErrorBuscar("Alumno no encontrado");
      return;
    }
    setListaAlumnos(listaAlumnos.filter((a) => a.dni !== dniBuscar));
    alert("Alumno eliminado!");
    setDniBuscar("");
    setErrorBuscar("");
  };

  // Filtrar alumnos para vista
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
              setAlumnoEncontrado(null);
              setDniBuscar("");
              setErrorBuscar("");
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
              localStorage.clear(); // Limpia sesión o tokens si tienes
              navigate("/login");
            }}
          >
            Cerrar sesión
          </li>
        </ul>
      </aside>

      {/* Contenido principal (al lado de sidebar) */}
      <div className="contenido-principal">
        {/* Barra botones horizontal solo si estamos en Alumnos */}
        {seccionSidebar === "Alumnos" && (
          <div className="barra-botones">
            {["Añadir", "Modificar", "Eliminar", "Ver"].map((opcion) => (
              <button
                key={opcion}
                className={seccionBotones === opcion ? "btn-activo" : ""}
                onClick={() => {
                  setSeccionBotones(opcion);
                  setAlumnoEncontrado(null);
                  setDniBuscar("");
                  setErrorBuscar("");
                  setAlumno({
                    nombre: "",
                    apellido: "",
                    dni: "",
                    fechaNacimiento: "",
                    grado: "",
                    seccion: "",
                  });
                }}
              >
                {opcion}
              </button>
            ))}
          </div>
        )}

        {/* Contenido según sección y botón */}
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
                  disabled={!dniBuscar}
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
                    <input type="text" name="dni" value={alumno.dni} readOnly />
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
                    Guardar Cambios
                  </button>
                </form>
              )}
            </>
          )}

          {seccionSidebar === "Alumnos" && seccionBotones === "Eliminar" && (
            <>
              <h2>Eliminar Alumno</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEliminar(e);
                }}
              >
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
                <button type="submit" className="btn-eliminar">
                  Eliminar Alumno
                </button>
              </form>
            </>
          )}

          {seccionSidebar === "Alumnos" && seccionBotones === "Ver" && (
            <>
              <h2>Lista de Alumnos</h2>
              <div className="filtros">
                <select
                  value={filtroGrado}
                  onChange={(e) => setFiltroGrado(e.target.value)}
                >
                  <option value="">Todos los grados</option>
                  {grados.map((g, i) => (
                    <option key={i} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <select
                  value={filtroSeccion}
                  onChange={(e) => setFiltroSeccion(e.target.value)}
                >
                  <option value="">Todas las secciones</option>
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
                    <th>Fecha Nac.</th>
                    <th>Grado</th>
                    <th>Sección</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosFiltrados.length > 0 ? (
                    alumnosFiltrados.map((a) => (
                      <tr key={a.dni}>
                        <td>{a.dni}</td>
                        <td>{a.nombre}</td>
                        <td>{a.apellido}</td>
                        <td>{a.fechaNacimiento}</td>
                        <td>{a.grado}</td>
                        <td>{a.seccion}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No hay alumnos para mostrar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {seccionSidebar === "Profesores" && (
            <div>
              <h2>Sección Profesores</h2>
              <p>Aquí irá el contenido de administración de profesores...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminAlumnos;

