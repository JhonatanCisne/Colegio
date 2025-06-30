import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Administrador/AdminProfesores.css"; // Asegúrate de que este CSS tenga estilos para los nuevos botones en el sidebar

const AdminProfesores = () => {
  const navigate = useNavigate();
  const [profesor, setProfesor] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    contrasena: "",
  });
  const [mensaje, setMensaje] = useState({ type: "", text: "" });

  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [profesorIdParaAsignar, setProfesorIdParaAsignar] = useState(null);

  const [seccionesCursosDisponibles, setSeccionesCursosDisponibles] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [seccionCursoSeleccionada, setSeccionCursoSeleccionada] = useState("");
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");

  const [seccionesMap, setSeccionesMap] = useState(new Map());
  const [cursosMap, setCursosMap] = useState(new Map());

  useEffect(() => {
    const fetchNombresData = async () => {
      try {
        const [seccionesRes, cursosRes] = await Promise.all([
          axios.get("http://localhost:8080/api/secciones"),
          axios.get("http://localhost:8080/api/cursos"),
        ]);

        const newSeccionesMap = new Map(seccionesRes.data.map(s => [s.idSeccion, s.nombre]));
        const newCursosMap = new Map(cursosRes.data.map(c => [c.idCurso, c.nombre]));

        setSeccionesMap(newSeccionesMap);
        setCursosMap(newCursosMap);
      } catch (error) {
        console.error("Error al cargar nombres de secciones o cursos:", error);
        setMensaje({ type: "error", text: "Error al cargar datos de secciones y cursos." });
      }
    };
    fetchNombresData();
  }, []);

  const fetchSeccionesCursos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/seccioncursos");
      const disponibles = response.data.filter(
        (sc) => sc.idProfesor === null || sc.idProfesor === 0 || sc.idProfesor === undefined
      );

      const disponiblesConNombres = disponibles.map(sc => ({
        ...sc,
        nombreSeccion: seccionesMap.get(sc.idSeccion) || `Sección ID: ${sc.idSeccion}`,
        nombreCurso: cursosMap.get(sc.idCurso) || `Curso ID: ${sc.idCurso}`
      }));
      setSeccionesCursosDisponibles(disponiblesConNombres);
    } catch (err) {
      console.error("Error al obtener secciones de cursos:", err);
      setMensaje({ type: "error", text: "Error al cargar secciones de cursos disponibles." });
    }
  };

  useEffect(() => {
    if (showAsignarModal && seccionesMap.size > 0 && cursosMap.size > 0) {
      fetchSeccionesCursos();
    }
  }, [showAsignarModal, seccionesMap, cursosMap]);

  useEffect(() => {
    const fetchHorarios = async () => {
      setHorariosDisponibles([]);
      setHorarioSeleccionado("");

      if (seccionCursoSeleccionada) {
        try {
          const response = await axios.get("http://localhost:8080/api/horarios");
          const seccionCursoObj = seccionesCursosDisponibles.find(
            (sc) => sc.idSeccionCurso === parseInt(seccionCursoSeleccionada)
          );

          if (seccionCursoObj) {
            const disponibles = response.data.filter(
              (h) =>
                (h.idProfesor === null || h.idProfesor === 0 || h.idProfesor === undefined) &&
                h.idSeccion === seccionCursoObj.idSeccion
            );
            setHorariosDisponibles(disponibles);
          }
        } catch (err) {
          console.error("Error al obtener horarios:", err);
          setMensaje({ type: "error", text: "Error al cargar horarios disponibles." });
        }
      }
    };

    if (showAsignarModal) {
      fetchHorarios();
    }
  }, [seccionCursoSeleccionada, seccionesCursosDisponibles, showAsignarModal]);

  const handleChange = (e) => {
    setProfesor({ ...profesor, [e.target.name]: e.target.value });
  };

  const handleCrearProfesor = async (e) => {
    e.preventDefault();
    setMensaje({ type: "", text: "" });

    try {
      const newProfesorData = {
        nombre: profesor.nombre,
        apellido: profesor.apellido,
        dni: profesor.dni,
        contrasena: profesor.contrasena,
        estado: "Activo",
      };
      const resProfesor = await axios.post("http://localhost:8080/api/profesores", newProfesorData);
      const idNuevoProfesor = resProfesor.data.idProfesor;

      setProfesorIdParaAsignar(idNuevoProfesor);
      setShowAsignarModal(true);

      setMensaje({ type: "success", text: "Profesor creado exitosamente. Ahora asigne un curso y horario." });
      setProfesor({
        nombre: "",
        apellido: "",
        dni: "",
        contrasena: "",
      });
    } catch (err) {
      console.error("Error al crear profesor:", err);
      setMensaje({ type: "error", text: `Error al crear profesor: ${err.message || err.response?.data || "Verifique la consola."}` });
    }
  };

  const handleAsignarCursoHorario = async (e) => {
    e.preventDefault();
    setMensaje({ type: "", text: "" });

    if (!seccionCursoSeleccionada || !horarioSeleccionado) {
      setMensaje({ type: "error", text: "Por favor, seleccione una Sección/Curso y un Horario." });
      return;
    }

    try {
      const seccionCursoToUpdate = seccionesCursosDisponibles.find(
        (sc) => sc.idSeccionCurso === parseInt(seccionCursoSeleccionada)
      );

      if (seccionCursoToUpdate) {
        const updatedSeccionCurso = {
          ...seccionCursoToUpdate,
          idProfesor: profesorIdParaAsignar,
          idHorario: parseInt(horarioSeleccionado)
        };
        delete updatedSeccionCurso.nombreSeccion;
        delete updatedSeccionCurso.nombreCurso;

        await axios.put(
          `http://localhost:8080/api/seccioncursos/${seccionCursoToUpdate.idSeccionCurso}`,
          updatedSeccionCurso
        );
      } else {
        throw new Error(`Sección/Curso con ID ${seccionCursoSeleccionada} no encontrada en la lista de disponibles.`);
      }

      const horarioToUpdate = horariosDisponibles.find(
        (h) => h.idHorario === parseInt(horarioSeleccionado)
      );
      if (horarioToUpdate) {
        const updatedHorario = { ...horarioToUpdate, idProfesor: profesorIdParaAsignar };
        await axios.put(
          `http://localhost:8080/api/horarios/${horarioToUpdate.idHorario}`,
          updatedHorario
        );
      } else {
        throw new Error("Horario seleccionado no encontrado.");
      }

      setMensaje({ type: "success", text: "Curso y horario asignados exitosamente." });
      setShowAsignarModal(false);
      setProfesorIdParaAsignar(null);
      setSeccionCursoSeleccionada("");
      setHorarioSeleccionado("");
      fetchSeccionesCursos();
      setHorariosDisponibles([]);
    } catch (err) {
      console.error("Error al asignar curso/horario:", err);
      let errorMessage = `Error al asignar curso y horario: ${err.message || "Verifique la consola."}`;
      if (err.response && err.response.status === 404) {
        errorMessage = `Error 404: El recurso no fue encontrado en el servidor. Esto puede significar que el ID de la Sección/Curso (${seccionCursoSeleccionada}) no existe o no está disponible en el backend para ser actualizado.`;
      }
      setMensaje({ type: "error", text: errorMessage });
    }
  };

  const closeModal = () => {
    setShowAsignarModal(false);
    setProfesorIdParaAsignar(null);
    setSeccionCursoSeleccionada("");
    setHorarioSeleccionado("");
    setMensaje({ type: "", text: "" });
  };

  return (
    <div className="contenedor-principal">
      <aside className="sidebar">
        <h2>Panel</h2>
        <ul>
          <li onClick={() => navigate("/AdminAlumnos")}>Alumnos</li>
          {/* Sección de Profesores con sub-navegación */}
          <li className="parent-menu-item">
            Profesores
            <ul>
              <li className="activo" onClick={() => navigate("/AdminProfesores")}>Crear Profesor</li>
              <li onClick={() => navigate("/AdminProfesoresVer")}>Ver Profesores</li>
              <li onClick={() => navigate("/AdminProfesoresModificar")}>Modificar Profesor</li>
              <li onClick={() => navigate("/AdminProfesoresEliminar")}>Eliminar Profesor</li>
            </ul>
          </li>
          <li className="cerrar-sesion" onClick={() => { localStorage.clear(); navigate("/"); }}>Cerrar sesión</li>
        </ul>
      </aside>

      <div className="contenido-principal">
        <main className="contenido-profesor">
          <h2>Registrar Nuevo Profesor</h2>
          {mensaje.text && mensaje.type !== "modal-error" && (
            <div className={`mensaje ${mensaje.type === "success" ? "mensaje-exito" : "mensaje-error"}`}>
              {mensaje.text}
            </div>
          )}
          <form onSubmit={handleCrearProfesor}>
            <div className="grupo">
              <label htmlFor="nombre">Nombre</label>
              <input type="text" id="nombre" name="nombre" value={profesor.nombre} onChange={handleChange} required />
            </div>
            <div className="grupo">
              <label htmlFor="apellido">Apellido</label>
              <input type="text" id="apellido" name="apellido" value={profesor.apellido} onChange={handleChange} required />
            </div>
            <div className="grupo">
              <label htmlFor="dni">DNI</label>
              <input type="text" id="dni" name="dni" value={profesor.dni} onChange={handleChange} required />
            </div>
            <div className="grupo">
              <label htmlFor="contrasena">Contraseña</label>
              <input type="password" id="contrasena" name="contrasena" value={profesor.contrasena} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-registrar">Crear Profesor</button>
          </form>
        </main>
      </div>

      {showAsignarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Asignar Curso y Horario al Nuevo Profesor</h3>
            {mensaje.text && mensaje.type === "error" && (
              <div className="mensaje mensaje-error">
                {mensaje.text}
              </div>
            )}
            <form onSubmit={handleAsignarCursoHorario}>
              <div className="grupo">
                <label htmlFor="seccionCursoModal">Asignar Sección/Curso Disponible</label>
                <select
                  id="seccionCursoModal"
                  value={seccionCursoSeleccionada}
                  onChange={(e) => setSeccionCursoSeleccionada(e.target.value)}
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
                    <option disabled>Cargando... o No hay secciones/cursos disponibles</option>
                  )}
                </select>
              </div>

              <div className="grupo">
                <label htmlFor="horarioModal">Asignar Horario Disponible</label>
                <select
                  id="horarioModal"
                  value={horarioSeleccionado}
                  onChange={(e) => setHorarioSeleccionado(e.target.value)}
                  disabled={!seccionCursoSeleccionada || horariosDisponibles.length === 0}
                  required
                >
                  <option value="">-- Seleccione un Horario --</option>
                  {horariosDisponibles.length > 0 ? (
                    horariosDisponibles.map((h) => (
                      <option key={h.idHorario} value={h.idHorario}>
                        {h.dia} {h.hora}
                      </option>
                    ))
                  ) : (
                    <option disabled>Seleccione una sección/curso para ver horarios</option>
                  )}
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-asignar">Asignar</button>
                <button type="button" className="btn-cancelar" onClick={closeModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfesores;