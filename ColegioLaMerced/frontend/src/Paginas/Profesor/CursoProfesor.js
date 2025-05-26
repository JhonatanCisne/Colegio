import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./CursoProfesor.css";

Chart.register(BarElement, CategoryScale, LinearScale);

function Curso() {
  const cursosDelProfesor = [
    { id: 1, nombre: "Matemática", seccion: "2° Sec" },
    { id: 2, nombre: "Matemática", seccion: "3° Sec" },
    { id: 3, nombre: "Matemática", seccion: "4° Pri" },
    { id: 4, nombre: "Matemática", seccion: "5° Pri" },
  ];

  const examenes = ["Examen 1", "Examen 2", "Examen 3", "Examen 4", "Examen 5"];

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [alumnosPorCurso, setAlumnosPorCurso] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [notaTemporal, setNotaTemporal] = useState("");
  const [examenSeleccionado, setExamenSeleccionado] = useState("Examen 1");
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const [tab, setTab] = useState("alumnos");

  useEffect(() => {
    if (cursoSeleccionado === null) return;
    fetch(`/api/cursos/${cursoSeleccionado}/alumnos-notas`)
      .then(res => res.json())
      .then(data => {
        setAlumnosPorCurso(data);
      })
      .catch(err => {
        console.error("Error cargando alumnos y notas:", err);
        setAlumnosPorCurso([]);
      });
    setModoEdicion(null);
  }, [cursoSeleccionado]);

  const seleccionarCurso = (idCurso) => {
    setCursoSeleccionado(idCurso);
    setTab("alumnos");
  };

  const editarNota = (idAlumno) => {
    setModoEdicion(idAlumno);
    setNotaTemporal("");
    setExamenSeleccionado("Examen 1");
  };

  const guardarNota = (idAlumno) => {
    const nota = parseFloat(notaTemporal);
    if (isNaN(nota) || nota < 0 || nota > 20) {
      alert("Ingrese una nota válida entre 0 y 20");
      return;
    }

    fetch(`/api/cursos/${cursoSeleccionado}/alumnos/${idAlumno}/notas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examen: examenSeleccionado,
        nota: nota,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Error guardando nota");
        return res.json();
      })
      .then(() => {
        setAlumnosPorCurso((prev) =>
          prev.map((alumno) => {
            if (alumno.id === idAlumno) {
              return {
                ...alumno,
                notas: {
                  ...alumno.notas,
                  [examenSeleccionado]: nota,
                },
              };
            }
            return alumno;
          })
        );
        setModoEdicion(null);
        setNotaTemporal("");
        setExamenSeleccionado("Examen 1");
      })
      .catch((err) => {
        alert("No se pudo guardar la nota. Intente de nuevo.");
        console.error(err);
      });
  };

  const promedioAlumno = (notas) => {
    const valores = Object.values(notas).filter((n) => !isNaN(n));
    if (valores.length === 0) return "-";
    const suma = valores.reduce((a, b) => a + b, 0);
    return (suma / valores.length).toFixed(2);
  };

  const promedioGeneral = () => {
    if (!cursoSeleccionado) return "-";
    let total = 0,
      count = 0;
    alumnosPorCurso.forEach((alumno) => {
      const valores = Object.values(alumno.notas).filter((n) => !isNaN(n));
      valores.forEach((nota) => {
        total += nota;
        count++;
      });
    });
    return count > 0 ? (total / count).toFixed(2) : "-";
  };

  const estadisticasCurso = () => {
    if (!cursoSeleccionado) return null;
    const notas = alumnosPorCurso.flatMap((a) =>
      Object.values(a.notas).filter((n) => !isNaN(n))
    );
    const aprobados = notas.filter((n) => n >= 11).length;
    const desaprobados = notas.filter((n) => n < 11).length;
    const max = notas.length ? Math.max(...notas) : "-";
    const min = notas.length ? Math.min(...notas) : "-";
    return {
      cantidadAlumnos: alumnosPorCurso.length,
      cantidadNotas: notas.length,
      aprobados,
      desaprobados,
      max,
      min,
      promedio: promedioGeneral(),
    };
  };

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralProfesor />
      <div className="contenido-principal">
        <h2 className="mb-4" style={{ fontWeight: 700, color: "#1976d2" }}>
          Mis Cursos
        </h2>

        <div className="cursos-lista">
          {cursosDelProfesor.map((curso) => (
            <div
              key={curso.id}
              className={`curso-card${cursoSeleccionado === curso.id ? " selected" : ""}`}
              onClick={() => seleccionarCurso(curso.id)}
            >
              <span role="img" aria-label="libro">
                📘
              </span>{" "}
              {curso.nombre}
              <br />
              <span style={{ fontSize: "0.95em", color: "#007bff" }}>
                {curso.seccion}
              </span>
            </div>
          ))}
        </div>

        {cursoSeleccionado && (
          <div className="d-flex">
            <div className="tabs-lateral">
              <button
                className={tab === "alumnos" ? "tab-btn active" : "tab-btn"}
                onClick={() => setTab("alumnos")}
              >
                Alumnos
              </button>
            </div>
            <div className="tab-content">
              {tab === "alumnos" && (
                <>
                  <h4>Alumnos del curso</h4>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        {examenes.map((examen) => (
                          <th key={examen}>{examen}</th>
                        ))}
                        <th>Promedio</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alumnosPorCurso.map((alumno) => (
                        <tr
                          key={alumno.id}
                          className={modoEdicion === alumno.id ? "editando" : ""}
                        >
                          <td>{alumno.id}</td>
                          <td>{alumno.nombre}</td>
                          {examenes.map((examen) => (
                            <td key={examen}>
                              {alumno.notas[examen] !== undefined
                                ? alumno.notas[examen]
                                : "-"}
                            </td>
                          ))}
                          <td>{promedioAlumno(alumno.notas)}</td>
                          <td>
                            {modoEdicion === alumno.id ? (
                              <div className="d-flex flex-column">
                                <select
                                  className="form-select mb-1"
                                  value={examenSeleccionado}
                                  onChange={(e) =>
                                    setExamenSeleccionado(e.target.value)
                                  }
                                >
                                  {examenes.map((ex) => (
                                    <option key={ex} value={ex}>
                                      {ex}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.1"
                                  className="form-control mb-1"
                                  value={notaTemporal}
                                  onChange={(e) => setNotaTemporal(e.target.value)}
                                  placeholder="Nota (0-20)"
                                />
                                <button
                                  className="btn btn-sm btn-primary mb-1"
                                  onClick={() => guardarNota(alumno.id)}
                                >
                                  Guardar
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => setModoEdicion(null)}
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => editarNota(alumno.id)}
                              >
                                Editar Nota
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    className="btn btn-info"
                    onClick={() => setMostrarEstadisticas(!mostrarEstadisticas)}
                  >
                    {mostrarEstadisticas ? "Ocultar Estadísticas" : "Mostrar Estadísticas"}
                  </button>

                  {mostrarEstadisticas && (
                    <div className="mt-4">
                      <h5>Estadísticas del curso</h5>
                      <p>Cantidad de alumnos: {estadisticasCurso().cantidadAlumnos}</p>
                      <p>Cantidad de notas registradas: {estadisticasCurso().cantidadNotas}</p>
                      <p>Aprobados: {estadisticasCurso().aprobados}</p>
                      <p>Desaprobados: {estadisticasCurso().desaprobados}</p>
                      <p>Nota máxima: {estadisticasCurso().max}</p>
                      <p>Nota mínima: {estadisticasCurso().min}</p>
                      <p>Promedio general: {estadisticasCurso().promedio}</p>

                      <Bar
                        data={{
                          labels: ["Aprobados", "Desaprobados"],
                          datasets: [
                            {
                              label: "Cantidad de estudiantes",
                              data: [
                                estadisticasCurso().aprobados,
                                estadisticasCurso().desaprobados,
                              ],
                              backgroundColor: ["#4caf50", "#f44336"],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Curso;
