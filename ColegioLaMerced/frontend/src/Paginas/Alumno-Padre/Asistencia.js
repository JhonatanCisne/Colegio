import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral";
import "./Asistencia.css";

function Asistencia() {
  // Datos simulados del estudiante y sus cursos inscritos
  const [estudianteLogueado, setEstudianteLogueado] = useState({
    id: 101, // ID del estudiante que está viendo su asistencia
    nombre: "Sofía Díaz",
    cursosInscritos: [
      { id: 1, nombre: "Matemática", seccion: "2° Sec" },
      { id: 2, nombre: "Literatura", seccion: "2° Sec" },
      { id: 3, nombre: "Historia", seccion: "2° Sec" },
      { id: 4, nombre: "Ciencia y Ambiente", seccion: "2° Sec" },
    ],
  });

  // Datos simulados de asistencia del estudiante por curso
  // La clave es el ID del curso. Cada curso tiene un array de objetos de asistencia.
  const [asistenciaPorCurso, setAsistenciaPorCurso] = useState({
    1: [ // Asistencia para el curso de Matemática (ID: 1)
      { fecha: "2025-05-05", estado: "Presente" },
      { fecha: "2025-05-12", estado: "Presente" },
      { fecha: "2025-05-19", estado: "Tardanza" },
      { fecha: "2025-05-26", estado: "Presente" },
      { fecha: "2025-06-02", estado: "Ausente" },
    ],
    2: [ // Asistencia para el curso de Literatura (ID: 2)
      { fecha: "2025-05-06", estado: "Presente" },
      { fecha: "2025-05-13", estado: "Presente" },
      { fecha: "2025-05-20", estado: "Presente" },
      { fecha: "2025-05-27", estado: "Tardanza" },
    ],
    3: [ // Asistencia para el curso de Historia (ID: 3)
      { fecha: "2025-05-07", estado: "Presente" },
      { fecha: "2025-05-14", estado: "Presente" },
      { fecha: "2025-05-21", estado: "Presente" },
      { fecha: "2025-05-28", estado: "Ausente" },
    ],
    4: [ // Asistencia para el curso de Ciencia y Ambiente (ID: 4)
      { fecha: "2025-05-08", estado: "Presente" },
      { fecha: "2025-05-15", estado: "Presente" },
      { fecha: "2025-05-22", estado: "Presente" },
    ],
  });

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  // Calcula el resumen de asistencia para un curso dado
  const getResumenAsistencia = (asistencias) => {
    if (!asistencias || asistencias.length === 0) {
      return { presente: 0, tardanza: 0, ausente: 0, total: 0, porcentaje: "0%" };
    }
    const presente = asistencias.filter(a => a.estado === "Presente").length;
    const tardanza = asistencias.filter(a => a.estado === "Tardanza").length;
    const ausente = asistencias.filter(a => a.estado === "Ausente").length;
    const total = asistencias.length;
    const porcentaje = total > 0 ? ((presente + tardanza) / total * 100).toFixed(2) + "%" : "0%"; // Considera tardanza como asistencia para el porcentaje

    return { presente, tardanza, ausente, total, porcentaje };
  };


  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralEstudiante />
      <div className="contenido-principal-asistencia-estudiante">
        <h2 className="mb-4" style={{ fontWeight: 700, color: "#8B0000" }}>
          Mi Asistencia
        </h2>

        <div className="cursos-lista">
          {estudianteLogueado.cursosInscritos.map((curso) => (
            <div
              key={curso.id}
              className={`curso-card ${cursoSeleccionado === curso.id ? "selected" : ""}`}
              onClick={() => setCursoSeleccionado(curso.id)}
            >
              <span role="img" aria-label="libro">📘</span> {curso.nombre}
              <br />
              <span style={{ fontSize: "0.95em", color: "#8B0000" }}>{curso.seccion}</span>
              <div className="resumen-asistencia-card">
                {asistenciaPorCurso[curso.id] && getResumenAsistencia(asistenciaPorCurso[curso.id]).porcentaje} de asistencia
              </div>
            </div>
          ))}
        </div>

        {cursoSeleccionado && (
          <div className="tab-content-asistencia">
            <h4>Asistencia del curso: {estudianteLogueado.cursosInscritos.find(c => c.id === cursoSeleccionado)?.nombre}</h4>

            {asistenciaPorCurso[cursoSeleccionado] && asistenciaPorCurso[cursoSeleccionado].length > 0 ? (
              <>
                <table className="table table-striped asistencia-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistenciaPorCurso[cursoSeleccionado]
                      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordena por fecha descendente
                      .map((asistencia, index) => (
                        <tr key={index} className={`estado-${asistencia.estado.toLowerCase()}`}>
                          <td>{new Date(asistencia.fecha).toLocaleDateString()}</td>
                          <td>{asistencia.estado}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="resumen-final-asistencia">
                  <h5>Resumen General de Asistencia</h5>
                  {(() => {
                    const resumen = getResumenAsistencia(asistenciaPorCurso[cursoSeleccionado]);
                    return (
                      <>
                        <p>Total de clases: <b>{resumen.total}</b></p>
                        <p>Presente: <span className="estado-presente">{resumen.presente}</span></p>
                        <p>Tardanza: <span className="estado-tardanza">{resumen.tardanza}</span></p>
                        <p>Ausente: <span className="estado-ausente">{resumen.ausente}</span></p>
                        <p className="porcentaje-total">Porcentaje de asistencia: <b>{resumen.porcentaje}</b></p>
                      </>
                    );
                  })()}
                </div>
              </>
            ) : (
              <div className="alert alert-info mt-3">No hay registros de asistencia para este curso.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Asistencia;