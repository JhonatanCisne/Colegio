import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Administrador/AdminProfesores.css"; // Reutilizamos los estilos existentes

const AdminProfesoresEliminar = () => {
  const navigate = useNavigate();
  const [profesores, setProfesores] = useState([]); // Lista de todos los profesores
  const [selectedProfesorId, setSelectedProfesorId] = useState(""); // ID del profesor seleccionado para eliminar
  const [profesorDetails, setProfesorDetails] = useState(null); // Detalles del profesor seleccionado
  const [mensaje, setMensaje] = useState({ type: "", text: "" });

  // --- useEffect para cargar todos los profesores ---
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/profesores");
        setProfesores(response.data);
      } catch (err) {
        console.error("Error al obtener profesores:", err);
        setMensaje({ type: "error", text: "Error al cargar la lista de profesores." });
      }
    };
    fetchProfesores();
  }, []);

  // --- useEffect para cargar detalles del profesor seleccionado ---
  useEffect(() => {
    const fetchProfesorDetails = async () => {
      setMensaje({ type: "", text: "" }); // Limpiar mensajes
      if (selectedProfesorId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/profesores/${selectedProfesorId}`);
          setProfesorDetails(response.data);
        } catch (err) {
          console.error("Error al obtener detalles del profesor:", err);
          setMensaje({ type: "error", text: "Error al cargar detalles del profesor." });
          setProfesorDetails(null);
        }
      } else {
        setProfesorDetails(null); // Limpiar detalles si no hay profesor seleccionado
      }
    };
    fetchProfesorDetails();
  }, [selectedProfesorId]);

  const handleProfesorSelectChange = (e) => {
    setSelectedProfesorId(e.target.value);
  };

  const handleEliminarProfesor = async () => {
    setMensaje({ type: "", text: "" });

    if (!selectedProfesorId) {
      setMensaje({ type: "error", text: "Por favor, seleccione un profesor para eliminar." });
      return;
    }

    const confirmacion = window.confirm(
      `¿Está seguro de que desea eliminar al profesor ${profesorDetails?.nombre} ${profesorDetails?.apellido} (DNI: ${profesorDetails?.dni})? Esta acción desvinculará sus cursos y horarios y es irreversible.`
    );

    if (!confirmacion) {
      return; // El usuario canceló la eliminación
    }

    try {
      // Paso 1: Desvincular al profesor de todas las secciones/cursos asignadas
      const seccionCursosRes = await axios.get("http://localhost:8080/api/seccioncursos");
      const seccionCursosAsignados = seccionCursosRes.data.filter(
        (sc) => sc.idProfesor === parseInt(selectedProfesorId)
      );

      for (const sc of seccionCursosAsignados) {
        const updatedSeccionCurso = { ...sc, idProfesor: null, idHorario: null };
        delete updatedSeccionCurso.nombreSeccion; // Asegurarse de quitar propiedades no mapeadas por el backend
        delete updatedSeccionCurso.nombreCurso;
        await axios.put(`http://localhost:8080/api/seccioncursos/${sc.idSeccionCurso}`, updatedSeccionCurso);
      }

      // Paso 2: Desvincular al profesor de todos los horarios asignados
      const horariosRes = await axios.get("http://localhost:8080/api/horarios");
      const horariosAsignados = horariosRes.data.filter(
        (h) => h.idProfesor === parseInt(selectedProfesorId)
      );

      for (const h of horariosAsignados) {
        const updatedHorario = { ...h, idProfesor: null };
        await axios.put(`http://localhost:8080/api/horarios/${h.idHorario}`, updatedHorario);
      }

      // Paso 3: Eliminar al profesor
      await axios.delete(`http://localhost:8080/api/profesores/${selectedProfesorId}`);

      setMensaje({ type: "success", text: "Profesor y sus asignaciones eliminados exitosamente." });
      setSelectedProfesorId(""); // Limpiar la selección
      setProfesorDetails(null); // Limpiar detalles
      // Recargar la lista de profesores para que el eliminado ya no aparezca
      const response = await axios.get("http://localhost:8080/api/profesores");
      setProfesores(response.data);
    } catch (err) {
      console.error("Error al eliminar profesor o sus asignaciones:", err);
      setMensaje({ type: "error", text: `Error al eliminar profesor: ${err.message || err.response?.data || "Verifique la consola."}` });
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
              <li className="activo" onClick={() => navigate("/AdminProfesoresEliminar")}>Eliminar Profesor</li>
            </ul>
          </li>
          <li className="cerrar-sesion" onClick={() => { localStorage.clear(); navigate("/"); }}>Cerrar sesión</li>
        </ul>
      </aside>

      <div className="contenido-principal">
        <main className="contenido-profesor">
          <h1>Eliminar Profesor</h1>
          {mensaje.text && (
            <div className={`mensaje ${mensaje.type === "success" ? "mensaje-exito" : "mensaje-error"}`}>
              {mensaje.text}
            </div>
          )}

          <div className="grupo">
            <label htmlFor="selectProfesor">Seleccionar Profesor a Eliminar</label>
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

          {profesorDetails && (
            <div className="professor-details-display">
              <h2>Detalles del Profesor Seleccionado:</h2>
              <p><strong>Nombre:</strong> {profesorDetails.nombre}</p>
              <p><strong>Apellido:</strong> {profesorDetails.apellido}</p>
              <p><strong>DNI:</strong> {profesorDetails.dni}</p>
              <p><strong>Estado:</strong> {profesorDetails.estado}</p>
              <button
                className="delete-button"
                onClick={handleEliminarProfesor}
              >
                Confirmar Eliminación
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProfesoresEliminar;