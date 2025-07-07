import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Administrador/AdminAlumnos.css";

const API_BASE_ALUMNOS = "http://localhost:8080/api/alumnos";
const API_BASE_PADRES = "http://localhost:8080/api/padres";
const API_BASE_SECCIONES = "http://localhost:8080/api/secciones";
const API_BASE_CURSOS_UNICOS = "http://localhost:8080/api/cursosunicos";
const API_BASE_SECCION_CURSOS = "http://localhost:8080/api/seccioncursos";

const AdminAlumnos = () => {
  const navigate = useNavigate();

  const [seccionSidebar, setSeccionSidebar] = useState("Alumnos");
  const [seccionBotones, setSeccionBotones] = useState("Añadir");
  const [alumno, setAlumno] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    correo: "",
    contrasena: "",
    idPadre: "",
  });
  const [listaPadres, setListaPadres] = useState([]);
  const [listaSecciones, setListaSecciones] = useState([]);

  const [mostrarFormNuevoPadre, setMostrarFormNuevoPadre] = useState(false);
  const [nuevoPadre, setNuevoPadre] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
    correo: "",
  });

  const [mostrarAsignarSeccionModal, setMostrarAsignarSeccionModal] = useState(false);
  const [alumnoRecienCreado, setAlumnoRecienCreado] = useState(null);
  const [seccionSeleccionadaModal, setSeccionSeleccionadaModal] = useState("");

  useEffect(() => {
    cargarPadres();
    cargarSecciones();
  }, []);

  const cargarPadres = async () => {
    try {
      const resp = await fetch(API_BASE_PADRES);
      if (!resp.ok) throw new Error("Error al cargar padres");
      const data = await resp.json();
      setListaPadres(data);
    } catch (error) {
      console.error("Error al cargar padres:", error.message);
      alert("Error al cargar la lista de padres.");
    }
  };

  const cargarSecciones = async () => {
    try {
      const resp = await fetch(API_BASE_SECCIONES);
      if (!resp.ok) throw new Error("Error al cargar secciones");
      const data = await resp.json();
      setListaSecciones(data);
    } catch (error) {
      console.error("Error al cargar secciones:", error.message);
      alert("Error al cargar la lista de secciones.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumno((prev) => ({ ...prev, [name]: value }));
  };

  const handleNuevoPadreChange = (e) => {
    const { name, value } = e.target;
    setNuevoPadre((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrearPadre = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(API_BASE_PADRES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPadre),
      });
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Error al crear nuevo padre");
      }
      const data = await resp.json();
      alert("Padre creado exitosamente!");
      await cargarPadres();
      setAlumno((prev) => ({ ...prev, idPadre: data.idPadre.toString() }));
      setMostrarFormNuevoPadre(false);
      setNuevoPadre({ nombre: "", apellido: "", telefono: "", dni: "", correo: "" });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!alumno.idPadre) {
      alert("Por favor, seleccione un padre para el alumno.");
      return;
    }

    try {
      const alumnoParaBackend = {
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        dni: alumno.dni,
        correo: alumno.correo,
        contrasena: alumno.contrasena,
        idPadre: parseInt(alumno.idPadre),
      };

      const resp = await fetch(API_BASE_ALUMNOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumnoParaBackend),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Error al agregar alumno");
      }
      const data = await resp.json();

      alert("Alumno agregado exitosamente. Ahora asigna una sección.");
      setAlumnoRecienCreado(data);
      setMostrarAsignarSeccionModal(true);
      limpiarFormulario();
    } catch (error) {
      alert(error.message);
    }
  };

  const limpiarFormulario = () => {
    setAlumno({
      nombre: "",
      apellido: "",
      dni: "",
      correo: "",
      contrasena: "",
      idPadre: "",
    });
    setMostrarFormNuevoPadre(false);
    setNuevoPadre({ nombre: "", apellido: "", telefono: "", dni: "", correo: "" });
    setSeccionSeleccionadaModal("");
  };

  const handleAsignarSeccionYCursosUnicos = async () => {
    if (!alumnoRecienCreado || !seccionSeleccionadaModal) {
      return;
    }

    try {
      const respSeccionCursos = await fetch(`${API_BASE_SECCION_CURSOS}/porSeccion/${seccionSeleccionadaModal}`);
      if (!respSeccionCursos.ok) {
        const errorData = await respSeccionCursos.json();
        throw new Error(errorData.message || "Error al obtener los cursos de la sección.");
      }
      const seccionCursos = await respSeccionCursos.json();

      if (seccionCursos.length === 0) {
        alert("No se encontraron cursos para esta sección. No se generarán Cursos Únicos.");
        setMostrarAsignarSeccionModal(false);
        setAlumnoRecienCreado(null);
        setSeccionSeleccionadaModal("");
        return;
      }

      const cursosUnicosParaCrear = seccionCursos.map(sc => ({
        idAlumno: alumnoRecienCreado.idAlumno,
        idSeccionCurso: sc.idSeccionCurso,
        examen1: 0.0,
        examen2: 0.0,
        examen3: 0.0,
        examen4: 0.0,
        examenFinal: 0.0
      }));

      const respCursosUnicos = await fetch(API_BASE_CURSOS_UNICOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cursosUnicosParaCrear),
      });

      if (!respCursosUnicos.ok) {
        const errorData = await respCursosUnicos.json();
        throw new Error(errorData.message || `Error al crear los cursos únicos. Estado: ${respCursosUnicos.status}`);
      }

      alert("Sección asignada y cursos únicos generados exitosamente!");
      setMostrarAsignarSeccionModal(false);
      setAlumnoRecienCreado(null);
      setSeccionSeleccionadaModal("");
    } catch (error) {
      alert(error.message);
    }
  };

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
            className={seccionSidebar === "Seccion" ? "activo" : ""}
            onClick={() => {
              setSeccionSidebar("Seccion");
              navigate("/AdminSeccionesAgregar");
            }}
          >
            Secciones
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
                  if (opcion === "Modificar") navigate("/AdminAlumnoModificar");
                  if (opcion === "Eliminar") navigate("/AdminAlumnoEliminar");
                  if (opcion === "Ver") navigate("/AdminAlumnoVer");
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
                  <label>Correo</label>
                  <input
                    type="email"
                    name="correo"
                    value={alumno.correo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grupo">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="contrasena"
                    value={alumno.contrasena}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grupo">
                  <label>Padre</label>
                  <select
                    name="idPadre"
                    value={alumno.idPadre}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un padre</option>
                    {listaPadres.map((padre) => (
                      <option key={padre.idPadre} value={padre.idPadre}>
                        {padre.nombre} {padre.apellido} ({padre.dni})
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => setMostrarFormNuevoPadre(true)} className="btn-crear-nuevo-padre">
                    Crear Nuevo Padre
                  </button>
                </div>

                {mostrarFormNuevoPadre && (
                  <div className="formulario-nuevo-padre">
                    <h3>Nuevo Padre</h3>
                    <div className="grupo">
                      <label>Nombre Padre</label>
                      <input type="text" name="nombre" value={nuevoPadre.nombre} onChange={handleNuevoPadreChange} required />
                    </div>
                    <div className="grupo">
                      <label>Apellido Padre</label>
                      <input type="text" name="apellido" value={nuevoPadre.apellido} onChange={handleNuevoPadreChange} required />
                    </div>
                    <div className="grupo">
                      <label>Teléfono Padre</label>
                      <input type="text" name="telefono" value={nuevoPadre.telefono} onChange={handleNuevoPadreChange} required />
                    </div>
                    <div className="grupo">
                      <label>DNI Padre</label>
                      <input type="text" name="dni" value={nuevoPadre.dni} onChange={handleNuevoPadreChange} required />
                    </div>
                    <div className="grupo">
                      <label>Correo Padre</label>
                      <input type="email" name="correo" value={nuevoPadre.correo} onChange={handleNuevoPadreChange} required />
                    </div>
                    <button type="button" onClick={handleCrearPadre}>Guardar Padre</button>
                    <button type="button" onClick={() => setMostrarFormNuevoPadre(false)}>Cancelar</button>
                  </div>
                )}

                <button type="submit" className="btn-registrar">
                  Registrar Alumno
                </button>
              </form>
            </>
          )}
        </main>
      </div>

      {mostrarAsignarSeccionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Asignar Sección a {alumnoRecienCreado?.nombre} {alumnoRecienCreado?.apellido}</h3>
            <p>ID del Alumno recién creado: <strong>{alumnoRecienCreado?.idAlumno}</strong> (Disponible para asignación)</p>

            <div className="grupo">
              <label>Selecciona una Sección:</label>
              <select
                value={seccionSeleccionadaModal}
                onChange={(e) => setSeccionSeleccionadaModal(e.target.value)}
                required
              >
                <option value="">Selecciona...</option>
                {listaSecciones.map((seccion) => (
                  <option key={seccion.idSeccion} value={seccion.idSeccion}>
                    {seccion.grado} "{seccion.nombre}"
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-acciones">
              <button
                onClick={handleAsignarSeccionYCursosUnicos}
                disabled={!seccionSeleccionadaModal}
              >
                Asignar y Generar Cursos
              </button>
              <button
                onClick={() => {
                  setMostrarAsignarSeccionModal(false);
                  setAlumnoRecienCreado(null);
                  setSeccionSeleccionadaModal("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAlumnos;