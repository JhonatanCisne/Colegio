import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminSeccionAgregar.css";

const AdminSeccionAgregar = () => {
  const navigate = useNavigate();
  const [nuevaSeccion, setNuevaSeccion] = useState({
    grado: "",
    nombre: "",
  });
  const [seccionCreadaId, setSeccionCreadaId] = useState(null);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [existingSecciones, setExistingSecciones] = useState([]);
  const [mensaje, setMensaje] = useState({ type: "", text: "" });

  // ¡ESTA LÍNEA FALTABA O SE PERDIÓ!
  const [asignacionesCursos, setAsignacionesCursos] = useState([
    { idCurso: "", dia: "", hora: "" },
  ]);

  // Cargar cursos disponibles y secciones existentes al inicio
  const fetchInitialData = useCallback(async () => {
    try {
      const [cursosRes, seccionesRes] = await Promise.all([
        axios.get("http://localhost:8080/api/cursos"),
        axios.get("http://localhost:8080/api/secciones"),
      ]);
      setCursosDisponibles(cursosRes.data);
      setExistingSecciones(seccionesRes.data);
    } catch (err) {
      setMensaje({ type: "error", text: "Error al cargar datos iniciales (cursos o secciones)." });
      console.error("Error fetching initial data:", err);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSeccionChange = (e) => {
    setNuevaSeccion({ ...nuevaSeccion, [e.target.name]: e.target.value });
  };

  const handleAsignacionChange = (index, e) => {
    const { name, value } = e.target;
    const newAsignaciones = [...asignacionesCursos];
    newAsignaciones[index][name] = value;
    setAsignacionesCursos(newAsignaciones);
  };

  const addAsignacionCurso = () => {
    setAsignacionesCursos([...asignacionesCursos, { idCurso: "", dia: "", hora: "" }]);
  };

  const removeAsignacionCurso = (index) => {
    const newAsignaciones = asignacionesCursos.filter((_, i) => i !== index);
    setAsignacionesCursos(newAsignaciones);
  };

  const handleSubmitSeccion = async (e) => {
    e.preventDefault();
    setMensaje({ type: "", text: "" });

    if (!nuevaSeccion.grado || !nuevaSeccion.nombre) {
      setMensaje({ type: "error", text: "Por favor, complete el grado y nombre de la sección." });
      return;
    }

    const isDuplicate = existingSecciones.some(
      (seccion) =>
        seccion.grado === nuevaSeccion.grado && seccion.nombre === nuevaSeccion.nombre
    );

    if (isDuplicate) {
      setMensaje({ type: "error", text: `Ya existe una sección con el grado "${nuevaSeccion.grado}" y nombre "${nuevaSeccion.nombre}".` });
      return;
    }

    try {
      const seccionResponse = await axios.post("http://localhost:8080/api/secciones", nuevaSeccion);
      setSeccionCreadaId(seccionResponse.data.idSeccion);
      setMensaje({ type: "success", text: `Sección "${nuevaSeccion.grado} ${nuevaSeccion.nombre}" creada exitosamente. Ahora puedes añadir cursos.` });
      fetchInitialData();
    } catch (err) {
      let errorMessage = "Error al crear la sección. ";
      if (axios.isAxiosError(err) && err.response) {
        errorMessage += `Detalles: ${err.response.data.message || JSON.stringify(err.response.data)}`;
      } else {
        errorMessage += err.message;
      }
      setMensaje({ type: "error", text: errorMessage });
    }
  };

  const handleSubmitAsignaciones = async (e) => {
    e.preventDefault();
    setMensaje({ type: "", text: "" });

    if (!seccionCreadaId) {
      setMensaje({ type: "error", text: "Primero debe crear una sección." });
      return;
    }

    if (asignacionesCursos.length === 0 || asignacionesCursos[0].idCurso === "") {
      setMensaje({ type: "error", text: "Debe asignar al menos un curso a la sección." });
      return;
    }

    for (const asignacion of asignacionesCursos) {
      if (!asignacion.idCurso || !asignacion.dia || !asignacion.hora) {
        setMensaje({ type: "error", text: "Todos los campos de las asignaciones de cursos (curso, día, hora) deben ser completados." });
        return;
      }
    }

    try {
      for (const asignacion of asignacionesCursos) {
        const horarioData = {
          hora: asignacion.hora,
          dia: asignacion.dia,
          idSeccion: seccionCreadaId,
          idProfesor: null,
        };
        const horarioResponse = await axios.post("http://localhost:8080/api/horarios", horarioData);
        const idHorarioCreado = horarioResponse.data.idHorario;

        const seccionCursoData = {
          idSeccion: seccionCreadaId,
          idCurso: parseInt(asignacion.idCurso),
          idProfesor: null,
          idHorario: idHorarioCreado,
        };
        await axios.post("http://localhost:8080/api/seccioncursos", seccionCursoData);
      }

      setMensaje({ type: "success", text: "Cursos y horarios asignados exitosamente a la sección." });
      setAsignacionesCursos([{ idCurso: "", dia: "", hora: "" }]);
      setNuevaSeccion({ grado: "", nombre: "" });
      setSeccionCreadaId(null);
    } catch (err) {
      let errorMessage = "Error al asignar cursos/horarios a la sección. ";
      if (axios.isAxiosError(err) && err.response) {
        errorMessage += `Detalles: ${err.response.data.message || JSON.stringify(err.response.data)}`;
      } else {
        errorMessage += err.message;
      }
      setMensaje({ type: "error", text: errorMessage });
    }
  };

  return (
    <div className="contenedor-principal">
      <aside className="sidebar">
        <h2>Panel</h2>
        <ul>
          <li onClick={() => navigate("/AdminAlumnos")}>Alumnos</li>
          <li className="parent-menu-item">
            Profesores
            <ul>
              <li onClick={() => navigate("/AdminProfesores")}>Crear Profesor</li>
              <li onClick={() => navigate("/AdminProfesoresVer")}>Ver Profesores</li>
              <li onClick={() => navigate("/AdminProfesoresModificar")}>Modificar Profesor</li>
              <li onClick={() => navigate("/AdminProfesoresEliminar")}>Eliminar Profesor</li>
            </ul>
          </li>
          <li className="parent-menu-item">
            Secciones
            <ul>
              <li className="activo" onClick={() => navigate("/AdminSeccionesAgregar")}>Crear Sección</li>
              <li onClick={() => navigate("/AdminSeccionesModificar")}>Modificar Sección</li>
              <li onClick={() => navigate("/AdminSeccionEliminar")}>Eliminar Sección</li>
            </ul>
          </li>
          <li className="cerrar-sesion" onClick={() => { localStorage.clear(); navigate("/"); }}>Cerrar sesión</li>
        </ul>
      </aside>

      <div className="contenido-principal">
        <main className="contenido-seccion">
          <h1>Crear Nueva Sección con Cursos y Horarios</h1>
          {mensaje.text && (
            <div className={`mensaje ${mensaje.type === "success" ? "mensaje-exito" : "mensaje-error"}`}>
              {mensaje.text}
            </div>
          )}

          <section className="seccion-form">
            <h2>Datos de la Sección</h2>
            <form onSubmit={handleSubmitSeccion}>
              <div className="grupo">
                <label htmlFor="grado">Grado:</label>
                <select
                  id="grado"
                  name="grado"
                  value={nuevaSeccion.grado}
                  onChange={handleSeccionChange}
                  required
                  disabled={seccionCreadaId !== null}
                >
                  <option value="">-- Seleccione un Grado --</option>
                  <option value="1er Grado">1er Grado</option>
                  <option value="2do Grado">2do Grado</option>
                  <option value="3er Grado">3er Grado</option>
                  <option value="4to Grado">4to Grado</option>
                  <option value="5to Grado">5to Grado</option>
                  <option value="6to Grado">6to Grado</option>
                </select>
              </div>
              <div className="grupo">
                <label htmlFor="nombre">Nombre de Sección:</label>
                <select
                  id="nombre"
                  name="nombre"
                  value={nuevaSeccion.nombre}
                  onChange={handleSeccionChange}
                  required
                  disabled={seccionCreadaId !== null}
                >
                  <option value="">-- Seleccione una Sección --</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <button type="submit" className="btn-registrar-seccion" disabled={seccionCreadaId !== null}>
                Crear Sección
              </button>
            </form>
          </section>

          {seccionCreadaId && (
            <>
              <hr className="divider" />
              <section className="seccion-form">
                <h2>Asignación de Cursos y Horarios para Sección: {nuevaSeccion.grado} {nuevaSeccion.nombre}</h2>
                <form onSubmit={handleSubmitAsignaciones}>
                  {asignacionesCursos.map((asignacion, index) => (
                    <div key={index} className="asignacion-item">
                      <h3>Curso #{index + 1}</h3>
                      <div className="grupo">
                        <label htmlFor={`idCurso-${index}`}>Curso:</label>
                        <select
                          id={`idCurso-${index}`}
                          name="idCurso"
                          value={asignacion.idCurso}
                          onChange={(e) => handleAsignacionChange(index, e)}
                          required
                        >
                          <option value="">-- Seleccione un Curso --</option>
                          {cursosDisponibles.map((curso) => (
                            <option key={curso.idCurso} value={curso.idCurso}>
                              {curso.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grupo">
                        <label htmlFor={`dia-${index}`}>Día:</label>
                        <select
                          id={`dia-${index}`}
                          name="dia"
                          value={asignacion.dia}
                          onChange={(e) => handleAsignacionChange(index, e)}
                          required
                        >
                          <option value="">-- Seleccione un Día --</option>
                          <option value="Lunes">Lunes</option>
                          <option value="Martes">Martes</option>
                          <option value="Miércoles">Miércoles</option>
                          <option value="Jueves">Jueves</option>
                          <option value="Viernes">Viernes</option>
                        </select>
                      </div>
                      <div className="grupo">
                        <label htmlFor={`hora-${index}`}>Hora:</label>
                        <input
                          type="time"
                          id={`hora-${index}`}
                          name="hora"
                          value={asignacion.hora}
                          onChange={(e) => handleAsignacionChange(index, e)}
                          required
                        />
                      </div>
                      {asignacionesCursos.length > 1 && (
                        <button
                          type="button"
                          className="btn-remover-asignacion"
                          onClick={() => removeAsignacionCurso(index)}
                        >
                          Remover Curso
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn-agregar-asignacion" onClick={addAsignacionCurso}>
                    ➕ Agregar Otro Curso
                  </button>

                  <button type="submit" className="btn-registrar-seccion">Guardar Cursos Asignados</button>
                </form>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSeccionAgregar;