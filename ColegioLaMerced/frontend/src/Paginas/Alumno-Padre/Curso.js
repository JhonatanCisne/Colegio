import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral";
import "./Curso.css";

function Curso() {
  const [cursosInscritos, setCursosInscritos] = useState([]);
  const [notasEstudiante, setNotasEstudiante] = useState({});
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const examenes = ["examen1", "examen2", "examen3", "examen4", "examenFinal"]; // Nombres de los campos en tu API

  useEffect(() => {
    const cargarCursosYNotas = async () => {
      const alumnoId = localStorage.getItem('alumnoId');
      if (!alumnoId) {
        console.error("No se encontró el ID del alumno en localStorage.");
        // Podrías redirigir al login aquí si es necesario
        return;
      }

      try {
        // 1. Obtener los cursos únicos del alumno
        const resCursosUnicos = await fetch('http://localhost:8080/api/cursosunicos');
        if (!resCursosUnicos.ok) throw new Error('Error al cargar cursos únicos.');
        const allCursosUnicos = await resCursosUnicos.json();
        const cursosDelAlumno = allCursosUnicos.filter(cursoUnico => cursoUnico.idAlumno === parseInt(alumnoId));

        // 2. Obtener la información de SeccionCurso y Curso para cada curso del alumno
        const resSeccionCursos = await fetch('http://localhost:8080/api/seccioncursos');
        if (!resSeccionCursos.ok) throw new Error('Error al cargar secciones de cursos.');
        const allSeccionCursos = await resSeccionCursos.json();

        const resCursos = await fetch('http://localhost:8080/api/cursos');
        if (!resCursos.ok) throw new Error('Error al cargar nombres de cursos.');
        const allCursos = await resCursos.json();

        const cursosFormateados = cursosDelAlumno.map(cursoUnico => {
          const seccionCurso = allSeccionCursos.find(sc => sc.idSeccionCurso === cursoUnico.idSeccionCurso);
          const curso = seccionCurso ? allCursos.find(c => c.idCurso === seccionCurso.idCurso) : null;
          
          return {
            id: cursoUnico.idCursoUnico, // Usamos idCursoUnico como ID principal para el listado y notas
            nombre: curso ? curso.nombre : 'Curso Desconocido',
            seccion: seccionCurso ? `Sección ${seccionCurso.idSeccion}` : 'Sección Desconocida', // Asume que idSeccion es el nombre de la sección
            notas: {
              examen1: cursoUnico.examen1,
              examen2: cursoUnico.examen2,
              examen3: cursoUnico.examen3,
              examen4: cursoUnico.examen4,
              examenFinal: cursoUnico.examenFinal,
            }
          };
        });
        
        setCursosInscritos(cursosFormateados.map(c => ({ id: c.id, nombre: c.nombre, seccion: c.seccion })));

        const notasMap = {};
        cursosFormateados.forEach(curso => {
          notasMap[curso.id] = curso.notas;
        });
        setNotasEstudiante(notasMap);

      } catch (error) {
        console.error("Error al cargar los datos del estudiante:", error);
      }
    };

    cargarCursosYNotas();
  }, []);

  const seleccionarCurso = (idCurso) => {
    setCursoSeleccionado(idCurso);
  };

  const promedioNotasCurso = (notas) => {
    const valores = examenes.map(examen => notas[examen]).filter((n) => !isNaN(n) && n !== null);
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
          {cursosInscritos.map((curso) => (
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
            <h4>Notas del curso: {cursosInscritos.find(c => c.id === cursoSeleccionado)?.nombre}</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  {examenes.map((examen) => (
                    <th key={examen}>{examen.replace('examen', 'Examen ')}</th>
                  ))}
                  <th>Promedio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {examenes.map((examen) => (
                    <td key={examen}>
                      {notasEstudiante[cursoSeleccionado]?.[examen] !== undefined && notasEstudiante[cursoSeleccionado]?.[examen] !== null
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