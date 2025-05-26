import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral";
import "./Inicio.css";

function Inicio() {
  // Datos simulados del estudiante (reemplazar con datos reales del backend)
  const [datosEstudiante, setDatosEstudiante] = useState({
    nombre: "Sofía Díaz",
    grado: "2° de Secundaria",
    seccion: "B",
    horario: [
      { dia: "Lunes", hora: "08:00 - 09:30", curso: "Matemática", profesor: "Juan Pérez" },
      { dia: "Lunes", hora: "09:30 - 11:00", curso: "Lenguaje", profesor: "María Gómez" },
      { dia: "Martes", hora: "08:00 - 09:30", curso: "Historia", profesor: "Carlos Sánchez" },
      { dia: "Martes", hora: "09:30 - 11:00", curso: "Ciencia y Ambiente", profesor: "Laura Fernández" },
      { dia: "Miércoles", hora: "08:00 - 09:30", curso: "Educación Física", profesor: "Pedro Ramos" },
      { dia: "Miércoles", hora: "09:30 - 11:00", curso: "Arte", profesor: "Ana Torres" },
      // Puedes añadir más días y horas
    ],
    ultimosAnuncios: [
      { id: 1, titulo: "Cambio de horario de Educación Física", fecha: "2025-05-20", contenido: "El curso de Educación Física de los viernes se ha movido al jueves." },
      { id: 2, titulo: "Recordatorio: Pago de pensiones", fecha: "2025-05-18", contenido: "Se recuerda a los padres de familia que la fecha límite para el pago de pensiones es el 30 de mayo." },
      { id: 3, titulo: "Excursión al museo", fecha: "2025-05-15", contenido: "La excursión al museo de ciencias será el 10 de junio. Consultar detalles en el aula virtual." },
    ],
  });

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralEstudiante />
      <div className="contenido-principal-inicio-estudiante">
        <h2 className="mb-4" style={{ fontWeight: 700, color: "#8B0000" }}>
          Bienvenido, {datosEstudiante.nombre}!
        </h2>

        {/* Información del Grado */}
        <div className="info-grado-card mb-4">
          <h3>Tu Grado y Sección</h3>
          <p>Estás en **{datosEstudiante.grado}**</p>
          <p>Sección: **{datosEstudiante.seccion}**</p>
        </div>

        {/* Horario del Estudiante */}
        <div className="seccion-inicio-estudiante">
          <h3 className="mb-3">Tu Horario</h3>
          <div className="horario-container">
            {/* Agrupa el horario por día */}
            {Object.entries(datosEstudiante.horario.reduce((acc, item) => {
              (acc[item.dia] = acc[item.dia] || []).push(item);
              return acc;
            }, {})).map(([dia, clases]) => (
              <div key={dia} className="horario-dia-card">
                <h5>{dia}</h5>
                <ul>
                  {clases.map((clase, index) => (
                    <li key={index}>
                      <span>{clase.hora}</span> - **{clase.curso}** ({clase.profesor})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos Anuncios */}
        <div className="seccion-inicio-estudiante">
          <h3 className="mb-3">Últimos Anuncios</h3>
          <div className="anuncios-container">
            {datosEstudiante.ultimosAnuncios.length === 0 ? (
              <div className="alert alert-info">No hay anuncios recientes.</div>
            ) : (
              datosEstudiante.ultimosAnuncios.map((anuncio) => (
                <div key={anuncio.id} className="anuncio-card">
                  <h5>{anuncio.titulo}</h5>
                  <p className="anuncio-fecha">{anuncio.fecha}</p>
                  <p>{anuncio.contenido}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;