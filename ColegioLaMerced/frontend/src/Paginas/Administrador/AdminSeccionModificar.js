import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminSeccionModificar.css"; // CSS específico para este componente

const AdminSeccionModificar = () => {
  const navigate = useNavigate();
  const [secciones, setSecciones] = useState([]);
  const [selectedSeccionId, setSelectedSeccionId] = useState("");
  const [seccionToModify, setSeccionToModify] = useState({
    grado: "",
    nombre: "",
  });
  const [mensaje, setMensaje] = useState({ type: "", text: "" });

  const [seccionCursosAsignados, setSeccionCursosAsignados] = useState([]);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [horariosFullMap, setHorariosFullMap] = useState(new Map()); // Para detalles de horario
  const [alumnosEnSeccion, setAlumnosEnSeccion] = useState([]); // Alumnos para crear CursoUnico

  // Estado para la nueva asignación de curso
  const [newCursoId, setNewCursoId] = useState("");
  const [newDia, setNewDia] = useState("");
  const [newHora, setNewHora] = useState("");

  // Cargar datos iniciales: secciones, cursos, y un mapa de horarios
  const fetchInitialData = useCallback(async () => {
    try {
      console.log("Fetching initial data...");
      const [seccionesRes, cursosRes, horariosRes] = await Promise.all([
        axios.get("http://localhost:8080/api/secciones"),
        axios.get("http://localhost:8080/api/cursos"),
        axios.get("http://localhost:8080/api/horarios"),
      ]);
      setSecciones(seccionesRes.data || []);
      setCursosDisponibles(cursosRes.data || []);
      setHorariosFullMap(new Map((horariosRes.data || []).map(h => [h.idHorario, h])));
      console.log("Initial data fetched successfully.");
    } catch (err) {
      setMensaje({ type: "error", text: "Error al cargar datos iniciales (secciones, cursos, horarios)." });
      console.error("Error fetching initial data:", err.response ? err.response.data : err.message);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Cargar detalles de la sección seleccionada y sus asignaciones
  const loadSeccionDetailsAndAssignments = useCallback(async () => {
    setMensaje({ type: "", text: "" });
    if (!selectedSeccionId) {
      setSeccionToModify({ grado: "", nombre: "" });
      setSeccionCursosAsignados([]);
      setAlumnosEnSeccion([]); // Limpiar alumnos
      return;
    }

    console.log(`Loading details for section ID: ${selectedSeccionId}`);
    try {
      const seccionRes = await axios.get(`http://localhost:8080/api/secciones/${selectedSeccionId}`);
      setSeccionToModify(seccionRes.data);
      console.log("Seccion details loaded:", seccionRes.data);

      const [seccionCursosRes, alumnosRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/seccioncursos/porSeccion/${selectedSeccionId}`),
        axios.get("http://localhost:8080/api/alumnos"), // Obtener todos los alumnos y filtrar
      ]);

      // Asegurarse de que seccionCursosRes.data sea un array antes de mapear
      const rawSeccionCursos = seccionCursosRes.data || [];
      const cursosAsignados = rawSeccionCursos.map(sc => ({
        ...sc,
        // *** CAMBIO CLAVE AQUÍ: Asumiendo que idCurso está directamente en el objeto sc ***
        nombreCurso: cursosDisponibles.find(c => c.idCurso === sc.idCurso)?.nombre || `Curso ID: ${sc.idCurso}`,
        // *** CAMBIO CLAVE AQUÍ: Asumiendo que idHorario está directamente en el objeto sc ***
        horarioDetalles: horariosFullMap.get(sc.idHorario) || null,
      }));
      setSeccionCursosAsignados(cursosAsignados);
      console.log("SeccionCursos loaded:", cursosAsignados);


      // Filtrar alumnos que pertenecen a esta sección
      const rawAlumnos = alumnosRes.data || [];
      const alumnosFiltrados = rawAlumnos.filter(alumno => 
        alumno.seccion && alumno.seccion.idSeccion === parseInt(selectedSeccionId)
      );
      setAlumnosEnSeccion(alumnosFiltrados);
      console.log("Alumnos in section loaded:", alumnosFiltrados);

    } catch (err) {
      setMensaje({ type: "error", text: "Error al cargar detalles de la sección o sus asignaciones." });
      console.error("Error loading section details and assignments:", err.response ? err.response.data : err.message);
    }
  }, [selectedSeccionId, cursosDisponibles, horariosFullMap]);

  useEffect(() => {
    // Solo cargar detalles si selectedSeccionId es válido y los datos iniciales están cargados
    if (selectedSeccionId && cursosDisponibles.length > 0 && horariosFullMap.size > 0) {
      loadSeccionDetailsAndAssignments();
    } else if (!selectedSeccionId) {
      // Resetear estados si no hay sección seleccionada
      setSeccionToModify({ grado: "", nombre: "" });
      setSeccionCursosAsignados([]);
      setAlumnosEnSeccion([]);
    }
  }, [selectedSeccionId, cursosDisponibles, horariosFullMap, loadSeccionDetailsAndAssignments]);


  const handleSeccionSelectChange = (e) => {
    setSelectedSeccionId(e.target.value);
  };

  const handleSeccionDetailsChange = (e) => {
    setSeccionToModify({ ...seccionToModify, [e.target.name]: e.target.value });
  };

  const handleUpdateSeccion = async (e) => {
    e.preventDefault();
    setMensaje({ type: "", text: "" });

    if (!selectedSeccionId) {
      setMensaje({ type: "error", text: "Por favor, seleccione una sección para modificar." });
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/secciones/${selectedSeccionId}`, seccionToModify);
      setMensaje({ type: "success", text: "Datos de la sección actualizados exitosamente." });
      fetchInitialData(); // Recargar secciones para actualizar el selector
      loadSeccionDetailsAndAssignments(); // Recargar detalles y asignaciones
    } catch (err) {
      let errorMessage = "Error al actualizar la sección. ";
      if (axios.isAxiosError(err) && err.response) {
        errorMessage += `Detalles: ${err.response.data.message || JSON.stringify(err.response.data)}`;
      } else {
        errorMessage += err.message;
      }
      setMensaje({ type: "error", text: errorMessage });
    }
  };

  const handleUnassignSeccionCurso = async (seccionCursoId) => {
    setMensaje({ type: "", text: "" });

    if (!window.confirm("¿Está seguro de que desea desasignar este curso? Esto eliminará el curso de la sección, su horario, las notas asociadas para los alumnos y los anuncios vinculados.")) {
      return;
    }

    try {
      const scToUnassign = seccionCursosAsignados.find(sc => sc.idSeccionCurso === seccionCursoId);
      if (!scToUnassign) {
        setMensaje({ type: "error", text: "Error: Asignación de sección/curso no encontrada para desasignar." });
        console.error("SeccionCurso not found for ID:", seccionCursoId);
        return;
      }

      console.log(`Iniciando desasignación para SeccionCurso ID: ${seccionCursoId}`);

      // Obtener todos los datos necesarios para la eliminación en cascada
      // Se hacen las llamadas aquí para asegurar que los datos estén lo más actualizados posible.
      const [allAnunciosRes, allCursosUnicosRes, allAsistenciasRes] = await Promise.all([
        axios.get("http://localhost:8080/api/anuncios"),
        axios.get("http://localhost:8080/api/cursosunicos"),
        axios.get("http://localhost:8080/api/asistencias")
      ]);
      const allAnuncios = allAnunciosRes.data || [];
      const allCursosUnicos = allCursosUnicosRes.data || [];
      const allAsistencias = allAsistenciasRes.data || [];

      console.log("Datos brutos de Anuncios:", allAnuncios);
      console.log("Datos brutos de CursoUnicos:", allCursosUnicos);
      console.log("Datos brutos de Asistencias:", allAsistencias);

      // 1. Eliminar Anuncios asociados a este SeccionCurso PRIMERO
      const anunciosParaEliminar = allAnuncios.filter(an => 
        (an.seccionCurso && an.seccionCurso.idSeccionCurso === seccionCursoId) || // Si es un objeto anidado
        (an.idSeccionCurso === seccionCursoId) // Si el ID está directamente en el DTO
      );
      console.log(`Anuncios a eliminar para SeccionCurso ${seccionCursoId}:`, anunciosParaEliminar.map(a => a.idAnuncio));
      for (const anuncio of anunciosParaEliminar) {
        try {
          await axios.delete(`http://localhost:8080/api/anuncios/${anuncio.idAnuncio}`);
          console.log(`Anuncio ${anuncio.idAnuncio} eliminado.`);
        } catch (deleteErr) {
          console.warn(`Advertencia: No se pudo eliminar el anuncio ${anuncio.idAnuncio}.`, deleteErr.message);
        }
      }

      // 2. Eliminar CursoUnico y sus dependencias (Asistencias)
      // Reforzado el filtro para CursoUnico para mayor compatibilidad de DTO
      const cursosUnicosAsociados = allCursosUnicos.filter(cu => 
        (cu.seccionCurso && cu.seccionCurso.idSeccionCurso === seccionCursoId) || 
        (cu.idSeccionCurso === seccionCursoId) // Incluye esta condición por si el DTO de CursoUnico tiene el ID directo
      );
      console.log(`CursosUnicos a eliminar para SeccionCurso ${seccionCursoId}:`, cursosUnicosAsociados.map(cu => cu.idCursoUnico));

      for (const cu of cursosUnicosAsociados) {
        // Eliminar Asistencias asociadas a este CursoUnico PRIMERO
        const asistenciasParaEliminar = allAsistencias.filter(asist => 
          (asist.cursoUnico && asist.cursoUnico.idCursoUnico === cu.idCursoUnico) ||
          (asist.idCursoUnico === cu.idCursoUnico) // Incluye esta condición por si el DTO de Asistencia tiene el ID directo
        );
        console.log(`Asistencias a eliminar para CursoUnico ${cu.idCursoUnico}:`, asistenciasParaEliminar.map(a => a.idAsistencia));

        for (const asist of asistenciasParaEliminar) {
          try {
            await axios.delete(`http://localhost:8080/api/asistencias/${asist.idAsistencia}`);
            console.log(`Asistencia ${asist.idAsistencia} eliminada.`);
          } catch (deleteErr) {
            console.warn(`Advertencia: No se pudo eliminar la asistencia ${asist.idAsistencia}.`, deleteErr.message);
          }
        }
        // Luego eliminar el CursoUnico
        try {
          await axios.delete(`http://localhost:8080/api/cursosunicos/${cu.idCursoUnico}`);
          console.log(`CursoUnico ${cu.idCursoUnico} eliminado.`);
        } catch (deleteErr) {
          console.warn(`Advertencia: No se pudo eliminar CursoUnico ${cu.idCursoUnico}.`, deleteErr.message);
        }
      }

      // 3. Eliminar SeccionCurso
      console.log(`Intentando eliminar SeccionCurso ID: ${seccionCursoId}`);
      try {
        await axios.delete(`http://localhost:8080/api/seccioncursos/${seccionCursoId}`);
        console.log(`SeccionCurso ${seccionCursoId} eliminado exitosamente.`);
      } catch (deleteErr) {
        console.error(`Error crítico al eliminar SeccionCurso ${seccionCursoId}:`, deleteErr);
        setMensaje({ type: "error", text: `Error crítico al desasignar el curso. Detalles: ${axios.isAxiosError(deleteErr) ? (deleteErr.response?.data?.message || JSON.stringify(deleteErr.response?.data)) : deleteErr.message}` });
        return; // Detener la ejecución si falla la eliminación de SeccionCurso
      }

      // 4. Eliminar Horario asociado (si existe)
      // Asegúrate de que scToUnassign.horario exista y tenga idHorario
      if (scToUnassign.horario && scToUnassign.horario.idHorario) {
        console.log(`Intentando eliminar Horario ID: ${scToUnassign.horario.idHorario}`);
        try {
          await axios.delete(`http://localhost:8080/api/horarios/${scToUnassign.horario.idHorario}`);
          console.log(`Horario ${scToUnassign.horario.idHorario} eliminado.`);
        } catch (deleteErr) {
          console.warn(`Advertencia: No se pudo eliminar el horario ${scToUnassign.horario.idHorario}.`, deleteErr.message);
        }
      }

      setMensaje({ type: "success", text: "Curso desasignado exitosamente (incluyendo horario, notas de alumnos y anuncios)." });
      loadSeccionDetailsAndAssignments(); // Recargar la lista de asignaciones
    } catch (err) {
      let errorMessage = "Error al desasignar el curso. ";
      if (axios.isAxiosError(err) && err.response) {
        errorMessage += `Detalles: ${err.response.data.message || JSON.stringify(err.response.data)}`;
      } else {
        errorMessage += err.message;
      }
      setMensaje({ type: "error", text: errorMessage });
      console.error("Error desasignando curso (general catch):", err);
    }
  };

  const handleAddCourseToSection = async (e) => {
    e.preventDefault();
    setMensaje({ type: "", text: "" });

    if (!selectedSeccionId || !newCursoId || !newDia || !newHora) {
      setMensaje({ type: "error", text: "Por favor, complete todos los campos para añadir el nuevo curso." });
      return;
    }

    try {
      // 1. Crear Horario (profesor null)
      const horarioData = {
        hora: newHora,
        dia: newDia,
        idSeccion: parseInt(selectedSeccionId),
        idProfesor: null,
      };
      const horarioResponse = await axios.post("http://localhost:8080/api/horarios", horarioData);
      const idHorarioCreado = horarioResponse.data.idHorario;

      // 2. Crear SeccionCurso (profesor null)
      const seccionCursoData = {
        idSeccion: parseInt(selectedSeccionId),
        idCurso: parseInt(newCursoId),
        idProfesor: null,
        idHorario: idHorarioCreado,
      };
      const seccionCursoResponse = await axios.post("http://localhost:8080/api/seccioncursos", seccionCursoData);
      const idSeccionCursoCreado = seccionCursoResponse.data.idSeccionCurso;

      // 3. Crear CursoUnico para cada alumno en esta sección
      const alumnosEnSeccionParaCrear = alumnosEnSeccion.map(alumno => ({
        examen1: null, // O el valor por defecto que desees
        examen2: null,
        examen3: null,
        examen4: null,
        examenFinal: null,
        idSeccionCurso: idSeccionCursoCreado,
        idAlumno: alumno.idAlumno,
      }));

      if (alumnosEnSeccionParaCrear.length > 0) {
        // Enviar la lista de CursoUnico en una sola petición POST
        await axios.post("http://localhost:8080/api/cursosunicos", alumnosEnSeccionParaCrear);
      }

      setMensaje({ type: "success", text: "Nuevo curso asignado y notas iniciales creadas para los alumnos." });
      setNewCursoId("");
      setNewDia("");
      setNewHora("");
      loadSeccionDetailsAndAssignments(); // Recargar la lista de asignaciones
    } catch (err) {
      let errorMessage = "Error al añadir el nuevo curso a la sección. ";
      if (axios.isAxiosError(err) && err.response) {
        errorMessage += `Detalles: ${err.response.data.message || JSON.stringify(err.response.data)}`;
      } else {
        errorMessage += err.message;
      }
      setMensaje({ type: "error", text: errorMessage });
      console.error("Error adding course to section:", err);
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
              <li onClick={() => navigate("/AdminSeccionesAgregar")}>Crear Sección</li>
              <li className="activo" onClick={() => navigate("/AdminSeccionesModificar")}>Modificar Sección</li>
              <li onClick={() => navigate("/AdminSeccionEliminar")}>Eliminar Sección</li>
            </ul>
          </li>
          <li className="cerrar-sesion" onClick={() => { localStorage.clear(); navigate("/"); }}>Cerrar sesión</li>
        </ul>
      </aside>

      <div className="contenido-principal">
        <main className="contenido-seccion-modificar">
          <h1>Modificar Sección y Asignaciones</h1>
          {mensaje.text && (
            <div className={`mensaje ${mensaje.type === "success" ? "mensaje-exito" : "mensaje-error"}`}>
              {mensaje.text}
            </div>
          )}

          <div className="grupo">
            <label htmlFor="selectSeccion">Seleccionar Sección</label>
            <select
              id="selectSeccion"
              value={selectedSeccionId}
              onChange={handleSeccionSelectChange}
            >
              <option value="">-- Seleccione una Sección --</option>
              {secciones.map((sec) => (
                <option key={sec.idSeccion} value={sec.idSeccion}>
                  Grado: {sec.grado} - Nombre: {sec.nombre}
                </option>
              ))}
            </select>
          </div>

          {selectedSeccionId && (
            <>
              <section className="modification-form">
                <h2>Datos de la Sección</h2>
                <form onSubmit={handleUpdateSeccion}>
                  <div className="grupo">
                    <label htmlFor="grado">Grado:</label>
                    <select
                      id="grado"
                      name="grado"
                      value={seccionToModify.grado}
                      onChange={handleSeccionDetailsChange}
                      required
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
                      value={seccionToModify.nombre}
                      onChange={handleSeccionDetailsChange}
                      required
                    >
                      <option value="">-- Seleccione una Sección --</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-registrar">Actualizar Datos de Sección</button>
                </form>
              </section>

              <hr className="divider" />

              <section className="assignment-section">
                <h2>Cursos Asignados a esta Sección</h2>
                {seccionCursosAsignados.length > 0 ? (
                  <ul className="assignment-list">
                    {seccionCursosAsignados.map((sc) => (
                      <li key={sc.idSeccionCurso} className="assignment-item">
                        <span>
                          Curso: {sc.nombreCurso}
                          {sc.horarioDetalles && ` (Horario: ${sc.horarioDetalles.dia} - ${sc.horarioDetalles.hora})`}
                        </span>
                        <button
                          onClick={() => handleUnassignSeccionCurso(sc.idSeccionCurso)}
                          className="delete-button"
                        >
                          Desasignar
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Esta sección no tiene cursos asignados.</p>
                )}
              </section>

              <hr className="divider" />

              <section className="assignment-form">
                <h2>Añadir Nuevo Curso a esta Sección</h2>
                <form onSubmit={handleAddCourseToSection}>
                  <div className="grupo">
                    <label htmlFor="newCursoId">Curso Disponible:</label>
                    <select
                      id="newCursoId"
                      name="newCursoId"
                      value={newCursoId}
                      onChange={(e) => setNewCursoId(e.target.value)}
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
                    <label htmlFor="newDia">Día:</label>
                    <select
                      id="newDia"
                      name="newDia"
                      value={newDia}
                      onChange={(e) => setNewDia(e.target.value)}
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
                    <label htmlFor="newHora">Hora:</label>
                    <input
                      type="time"
                      id="newHora"
                      name="newHora"
                      value={newHora}
                      onChange={(e) => setNewHora(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-assign">Añadir Curso</button>
                </form>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSeccionModificar;