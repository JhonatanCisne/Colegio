import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Administrador/AdminProfesores.css"; // Reutilizamos los estilos existentes

const AdminProfesoresVer = () => {
  const navigate = useNavigate();
  const [profesores, setProfesores] = useState([]);
  const [seccionesMap, setSeccionesMap] = useState(new Map());
  const [cursosMap, setCursosMap] = useState(new Map());
  const [seccionCursosMap, setSeccionCursosMap] = useState(new Map()); // idSeccionCurso -> {idSeccion, idCurso, idHorario}
  const [horariosMap, setHorariosMap] = useState(new Map()); // idHorario -> {dia, hora, idSeccion}
  const [mensaje, setMensaje] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      setMensaje({ type: "", text: "" });
      try {
        const [
          profesoresRes,
          seccionesRes,
          cursosRes,
          seccionCursosRes,
          horariosRes,
        ] = await Promise.all([
          axios.get("http://localhost:8080/api/profesores"),
          axios.get("http://localhost:8080/api/secciones"),
          axios.get("http://localhost:8080/api/cursos"),
          axios.get("http://localhost:8080/api/seccioncursos"),
          axios.get("http://localhost:8080/api/horarios"),
        ]);

        // Crear mapas para acceso rápido a nombres
        setSeccionesMap(new Map(seccionesRes.data.map((s) => [s.idSeccion, s.nombre])));
        setCursosMap(new Map(cursosRes.data.map((c) => [c.idCurso, c.nombre])));
        setHorariosMap(new Map(horariosRes.data.map((h) => [h.idHorario, h])));
        setSeccionCursosMap(new Map(seccionCursosRes.data.map((sc) => [sc.idSeccionCurso, sc])));

        const profesoresData = profesoresRes.data.map((profesor) => {
          // Obtener las asignaciones de secciones/cursos para este profesor
          const cursosAsignados = seccionCursosRes.data.filter(
            (sc) => sc.idProfesor === profesor.idProfesor
          );

          // Formatear la información de cursos asignados
          const formattedCursos = cursosAsignados.map((sc) => {
            const nombreSeccion = seccionesMap.get(sc.idSeccion) || `Sección ${sc.idSeccion}`;
            const nombreCurso = cursosMap.get(sc.idCurso) || `Curso ${sc.idCurso}`;
            return `${nombreSeccion} - ${nombreCurso}`;
          });

          // Obtener los horarios asignados directamente a este profesor (si los hay)
          const horariosAsignados = horariosRes.data.filter(
            (h) => h.idProfesor === profesor.idProfesor
          );

          // Formatear la información de horarios asignados
          const formattedHorarios = horariosAsignados.map((h) => {
            return `${h.dia} ${h.hora}`;
          });

          return {
            ...profesor,
            cursosAsignados: formattedCursos,
            horariosAsignados: formattedHorarios,
          };
        });

        setProfesores(profesoresData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setMensaje({ type: "error", text: "Error al cargar la información de profesores." });
      }
    };

    fetchData();
  }, [seccionesMap, cursosMap]); // Dependencias para asegurar que los mapas se llenen antes de procesar

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
              <li className="activo" onClick={() => navigate("/AdminProfesoresVer")}>Ver Profesores</li>
              <li onClick={() => navigate("/AdminProfesoresModificar")}>Modificar Profesor</li>
              <li onClick={() => navigate("/AdminProfesoresEliminar")}>Eliminar Profesor</li>
            </ul>
          </li>
          <li className="cerrar-sesion" onClick={() => { localStorage.clear(); navigate("/"); }}>Cerrar sesión</li>
        </ul>
      </aside>

      <div className="contenido-principal">
        <main className="contenido-profesor">
          <h1>Lista de Profesores</h1>
          {mensaje.text && (
            <div className={`mensaje ${mensaje.type === "success" ? "mensaje-exito" : "mensaje-error"}`}>
              {mensaje.text}
            </div>
          )}

          <div className="profesor-table-container">
            {profesores.length > 0 ? (
              <table className="profesor-list-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Estado</th>
                    <th>Contraseña</th>
                    <th>Cursos Asignados</th>
                    <th>Horarios Asignados</th>
                  </tr>
                </thead>
                <tbody>
                  {profesores.map((prof) => (
                    <tr key={prof.idProfesor}>
                      <td>{prof.idProfesor}</td>
                      <td>{prof.dni}</td>
                      <td>{prof.nombre}</td>
                      <td>{prof.apellido}</td>
                      <td>{prof.estado}</td>
                      <td>{prof.contrasena}</td>
                      <td>
                        {prof.cursosAsignados && prof.cursosAsignados.length > 0 ? (
                          <ul>
                            {prof.cursosAsignados.map((curso, index) => (
                              <li key={index}>{curso}</li>
                            ))}
                          </ul>
                        ) : (
                          "Ninguno"
                        )}
                      </td>
                      <td>
                        {prof.horariosAsignados && prof.horariosAsignados.length > 0 ? (
                          <ul>
                            {prof.horariosAsignados.map((horario, index) => (
                              <li key={index}>{horario}</li>
                            ))}
                          </ul>
                        ) : (
                          "Ninguno"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay profesores registrados.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfesoresVer;