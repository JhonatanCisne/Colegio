import React, { useState } from "react";
import BarraDeNavegacionLateral from "../../Componentes/BarraDeNavegacionLateral";
import "./Anuncios.css";

function AnunciosProfesor() {
  const [anuncios, setAnuncios] = useState([
    {
      titulo: "Salida Escolar",
      descripcion: "El próximo viernes habrá una salida educativa al museo de historia. Traer autorización firmada."
    },
    {
      titulo: "Entrega de Boletas",
      descripcion: "La entrega de boletas será el lunes 27 en horario de tutoría. Asistencia obligatoria de padres."
    },
    {
      titulo: "Reunión de Padres",
      descripcion: "Se convoca a reunión virtual el jueves a las 6:00 p.m. por Zoom para tratar temas del segundo bimestre."
    }
  ]);

  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (nuevoTitulo && nuevaDescripcion) {
      setAnuncios([...anuncios, { titulo: nuevoTitulo, descripcion: nuevaDescripcion }]);
      setNuevoTitulo("");
      setNuevaDescripcion("");
    }
  };

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateral />
      <div className="contenido-principal p-4">
        <h2 className="mb-4">Publicar Anuncios</h2>

        <form onSubmit={manejarEnvio} className="mb-5">
          <div className="mb-3">
            <label className="form-label">Título del Anuncio</label>
            <input
              type="text"
              className="form-control"
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Publicar Anuncio</button>
        </form>

        <h3 className="mb-3">Anuncios Publicados</h3>
        <div className="anuncios-vertical">
          {anuncios.map((anuncio, index) => (
            <div key={index} className="anuncio mb-4 p-3 border rounded">
              <h5>{anuncio.titulo}</h5>
              <p>{anuncio.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnunciosProfesor;