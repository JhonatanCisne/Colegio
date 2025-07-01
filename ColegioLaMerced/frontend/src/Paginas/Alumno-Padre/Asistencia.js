import React, { useState, useEffect, useMemo } from "react";
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral";
import "./Asistencia.css";
import axios from "axios";

// --- Iconos para los estados de asistencia ---
const PresenteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>;
const AusenteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const TardanzaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

function Asistencia() {
  const [asistenciaData, setAsistenciaData] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosAsistencia = async () => {
      const alumnoId = localStorage.getItem('alumnoId');
      if (!alumnoId) {
        setError("No se encontró el ID del alumno. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const alumnoRes = await axios.get(`http://localhost:8080/api/alumnos/${alumnoId}`);
        setNombreAlumno(`${alumnoRes.data.nombre} ${alumnoRes.data.apellido}`);
        const [cursosUnicosRes, seccionCursosRes, cursosRes, seccionesRes, asistenciasRes] = await Promise.all([
          axios.get('http://localhost:8080/api/cursosunicos'),
          axios.get('http://localhost:8080/api/seccioncursos'),
          axios.get('http://localhost:8080/api/cursos'),
          axios.get('http://localhost:8080/api/secciones'),
          axios.get('http://localhost:8080/api/asistencias')
        ]);

        const allCursosUnicos = cursosUnicosRes.data;
        const allSeccionCursos = seccionCursosRes.data;
        const allCursos = cursosRes.data;
        const allSecciones = seccionesRes.data;
        const allAsistencias = asistenciasRes.data;

        const cursosUnicosDelAlumno = allCursosUnicos.filter(cu => cu.idAlumno === parseInt(alumnoId));
        const idCursosUnicosAlumno = cursosUnicosDelAlumno.map(cu => cu.idCursoUnico);
        const asistenciasDelAlumno = allAsistencias.filter(asistencia => idCursosUnicosAlumno.includes(asistencia.idCursoUnico));

        const dataFormateada = cursosUnicosDelAlumno.map(cu => {
          const seccionCurso = allSeccionCursos.find(sc => sc.idSeccionCurso === cu.idSeccionCurso) || {};
          const cursoInfo = allCursos.find(c => c.idCurso === seccionCurso.idCurso) || { nombre: 'Curso Desconocido' };
          const seccionInfo = allSecciones.find(s => s.idSeccion === seccionCurso.idSeccion) || { grado: '', nombre: 'Desconocida' };
          
          const asistenciasDelCurso = asistenciasDelAlumno.filter(a => a.idCursoUnico === cu.idCursoUnico);

          return {
            id: cu.idCursoUnico,
            nombre: cursoInfo.nombre,
            seccion: `${seccionInfo.grado}° ${seccionInfo.nombre}`,
            registros: asistenciasDelCurso.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar por fecha descendente
          };
        });
        
        setAsistenciaData(dataFormateada);
        if (dataFormateada.length > 0) {
          setCursoSeleccionado(dataFormateada[0]);
        }

      } catch (err) {
        console.error("Error al cargar los datos de asistencia:", err);
        setError("No se pudieron cargar los datos de asistencia. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatosAsistencia();
  }, []);

  const resumenGeneral = useMemo(() => {
    const todosLosRegistros = asistenciaData.flatMap(curso => curso.registros);
    const total = todosLosRegistros.length;
    if (total === 0) return { presentes: 0, tardanzas: 0, ausencias: 0, porcentaje: 0 };

    const presentes = todosLosRegistros.filter(r => r.estado === 'Presente').length;
    const tardanzas = todosLosRegistros.filter(r => r.estado === 'Tardanza').length;
    const ausencias = todosLosRegistros.filter(r => r.estado === 'Ausente').length;
    const porcentaje = total > 0 ? Math.round(((presentes + tardanzas) / total) * 100) : 0;

    return { presentes, tardanzas, ausencias, porcentaje };
  }, [asistenciaData]);

  const getResumenPorCurso = (registros) => {
    const total = registros.length;
    if (total === 0) return { presentes: 0, tardanzas: 0, ausencias: 0 };
    
    const presentes = registros.filter(r => r.estado === 'Presente').length;
    const tardanzas = registros.filter(r => r.estado === 'Tardanza').length;
    const ausencias = registros.filter(r => r.estado === 'Ausente').length;
    
    return { presentes, tardanzas, ausencias };
  };

  if (loading) {
    return (
      <div className="d-flex">
        <BarraDeNavegacionLateralEstudiante nombre={nombreAlumno} />
        <div className="page-content">Cargando asistencia...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex">
        <BarraDeNavegacionLateralEstudiante nombre={nombreAlumno} />
        <div className="page-content">{error}</div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralEstudiante nombre={nombreAlumno} />
      <div className="page-content">
        <header className="page-header">
          <h2>Mi Asistencia</h2>
          <p>Consulta tu registro de asistencia por curso y el resumen general.</p>
        </header>

        <div className="resumen-general-grid">
          <div className="resumen-card porcentaje">
            <span className="resumen-value">{resumenGeneral.porcentaje}%</span>
            <span className="resumen-label">Asistencia General</span>
          </div>
          <div className="resumen-card">
            <span className="resumen-value">{resumenGeneral.presentes}</span>
            <span className="resumen-label">Presente</span>
          </div>
          <div className="resumen-card">
            <span className="resumen-value">{resumenGeneral.tardanzas}</span>
            <span className="resumen-label">Tardanzas</span>
          </div>
          <div className="resumen-card">
            <span className="resumen-value">{resumenGeneral.ausencias}</span>
            <span className="resumen-label">Ausencias</span>
          </div>
        </div>
        
        <div className="asistencia-layout">
          <div className="cursos-list-container">
            <h3>Cursos</h3>
            {asistenciaData.length > 0 ? (
              asistenciaData.map((curso) => {
                const resumen = getResumenPorCurso(curso.registros);
                return (
                  <div
                    key={curso.id}
                    className={`curso-summary-card ${cursoSeleccionado?.id === curso.id ? "selected" : ""}`}
                    onClick={() => setCursoSeleccionado(curso)}
                  >
                    <strong className="curso-title">{curso.nombre}</strong>
                    <span className="curso-seccion">{curso.seccion}</span>
                    <div className="curso-stats">
                      <span>P: {resumen.presentes}</span>
                      <span>T: {resumen.tardanzas}</span>
                      <span>A: {resumen.ausencias}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No hay cursos con registros de asistencia.</p>
            )}
          </div>

          <div className="detalle-asistencia-container">
            <h3>Historial de Asistencia</h3>
            {cursoSeleccionado ? (
              <div className="timeline">
                {cursoSeleccionado.registros.length > 0 ? (
                  cursoSeleccionado.registros.map((registro, index) => (
                    <div className="timeline-item" key={index}>
                      <div className={`timeline-icon ${registro.estado.toLowerCase()}`}>
                        {registro.estado === 'Presente' && <PresenteIcon />}
                        {registro.estado === 'Tardanza' && <TardanzaIcon />}
                        {registro.estado === 'Ausente' && <AusenteIcon />}
                      </div>
                      <div className="timeline-content">
                        <span className="timeline-date">{new Date(registro.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className={`timeline-status ${registro.estado.toLowerCase()}`}>{registro.estado}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data-message">No hay registros para este curso.</p>
                )}
              </div>
            ) : (
              <p className="no-data-message">Selecciona un curso para ver el detalle.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Asistencia;
