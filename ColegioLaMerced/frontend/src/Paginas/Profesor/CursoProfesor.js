import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import axios from "axios";
import "./CursoProfesor.css";

Chart.register(BarElement, CategoryScale, LinearScale);

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
  const [tab, setTab] = useState("alumnos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (cursoSeleccionado === null || !profesorId || loading) return;

    const seccionCursoActual = seccionCursosData.find(
      (sc) => sc.idSeccionCurso === cursoSeleccionado
    );

    if (!seccionCursoActual) {
      setAlumnosPorCurso([]);
      return;
    }

    const { idSeccion, idCurso } = seccionCursoActual;

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
    });
    setAlumnosPorCurso(alumnosConNotas);
    setModoEdicion(null);
    setMostrarEstadisticas(false);
  }, [cursoSeleccionado, alumnosData, cursosUnicosData, seccionCursosData, profesorId, loading]);

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
          <div className="d-flex flex-column flex-md-row mt-4">
            <div className="tab-content flex-grow-1 p-3">
              {tab === "alumnos" && (
                <>
                  <h4>Alumnos del curso</h4>
                  {alumnosPorCurso.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            {examenes.map((examen) => (
                              <th key={examen}>{examen.replace('examen', 'Examen ').trim()}</th>
                            ))}
                            <th>Promedio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alumnosPorCurso.map((alumno) => (
                            <tr
                              key={alumno.id}
                              className={modoEdicion === alumno.id ? "table-info" : ""}
                            >
                              <td>{alumno.id}</td>
                              <td>{alumno.nombre}</td>
                              {examenes.map((examen) => (
                                <td key={examen}>
                                  {modoEdicion === alumno.id && examenSeleccionado === examen ? (
                                    <>
                                      <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        step="0.1"
                                        className="form-control form-control-sm"
                                        value={notaTemporal}
                                        onChange={(e) => setNotaTemporal(e.target.value)}
                                      />
                                      <div className="d-flex flex-column mt-1">
                                        <button
                                          className="btn btn-sm btn-success mb-1"
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
                                    </>
                                  ) : (
                                    <>
                                      {alumno.notas[examen] !== undefined && alumno.notas[examen] !== null
                                        ? alumno.notas[examen]
                                        : "-"}
                                      <button
                                        className="btn btn-sm btn-outline-primary mt-1"
                                        onClick={() => editarNota(alumno.id, examen)}
                                      >
                                        Editar
                                      </button>
                                    </>
                                  )}
                                </td>
                              ))}
                              <td>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted">No hay alumnos inscritos en este curso o sección.</p>
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
                      <h5>Estadísticas del curso</h5>
                      <p>Cantidad de alumnos: <strong>{estadisticasCurso().cantidadAlumnos}</strong></p>
                      <p>Cantidad de notas registradas: <strong>{estadisticasCurso().cantidadNotas}</strong></p>
                      <p>Aprobados: <strong>{estadisticasCurso().aprobados}</strong></p>
                      <p>Desaprobados: <strong>{estadisticasCurso().desaprobados}</strong></p>
                      <p>Nota máxima: <strong>{estadisticasCurso().max}</strong></p>
                      <p>Nota mínima: <strong>{estadisticasCurso().min}</strong></p>
                      <p>Promedio general del curso: <strong>{estadisticasCurso().promedio}</strong></p>

                      <div style={{ maxWidth: "400px", margin: "auto" }}>
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
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  stepSize: 1
                                }
                              }
                            }
                          }}
                        />
                      </div>
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