import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral";
import "./Anuncios.css";
import axios from "axios";

function Anuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alumnoId, setAlumnoId] = useState(null);
  const [idSeccionCursoAlumno, setIdSeccionCursoAlumno] = useState(null);

  useEffect(() => {
    const cargarAnunciosDelEstudiante = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedAlumnoId = localStorage.getItem('alumnoId');
        if (!storedAlumnoId) {
          setError("No se encontró el ID del estudiante. Por favor, inicie sesión nuevamente.");
          setLoading(false);
          return;
        }
        setAlumnoId(parseInt(storedAlumnoId));

        const cursosUnicosRes = await axios.get("http://localhost:8080/api/cursosunicos");
        const cursoUnicoDelAlumno = cursosUnicosRes.data.find(
          (cu) => cu.idAlumno === parseInt(storedAlumnoId)
        );

        if (!cursoUnicoDelAlumno) {
          setError("No se encontró información de cursos para este estudiante.");
          setLoading(false);
          setAnuncios([]);
          return;
        }

        const seccionCursoId = cursoUnicoDelAlumno.idSeccionCurso;
        setIdSeccionCursoAlumno(seccionCursoId);

        const todosLosAnunciosRes = await axios.get("http://localhost:8080/api/anuncios");

        const anunciosFiltrados = todosLosAnunciosRes.data.filter(
          (anuncio) => anuncio.idSeccionCurso === seccionCursoId
        );

        const seccionCursosRes = await axios.get("http://localhost:8080/api/seccioncursos");
        const seccionesRes = await axios.get("http://localhost:8080/api/secciones");
        const cursosRes = await axios.get("http://localhost:8080/api/cursos");

        const anunciosFormateados = await Promise.all(anunciosFiltrados.map(async (anuncio) => {
          const seccionCursoDetalle = seccionCursosRes.data.find(sc => sc.idSeccionCurso === anuncio.idSeccionCurso);
          let nombreCurso = "Desconocido";
          let nombreSeccion = "Desconocida";

          if (seccionCursoDetalle) {
            const cursoDetalle = cursosRes.data.find(c => c.idCurso === seccionCursoDetalle.idCurso);
            const seccionDetalle = seccionesRes.data.find(s => s.idSeccion === seccionCursoDetalle.idSeccion);
            if (cursoDetalle) nombreCurso = cursoDetalle.nombre;
            if (seccionDetalle) nombreSeccion = `${seccionDetalle.grado}° ${seccionDetalle.nombre}`;
          }

          return {
            id: anuncio.idAnuncio,
            titulo: anuncio.nombreProfesor,
            contenido: anuncio.contenido,
            profesor: anuncio.nombreProfesor,
            idSeccionCurso: anuncio.idSeccionCurso,
            nombreCursoSeccion: `${nombreCurso} (${nombreSeccion})`
          };
        }));
        
        anunciosFormateados.sort((a, b) => b.id - a.id);

        setAnuncios(anunciosFormateados);
      } catch (err) {
        console.error("Error al obtener los anuncios del estudiante:", err);
        setError("Error al cargar los anuncios. Intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    cargarAnunciosDelEstudiante();
  }, [alumnoId]);

  if (loading) {
    return (
      <div className="d-flex">
        <BarraDeNavegacionLateralEstudiante />
        <div className="contenido-principal-anuncios">
          <h2 className="mb-4" style={{ fontWeight: 700, color: "#8B0000" }}>
            Anuncios
          </h2>
          <div className="alert alert-info">Cargando anuncios...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex">
        <BarraDeNavegacionLateralEstudiante />
        <div className="contenido-principal-anuncios">
          <h2 className="mb-4" style={{ fontWeight: 700, color: "#8B0000" }}>
            Anuncios
          </h2>
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralEstudiante />
      <div className="contenido-principal-anuncios">
        <h2 className="mb-4" style={{ fontWeight: 700, color: "#8B0000" }}>
          Anuncios
        </h2>

        <div className="anuncios-estudiante-container">
          {anuncios.length === 0 ? (
            <div className="alert alert-info">No hay anuncios disponibles para tus cursos en este momento.</div>
          ) : (
            anuncios.map((anuncio) => (
              <div key={anuncio.id} className="anuncio-card-estudiante">
                <div className="anuncio-header">
                  <h5 className="anuncio-titulo">Anuncio de {anuncio.titulo}</h5>
                </div>
                <p className="anuncio-contenido">{anuncio.contenido}</p>
                <div className="anuncio-footer">
                  <span className="anuncio-profesor">Publicado por: **{anuncio.profesor}**</span>
                  {anuncio.nombreCursoSeccion && (
                    <span className="anuncio-curso">Para: **{anuncio.nombreCursoSeccion}**</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Anuncios;