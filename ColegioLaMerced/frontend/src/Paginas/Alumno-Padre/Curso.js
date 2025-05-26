import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral"; // Asume que tienes un componente similar para el estudiante
import "./Curso.css"; // Puedes reutilizar o adaptar los estilos de CursoProfesor.css

function Curso() {
  // Datos simulados del estudiante
  // Aquí debes reemplazar esto con datos reales del estudiante logueado
  const [estudianteLogueado, setEstudianteLogueado] = useState({
    id: 101, // ID del estudiante que está viendo sus cursos
    nombre: "Sofía Díaz",
    cursosInscritos: [
      { id: 1, nombre: "Matemática", seccion: "2° Sec" },
      { id: 2, nombre: "Literatura", seccion: "2° Sec" },
      { id: 3, nombre: "Historia", seccion: "2° Sec" },
    ],
  });

  // Datos simulados de notas (para fines de demostración)
  // En una aplicación real, esto se cargaría desde una base de datos
  const [notasEstudiante, setNotasEstudiante] = useState({
    1: { // Notas para el curso con ID 1 (Matemática)
      "Examen 1": 15,
      "Examen 2": 18,
      "Examen 3": 12,
      "Examen 4": 16,
      "Examen 5": 19,
    },
    2: { // Notas para el curso con ID 2 (Literatura)
      "Examen 1": 14,
      "Examen 2": 17,
      "Examen 3": 10,
      "Examen 4": 15,
      "Examen 5": 16,
    },
    3: { // Notas para el curso con ID 3 (Historia)
      "Examen 1": 11,
      "Examen 2": 13,
      "Examen 3": 16,
      "Examen 4": 14,
      "Examen 5": 17,
    },
  });

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const examenes = ["Examen 1", "Examen 2", "Examen 3", "Examen 4", "Examen 5"];

  const seleccionarCurso = (idCurso) => {
    setCursoSeleccionado(idCurso);
  };

  const promedioNotasCurso = (notas) => {
    const valores = Object.values(notas).filter((n) => !isNaN(n));
    if (valores.length === 0) return "-";
    const suma = valores.reduce((a, b) => a + b, 0);
    return (suma / valores.length).toFixed(2);
  };

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralEstudiante />
      <div className="contenido-principal">
        <h2 className="mb-4" style={{ fontWeight: 700, color: "#8B0000" }}>
          Mis Cursos
        </h2>

        <div className="cursos-lista">
          {estudianteLogueado.cursosInscritos.map((curso) => (
            <div
              key={curso.id}
              className={`curso-card ${cursoSeleccionado === curso.id ? "selected" : ""}`}
              onClick={() => seleccionarCurso(curso.id)}
            >
              <span role="img" aria-label="libro">📘</span> {curso.nombre}
              <br />
              <span style={{ fontSize: "0.95em", color: "#8B0000" }}>{curso.seccion}</span>
            </div>
          ))}
        </div>

        {cursoSeleccionado && (
          <div className="tab-content">
            <h4>Notas del curso: {estudianteLogueado.cursosInscritos.find(c => c.id === cursoSeleccionado)?.nombre}</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  {examenes.map((examen) => (
                    <th key={examen}>{examen}</th>
                  ))}
                  <th>Promedio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {examenes.map((examen) => (
                    <td key={examen}>
                      {notasEstudiante[cursoSeleccionado]?.[examen] !== undefined
                        ? notasEstudiante[cursoSeleccionado][examen]
                        : "-"}
                    </td>
                  ))}
                  <td>
                    {promedioNotasCurso(notasEstudiante[cursoSeleccionado] || {})}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Curso;