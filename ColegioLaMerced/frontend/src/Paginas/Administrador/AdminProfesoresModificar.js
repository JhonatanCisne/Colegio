import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Administrador/AdminProfesores.css"; // Asegúrate de que la ruta CSS sea correcta

const AdminProfesoresModificar = () => {
  const navigate = useNavigate();
  const [profesores, setProfesores] = useState([]);
  const [selectedProfesorId, setSelectedProfesorId] = useState("");
  const [profesorToModify, setProfesorToModify] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    contrasena: "",
  });
  const [mensaje, setMensaje] = useState({ type: "", text: "" });

  const [seccionesCursosDisponibles, setSeccionesCursosDisponibles] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [seccionCursoParaAsignar, setSeccionCursoParaAsignar] = useState("");
  const [horarioParaAsignar, setHorarioParaAsignar] = useState("");

  const [profesorSeccionesCursosAsignados, setProfesorSeccionesCursosAsignados] = useState([]);

  // Mapas para almacenar nombres de entidades y detalles completos de horarios
  const [seccionesMap, setSeccionesMap] = useState(new Map());
  const [cursosMap, setCursosMap] = useState(new Map());
  const [horariosFullMap, setHorariosFullMap] = useState(new Map()); // Almacena objetos completos de horario

  // Carga inicial de todos los datos de referencia (secciones, cursos, horarios)
  useEffect(() => {
    const fetchNombresData = async () => {
      console.log("useEffect: Cargando datos de referencia (secciones, cursos, horarios)...");
      try {
        const [seccionesRes, cursosRes, horariosRes] = await Promise.all([
          axios.get("http://localhost:8080/api/secciones"),
          axios.get("http://localhost:8080/api/cursos"),
          axios.get("http://localhost:8080/api/horarios"),
        ]);
        setSeccionesMap(new Map(seccionesRes.data.map(s => [s.idSeccion, s.nombre])));
        setCursosMap(new Map(cursosRes.data.map(c => [c.idCurso, c.nombre])));
        setHorariosFullMap(new Map(horariosRes.data.map(h => [h.idHorario, h])));
        console.log("useEffect: Datos de referencia cargados exitosamente.");
      } catch (error) {
        console.error("Error al cargar nombres de secciones, cursos u horarios:", error);
        setMensaje({ type: "error", text: "Error al cargar datos iniciales." });
      }
    };
    fetchNombresData();
  }, []); // Se ejecuta una sola vez al montar el componente

  // Carga inicial de la lista de profesores para el dropdown
  useEffect(() => {
    const fetchProfesores = async () => {
      console.log("useEffect: Cargando lista de profesores...");
      try {
        const response = await axios.get("http://localhost:8080/api/profesores");
        setProfesores(response.data);
        console.log("useEffect: Lista de profesores cargada.");
      } catch (err) {
        console.error("Error al obtener profesores:", err);
        setMensaje({ type: "error", text: "Error al cargar la lista de profesores." });
      }
    };
    fetchProfesores();
  }, []); // Se ejecuta una sola vez al montar el componente

  // Función para cargar los detalles del profesor seleccionado y sus asignaciones
  const loadProfesorAndAssignments = useCallback(async () => {
    console.log("loadProfesorAndAssignments: Iniciando carga de datos para profesor:", selectedProfesorId);
    setMensaje({ type: "", text: "" });

    if (!selectedProfesorId) {
      setProfesorToModify({ nombre: "", apellido: "", dni: "", contrasena: "" });
      setProfesorSeccionesCursosAsignados([]);
      setSeccionesCursosDisponibles([]);
      setHorariosDisponibles([]);
      console.log("loadProfesorAndAssignments: No hay profesor seleccionado, limpiando estados.");
      return;
    }

    try {
      // 1. Obtener detalles del profesor
      const profesorRes = await axios.get(`http://localhost:8080/api/profesores/${selectedProfesorId}`);
      const { estado, ...restOfProfesorData } = profesorRes.data; // Ignorar el campo 'estado' si existe
      setProfesorToModify(restOfProfesorData);
      console.log("loadProfesorAndAssignments: Datos de profesor cargados:", restOfProfesorData);

      // 2. Obtener TODAS las secciones/cursos y horarios para la actualización más reciente
      const [seccionCursosRes, horariosRes] = await Promise.all([
        axios.get("http://localhost:8080/api/seccioncursos"),
        axios.get("http://localhost:8080/api/horarios"),
      ]);

      const allSeccionCursos = seccionCursosRes.data;
      const allHorarios = horariosRes.data;
      console.log("loadProfesorAndAssignments: Todas las secciones/cursos y horarios obtenidos.");

      // 3. Actualizar horariosFullMap con los datos más frescos antes de usarlos
      // Esto es crucial para que el mapa refleje los cambios recientes de asignación/desasignación
      const updatedHorariosFullMap = new Map(allHorarios.map(h => [h.idHorario, h]));
      setHorariosFullMap(updatedHorariosFullMap); // Actualiza el estado global de horariosFullMap

      // 4. Filtrar y mapear las asignaciones del profesor actual
      const asignadosSC = allSeccionCursos
        .filter(sc => sc.idProfesor === parseInt(selectedProfesorId))
        .map(sc => ({
          ...sc,
          nombreSeccion: seccionesMap.get(sc.idSeccion) || `Sección ID: ${sc.idSeccion}`,
          nombreCurso: cursosMap.get(sc.idCurso) || `Curso ID: ${sc.idCurso}`,
          // Usar updatedHorariosFullMap (la versión más reciente) para encontrar los detalles del horario
          horarioDetalles: sc.idHorario ? updatedHorariosFullMap.get(sc.idHorario) : null
        }));
      setProfesorSeccionesCursosAsignados(asignadosSC);
      console.log("loadProfesorAndAssignments: Asignaciones de profesor actualizadas:", asignadosSC);

      // 5. Filtrar secciones/cursos disponibles (sin profesor asignado)
      const disponiblesSC = allSeccionCursos.filter(sc => sc.idProfesor === null || sc.idProfesor === 0 || sc.idProfesor === undefined);
      setSeccionesCursosDisponibles(disponiblesSC.map(sc => ({
        ...sc,
        nombreSeccion: seccionesMap.get(sc.idSeccion) || `Sección ID: ${sc.idSeccion}`,
        nombreCurso: cursosMap.get(sc.idCurso) || `Curso ID: ${sc.idCurso}`
      })));
      console.log("loadProfesorAndAssignments: Secciones/cursos disponibles actualizadas.");

      // 6. Filtrar horarios disponibles (sin profesor asignado)
      // Nota: los horarios disponibles para el dropdown de "Asignar Nueva Sección/Curso y Horario"
      // se filtran en otro useEffect basado en `seccionCursoParaAsignar`.
      // Esta línea solo actualiza el estado general de horarios disponibles.
      setHorariosDisponibles(allHorarios.filter(h => h.idProfesor === null || h.idProfesor === 0 || h.idProfesor === undefined));
      console.log("loadProfesorAndAssignments: Horarios disponibles generales actualizados.");

    } catch (err) {
      console.error("loadProfesorAndAssignments: Error al cargar datos del profesor o asignaciones:", err);
      setMensaje({ type: "error", text: "Error al cargar los detalles del profesor y sus asignaciones." });
    }
  }, [selectedProfesorId, seccionesMap, cursosMap]); // Dependencias de useCallback. horariosFullMap se actualiza DENTRO de la función.

  // useEffect principal que dispara loadProfesorAndAssignments
  // Se ejecutará cuando cambie el profesor seleccionado o cuando los mapas de nombres se carguen inicialmente.
  useEffect(() => {
    console.log("useEffect (selectedProfesorId, mapas): Estado de dependencias:", { selectedProfesorId, seccionesMapSize: seccionesMap.size, cursosMapSize: cursosMap.size, horariosFullMapSize: horariosFullMap.size });
    // Solo llamar a loadProfesorAndAssignments si hay un profesor seleccionado y los mapas de nombres están cargados
    if (selectedProfesorId && seccionesMap.size > 0 && cursosMap.size > 0) {
      loadProfesorAndAssignments();
    } else if (!selectedProfesorId) {
       // Limpiar estados si no hay profesor seleccionado
       setProfesorToModify({ nombre: "", apellido: "", dni: "", contrasena: "" });
       setProfesorSeccionesCursosAsignados([]);
       setSeccionesCursosDisponibles([]);
       setHorariosDisponibles([]);
    }
  }, [selectedProfesorId, seccionesMap, cursosMap, loadProfesorAndAssignments]); // horariosFullMap se añadió aquí como dependencia para forzar un re-render si cambia, aunque loadProfesorAndAssignments ya lo actualiza. Es una medida extra si el render no se dispara.


  // useEffect para filtrar los horarios disponibles en el dropdown "Asignar Nueva Sección/Curso y Horario"
  // Esto se ejecuta cuando cambia la sección/curso seleccionada para asignar o cuando cambia el mapa de horarios.
  useEffect(() => {
    console.log("useEffect (seccionCursoParaAsignar, horariosFullMap): Filtrando horarios para asignación...");
    setHorarioParaAsignar(""); // Limpiar la selección de horario al cambiar la sección/curso
    if (!seccionCursoParaAsignar) {
      setHorariosDisponibles([]);
      return;
    }

    const fetchHorariosParaNuevaAsignacion = () => {
      try {
        const seccionCursoObj = seccionesCursosDisponibles.find(
          (sc) => sc.idSeccionCurso === parseInt(seccionCursoParaAsignar)
        );

        if (seccionCursoObj) {
          // Filtrar horarios que estén "libres" y que correspondan a la misma sección
          const disponibles = Array.from(horariosFullMap.values()).filter(
            (h) =>
              (h.idProfesor === null || h.idProfesor === 0 || h.idProfesor === undefined) &&
              h.idSeccion === seccionCursoObj.idSeccion
          );
          setHorariosDisponibles(disponibles);
          console.log("useEffect: Horarios disponibles para asignación:", disponibles);
        } else {
            setHorariosDisponibles([]);
            console.log("useEffect: Sección/curso seleccionada para asignar no encontrada.");
        }
      } catch (err) {
        console.error("Error al obtener horarios para nueva asignación:", err);
        setMensaje({ type: "error", text: "Error al cargar horarios disponibles para asignación." });
      }
    };

    // Solo ejecutar si los mapas de datos de referencia están cargados
    if (horariosFullMap.size > 0) { // Dependemos de que horariosFullMap ya esté poblado
      fetchHorariosParaNuevaAsignacion();
    }
  }, [seccionCursoParaAsignar, seccionesCursosDisponibles, horariosFullMap]);


  const handleProfesorSelectChange = (e) => {
    setSelectedProfesorId(e.target.value);
    console.log("Profesor seleccionado:", e.target.value);
  };

  const handleProfesorDetailsChange = (e) => {
    setProfesorToModify({ ...profesorToModify, [e.target.name]: e.target.value });
  };

  const handleUpdateProfesor = async (e) => {
    e.preventDefault();
    setMensaje({ type: "", text: "" });

    if (!selectedProfesorId) {
      setMensaje({ type: "error", text: "Por favor, seleccione un profesor para modificar." });
      return;
    }

    try {
      const { estado, ...profesorDataToSend } = profesorToModify; // Asegurarse de no enviar 'estado'
      await axios.put(`http://localhost:8080/api/profesores/${selectedProfesorId}`, profesorDataToSend);
      setMensaje({ type: "success", text: "Datos del profesor actualizados exitosamente." });
      loadProfesorAndAssignments(); // Refrescar la UI
      console.log("Datos del profesor actualizados. Disparando loadProfesorAndAssignments().");
    } catch (err) {
      console.error("Error al actualizar profesor:", err);
      setMensaje({ type: "error", text: `Error al actualizar profesor: ${err.message || err.response?.data || "Verifique la consola."}` });
    }
  };

  const handleUnassignCombined = async (seccionCursoId) => {
    console.log("Intentando desasignar sección/curso ID:", seccionCursoId);
    setMensaje({ type: "", text: "" });
    try {
      const scToUnassign = profesorSeccionesCursosAsignados.find(sc => sc.idSeccionCurso === seccionCursoId);
      if (!scToUnassign) {
        setMensaje({ type: "error", text: "Error: Asignación de sección/curso no encontrada para desasignar." });
        return;
      }

      // 1. Prepara y envía la actualización para seccion_curso (idProfesor = null, idHorario = null)
      const cleanedSeccionCurso = {
        idSeccionCurso: scToUnassign.idSeccionCurso,
        idSeccion: scToUnassign.idSeccion,
        idCurso: scToUnassign.idCurso,
        idProfesor: null, // Desasignar profesor
        idHorario: null // Desasignar horario de seccion_curso
      };
      console.log("Desasignando SeccionCurso:", cleanedSeccionCurso);
      await axios.put(`http://localhost:8080/api/seccioncursos/${seccionCursoId}`, cleanedSeccionCurso);

      let successMessage = "Sección/Curso desasignada exitosamente.";

      // 2. Si también había un horario asociado, desasignarlo del horario
      if (scToUnassign.idHorario) {
        const horarioActual = horariosFullMap.get(scToUnassign.idHorario);
        if (horarioActual) {
          const cleanedHorario = {
            idHorario: horarioActual.idHorario,
            hora: horarioActual.hora,
            dia: horarioActual.dia,
            idSeccion: horarioActual.idSeccion,
            idProfesor: null // Desasignar profesor del horario
          };
          console.log("Desasignando Horario:", cleanedHorario);
          await axios.put(`http://localhost:8080/api/horarios/${scToUnassign.idHorario}`, cleanedHorario);
          successMessage = "Sección/Curso y Horario asociados desasignados exitosamente.";
        } else {
          successMessage += " (Advertencia: El horario asociado no se encontró para desasignar directamente de la tabla de horarios.)";
        }
      }

      setMensaje({ type: "success", text: successMessage });
      loadProfesorAndAssignments(); // Refrescar la UI
      console.log("Desasignación completa. Disparando loadProfesorAndAssignments().");

    } catch (err) {
      console.error("Error al desasignar sección/curso o horario asociado:", err);
      let errorMessage = `Error al desasignar: ${err.message || err.response?.data || "Verifique la consola del navegador y el estado del backend."}`;
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = `Error 404 (Not Found): El recurso (sección/curso o horario) no existe en el servidor o la ruta es incorrecta. Revise IDs o rutas de la API.`;
        } else if (err.response.status === 400) {
          errorMessage = `Error 400 (Bad Request): Verifique los datos enviados a la API.`;
        } else if (err.response.data) {
          errorMessage += ` Detalles del servidor: ${JSON.stringify(err.response.data)}`;
        }
      }
      setMensaje({ type: "error", text: errorMessage });
    }
  };

  const handleAssignNewSeccionCursoHorario = async (e) => {
    e.preventDefault();
    console.log("Intentando asignar nueva sección/curso y horario...");
    setMensaje({ type: "", text: "" });

    if (!selectedProfesorId || !seccionCursoParaAsignar || !horarioParaAsignar) {
      setMensaje({ type: "error", text: "Por favor, seleccione un profesor, una sección/curso y un horario." });
      return;
    }

    try {
      // 1. Encuentra la sección/curso seleccionada de la lista de disponibles
      const seccionCursoToUpdate = seccionesCursosDisponibles.find(
        (sc) => sc.idSeccionCurso === parseInt(seccionCursoParaAsignar)
      );

      if (!seccionCursoToUpdate) {
        throw new Error(`Sección/Curso con ID ${seccionCursoParaAsignar} no encontrada en la lista de disponibles.`);
      }

      // 2. Prepara y envía la actualización para seccion_curso (asignar profesor y horario)
      const cleanedSeccionCurso = {
        idSeccionCurso: seccionCursoToUpdate.idSeccionCurso,
        idSeccion: seccionCursoToUpdate.idSeccion,
        idCurso: seccionCursoToUpdate.idCurso,
        idProfesor: parseInt(selectedProfesorId), // Asignar profesor
        idHorario: parseInt(horarioParaAsignar), // Asignar horario
      };
      console.log("Asignando SeccionCurso:", cleanedSeccionCurso);
      await axios.put(
        `http://localhost:8080/api/seccioncursos/${seccionCursoToUpdate.idSeccionCurso}`,
        cleanedSeccionCurso
      );

      // 3. Encuentra el horario seleccionado de la lista de disponibles
      const horarioToUpdate = horariosDisponibles.find(
        (h) => h.idHorario === parseInt(horarioParaAsignar)
      );
      if (!horarioToUpdate) {
        throw new Error("Horario seleccionado no encontrado para asignación.");
      }

      // 4. Prepara y envía la actualización para horario (asignar profesor)
      const cleanedHorario = {
        idHorario: horarioToUpdate.idHorario,
        hora: horarioToUpdate.hora,
        dia: horarioToUpdate.dia,
        idSeccion: horarioToUpdate.idSeccion,
        idProfesor: parseInt(selectedProfesorId) // Asignar profesor al horario
      };
      console.log("Asignando Horario:", cleanedHorario);
      await axios.put(
        `http://localhost:8080/api/horarios/${horarioToUpdate.idHorario}`,
        cleanedHorario
      );

      setMensaje({ type: "success", text: "Nueva sección/curso y horario asignados exitosamente." });
      setSeccionCursoParaAsignar(""); // Limpiar el campo de selección
      setHorarioParaAsignar(""); // Limpiar el campo de selección
      loadProfesorAndAssignments(); // Refrescar la UI
      console.log("Asignación completa. Disparando loadProfesorAndAssignments().");

    } catch (err) {
      console.error("Error al asignar nueva sección/curso y horario:", err);
      let errorMessage = `Error al asignar: ${err.message || err.response?.data || "Verifique la consola."}`;
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = `Error 404 (Not Found): El recurso (sección/curso o horario) no fue encontrado. Asegúrese de que existe y está disponible.`;
        } else if (err.response.status === 400) {
          errorMessage = `Error 400 (Bad Request): Datos de asignación incorrectos.`;
        }
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
              <li className="activo" onClick={() => navigate("/AdminProfesoresModificar")}>Modificar Profesor</li>
              <li onClick={() => navigate("/AdminProfesoresEliminar")}>Eliminar Profesor</li>
            </ul>
          </li>
          <li className="cerrar-sesion" onClick={() => { localStorage.clear(); navigate("/"); }}>Cerrar sesión</li>
        </ul>
      </aside>

      <div className="contenido-principal">
        <main className="contenido-profesor">
          <h1>Modificar Profesor y Asignaciones</h1>
          {mensaje.text && (
            <div className={`mensaje ${mensaje.type === "success" ? "mensaje-exito" : "mensaje-error"}`}>
              {mensaje.text}
            </div>
          )}

          <div className="grupo">
            <label htmlFor="selectProfesor">Seleccionar Profesor</label>
            <select
              id="selectProfesor"
              value={selectedProfesorId}
              onChange={handleProfesorSelectChange}
            >
              <option value="">-- Seleccione un Profesor --</option>
              {profesores.map((prof) => (
                <option key={prof.idProfesor} value={prof.idProfesor}>
                  {prof.nombre} {prof.apellido} ({prof.dni})
                </option>
              ))}
            </select>
          </div>

          {selectedProfesorId && (
            <>
              <section className="modification-form">
                <h2>Datos del Profesor</h2>
                <form onSubmit={handleUpdateProfesor}>
                  <div className="grupo">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={profesorToModify.nombre}
                      onChange={handleProfesorDetailsChange}
                      required
                    />
                  </div>
                  <div className="grupo">
                    <label htmlFor="apellido">Apellido</label>
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      value={profesorToModify.apellido}
                      onChange={handleProfesorDetailsChange}
                      required
                    />
                  </div>
                  <div className="grupo">
                    <label htmlFor="dni">DNI</label>
                    <input
                      type="text"
                      id="dni"
                      name="dni"
                      value={profesorToModify.dni}
                      onChange={handleProfesorDetailsChange}
                      required
                    />
                  </div>
                  <div className="grupo">
                    <label htmlFor="contrasena">Contraseña</label>
                    <input
                      type="password"
                      id="contrasena"
                      name="contrasena"
                      value={profesorToModify.contrasena}
                      onChange={handleProfesorDetailsChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-registrar">Actualizar Datos</button>
                </form>
              </section>

              <section className="assignment-section">
                <h2>Asignaciones de Secciones/Cursos y Horarios</h2>
                {profesorSeccionesCursosAsignados.length > 0 ? (
                  <ul className="assignment-list">
                    {profesorSeccionesCursosAsignados.map((sc) => (
                      <li key={sc.idSeccionCurso} className="assignment-item">
                        <span>
                          Sección: {sc.nombreSeccion} - Curso: {sc.nombreCurso}
                          {sc.horarioDetalles && ` (Horario: ${sc.horarioDetalles.dia} - ${sc.horarioDetalles.hora})`}
                        </span>
                        <button
                          onClick={() => handleUnassignCombined(sc.idSeccionCurso)}
                          className="delete-button"
                        >
                          Desasignar
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Este profesor no tiene secciones/cursos asignados.</p>
                )}
              </section>

              <section className="assignment-section assignment-form">
                <h2>Asignar Nueva Sección/Curso y Horario</h2>
                <form onSubmit={handleAssignNewSeccionCursoHorario}>
                  <div className="grupo">
                    <label htmlFor="seccionCursoAsignar">Sección/Curso Disponible</label>
                    <select
                      id="seccionCursoAsignar"
                      value={seccionCursoParaAsignar}
                      onChange={(e) => setSeccionCursoParaAsignar(e.target.value)}
                      required
                    >
                      <option value="">-- Seleccione una Sección/Curso --</option>
                      {seccionesCursosDisponibles.length > 0 ? (
                        seccionesCursosDisponibles.map((sc) => (
                          <option key={sc.idSeccionCurso} value={sc.idSeccionCurso}>
                            Sección: {sc.nombreSeccion} - Curso: {sc.nombreCurso}
                          </option>
                        ))
                      ) : (
                        <option disabled>No hay secciones/cursos disponibles para asignar</option>
                      )}
                    </select>
                  </div>

                  <div className="grupo">
                    <label htmlFor="horarioAsignar">Horario Disponible</label>
                    <select
                      id="horarioAsignar"
                      value={horarioParaAsignar}
                      onChange={(e) => setHorarioParaAsignar(e.target.value)}
                      disabled={!seccionCursoParaAsignar || horariosDisponibles.length === 0}
                      required
                    >
                      <option value="">-- Seleccione un Horario --</option>
                      {horariosDisponibles.length > 0 ? (
                        horariosDisponibles.map((h) => (
                          <option key={h.idHorario} value={h.idHorario}>
                            {h.dia} - {h.hora}
                          </option>
                        ))
                      ) : (
                        <option disabled>Seleccione una sección/curso para ver horarios</option>
                      )}
                    </select>
                  </div>
                  <button type="submit" className="btn-assign">Asignar Sección/Curso y Horario</button>
                </form>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProfesoresModificar;