import React, { useState, useEffect, useMemo } from "react";
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral";
import "./Inicio.css";
import axios from "axios";

// --- Iconos para los Widgets ---
const ScheduleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const AnnounceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const CoursesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const AttendanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;


function Inicio() {
  const [datosEstudiante, setDatosEstudiante] = useState({
    nombre: "",
    grado: "",
    seccion: "",
    horario: [],
  });
  const [anuncios, setAnuncios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [asistenciaResumen, setAsistenciaResumen] = useState({ porcentaje: "0%" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosInicio = async () => {
      const storedAlumnoId = localStorage.getItem('alumnoId');
      if (!storedAlumnoId) {
        setError("No se encontró el ID del alumno. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const [
          alumnosRes,
          cursosUnicosRes,
          anunciosRes,
          seccionCursosRes,
          seccionesRes,
          cursosRes,
          horariosRes,
          asistenciasRes
        ] = await Promise.all([
          axios.get("http://localhost:8080/api/alumnos"),
          axios.get("http://localhost:8080/api/cursosunicos"),
          axios.get("http://localhost:8080/api/anuncios"),
          axios.get("http://localhost:8080/api/seccioncursos"),
          axios.get("http://localhost:8080/api/secciones"),
          axios.get("http://localhost:8080/api/cursos"),
          axios.get("http://localhost:8080/api/horarios"),
          axios.get("http://localhost:8080/api/asistencias")
        ]);

        const allAlumnos = alumnosRes.data;
        const allCursosUnicos = cursosUnicosRes.data;
        const allAnuncios = anunciosRes.data;
        const allSeccionCursos = seccionCursosRes.data;
        const allSecciones = seccionesRes.data;
        const allCursos = cursosRes.data;
        const allHorarios = horariosRes.data;
        const allAsistencias = asistenciasRes.data;

        const alumnoLogueado = allAlumnos.find(
          (a) => a.idAlumno === parseInt(storedAlumnoId)
        );
        if (!alumnoLogueado) {
          setError("No se encontró información para el alumno logueado.");
          setLoading(false);
          return;
        }

        const cursoUnicoPrincipal = allCursosUnicos.find(
          (cu) => cu.idAlumno === parseInt(storedAlumnoId)
        );

        if (cursoUnicoPrincipal) {
            const seccionCursoId = cursoUnicoPrincipal.idSeccionCurso;

            const anunciosFiltrados = allAnuncios.filter(
                (anuncio) => anuncio.idSeccionCurso === seccionCursoId
            );

            const anunciosFormateados = anunciosFiltrados.map((anuncio) => {
                const seccionCursoDetalle = allSeccionCursos.find(sc => sc.idSeccionCurso === anuncio.idSeccionCurso);
                let nombreCurso = "General";
                let nombreSeccion = "";
                if (seccionCursoDetalle) {
                    const cursoDetalle = allCursos.find(c => c.idCurso === seccionCursoDetalle.idCurso);
                    const seccionDetalle = allSecciones.find(s => s.idSeccion === seccionCursoDetalle.idSeccion);
                    if (cursoDetalle) nombreCurso = cursoDetalle.nombre;
                    if (seccionDetalle) nombreSeccion = `${seccionDetalle.grado}° ${seccionDetalle.nombre}`;
                }
                return {
                    id: anuncio.idAnuncio,
                    titulo: anuncio.nombreProfesor || "Anuncio",
                    contenido: anuncio.contenido,
                    nombreCursoSeccion: seccionCursoDetalle ? `${nombreCurso} (${nombreSeccion})` : "General"
                };
            });
            anunciosFormateados.sort((a, b) => b.id - a.id);
            setAnuncios(anunciosFormateados.slice(0, 3));

            const todosLosCursosDelAlumno = allCursosUnicos.filter(
                (cu) => cu.idAlumno === parseInt(storedAlumnoId)
            );

            const cursosFormateadosWidget = todosLosCursosDelAlumno.map(cursoUnico => {
                const seccionCurso = allSeccionCursos.find(sc => sc.idSeccionCurso === cursoUnico.idSeccionCurso) || {};
                const cursoInfo = allCursos.find(c => c.idCurso === seccionCurso.idCurso) || { nombre: 'Curso Desconocido' };
                return { id: cursoUnico.idCursoUnico, nombre: cursoInfo.nombre };
            });
            setCursos(cursosFormateadosWidget);

            const idCursosUnicosDelAlumno = todosLosCursosDelAlumno.map(cu => cu.idCursoUnico);
            const asistenciasDelAlumno = allAsistencias.filter(asistencia => idCursosUnicosDelAlumno.includes(asistencia.idCursoUnico));
            const presente = asistenciasDelAlumno.filter(a => a.estado === "Presente").length;
            const tardanza = asistenciasDelAlumno.filter(a => a.estado === "Tardanza").length;
            const total = asistenciasDelAlumno.length;
            const porcentaje = total > 0 ? (((presente + tardanza) / total) * 100).toFixed(1) + "%" : "0%";
            setAsistenciaResumen({ porcentaje });

            const seccionCursoRelacionada = allSeccionCursos.find(sc => sc.idSeccionCurso === seccionCursoId);
            let gradoEstudiante = "N/A";
            let seccionEstudiante = "N/A";
            let horarioAlumno = [];
            if (seccionCursoRelacionada) {
                const idSeccionDelAlumno = seccionCursoRelacionada.idSeccion;
                const seccionInfo = allSecciones.find(s => s.idSeccion === idSeccionDelAlumno);
                if (seccionInfo) {
                    gradoEstudiante = seccionInfo.grado;
                    seccionEstudiante = seccionInfo.nombre;
                }
                horarioAlumno = allHorarios
                    .filter(h => h.idSeccion === idSeccionDelAlumno)
                    .map(horario => {
                        const seccionCurso = allSeccionCursos.find(sc => sc.idSeccion === horario.idSeccion && sc.idProfesor === horario.idProfesor);
                        const curso = seccionCurso ? allCursos.find(c => c.idCurso === seccionCurso.idCurso) : null;
                        return { dia: horario.dia, hora: horario.hora, curso: curso ? curso.nombre : 'Actividad General' };
                    });
            }
            setDatosEstudiante({
              nombre: `${alumnoLogueado.nombre} ${alumnoLogueado.apellido}`,
              grado: gradoEstudiante,
              seccion: seccionEstudiante,
              horario: horarioAlumno,
            });
        } else {
            setError("No se encontró información de cursos para este estudiante.");
            setAnuncios([]);
            setCursos([]);
        }

      } catch (err) {
        console.error("Error al cargar los datos de inicio:", err);
        setError("No se pudieron cargar los datos. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatosInicio();
  }, []);

  const horarioSemanal = useMemo(() => {
    if (!datosEstudiante.horario || datosEstudiante.horario.length === 0) {
        return [];
    }

    const diasOrdenados = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    
    const horarioAgrupado = datosEstudiante.horario.reduce((acc, clase) => {
        const dia = clase.dia;
        if (!acc[dia]) {
            acc[dia] = [];
        }
        acc[dia].push(clase);
        acc[dia].sort((a, b) => a.hora.localeCompare(b.hora));
        return acc;
    }, {});

    return diasOrdenados
        .filter(dia => horarioAgrupado[dia])
        .map(dia => ({
            dia,
            clases: horarioAgrupado[dia]
        }));
  }, [datosEstudiante.horario]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-screen">Cargando portal...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-screen">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <BarraDeNavegacionLateralEstudiante nombre={datosEstudiante.nombre} />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>¡Bienvenido, {datosEstudiante.nombre}!</h1>
          <p>Portal del Estudiante - {datosEstudiante.grado} "{datosEstudiante.seccion}"</p>
        </header>

        <div className="dashboard-widgets">
          {/* Widget Horario Semanal */}
          <div className="widget-card full-width-widget">
            <div className="widget-header">
              <ScheduleIcon />
              <h2>Mi Horario Semanal</h2>
            </div>
            <div className="widget-content">
              {horarioSemanal.length > 0 ? (
                <div className="horario-semanal-grid">
                  {horarioSemanal.map(({ dia, clases }) => (
                    <div key={dia} className="horario-dia-columna">
                      <h3 className="horario-dia-titulo">{dia}</h3>
                      <ul className="schedule-list">
                        {clases.map((clase, index) => (
                          <li key={index}>
                            <span className="schedule-time">{clase.hora}</span>
                            <span className="schedule-subject">{clase.curso}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data-message">No tienes un horario asignado todavía.</p>
              )}
            </div>
          </div>

          {/* Widget Anuncios */}
          <div className="widget-card">
            <div className="widget-header">
              <AnnounceIcon />
              <h2>Anuncios Recientes</h2>
            </div>
            <div className="widget-content">
                <ul className="announcements-list">
                    {anuncios.length > 0 ? anuncios.map(anuncio => (
                        <li key={anuncio.id}>
                            <strong className="announcement-title">Anuncio de {anuncio.titulo}</strong>
                            <p className="announcement-text">{anuncio.contenido}</p>
                            <span className="announcement-date">Para: {anuncio.nombreCursoSeccion}</span>
                        </li>
                    )) : <p className="no-data-message">No hay anuncios para tu sección.</p>}
                </ul>
            </div>
          </div>

          {/* Widget Mis Cursos */}
          <div className="widget-card">
             <div className="widget-header">
                <CoursesIcon />
                <h3>Mis Cursos</h3>
             </div>
             <div className="widget-content">
                {cursos.length > 0 ? (
                    <ul className="course-list">
                        {cursos.map(curso => (
                            <li key={curso.id}>{curso.nombre}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-data-message">No tienes cursos asignados.</p>
                )}
             </div>
          </div>

          {/* Widget Mi Asistencia */}
          <div className="widget-card">
             <div className="widget-header">
                <AttendanceIcon />
                <h3>Mi Asistencia General</h3>
             </div>
             <div className="widget-content attendance-summary">
                <div className="attendance-percentage">{asistenciaResumen.porcentaje}</div>
                <p>de asistencia</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Inicio;
