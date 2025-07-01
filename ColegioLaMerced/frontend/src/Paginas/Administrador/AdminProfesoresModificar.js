import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Administrador/AdminProfesores.css";

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

  const [seccionesMap, setSeccionesMap] = useState(new Map());
  const [cursosMap, setCursosMap] = useState(new Map());
  const [horariosFullMap, setHorariosFullMap] = useState(new Map());

  // Función para cargar la lista de profesores (reutilizable)
  const fetchProfesores = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/profesores");
      setProfesores(response.data);
    } catch (err) {
      setMensaje({ type: "error", text: "Error al cargar la lista de profesores." });
    }
  }, []); // Sin dependencias, ya que solo carga la lista de profesores

  useEffect(() => {
    // Carga los datos de nombres iniciales (secciones, cursos, horarios)
    const fetchNombresData = async () => {
      try {
        const [seccionesRes, cursosRes, horariosRes] = await Promise.all([
          axios.get("http://localhost:8080/api/secciones"),
          axios.get("http://localhost:8080/api/cursos"),
          axios.get("http://localhost:8080/api/horarios"),
        ]);
        setSeccionesMap(new Map(seccionesRes.data.map(s => [s.idSeccion, s.nombre])));
        setCursosMap(new Map(cursosRes.data.map(c => [c.idCurso, c.nombre])));
        setHorariosFullMap(new Map(horariosRes.data.map(h => [h.idHorario, h])));
      } catch (error) {
        setMensaje({ type: "error", text: "Error al cargar datos iniciales." });
      }
    };
    fetchNombresData();
  }, []);

  useEffect(() => {
    // Carga la lista de profesores al montar el componente
    fetchProfesores();
  }, [fetchProfesores]); // `fetchProfesores` es una dependencia del useCallback

  const loadProfesorAndAssignments = useCallback(async () => {
    setMensaje({ type: "", text: "" });

    if (!selectedProfesorId) {
      setProfesorToModify({ nombre: "", apellido: "", dni: "", contrasena: "" });
      setProfesorSeccionesCursosAsignados([]);
      setSeccionesCursosDisponibles([]);
      setHorariosDisponibles([]);
      return;
    }

    try {
      const profesorRes = await axios.get(`http://localhost:8080/api/profesores/${selectedProfesorId}`);
      const { estado, ...restOfProfesorData } = profesorRes.data;
      setProfesorToModify(restOfProfesorData);

      const [seccionCursosRes, horariosRes] = await Promise.all([
        axios.get("http://localhost:8080/api/seccioncursos"),
        axios.get("http://localhost:8080/api/horarios"),
      ]);

      const allSeccionCursos = seccionCursosRes.data;
      const allHorarios = horariosRes.data;

      const updatedHorariosFullMap = new Map(allHorarios.map(h => [h.idHorario, h]));
      setHorariosFullMap(updatedHorariosFullMap);

      const asignadosSC = allSeccionCursos
        .filter(sc => sc.idProfesor === parseInt(selectedProfesorId))
        .map(sc => ({
          ...sc,
          nombreSeccion: seccionesMap.get(sc.idSeccion) || `Sección ID: ${sc.idSeccion}`,
          nombreCurso: cursosMap.get(sc.idCurso) || `Curso ID: ${sc.idCurso}`,
          horarioDetalles: sc.idHorario ? updatedHorariosFullMap.get(sc.idHorario) : null
        }));
      setProfesorSeccionesCursosAsignados(asignadosSC);

      const disponiblesSC = allSeccionCursos.filter(sc => sc.idProfesor === null || sc.idProfesor === 0 || sc.idProfesor === undefined);
      setSeccionesCursosDisponibles(disponiblesSC.map(sc => ({
        ...sc,
        nombreSeccion: seccionesMap.get(sc.idSeccion) || `Sección ID: ${sc.idSeccion}`,
        nombreCurso: cursosMap.get(sc.idCurso) || `Curso ID: ${sc.idCurso}`
      })));

      setHorariosDisponibles(allHorarios.filter(h => h.idProfesor === null || h.idProfesor === 0 || h.idProfesor === undefined));

    } catch (err) {
      setMensaje({ type: "error", text: "Error al cargar los detalles del profesor y sus asignaciones." });
    }
  }, [selectedProfesorId, seccionesMap, cursosMap]);

  useEffect(() => {
    if (selectedProfesorId && seccionesMap.size > 0 && cursosMap.size > 0) {
      loadProfesorAndAssignments();
    } else if (!selectedProfesorId) {
      setProfesorToModify({ nombre: "", apellido: "", dni: "", contrasena: "" });
      setProfesorSeccionesCursosAsignados([]);
      setSeccionesCursosDisponibles([]);
      setHorariosDisponibles([]);
    }
  }, [selectedProfesorId, seccionesMap, cursosMap, loadProfesorAndAssignments]);

  useEffect(() => {
    setHorarioParaAsignar("");
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
          const disponibles = Array.from(horariosFullMap.values()).filter(
            (h) =>
              (h.idProfesor === null || h.idProfesor === 0 || h.idProfesor === undefined) &&
              h.idSeccion === seccionCursoObj.idSeccion
          );
          setHorariosDisponibles(disponibles);
        } else {
            setHorariosDisponibles([]);
        }
      } catch (err) {
        setMensaje({ type: "error", text: "Error al cargar horarios disponibles para asignación." });
      }
    };

    if (horariosFullMap.size > 0) {
      fetchHorariosParaNuevaAsignacion();
    }
  }, [seccionCursoParaAsignar, seccionesCursosDisponibles, horariosFullMap]);

  const handleProfesorSelectChange = (e) => {
    setSelectedProfesorId(e.target.value);
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
      const profesorDataToSend = {
        ...profesorToModify,
        estado: "activo"
      };

      await axios.put(`http://localhost:8080/api/profesores/${selectedProfesorId}`, profesorDataToSend);
      setMensaje({ type: "success", text: "Datos del profesor actualizados exitosamente." });
      loadProfesorAndAssignments(); // Esto carga los detalles del profesor modificado
      fetchProfesores(); // ¡ACTUALIZA LA LISTA DE PROFESORES EN EL SELECT!
    } catch (err) {
      let errorMessage = `Error al actualizar profesor: ${err.message || err.response?.data || "Verifique la consola."}`;
      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${err.response.data || err.message}`;
      }
      setMensaje({ type: "error", text: errorMessage });
    }
  };

  const handleUnassignCombined = async (seccionCursoId) => {
    setMensaje({ type: "", text: "" });
    try {
      const scToUnassign = profesorSeccionesCursosAsignados.find(sc => sc.idSeccionCurso === seccionCursoId);
      if (!scToUnassign) {
        setMensaje({ type: "error", text: "Error: Asignación de sección/curso no encontrada para desasignar." });
        return;
      }

      const cleanedSeccionCurso = {
        idSeccionCurso: scToUnassign.idSeccionCurso,
        idSeccion: scToUnassign.idSeccion,
        idCurso: scToUnassign.idCurso,
        idProfesor: null,
        idHorario: null
      };
      await axios.put(`http://localhost:8080/api/seccioncursos/${seccionCursoId}`, cleanedSeccionCurso);

      let successMessage = "Sección/Curso desasignada exitosamente.";

      if (scToUnassign.idHorario) {
        const horarioActual = horariosFullMap.get(scToUnassign.idHorario);
        if (horarioActual) {
          const cleanedHorario = {
            idHorario: horarioActual.idHorario,
            hora: horarioActual.hora,
            dia: horarioActual.dia,
            idSeccion: horarioActual.idSeccion,
            idProfesor: null
          };
          await axios.put(`http://localhost:8080/api/horarios/${scToUnassign.idHorario}`, cleanedHorario);
          successMessage = "Sección/Curso y Horario asociados desasignados exitosamente.";
        } else {
          successMessage += " (Advertencia: El horario asociado no se encontró para desasignar directamente de la tabla de horarios.)";
        }
      }

      setMensaje({ type: "success", text: successMessage });
      loadProfesorAndAssignments();

    } catch (err) {
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
    setMensaje({ type: "", text: "" });

    if (!selectedProfesorId || !seccionCursoParaAsignar || !horarioParaAsignar) {
      setMensaje({ type: "error", text: "Por favor, seleccione un profesor, una sección/curso y un horario." });
      return;
    }

    try {
      const seccionCursoToUpdate = seccionesCursosDisponibles.find(
        (sc) => sc.idSeccionCurso === parseInt(seccionCursoParaAsignar)
      );

      if (!seccionCursoToUpdate) {
        throw new Error(`Sección/Curso con ID ${seccionCursoParaAsignar} no encontrada en la lista de disponibles.`);
      }

      const cleanedSeccionCurso = {
        idSeccionCurso: seccionCursoToUpdate.idSeccionCurso,
        idSeccion: seccionCursoToUpdate.idSeccion,
        idCurso: seccionCursoToUpdate.idCurso,
        idProfesor: parseInt(selectedProfesorId),
        idHorario: parseInt(horarioParaAsignar),
      };
      await axios.put(
        `http://localhost:8080/api/seccioncursos/${seccionCursoToUpdate.idSeccionCurso}`,
        cleanedSeccionCurso
      );

      const horarioToUpdate = horariosDisponibles.find(
        (h) => h.idHorario === parseInt(horarioParaAsignar)
      );
      if (!horarioToUpdate) {
        throw new Error("Horario seleccionado no encontrado para asignación.");
      }

      const cleanedHorario = {
        idHorario: horarioToUpdate.idHorario,
        hora: horarioToUpdate.hora,
        dia: horarioToUpdate.dia,
        idSeccion: horarioToUpdate.idSeccion,
        idProfesor: parseInt(selectedProfesorId)
      };
      await axios.put(
        `http://localhost:8080/api/horarios/${horarioToUpdate.idHorario}`,
        cleanedHorario
      );

      setMensaje({ type: "success", text: "Nueva sección/curso y horario asignados exitosamente." });
      setSeccionCursoParaAsignar("");
      setHorarioParaAsignar("");
      loadProfesorAndAssignments();

    } catch (err) {
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