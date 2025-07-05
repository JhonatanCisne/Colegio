import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import "./AnunciosProfesor.css";
import axios from "axios";

const AnnounceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

function AnunciosProfesor() {
  const [nombreProfesor, setNombreProfesor] = useState("");
  const [anuncios, setAnuncios] = useState([]);
  const [cursosDelProfesor, setCursosDelProfesor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroCurso, setFiltroCurso] = useState("todos");

  // Formulario de creación
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");

  // Modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAnuncio, setEditingAnuncio] = useState(null);
  const [editedTitulo, setEditedTitulo] = useState("");
  const [editedDescripcion, setEditedDescripcion] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      const profesorData = JSON.parse(localStorage.getItem('profesorLogged'));
      if (!profesorData) {
        setError("No se encontró información del profesor. Por favor, inicie sesión.");
        setLoading(false);
        return;
      }
      setNombreProfesor(`${profesorData.nombre} ${profesorData.apellido}`);

      try {
        const [anunciosRes, seccionCursosRes, cursosRes, seccionesRes] = await Promise.all([
          axios.get("http://localhost:8080/api/anuncios"),
          axios.get("http://localhost:8080/api/seccioncursos"),
          axios.get("http://localhost:8080/api/cursos"),
          axios.get("http://localhost:8080/api/secciones"),
        ]);

        const misSeccionCursos = seccionCursosRes.data.filter(sc => sc.idProfesor === profesorData.idProfesor);
        const misSeccionCursosIds = misSeccionCursos.map(sc => sc.idSeccionCurso);

        const cursosParaDropdown = misSeccionCursos.map(sc => {
          const curso = cursosRes.data.find(c => c.idCurso === sc.idCurso);
          const seccion = seccionesRes.data.find(s => s.idSeccion === sc.idSeccion);
          return { 
            id: sc.idSeccionCurso, 
            nombre: `${curso.nombre} - ${seccion.grado}° ${seccion.nombre}`
          };
        });
        setCursosDelProfesor(cursosParaDropdown);

        const anunciosFiltrados = anunciosRes.data
          .filter(anuncio => misSeccionCursosIds.includes(anuncio.idSeccionCurso))
          .map(anuncio => {
            const seccionCurso = seccionCursosRes.data.find(sc => sc.idSeccionCurso === anuncio.idSeccionCurso);
            const curso = cursosRes.data.find(c => c.idCurso === seccionCurso.idCurso);
            const seccion = seccionesRes.data.find(s => s.idSeccion === seccionCurso.idSeccion);
            return {
              id: anuncio.idAnuncio,
              titulo: anuncio.contenido.split('\n')[0].replace('Título: ', ''),
              contenido: anuncio.contenido.split('\n').slice(1).join('\n').replace('Descripción: ', ''),
              profesor: anuncio.nombreProfesor,
              curso: `${curso.nombre} - ${seccion.grado}° ${seccion.nombre}`,
              idSeccionCurso: anuncio.idSeccionCurso
            };
          });
        
        setAnuncios(anunciosFiltrados.sort((a, b) => b.id - a.id));

      } catch (err) {
        setError("Error al cargar los datos. Intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const handleCrearAnuncio = async (e) => {
    e.preventDefault();
    if (!nuevoTitulo || !nuevaDescripcion || !cursoSeleccionado) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const profesorData = JSON.parse(localStorage.getItem('profesorLogged'));
    const nuevoAnuncio = {
      nombreProfesor: `${profesorData.nombre} ${profesorData.apellido}`,
      contenido: `Título: ${nuevoTitulo}\nDescripción: ${nuevaDescripcion}`,
      idSeccionCurso: parseInt(cursoSeleccionado),
    };

    try {
      const res = await axios.post("http://localhost:8080/api/anuncios", nuevoAnuncio);
      window.location.reload();
    } catch (error) {
      alert("No se pudo crear el anuncio.");
    }
  };

  const openEditModal = (anuncio) => {
    setEditingAnuncio(anuncio);
    setEditedTitulo(anuncio.titulo);
    setEditedDescripcion(anuncio.contenido);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAnuncio(null);
  };

  const handleUpdateAnuncio = async (e) => {
    e.preventDefault();
    if (!editedTitulo || !editedDescripcion) {
        alert("El título y la descripción не pueden estar vacíos.");
        return;
    }

    const anuncioParaBackend = {
        idAnuncio: editingAnuncio.id,
        nombreProfesor: nombreProfesor,
        contenido: `Título: ${editedTitulo}\nDescripción: ${editedDescripcion}`,
        idSeccionCurso: editingAnuncio.idSeccionCurso,
    };

    const anuncioParaEstado = {
        ...editingAnuncio,
        titulo: editedTitulo,
        contenido: editedDescripcion,
    };

    try {
        await axios.put(`http://localhost:8080/api/anuncios/${editingAnuncio.id}`, anuncioParaBackend);
        setAnuncios(anuncios.map(a => a.id === editingAnuncio.id ? anuncioParaEstado : a));
        closeEditModal();
    } catch (error) {
        alert("No se pudo actualizar el anuncio.");
    }
  };

  const anunciosMostrados = anuncios.filter(anuncio => 
    filtroCurso === "todos" || anuncio.curso === filtroCurso
  );

  const cursosDisponibles = [...new Set(anuncios.map(a => a.curso))];

  if (loading) return <div className="page-content">Cargando...</div>;
  if (error) return <div className="page-content">{error}</div>;

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralProfesor nombre={nombreProfesor} />
      <div className="page-content">
        <header className="page-header">
          <h2>Anuncios y Novedades</h2>
          <p>Crea y gestiona los anuncios para tus cursos.</p>
        </header>

        <div className="anuncio-form-card">
          <h3>Crear Nuevo Anuncio</h3>
          <form onSubmit={handleCrearAnuncio}>
            <div className="form-group">
              <label className="form-label">Título</label>
              <input type="text" className="form-control" value={nuevoTitulo} onChange={e => setNuevoTitulo(e.target.value)} placeholder="Título del anuncio" />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" value={nuevaDescripcion} onChange={e => setNuevaDescripcion(e.target.value)} placeholder="Contenido del anuncio"></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Curso</label>
              <select className="form-select" value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)}>
                <option value="">Selecciona un curso</option>
                {cursosDelProfesor.map(curso => (
                  <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-submit">Publicar Anuncio</button>
          </form>
        </div>

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
          {anunciosMostrados.map((anuncio) => (
              <div key={anuncio.id} className="anuncio-card">
                <div className="anuncio-card-header">
                  <div className="anuncio-icon"><AnnounceIcon /></div>
                  <div className="anuncio-header-text">
                    <h3 className="anuncio-title">{anuncio.titulo}</h3>
                    <span className="anuncio-meta">Publicado por: {anuncio.profesor} | Para: {anuncio.curso}</span>
                  </div>
                  <button className="edit-btn" onClick={() => openEditModal(anuncio)}><EditIcon /></button>
                </div>
                <p className="anuncio-content">{anuncio.contenido}</p>
              </div>
            ))}
        </div>

        {isEditModalOpen && (
            <div className="modal-backdrop">
                <div className="modal-content">
                    <h3>Editar Anuncio</h3>
                    <form onSubmit={handleUpdateAnuncio}>
                        <div className="form-group">
                            <label>Título</label>
                            <input type="text" value={editedTitulo} onChange={e => setEditedTitulo(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea value={editedDescripcion} onChange={e => setEditedDescripcion(e.target.value)}></textarea>
                        </div>
                        <div className="modal-actions">
                            <button type="submit" className="btn-submit">Guardar Cambios</button>
                            <button type="button" className="btn-cancel" onClick={closeEditModal}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

export default AnunciosProfesor;