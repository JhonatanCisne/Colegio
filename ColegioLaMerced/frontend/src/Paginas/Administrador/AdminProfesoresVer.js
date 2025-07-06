import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Administrador/AdminProfesoresVer.css"; // Usa el nuevo archivo CSS

const AdminProfesoresVer = () => {
  const navigate = useNavigate();
  const [profesores, setProfesores] = useState([]);
  const [seccionesMap, setSeccionesMap] = useState(new Map());
  const [cursosMap, setCursosMap] = useState(new Map());
  const [seccionCursosMap, setSeccionCursosMap] = useState(new Map());
  const [horariosMap, setHorariosMap] = useState(new Map());
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
        const fetchedSeccionesMap = new Map(seccionesRes.data.map((s) => [s.idSeccion, s.nombre]));
        const fetchedCursosMap = new Map(cursosRes.data.map((c) => [c.idCurso, c.nombre]));
        const fetchedHorariosMap = new Map(horariosRes.data.map((h) => [h.idHorario, h]));
        const fetchedSeccionCursosMap = new Map(seccionCursosRes.data.map((sc) => [sc.idSeccionCurso, sc]));

        setSeccionesMap(fetchedSeccionesMap);
        setCursosMap(fetchedCursosMap);
        setHorariosMap(fetchedHorariosMap);
        setSeccionCursosMap(fetchedSeccionCursosMap);

        const profesoresData = profesoresRes.data.map((profesor) => {
          const cursosAsignados = seccionCursosRes.data.filter(
            (sc) => sc.idProfesor === profesor.idProfesor
          );

          const formattedCursos = cursosAsignados.map((sc) => {
            const nombreSeccion = fetchedSeccionesMap.get(sc.idSeccion) || `Sección ${sc.idSeccion}`;
            const nombreCurso = fetchedCursosMap.get(sc.idCurso) || `Curso ${sc.idCurso}`;
            return `${nombreSeccion} - ${nombreCurso}`;
          });

          const horariosAsignados = horariosRes.data.filter(
            (h) => h.idProfesor === profesor.idProfesor
          );

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
    // No incluyas los mapas en las dependencias si se establecen dentro del efecto,
    // ya que eso podría causar un bucle infinito o re-fetches innecesarios.
    // El efecto se ejecuta una vez al montar, y eso es suficiente para cargar los datos.
  }, []); 

  // Función para exportar a CSV
  const exportToCsv = () => {
    if (profesores.length === 0) {
      alert('No hay profesores para exportar.');
      return;
    }

    // Encabezados del CSV
    const headers = [
      'ID Profesor',
      'DNI',
      'Nombre',
      'Apellido',
      'Estado',
      'Contraseña',
      'Cursos Asignados',
      'Horarios Asignados'
    ];

    // Mapea los datos de los profesores a un formato de fila CSV
    const rows = profesores.map(profesor => [
      profesor.idProfesor,
      profesor.dni,
      profesor.nombre,
      profesor.apellido,
      profesor.estado,
      profesor.contrasena,
      // Une los arrays de cursos y horarios con comas para que se vean como una sola celda en CSV
      profesor.cursosAsignados.join('; '), // Usamos ';' como separador interno
      profesor.horariosAsignados.join('; ')
    ]);

    // Combina encabezados y filas, escapando comas internas y añadiendo comillas si es necesario
    const csvContent = [
      headers.map(header => `"${header}"`).join(','), // Asegura que los encabezados estén entre comillas
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')) // Escapa comillas internas y rodea con comillas
    ].join('\n');

    // Crea un Blob y un enlace para la descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    // Asegura que el navegador soporte el atributo 'download'
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'lista_profesores.csv'); // Nombre del archivo

      // Simula un clic para descargar el archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Libera el objeto URL
    } else {
      alert('Tu navegador no soporta la descarga de archivos. Intenta con otro navegador.');
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

          {profesores.length > 0 && (
            <button className="export-button" onClick={exportToCsv}>
              Exportar
            </button>
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
                          prof.cursosAsignados.join(', ') // Mostrar como texto plano separado por comas
                        ) : (
                          "Ninguno"
                        )}
                      </td>
                      <td>
                        {prof.horariosAsignados && prof.horariosAsignados.length > 0 ? (
                          prof.horariosAsignados.join(', ') // Mostrar como texto plano separado por comas
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