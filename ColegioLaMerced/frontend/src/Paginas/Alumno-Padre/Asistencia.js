import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral";
import "./Asistencia.css";

function Asistencia() {
  const [cursosInscritos, setCursosInscritos] = useState([]);
  const [asistenciaPorCurso, setAsistenciaPorCurso] = useState({});
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosAsistencia = async () => {
      const alumnoId = localStorage.getItem('alumnoId');
      if (!alumnoId) {
        setError("No se encontró el ID del alumno en localStorage. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const resCursosUnicos = await fetch('http://localhost:8080/api/cursosunicos');
        if (!resCursosUnicos.ok) throw new Error('Error al cargar cursos únicos.');
        const allCursosUnicos = await resCursosUnicos.json();
        const cursosUnicosDelAlumno = allCursosUnicos.filter(cu => cu.idAlumno === parseInt(alumnoId));

        if (cursosUnicosDelAlumno.length === 0) {
            setCursosInscritos([]);
            setAsistenciaPorCurso({});
            setLoading(false);
            return;
        }

        const idSeccionCursos = cursosUnicosDelAlumno.map(cu => cu.idSeccionCurso);
        const idCursosUnicosAlumno = cursosUnicosDelAlumno.map(cu => cu.idCursoUnico);

        const resSeccionCursos = await fetch('http://localhost:8080/api/seccioncursos');
        if (!resSeccionCursos.ok) throw new Error('Error al cargar secciones de cursos.');
        const allSeccionCursos = await resSeccionCursos.json();
        const seccionCursosDelAlumno = allSeccionCursos.filter(sc => idSeccionCursos.includes(sc.idSeccionCurso));

        const resCursos = await fetch('http://localhost:8080/api/cursos');
        if (!resCursos.ok) throw new Error('Error al cargar nombres de cursos.');
        const allCursos = await resCursos.json();

        const resAsistencias = await fetch('http://localhost:8080/api/asistencias');
        if (!resAsistencias.ok) throw new Error('Error al cargar asistencias.');
        const allAsistencias = await resAsistencias.json();
        const asistenciasFiltradas = allAsistencias.filter(asistencia => idCursosUnicosAlumno.includes(asistencia.idCursoUnico));

        const cursosFormateados = [];
        const asistenciasAgrupadas = {};

        cursosUnicosDelAlumno.forEach(cu => {
          const seccionCurso = seccionCursosDelAlumno.find(sc => sc.idSeccionCurso === cu.idSeccionCurso);
          const cursoNombre = seccionCurso ? allCursos.find(c => c.idCurso === seccionCurso.idCurso)?.nombre : 'Curso Desconocido';
          const seccion = seccionCurso ? `Sección ${seccionCurso.idSeccion}` : 'Sección Desconocida';

          cursosFormateados.push({
            id: cu.idCursoUnico,
            nombre: cursoNombre,
            seccion: seccion,
          });

          asistenciasAgrupadas[cu.idCursoUnico] = asistenciasFiltradas.filter(a => a.idCursoUnico === cu.idCursoUnico);
        });
        
        setCursosInscritos(cursosFormateados);
        setAsistenciaPorCurso(asistenciasAgrupadas);
        setLoading(false);

        if (cursosFormateados.length > 0) {
            setCursoSeleccionado(cursosFormateados[0].id);
        }

      } catch (err) {
        console.error("Error al cargar los datos de asistencia:", err);
        setError("No se pudieron cargar los datos de asistencia. Inténtalo de nuevo más tarde.");
        setLoading(false);
      }
    };

    cargarDatosAsistencia();
  }, []);

  const getResumenAsistencia = (asistencias) => {
    if (!asistencias || asistencias.length === 0) {
      return { presente: 0, tardanza: 0, ausente: 0, total: 0, porcentaje: "0%" };
    }
    const presente = asistencias.filter(a => a.estado === "Presente").length;
    const tardanza = asistencias.filter(a => a.estado === "Tardanza").length;
    const ausente = asistencias.filter(a => a.estado === "Ausente").length;
    const total = asistencias.length;
    const porcentaje = total > 0 ? ((presente + tardanza) / total * 100).toFixed(2) + "%" : "0%";

    return { presente, tardanza, ausente, total, porcentaje };
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralEstudiante />
      <div className="contenido-principal-asistencia-estudiante">
        <h2 className="mb-4" style={{ fontWeight: 700, color: "#8B0000" }}>
          Mi Asistencia
        </h2>

        <div className="cursos-lista">
          {cursosInscritos.length > 0 ? (
            cursosInscritos.map((curso) => (
              <div
                key={curso.id}
                className={`curso-card ${cursoSeleccionado === curso.id ? "selected" : ""}`}
                onClick={() => setCursoSeleccionado(curso.id)}
              >
                <span role="img" aria-label="libro">📘</span> {curso.nombre}
                <br />
                <span style={{ fontSize: "0.95em", color: "#8B0000" }}>{curso.seccion}</span>
                <div className="resumen-asistencia-card">
                  {asistenciaPorCurso[curso.id] && getResumenAsistencia(asistenciaPorCurso[curso.id]).porcentaje} de asistencia
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info">No estás inscrito en ningún curso.</div>
          )}
        </div>

        {cursoSeleccionado && (
          <div className="tab-content-asistencia">
            <h4>Asistencia del curso: {cursosInscritos.find(c => c.id === cursoSeleccionado)?.nombre}</h4>

            {asistenciaPorCurso[cursoSeleccionado] && asistenciaPorCurso[cursoSeleccionado].length > 0 ? (
              <>
                <table className="table table-striped asistencia-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistenciaPorCurso[cursoSeleccionado]
                      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                      .map((asistencia, index) => (
                        <tr key={index} className={`estado-${asistencia.estado.toLowerCase()}`}>
                          <td>{new Date(asistencia.fecha).toLocaleDateString()}</td>
                          <td>{asistencia.estado}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="resumen-final-asistencia">
                  <h5>Resumen General de Asistencia</h5>
                  {(() => {
                    const resumen = getResumenAsistencia(asistenciaPorCurso[cursoSeleccionado]);
                    return (
                      <>
                        <p>Total de clases: <b>{resumen.total}</b></p>
                        <p>Presente: <span className="estado-presente">{resumen.presente}</span></p>
                        <p>Tardanza: <span className="estado-tardanza">{resumen.tardanza}</span></p>
                        <p>Ausente: <span className="estado-ausente">{resumen.ausente}</span></p>
                        <p className="porcentaje-total">Porcentaje de asistencia: <b>{resumen.porcentaje}</b></p>
                      </>
                    );
                  })()}
                </div>
              </>
            ) : (
              <div className="alert alert-info mt-3">No hay registros de asistencia para este curso.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Asistencia;