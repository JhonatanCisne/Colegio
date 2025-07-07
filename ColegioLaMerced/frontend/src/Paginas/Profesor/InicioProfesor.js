import React, { useState, useEffect, useMemo } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import "./InicioProfesor.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const AnnounceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10m-6 10V4M6 20v-6"/></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>;

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

function getSemanaActual() {
  const hoy = new Date();
  const diaSemana = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - diaSemana);
  return Array.from({ length: 5 }).map((_, i) => {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    return fecha;
  });
}

function InicioProfesor() {
  const [profesor, setProfesor] = useState({ nombre: "", apellido: "" });
  const [horario, setHorario] = useState({});
  const [semanaActual, setSemanaActual] = useState(getSemanaActual());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anunciosImportantes, setAnunciosImportantes] = useState([]);
  const [enlacesUtiles, setEnlacesUtiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      const profesorData = localStorage.getItem('profesorLogged');
      if (!profesorData) {
        setError("No se encontró información del profesor. Por favor, inicie sesión.");
        setLoading(false);
        return;
      }
      const profesorLogueado = JSON.parse(profesorData);
      setProfesor(profesorLogueado);
      const profesorId = profesorLogueado.idProfesor;

      try {
        const [horariosRes, seccionCursosRes, seccionesRes, cursosRes, anunciosRes] = await Promise.all([
          axios.get('http://localhost:8080/api/horarios'),
          axios.get('http://localhost:8080/api/seccioncursos'),
          axios.get('http://localhost:8080/api/secciones'),
          axios.get('http://localhost:8080/api/cursos'),
          axios.get('http://localhost:8080/api/anuncios'),
        ]);

        const horariosDelProfesor = horariosRes.data.filter(h => h.idProfesor === profesorId);
        const horarioProcesado = diasSemana.reduce((acc, _, index) => {
            acc[index] = [];
            return acc;
        }, {});

        horariosDelProfesor.forEach(h => {
          const seccionCurso = seccionCursosRes.data.find(sc => sc.idSeccion === h.idSeccion && sc.idProfesor === profesorId);
          if (seccionCurso) {
            const curso = cursosRes.data.find(c => c.idCurso === seccionCurso.idCurso);
            const seccion = seccionesRes.data.find(s => s.idSeccion === h.idSeccion);
            if (curso && seccion) {
              const diaIndex = diasSemana.indexOf(h.dia);
              if (diaIndex !== -1) {
                horarioProcesado[diaIndex].push({
                  hora: h.hora.split('-')[0],
                  curso: `${curso.nombre}`,
                  aula: `${seccion.grado}° "${seccion.nombre}"`
                });
              }
            }
          }
        });
        
        Object.values(horarioProcesado).forEach(dia => dia.sort((a, b) => a.hora.localeCompare(b.hora)));
        setHorario(horarioProcesado);

        const misSeccionCursos = seccionCursosRes.data.filter(sc => sc.idProfesor === profesorLogueado.idProfesor);
        const misSeccionCursosIds = misSeccionCursos.map(sc => sc.idSeccionCurso);

        const anunciosFiltrados = anunciosRes.data
          .filter(anuncio => misSeccionCursosIds.includes(anuncio.idSeccionCurso))
          .map(anuncio => {
            const [tituloLine, ...descripcionLines] = anuncio.contenido.split('\n');
            const titulo = tituloLine ? tituloLine.replace('Título: ', '') : 'Sin título';
            const descripcion = descripcionLines.join('\n').replace('Descripción: ', '');
            return {
              id: anuncio.idAnuncio,
              titulo: titulo,
              descripcion: descripcion,
            };
          });
        setAnunciosImportantes(anunciosFiltrados);

        setEnlacesUtiles([]); 

      } catch (err) {
        console.error("Error al cargar los datos del profesor:", err);
        setError("No se pudo cargar el portal. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const resumenSemana = useMemo(() => {
    const totalClases = Object.values(horario).flat().length;
    const clasesPorDia = Object.values(horario).map(clases => clases.length);
    const minClases = totalClases > 0 ? Math.min(...clasesPorDia.filter(c => c > 0)) : 0;
    const diasMenosCarga = diasSemana.filter((_, idx) => clasesPorDia[idx] === minClases).join(", ");
    return { totalClases, diasMenosCarga: minClases > 0 ? diasMenosCarga : "N/A" };
  }, [horario]);
  
  const cambiarSemana = (offset) => {
    setSemanaActual(prevSemana => prevSemana.map(fecha => {
      const nuevaFecha = new Date(fecha);
      nuevaFecha.setDate(nuevaFecha.getDate() + offset * 7);
      return nuevaFecha;
    }));
  };

  const rangoSemana = `${semanaActual[0].getDate()} de ${semanaActual[0].toLocaleString('es-ES', { month: 'long' })} - ${semanaActual[4].getDate()} de ${semanaActual[4].toLocaleString('es-ES', { month: 'long' })}`;

  if (loading) return <div className="loading-screen">Cargando portal...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="dashboard-layout">
      <BarraDeNavegacionLateralProfesor nombre={`${profesor.nombre} ${profesor.apellido}`} />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>¡Bienvenido, {profesor.nombre}!</h1>
          <p>Portal del Profesor</p>
        </header>

        <div className="dashboard-widgets-profesor">
          <div className="widget-card full-width-widget">
            <div className="widget-header">
              <CalendarIcon />
              <h2>Mi Horario Semanal</h2>
            </div>
            <div className="widget-content">
              <div className="horario-header">
                <button className="btn-navegacion-semana" onClick={() => cambiarSemana(-1)}>&lt; Anterior</button>
                <span className="horario-rango-semana">{rangoSemana}</span>
                <button className="btn-navegacion-semana" onClick={() => cambiarSemana(1)}>Siguiente &gt;</button>
              </div>
              <div className="horario-profesor-grid">
                {semanaActual.map((fecha, idx) => (
                  <div key={idx} className="horario-dia-columna">
                    <h3 className="horario-dia-titulo">
                      {diasSemana[idx]} <span className="horario-dia-fecha">{fecha.getDate()}/{fecha.getMonth() + 1}</span>
                    </h3>
                    <ul className="schedule-list">
                      {horario[idx] && horario[idx].length > 0 ? (
                        horario[idx].map((clase, i) => (
                          <li key={i} className="evento-clase">
                            <span className="schedule-time">{clase.hora}</span>
                            <span className="schedule-subject">{clase.curso}</span>
                            <span className="schedule-classroom">{clase.aula}</span>
                          </li>
                        ))
                      ) : <p className="no-data-message-small">No hay clases</p>}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="widget-card">
            <div className="widget-header"><AnnounceIcon /><h2>Anuncios Importantes</h2></div>
            <div className="widget-content">
              <ul className="announcements-list">
                {anunciosImportantes.length > 0 ? (
                  anunciosImportantes.map(anuncio => (
                    <li key={anuncio.id}>
                      <strong className="announcement-title">{anuncio.titulo}</strong>
                      <p className="announcement-text">{anuncio.descripcion}</p>
                    </li>
                  ))
                ) : (
                  <p className="no-data-message">No hay anuncios recientes.</p>
                )}
              </ul>
            </div>
          </div>
          
          <div className="widget-card">
            <div className="widget-header"><ChartIcon /><h2>Clases</h2></div>
            <div className="widget-content stats-grid">
                <div className="stat-item">
                    <span className="stat-value">{resumenSemana.totalClases}</span>
                    <span className="stat-label">Clases / Semana</span>
                </div>
            </div>
          </div>

          <div className="widget-card">
            <div className="widget-header"><LinkIcon /><h2>Accesos Rápidos</h2></div>
            <div className="widget-content">
                <div className="accesos-rapidos-grid">
                    <button className="btn-acceso" onClick={() => navigate("/asistenciaProfesor")}>Tomar Asistencia</button>
                    <button className="btn-acceso" onClick={() => navigate("/anunciosProfesor")}>Publicar Anuncio</button>
                    <button className="btn-acceso" onClick={() => navigate("/cursosProfesor")}>Ver Mis Cursos</button>
                </div>
                <h4 className="enlaces-utiles-titulo">Enlaces Útiles</h4>
                   <ul className="enlaces-utiles-list">
                    {enlacesUtiles.length > 0 ? (
                      enlacesUtiles.map(link => (
                          <li key={link.id}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.nombre}</a></li>
                      ))
                    ) : (
                      <p className="no-data-message-small">No hay enlaces útiles disponibles.</p>
                    )}
                </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default InicioProfesor;