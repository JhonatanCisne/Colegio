import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import "./AnunciosProfesor.css";
import axios from "axios";

function AnunciosProfesor() {
  const [anuncios, setAnuncios] = useState([]);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [profesorId, setProfesorId] = useState(null);
  const [nombreProfesor, setNombreProfesor] = useState("");
  const [cursosDelProfesor, setCursosDelProfesor] = useState([]);
  const [cursoSeleccionadoParaAnuncio, setCursoSeleccionadoParaAnuncio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const profesorInfo = JSON.parse(localStorage.getItem('profesorLogged'));
        if (!profesorInfo || !profesorInfo.idProfesor) {
          setError("No se encontró ID de profesor. Por favor, inicie sesión nuevamente.");
          setLoading(false);
          return;
        }
        setProfesorId(profesorInfo.idProfesor);
        setNombreProfesor(`${profesorInfo.nombre} ${profesorInfo.apellido}`);

        const [anunciosRes, seccionCursosRes, seccionesRes, cursosRes] = await Promise.all([
          axios.get("http://localhost:8080/api/anuncios"),
          axios.get("http://localhost:8080/api/seccioncursos"),
          axios.get("http://localhost:8080/api/secciones"),
          axios.get("http://localhost:8080/api/cursos"),
        ]);

        const misSeccionCursos = seccionCursosRes.data.filter(
          (sc) => sc.idProfesor === profesorInfo.idProfesor
        );

        const idsCursosDelProfesor = misSeccionCursos.map(sc => sc.idSeccionCurso);

        const cursosParaMostrar = misSeccionCursos.map((sc) => {
          const seccion = seccionesRes.data.find(
            (s) => s.idSeccion === sc.idSeccion
          );
          const curso = cursosRes.data.find((c) => c.idCurso === sc.idCurso);
          return {
            idSeccionCurso: sc.idSeccionCurso,
            nombreCompleto: `${curso ? curso.nombre : "Curso Desconocido"} - ${
              seccion ? `${seccion.grado}° ${seccion.nombre}` : "Sección Desconocida"
            }`,
          };
        });
        setCursosDelProfesor(cursosParaMostrar);

        const anunciosFiltrados = anunciosRes.data.filter(anuncio => 
          idsCursosDelProfesor.includes(anuncio.idSeccionCurso)
        );
        
        const anunciosFormateados = anunciosFiltrados.map(anuncio => ({
          titulo: anuncio.nombreProfesor,
          descripcion: anuncio.contenido,
          fecha: new Date(anuncio.idAnuncio).toISOString().slice(0, 10) 
        }));
        setAnuncios(anunciosFormateados);
        setLoading(false);

      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
        setError("Error al cargar los datos. Por favor, intente recargar la página.");
        setLoading(false);
      }
    };

    cargarDatosIniciales();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (nuevoTitulo && nuevaDescripcion && cursoSeleccionadoParaAnuncio) {
      const nuevoAnuncio = {
        nombreProfesor: nombreProfesor,
        contenido: `Título: ${nuevoTitulo}\nDescripción: ${nuevaDescripcion}`,
        idSeccionCurso: parseInt(cursoSeleccionadoParaAnuncio),
      };

      try {
        const res = await axios.post("http://localhost:8080/api/anuncios", nuevoAnuncio);
        if (res.status === 201) {
          setAnuncios([
            { 
              titulo: nuevoTitulo, 
              descripcion: nuevaDescripcion, 
              fecha: new Date().toISOString().slice(0, 10) 
            },
            ...anuncios
          ]);
          setNuevoTitulo("");
          setNuevaDescripcion("");
          setCursoSeleccionadoParaAnuncio("");
        } else {
          throw new Error("Error al publicar el anuncio.");
        }
      } catch (err) {
        alert("No se pudo publicar el anuncio. Verifique su conexión o intente de nuevo.");
        console.error("Error al publicar anuncio:", err);
      }
    } else {
      alert("Por favor, complete todos los campos y seleccione un curso.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
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
      <BarraDeNavegacionLateralProfesor />
      <div className="contenido-principal p-4">
        <h2 className="mb-4" style={{ color: "#1976d2", fontWeight: 700 }}>Publicar Anuncios</h2>

        <form onSubmit={manejarEnvio} className="mb-5 anuncio-form">
          <div className="mb-3">
            <label className="form-label fw-bold">Título del Anuncio</label>
            <input
              type="text"
              className="form-control"
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
              required
              placeholder="Ej: Aviso importante"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Descripción</label>
            <textarea
              className="form-control"
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
              required
              placeholder="Escribe aquí el detalle del anuncio..."
              rows={3}
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Seleccionar Curso</label>
            <select
              className="form-select"
              value={cursoSeleccionadoParaAnuncio}
              onChange={(e) => setCursoSeleccionadoParaAnuncio(e.target.value)}
              required
            >
              <option value="">Seleccione un curso</option>
              {cursosDelProfesor.map((curso) => (
                <option key={curso.idSeccionCurso} value={curso.idSeccionCurso}>
                  {curso.nombreCompleto}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary px-4 py-2">Publicar Anuncio</button>
        </form>

        <h3 className="mb-3" style={{ color: "#1976d2" }}>Anuncios Publicados</h3>
        <div className="anuncios-vertical">
          {anuncios.length > 0 ? (
            anuncios.map((anuncio, index) => (
              <div key={index} className="anuncio mb-4 p-3 shadow-sm rounded" style={{ background: "#f4f8fd" }}>
                <div className="d-flex align-items-center mb-2">
                  <span style={{ fontSize: "1.6em", marginRight: 10 }}>📢</span>
                  <h5 className="mb-0" style={{ fontWeight: 600 }}>{anuncio.titulo}</h5>
                  <span className="ms-auto" style={{ fontSize: "0.98em", color: "#888"}}>
                    {anuncio.fecha}
                  </span>
                </div>
                <p style={{ marginLeft: 32 }}>{anuncio.descripcion}</p>
              </div>
            ))
          ) : (
            <p className="text-muted">No hay anuncios publicados para tus cursos.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnunciosProfesor;