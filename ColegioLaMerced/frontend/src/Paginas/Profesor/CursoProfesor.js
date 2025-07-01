import React, { useState, useEffect, useCallback } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"; // Import Tooltip and Legend
import axios from "axios";
import "./CursoProfesor.css";

// Register Chart.js components including Tooltip and Legend
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Curso() {
  const [profesorId, setProfesorId] = useState(null);
  const [cursosDelProfesor, setCursosDelProfesor] = useState([]);
  const [seccionCursosData, setSeccionCursosData] = useState([]);
  const [seccionesData, setSeccionesData] = useState([]);
  const [cursosData, setCursosData] = useState([]);
  const [alumnosData, setAlumnosData] = useState([]);
  const [cursosUnicosData, setCursosUnicosData] = useState([]);

  const examenes = ["examen1", "examen2", "examen3", "examen4", "examenFinal"];

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [alumnosPorCurso, setAlumnosPorCurso] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [notaTemporal, setNotaTemporal] = useState("");
  const [examenSeleccionado, setExamenSeleccionado] = useState("");
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const [tab, setTab] = useState("alumnos"); // Keep tab state if other tabs are planned
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial data loading effect
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const profesorInfo = JSON.parse(localStorage.getItem('profesorLogged'));
        if (!profesorInfo || !profesorInfo.idProfesor) {
          setError("No se encontró ID de profesor. Por favor, inicie sesión nuevamente.");
          setLoading(false);
          return;
        }
        setProfesorId(profesorInfo.idProfesor);

        const [
          seccionCursosRes,
          seccionesRes,
          cursosRes,
          alumnosRes,
          cursosUnicosRes,
        ] = await Promise.all([
          axios.get("http://localhost:8080/api/seccioncursos"),
          axios.get("http://localhost:8080/api/secciones"),
          axios.get("http://localhost:8080/api/cursos"),
          axios.get("http://localhost:8080/api/alumnos"),
          axios.get("http://localhost:8080/api/cursosunicos"),
        ]);

        setSeccionCursosData(seccionCursosRes.data);
        setSeccionesData(seccionesRes.data);
        setCursosData(cursosRes.data);
        setAlumnosData(alumnosRes.data);
        setCursosUnicosData(cursosUnicosRes.data);

        const misSeccionCursos = seccionCursosRes.data.filter(
          (sc) => sc.idProfesor === profesorInfo.idProfesor
        );

        const cursosParaMostrar = misSeccionCursos.map((sc) => {
          const seccion = seccionesRes.data.find(
            (s) => s.idSeccion === sc.idSeccion
          );
          const curso = cursosRes.data.find((c) => c.idCurso === sc.idCurso);
          return {
            idSeccionCurso: sc.idSeccionCurso,
            nombre: curso ? curso.nombre : "Curso Desconocido",
            seccion: seccion
              ? `${seccion.grado}° ${seccion.nombre}`
              : "Sección Desconocida",
            idSeccion: sc.idSeccion,
            idCurso: sc.idCurso,
          };
        });
        setCursosDelProfesor(cursosParaMostrar);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
        setError("Error al cargar los datos del sistema. Por favor, intente recargar la página.");
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Effect to load students and their grades for the selected course
  // Using useCallback for optimization
  const loadAlumnosYNotas = useCallback(() => {
    if (cursoSeleccionado === null || !profesorId || loading) {
      setAlumnosPorCurso([]);
      return;
    }

    const seccionCursoActual = seccionCursosData.find(
      (sc) => sc.idSeccionCurso === cursoSeleccionado
    );

    if (!seccionCursoActual) {
      setAlumnosPorCurso([]);
      return;
    }

    const cursosUnicosFiltrados = cursosUnicosData.filter(cu =>
      cu.idSeccionCurso === seccionCursoActual.idSeccionCurso
    );

    const idsAlumnosEnCurso = new Set(cursosUnicosFiltrados.map(cu => cu.idAlumno));

    const alumnosDeEstaSeccion = alumnosData.filter(alumno =>
      idsAlumnosEnCurso.has(alumno.idAlumno)
    );

    const alumnosConNotas = alumnosDeEstaSeccion.map((alumno) => {
      const notasAlumno = cursosUnicosFiltrados.find(
        (cu) => cu.idAlumno === alumno.idAlumno
      );

      const notas = {};
      examenes.forEach((examenKey) => {
        const notaValue = notasAlumno ? notasAlumno[examenKey] : undefined;
        notas[examenKey] = (typeof notaValue === 'number' && !isNaN(notaValue)) ? notaValue : undefined;
      });

      return {
        id: alumno.idAlumno,
        idCursoUnico: notasAlumno ? notasAlumno.idCursoUnico : null,
        nombre: `${alumno.nombre} ${alumno.apellido}`,
        notas: notas,
      };
    }).sort((a, b) => a.nombre.localeCompare(b.nombre)); // Sort alphabetically

    setAlumnosPorCurso(alumnosConNotas);
    setModoEdicion(null); // Reset edit mode when course changes
    setMostrarEstadisticas(false); // Hide stats when course changes
  }, [cursoSeleccionado, alumnosData, cursosUnicosData, seccionCursosData, profesorId, loading]);

  useEffect(() => {
    loadAlumnosYNotas();
  }, [loadAlumnosYNotas]);

  const seleccionarCurso = (idSeccionCurso) => {
    setCursoSeleccionado(idSeccionCurso);
    setTab("alumnos");
  };

  const editarNota = (idAlumno, examen) => {
    setModoEdicion(idAlumno);
    setExamenSeleccionado(examen);
    const alumno = alumnosPorCurso.find(a => a.id === idAlumno);
    setNotaTemporal(alumno?.notas[examen] !== undefined && alumno.notas[examen] !== null ? alumno.notas[examen].toString() : "");
  };

  const guardarNota = async (idAlumno) => {
    const nota = parseFloat(notaTemporal);
    if (isNaN(nota) || nota < 0 || nota > 20) {
      alert("Por favor, ingrese una nota válida entre 0 y 20.");
      return;
    }

    const alumnoActual = alumnosPorCurso.find((a) => a.id === idAlumno);
    if (!alumnoActual || alumnoActual.idCursoUnico === null) {
      alert("Error: No se encontró el registro de notas para este alumno en este curso.");
      console.error("No se pudo encontrar idCursoUnico para el alumno:", idAlumno);
      return;
    }

    const idCursoUnico = alumnoActual.idCursoUnico;
    const currentCursoUnico = cursosUnicosData.find(cu => cu.idCursoUnico === idCursoUnico);

    if (!currentCursoUnico) {
      alert("Error: El registro de curso único no se encontró en los datos cargados.");
      console.error("Registro de curso único no encontrado con ID:", idCursoUnico);
      return;
    }

    const updatedCursoUnicoDTO = {
      ...currentCursoUnico,
      [examenSeleccionado]: nota
    };

    try {
      const res = await axios.put(
        `http://localhost:8080/api/cursosunicos/${idCursoUnico}`,
        updatedCursoUnicoDTO
      );

      if (res.status === 200) {
        // Optimistically update the state for a smoother UI
        setCursosUnicosData(prev => prev.map(cu =>
          cu.idCursoUnico === idCursoUnico ? res.data : cu
        ));

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
        setExamenSeleccionado("");
      } else {
        throw new Error("Respuesta no exitosa del servidor al guardar la nota.");
      }
    } catch (err) {
      alert("No se pudo guardar la nota. Verifique su conexión o intente de nuevo.");
      console.error("Error guardando nota:", err);
    }
  };

  const promedioAlumno = (notas) => {
    const valores = Object.values(notas).filter((n) => typeof n === 'number' && !isNaN(n));
    if (valores.length === 0) return "-";
    const suma = valores.reduce((a, b) => a + b, 0);
    return (suma / valores.length).toFixed(2);
  };

  const promedioGeneral = () => {
    if (!cursoSeleccionado || alumnosPorCurso.length === 0) return "-";
    let total = 0;
    let count = 0;
    alumnosPorCurso.forEach((alumno) => {
      const valores = Object.values(alumno.notas).filter((n) => typeof n === 'number' && !isNaN(n));
      valores.forEach((nota) => {
        total += nota;
        count++;
      });
    });
    return count > 0 ? (total / count).toFixed(2) : "-";
  };

  const estadisticasCurso = () => {
    if (!cursoSeleccionado || alumnosPorCurso.length === 0) return null;
    const notas = alumnosPorCurso.flatMap((a) =>
      Object.values(a.notas).filter((n) => typeof n === 'number' && !isNaN(n))
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
      <div className="contenido-principal">
        <h2 className="mb-4" style={{ fontWeight: 700, color: "#1976d2" }}>
          Mis Cursos
        </h2>

        <div className="cursos-lista">
          {cursosDelProfesor.length > 0 ? (
            cursosDelProfesor.map((curso) => (
              <div
                key={curso.idSeccionCurso}
                className={`curso-card${
                  cursoSeleccionado === curso.idSeccionCurso ? " selected" : ""
                }`}
                onClick={() => seleccionarCurso(curso.idSeccionCurso)}
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
            ))
          ) : (
            <p className="text-muted">No se encontraron cursos asignados a este profesor.</p>
          )}
        </div>

        {cursoSeleccionado && (
          <div className="mt-4"> {/* Removed flex-column flex-md-row and tab-content, adjust as needed if you plan more tabs */}
            {tab === "alumnos" && (
              <>
                <h4>Alumnos del curso</h4>
                {alumnosPorCurso.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover align-middle"> {/* Added align-middle for vertical alignment */}
                      <thead className="table-primary"> {/* Styled header */}
                        <tr>
                          <th>Código</th> {/* Changed from Nombre to Código as per your previous request logic */}
                          <th>Nombre del Alumno</th>
                          {examenes.map((examen) => (
                            <th key={examen} className="text-center">{examen.replace('examen', 'Examen ').trim()}</th> 
                          ))}
                          <th className="text-center">Promedio</th> {/* Centered text */}
                        </tr>
                      </thead>
                      <tbody>
                        {alumnosPorCurso.map((alumno) => (
                          <tr
                            key={alumno.id}
                            className={modoEdicion === alumno.id ? "table-info" : ""}
                          >
                            <td>{alumno.id}</td> {/* Displaying alumno.id here */}
                            <td>{alumno.nombre}</td>
                            {examenes.map((examen) => (
                              <td key={examen} className="text-center"> {/* Centered text */}
                                {modoEdicion === alumno.id && examenSeleccionado === examen ? (
                                  <div className="d-flex flex-column align-items-center"> {/* Centered input and buttons */}
                                    <input
                                      type="number"
                                      min="0"
                                      max="20"
                                      step="0.1"
                                      className="form-control form-control-sm text-center" // Center text in input
                                      value={notaTemporal}
                                      onChange={(e) => setNotaTemporal(e.target.value)}
                                      onKeyPress={(e) => { // Allow saving with Enter key
                                        if (e.key === 'Enter') {
                                          guardarNota(alumno.id);
                                        }
                                      }}
                                      style={{ maxWidth: '80px', marginBottom: '5px' }} // Added max-width and margin
                                    />
                                    <div className="d-flex gap-1"> {/* Added gap for spacing */}
                                      <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => guardarNota(alumno.id)}
                                        title="Guardar Nota"
                                      >
                                        💾 {/* Save icon */}
                                      </button>
                                      <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setModoEdicion(null)}
                                        title="Cancelar Edición"
                                      >
                                        ✖️ {/* Cancel icon */}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="d-flex flex-column align-items-center"> {/* Centered grade and button */}
                                    <span className="fw-bold fs-5">
                                      {alumno.notas[examen] !== undefined && alumno.notas[examen] !== null
                                        ? alumno.notas[examen]
                                        : "-"}
                                    </span>
                                    <button
                                      className="btn btn-sm btn-outline-primary mt-1"
                                      onClick={() => editarNota(alumno.id, examen)}
                                      title="Editar Nota"
                                    >
                                      ✏️ {/* Edit icon */}
                                    </button>
                                  </div>
                                )}
                              </td>
                            ))}
                            <td className="text-center"> {/* Centered text */}
                              <span className="fw-bold fs-5">
                                {promedioAlumno(alumno.notas)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot> {/* Added a footer for general average */}
                        <tr>
                          <td colSpan={2} className="text-end fw-bold">Promedio General del Curso:</td>
                          {examenes.map((examen) => (
                            <td key={`avg-${examen}`} className="text-center">
                              {/* You might want to calculate average for each exam here if needed */}
                              -
                            </td>
                          ))}
                          <td className="text-center fw-bold fs-5 text-primary">
                            {promedioGeneral()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="alert alert-info">No hay alumnos inscritos en este curso o sección.</p>
                )}

                {alumnosPorCurso.length > 0 && (
                  <button
                    className="btn btn-info mt-3"
                    onClick={() => setMostrarEstadisticas(!mostrarEstadisticas)}
                  >
                    {mostrarEstadisticas ? "Ocultar Estadísticas" : "Mostrar Estadísticas"}
                  </button>
                )}

                {mostrarEstadisticas && estadisticasCurso() && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    <h5 className="text-primary mb-3">Estadísticas del curso</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <p>Cantidad de alumnos: <strong>{estadisticasCurso().cantidadAlumnos}</strong></p>
                        <p>Cantidad de notas registradas: <strong>{estadisticasCurso().cantidadNotas}</strong></p>
                        <p>Aprobados: <strong className="text-success">{estadisticasCurso().aprobados}</strong></p>
                        <p>Desaprobados: <strong className="text-danger">{estadisticasCurso().desaprobados}</strong></p>
                        <p>Nota máxima: <strong className="text-success">{estadisticasCurso().max}</strong></p>
                        <p>Nota mínima: <strong className="text-danger">{estadisticasCurso().min}</strong></p>
                        <p>Promedio general del curso: <strong className="text-primary">{estadisticasCurso().promedio}</strong></p>
                      </div>
                      <div className="col-md-6 d-flex justify-content-center align-items-center">
                        <div style={{ maxWidth: "400px", width: "100%" }}>
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
                                  borderRadius: 8, // Added border-radius for nicer bars
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false, // Allow charts to resize more freely
                              plugins: {
                                legend: {
                                  display: false,
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      let label = context.dataset.label || '';
                                      if (label) {
                                        label += ': ';
                                      }
                                      if (context.parsed.y !== null) {
                                        label += context.parsed.y;
                                      }
                                      return label;
                                    }
                                  }
                                }
                              },
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  ticks: {
                                    stepSize: 1,
                                    precision: 0 // Ensure integer ticks
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Curso;