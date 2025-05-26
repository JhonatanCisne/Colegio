import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral";
import "./Anuncios.css";

function Anuncios() {
  // Datos simulados de anuncios, ahora solo publicados por profesores
  const [anuncios, setAnuncios] = useState([
    {
      id: 1,
      titulo: "Recordatorio: Examen Final de Matemática",
      contenido: "El examen final de Matemática se realizará el 15 de junio a las 10:00 AM en el aula 301. ¡No olviden repasar!",
      fecha: "2025-05-24",
      profesor: "Prof. Juan Pérez", // Publicado por un profesor
      curso: "Matemática 2° Sec"
    },
    {
      id: 2,
      titulo: "Nueva tarea de Lenguaje: Análisis Literario",
      contenido: "Se ha publicado una nueva tarea en el aula virtual sobre el análisis de 'Cien años de soledad'. Fecha límite de entrega: 5 de junio.",
      fecha: "2025-05-23",
      profesor: "Prof. María Gómez", // Publicado por un profesor
      curso: "Lenguaje 2° Sec"
    },
    {
      id: 3,
      titulo: "Charla de Orientación Vocacional",
      contenido: "El próximo martes 27 de mayo tendremos una charla online con un orientador vocacional. Enlace y hora se enviarán por correo electrónico. (Comunicado transmitido por profesores)",
      fecha: "2025-05-22",
      profesor: "Prof. Ana Torres", // Ahora un profesor transmite el anuncio
      curso: "Literatura" // Anuncio general
    },
    {
      id: 4,
      titulo: "Suspensión de clases por feriado",
      contenido: "Se comunica que el día lunes 26 de mayo no habrá clases debido al feriado por el Día de la Bandera. (Comunicado transmitido por profesores)",
      fecha: "2025-05-20",
      profesor: "Prof. Carlos Sánchez", // Ahora un profesor transmite el anuncio
      curso: "General"
    },
    {
      id: 5,
      titulo: "Reunión de Padres y Apoderados",
      contenido: "Invitamos a todos los padres y apoderados a la reunión mensual el viernes 30 de mayo a las 5:00 PM vía Zoom. (Comunicado transmitido por profesores)",
      fecha: "2025-05-18",
      profesor: "Prof. Laura Fernández", // Ahora un profesor transmite el anuncio
      curso: "General"
    },
  ]);

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralEstudiante />
      <div className="contenido-principal-anuncios">
        <h2 className="mb-4" style={{ fontWeight: 700, color: "#8B0000" }}>
          Anuncios
        </h2>

        <div className="anuncios-estudiante-container">
          {anuncios.length === 0 ? (
            <div className="alert alert-info">No hay anuncios disponibles en este momento.</div>
          ) : (
            anuncios
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordena por fecha descendente
              .map((anuncio) => (
                <div key={anuncio.id} className="anuncio-card-estudiante">
                  <div className="anuncio-header">
                    <h5 className="anuncio-titulo">{anuncio.titulo}</h5>
                    <span className="anuncio-fecha">{new Date(anuncio.fecha).toLocaleDateString()}</span>
                  </div>
                  <p className="anuncio-contenido">{anuncio.contenido}</p>
                  <div className="anuncio-footer">
                    <span className="anuncio-profesor">Publicado por: **{anuncio.profesor}**</span>
                    {anuncio.curso && anuncio.curso !== "General" && (
                      <span className="anuncio-curso">Curso: **{anuncio.curso}**</span>
                    )}
                    {anuncio.curso && anuncio.curso === "General" && (
                      <span className="anuncio-curso general">**Anuncio General**</span>
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