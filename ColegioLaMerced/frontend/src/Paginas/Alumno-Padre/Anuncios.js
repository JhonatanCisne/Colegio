import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral";
import "./Anuncios.css";
import axios from "axios";

// --- Icono para las tarjetas de anuncios ---
const AnnounceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;

function Anuncios() {
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroCurso, setFiltroCurso] = useState("todos");

  useEffect(() => {
    const cargarAnunciosDelEstudiante = async () => {
      const alumnoId = localStorage.getItem('alumnoId');
      if (!alumnoId) {
        setError("No se encontró el ID del estudiante. Por favor, inicie sesión nuevamente.");
        setLoading(false);
        return;
      }

      try {
        const [
          alumnoRes,
          cursosUnicosRes,
          seccionCursosRes,
          cursosRes,
          anunciosRes
        ] = await Promise.all([
          axios.get(`http://localhost:8080/api/alumnos/${alumnoId}`),
          axios.get("http://localhost:8080/api/cursosunicos"),
          axios.get("http://localhost:8080/api/seccioncursos"),
          axios.get("http://localhost:8080/api/cursos"),
          axios.get("http://localhost:8080/api/anuncios")
        ]);

        setNombreAlumno(`${alumnoRes.data.nombre} ${alumnoRes.data.apellido}`);

        const cursoUnicoPrincipal = cursosUnicosRes.data.find(
          (cu) => cu.idAlumno === parseInt(alumnoId)
        );

        if (cursoUnicoPrincipal) {
          const seccionCursoId = cursoUnicoPrincipal.idSeccionCurso;

          const anunciosFiltrados = anunciosRes.data.filter(
            (anuncio) => anuncio.idSeccionCurso === seccionCursoId
          );

          const anunciosFormateados = anunciosFiltrados.map(anuncio => {
            const seccionCurso = seccionCursosRes.data.find(sc => sc.idSeccionCurso === anuncio.idSeccionCurso) || {};
            const curso = cursosRes.data.find(c => c.idCurso === seccionCurso.idCurso) || { nombre: "General" };
            
            return {
              id: anuncio.idAnuncio,
              titulo: anuncio.contenido.split('\n')[0].replace('Título: ', ''),
              contenido: anuncio.contenido.split('\n').slice(1).join('\n').replace('Descripción: ', ''),
              profesor: anuncio.nombreProfesor,
              curso: curso.nombre,
            };
          });

          setAnuncios(anunciosFormateados.sort((a, b) => b.id - a.id));
        } else {
          setAnuncios([]);
        }

      } catch (err) {
        console.error("Error al obtener los anuncios del estudiante:", err);
        setError("Error al cargar los anuncios. Intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    cargarAnunciosDelEstudiante();
  }, []);

  const anunciosMostrados = anuncios.filter(anuncio => 
    filtroCurso === "todos" || anuncio.curso === filtroCurso
  );

  const cursosDisponibles = [...new Set(anuncios.map(a => a.curso))];

  if (loading) {
    return (
      <div className="d-flex">
        <BarraDeNavegacionLateralEstudiante nombre={nombreAlumno} />
        <div className="page-content">Cargando anuncios...</div>
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
          <h2>Anuncios y Novedades</h2>
          <p>Mantente al día con las últimas noticias de tus profesores y el colegio.</p>
        </header>
        
        <div className="anuncios-filter-bar">
            <label htmlFor="curso-filter">Filtrar por curso:</label>
            <select id="curso-filter" value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
                <option value="todos">Todos los cursos</option>
                {cursosDisponibles.map(curso => (
                    <option key={curso} value={curso}>{curso}</option>
                ))}
            </select>
        </div>

        <div className="anuncios-grid">
          {anunciosMostrados.length > 0 ? (
            anunciosMostrados.map((anuncio) => (
              <div key={anuncio.id} className="anuncio-card">
                <div className="anuncio-card-header">
                  <div className="anuncio-icon"><AnnounceIcon /></div>
                  <div className="anuncio-header-text">
                    <h3 className="anuncio-title">{anuncio.titulo}</h3>
                    <span className="anuncio-meta">
                      Publicado por: {anuncio.profesor} | Para: {anuncio.curso}
                    </span>
                  </div>
                </div>
                <p className="anuncio-content">{anuncio.contenido}</p>
              </div>
            ))
          ) : (
            <div className="no-data-message">No hay anuncios para mostrar.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Anuncios;