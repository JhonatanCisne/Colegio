import React, { useState, useEffect, useCallback } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "./CursoProfesor.css";

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function CursoProfesor() {
  const [profesorId, setProfesorId] = useState(null);
  const [cursosDelProfesor, setCursosDelProfesor] = useState([]);
  const [seccionCursosData, setSeccionCursosData] = useState([]);
  const [alumnosData, setAlumnosData] = useState([]);
  const [cursosUnicosData, setCursosUnicosData] = useState([]);

  const examenes = ["examen1", "examen2", "examen3", "examen4", "examenFinal"];

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [alumnosPorCurso, setAlumnosPorCurso] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [notaTemporal, setNotaTemporal] = useState("");
  const [examenSeleccionado, setExamenSeleccionado] = useState("");
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
          };
        });
        setCursosDelProfesor(cursosParaMostrar);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos del sistema. Por favor, intente recargar.");
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

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
    }).sort((a, b) => a.nombre.localeCompare(b.nombre));

    setAlumnosPorCurso(alumnosConNotas);
    setModoEdicion(null);
  }, [cursoSeleccionado, alumnosData, cursosUnicosData, seccionCursosData, profesorId, loading]);

  useEffect(() => {
    loadAlumnosYNotas();
  }, [loadAlumnosYNotas]);

  const seleccionarCurso = (idSeccionCurso) => {
    setCursoSeleccionado(idSeccionCurso);
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
      return;
    }

    const idCursoUnico = alumnoActual.idCursoUnico;
    const currentCursoUnico = cursosUnicosData.find(cu => cu.idCursoUnico === idCursoUnico);

    if (!currentCursoUnico) {
      alert("Error: El registro de curso único no se encontró en los datos cargados.");
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
    }
  };

  const promedioAlumno = (notas) => {
    const valores = Object.values(notas).filter((n) => typeof n === 'number' && !isNaN(n));
    if (valores.length === 0) return "-";
    const suma = valores.reduce((a, b) => a + b, 0);
    return (suma / valores.length).toFixed(2);
  };

  const getPromedioClass = (promedio) => {
    if (promedio === "-" || promedio < 10.5) {
      return "promedio-desaprobado";
    }
    return "promedio-aprobado";
  };

  const chartData = {
    labels: examenes.map(e => e.replace('examen', 'Ex. ')),
    datasets: [
      {
        label: 'Promedio de Notas por Examen',
        data: examenes.map(examen => {
          const notasExamen = alumnosPorCurso.map(a => a.notas[examen]).filter(n => typeof n === 'number');
          if (notasExamen.length === 0) return 0;
          const suma = notasExamen.reduce((a, b) => a + b, 0);
          return (suma / notasExamen.length).toFixed(2);
        }),
        backgroundColor: 'rgba(138, 3, 3, 0.6)',
        borderColor: 'rgba(138, 3, 3, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Rendimiento Promedio del Curso' },
    },
    scales: { y: { beginAtZero: true, max: 20 } },
  };

  if (loading) {
    return <div className="page-content">Cargando...</div>;
  }

  if (error) {
    return <div className="page-content">{error}</div>;
  }

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralProfesor />
      <div className="page-content">
        <header className="page-header">
          <h2>Gestión de Cursos y Calificaciones</h2>
          <p>Selecciona un curso para registrar y modificar las notas de los alumnos.</p>
        </header>

        <div className="cursos-selector-grid">
          {cursosDelProfesor.length > 0 ? (
            cursosDelProfesor.map((curso) => (
              <div
                key={curso.idSeccionCurso}
                className={`curso-selector-card${
                  cursoSeleccionado === curso.idSeccionCurso ? " selected" : ""
                }`}
                onClick={() => seleccionarCurso(curso.idSeccionCurso)}
              >
                <div className="curso-card-header">
                  <h3 className="curso-card-title">{curso.nombre}</h3>
                  <p className="curso-card-profesor">{curso.seccion}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No se encontraron cursos asignados.</p>
          )}
        </div>

        {cursoSeleccionado && (
          <div className="notas-details-card">
            <h3 className="notas-header">Calificaciones del Curso</h3>
            <div className="grades-layout">
              <div className="table-responsive">
                {alumnosPorCurso.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Alumno</th>
                        {examenes.map((examen) => (
                          <th key={examen}>{examen.replace('examen', 'Ex. ')}</th>
                        ))}
                        <th>Promedio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alumnosPorCurso.map((alumno) => (
                        <tr key={alumno.id}>
                          <td>{alumno.nombre}</td>
                          {examenes.map((examen) => (
                            <td key={examen}>
                              {modoEdicion === alumno.id && examenSeleccionado === examen ? (
                                <div className="d-flex align-items-center">
                                  <input
                                    type="number"
                                    value={notaTemporal}
                                    onChange={(e) => setNotaTemporal(e.target.value)}
                                    className="form-control form-control-sm"
                                    style={{ width: '70px' }}
                                  />
                                  <button onClick={() => guardarNota(alumno.id)} className="btn btn-sm btn-success ms-1">Guardar</button>
                                  <button onClick={() => setModoEdicion(null)} className="btn btn-sm btn-secondary ms-1">Cancelar</button>
                                </div>
                              ) : (                                
                                <span 
                                  onDoubleClick={() => editarNota(alumno.id, examen)} 
                                  style={{ cursor: 'pointer' }}>
                                    {alumno.notas[examen] ?? "-"}
                                </span>
                              )}
                            </td>
                          ))}
                          <td className={getPromedioClass(promedioAlumno(alumno.notas))}>{promedioAlumno(alumno.notas)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No hay alumnos en este curso.</p>
                )}
              </div>
              <div className="chart-container">
                <Bar options={chartOptions} data={chartData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CursoProfesor;
