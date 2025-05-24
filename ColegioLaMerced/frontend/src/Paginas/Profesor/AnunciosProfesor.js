import React, { useState } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import "./AnunciosProfesor.css";

function AnunciosProfesor() {
  const [anuncios, setAnuncios] = useState([
    {
      titulo: "Salida Escolar",
      descripcion: "El próximo viernes habrá una salida educativa al museo de historia. Traer autorización firmada.",
      fecha: "2025-05-24"
    },
    {
      titulo: "Entrega de Boletas",
      descripcion: "La entrega de boletas será el lunes 27 en horario de tutoría. Asistencia obligatoria de padres.",
      fecha: "2025-05-22"
    },
    {
      titulo: "Reunión de Padres",
      descripcion: "Se convoca a reunión virtual el jueves a las 6:00 p.m. por Zoom para tratar temas del segundo bimestre.",
      fecha: "2025-05-20"
    }
  ]);

  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (nuevoTitulo && nuevaDescripcion) {
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
    }
  };

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralProfesor />
      <div className="contenido-principal p-4">
        <h2 className="mb-4" style={{color:"#1976d2", fontWeight:700}}>Publicar Anuncios</h2>

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
          <button type="submit" className="btn btn-primary px-4 py-2">Publicar Anuncio</button>
        </form>

        <h3 className="mb-3" style={{color:"#1976d2"}}>Anuncios Publicados</h3>
        <div className="anuncios-vertical">
          {anuncios.map((anuncio, index) => (
            <div key={index} className="anuncio mb-4 p-3 shadow-sm rounded" style={{background:"#f4f8fd"}}>
              <div className="d-flex align-items-center mb-2">
                <span style={{fontSize:"1.6em", marginRight:10}}>📢</span>
                <h5 className="mb-0" style={{fontWeight:600}}>{anuncio.titulo}</h5>
                <span className="ms-auto" style={{fontSize:"0.98em", color:"#888"}}>
                  {anuncio.fecha}
                </span>
              </div>
              <p style={{marginLeft:32}}>{anuncio.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnunciosProfesor;