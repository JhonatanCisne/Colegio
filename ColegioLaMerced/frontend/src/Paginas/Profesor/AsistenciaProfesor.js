import React, { useState, useEffect, useCallback } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "./AsistenciaProfesor.css";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AsistenciaProfesor() {
  const [profesorId, setProfesorId] = useState(null);
  const [cursosDelProfesor, setCursosDelProfesor] = useState([]);
  const [seccionCursosData, setSeccionCursosData] = useState([]);
  const [seccionesData, setSeccionesData] = useState([]);
  const [cursosData, setCursosData] = useState([]);
  const [alumnosData, setAlumnosData] = useState([]);
  const [cursosUnicosData, setCursosUnicosData] = useState([]); // Datos de todos los CursoUnico
  const [asistenciasGuardadas, setAsistenciasGuardadas] = useState([]); // Todas las asistencias registradas
  
  const [cursoSeleccionadoId, setCursoSeleccionadoId] = useState(""); // idSeccionCurso del selector
  const [alumnosParaTomarAsistencia, setAlumnosParaTomarAsistencia] = useState([]); // Alumnos para la tabla
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10)); // Fecha actual
  const [asistenciaActual, setAsistenciaActual] = useState({}); // {idAlumno: "Presente"|"Ausente"|"Tardanza", ...} para la fecha y curso seleccionados
  
  const [mostrarGrafica, setMostrarGrafica] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar los datos iniciales de todas las APIs necesarias
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const profesorInfo = JSON.parse(localStorage.getItem('profesorLogged'));
        if (!profesorInfo || !profesorInfo.idProfesor) {
          setError("No se encontró ID de profesor. Inicie sesión nuevamente.");
          setLoading(false);
          return;
        }
        setProfesorId(profesorInfo.idProfesor);

        const [
          seccionCursosRes,
          seccionesRes,
          cursosRes,
          alumnosRes,
          cursosUnicosRes, // Necesitamos CursoUnico para asociar alumnos a secciones/cursos
          asistenciasRes,  // Todas las asistencias registradas
        ] = await Promise.all([
          axios.get("http://localhost:8080/api/seccioncursos"),
          axios.get("http://localhost:8080/api/secciones"),
          axios.get("http://localhost:8080/api/cursos"),
          axios.get("http://localhost:8080/api/alumnos"),
          axios.get("http://localhost:8080/api/cursosunicos"), 
          axios.get("http://localhost:8080/api/asistencias"),
        ]);

        setSeccionCursosData(seccionCursosRes.data);
        setSeccionesData(seccionesRes.data);
        setCursosData(cursosRes.data);
        setAlumnosData(alumnosRes.data);
        setCursosUnicosData(cursosUnicosRes.data); 
        setAsistenciasGuardadas(asistenciasRes.data);

        // Filtrar los cursos que imparte este profesor
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
            nombre: curso ? curso.nombre : "Desconocido",
            seccion: seccion
              ? `${seccion.grado}° ${seccion.nombre}`
              : "Desconocida",
            idSeccion: sc.idSeccion,
            idCurso: sc.idCurso,
          };
        });
        setCursosDelProfesor(cursosParaMostrar);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
        setError("Error al cargar los datos del sistema. Intente recargar.");
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Efecto para cargar los alumnos de la sección seleccionada y su asistencia para la fecha
  const loadAlumnosYAsistencia = useCallback(() => {
    if (!cursoSeleccionadoId || !profesorId) {
      setAlumnosParaTomarAsistencia([]);
      setAsistenciaActual({});
      return;
    }

    // 1. Encontrar los registros de CursoUnico para la seccionCurso seleccionada
    const cursosUnicosEnSeccion = cursosUnicosData.filter(
      (cu) => cu.idSeccionCurso === cursoSeleccionadoId
    );

    // 2. Obtener los detalles de los alumnos a partir de estos CursoUnicos
    // Se mapea cada CursoUnico a un objeto de alumno con su id, nombre y el idCursoUnico
    const alumnosEnEstaSeccion = cursosUnicosEnSeccion.map((cu) => {
      const alumno = alumnosData.find((a) => a.idAlumno === cu.idAlumno);
      return {
        id: cu.idAlumno, // ID del alumno para la key y para el estado de asistenciaActual
        nombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : "Alumno Desconocido",
        idCursoUnico: cu.idCursoUnico, // Necesitamos el idCursoUnico para enviar al backend
      };
    }).sort((a, b) => a.nombre.localeCompare(b.nombre)); // Opcional: ordenar por nombre

    setAlumnosParaTomarAsistencia(alumnosEnEstaSeccion);

    // 3. Cargar asistencia existente para la fecha y curso seleccionados
    const estadosAsistencia = {};
    asistenciasGuardadas.forEach((asist) => {
      // Para cada asistencia guardada, buscamos su CursoUnico para ver a qué idSeccionCurso y idAlumno pertenece
      const cuAsistencia = cursosUnicosData.find(cu => cu.idCursoUnico === asist.idCursoUnico);
      
      // Si el CursoUnico existe, su idSeccionCurso coincide y la fecha de la asistencia coincide
      if (cuAsistencia && cuAsistencia.idSeccionCurso === cursoSeleccionadoId && asist.fecha === fecha) {
        estadosAsistencia[cuAsistencia.idAlumno] = asist.estado;
      }
    });
    setAsistenciaActual(estadosAsistencia);

  }, [cursoSeleccionadoId, fecha, profesorId, alumnosData, cursosUnicosData, asistenciasGuardadas]);

  useEffect(() => {
    // Cuando el curso o la fecha cambian, recargamos los alumnos y la asistencia
    loadAlumnosYAsistencia();
  }, [loadAlumnosYAsistencia]);

  // Manejador para cambiar el curso seleccionado
  const handleCursoChange = (e) => {
    setCursoSeleccionadoId(parseInt(e.target.value));
    setMostrarGrafica(false); // Ocultar gráfica al cambiar de curso
  };

  // Función para guardar o actualizar la asistencia individualmente
  const guardarAsistencia = async () => {
    if (!cursoSeleccionadoId || alumnosParaTomarAsistencia.length === 0) {
      alert("Seleccione un curso y asegúrese de que haya alumnos matriculados.");
      return;
    }

    try {
        // Itera sobre cada alumno en la tabla para guardar/actualizar su asistencia
        for (const alumno of alumnosParaTomarAsistencia) {
            const estado = asistenciaActual[alumno.id] || "Presente"; // Por defecto "Presente"

            // Busca si ya existe un registro de asistencia para este idCursoUnico y fecha
            const existingAsistencia = asistenciasGuardadas.find(asist => 
                asist.idCursoUnico === alumno.idCursoUnico && 
                asist.fecha === fecha
            );

            const asistenciaData = {
                idCursoUnico: alumno.idCursoUnico,
                fecha: fecha,
                estado: estado,
            };

            if (existingAsistencia) {
                // Si existe, actualiza el registro (PUT)
                await axios.put(`http://localhost:8080/api/asistencias/${existingAsistencia.idAsistencia}`, asistenciaData);
            } else {
                // Si no existe, crea un nuevo registro (POST)
                await axios.post(`http://localhost:8080/api/asistencias`, asistenciaData);
            }
        }
        
        // Después de guardar todo, recarga todas las asistencias para que el estado global esté actualizado
        // Esto es crucial para que la gráfica y futuras selecciones de fecha/curso reflejen los cambios
        const updatedAsistenciasRes = await axios.get("http://localhost:8080/api/asistencias");
        setAsistenciasGuardadas(updatedAsistenciasRes.data);
        
        // Re-ejecutar loadAlumnosYAsistencia para que la UI se actualice con los datos guardados
        loadAlumnosYAsistencia(); 
        
        alert("Asistencia guardada con éxito.");
    } catch (err) {
      console.error("Error al guardar la asistencia:", err);
      alert("Hubo un error al guardar la asistencia. Intente de nuevo.");
    }
  };

  // Función para el resumen de asistencia para la gráfica
  const resumenAsistencia = () => {
    if (!cursoSeleccionadoId) return { Presente: 0, Ausente: 0, Tardanza: 0 };

    // Obtenemos los idCursoUnico que pertenecen al cursoSeleccionadoId
    const idCursosUnicosDeEstaSeccion = cursosUnicosData
      .filter(cu => cu.idSeccionCurso === cursoSeleccionadoId)
      .map(cu => cu.idCursoUnico);

    // Filtramos las asistencias guardadas que corresponden a estos idCursoUnico
    const asistenciasDelCurso = asistenciasGuardadas.filter(asist => 
        idCursosUnicosDeEstaSeccion.includes(asist.idCursoUnico)
    );

    let Presente = 0, Ausente = 0, Tardanza = 0;
    asistenciasDelCurso.forEach(reg => {
      if (reg.estado === "Presente") Presente++;
      else if (reg.estado === "Ausente") Ausente++;
      else if (reg.estado === "Tardanza") Tardanza++;
    });
    return { Presente, Ausente, Tardanza };
  };

  // Mensajes de carga y error
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
        <h2 className="mb-4" style={{fontWeight:700, color:"#1976d2"}}>Registro de Asistencia</h2>

        <div className="mb-4 d-flex align-items-center flex-wrap gap-3">
          <label className="fw-bold mb-0">Curso y Sección:</label>
          <select
            className="form-select"
            value={cursoSeleccionadoId || ""}
            onChange={handleCursoChange}
            style={{maxWidth: 320}}
          >
            <option value="">-- Selecciona un curso --</option>
            {cursosDelProfesor.map((curso) => (
              <option key={curso.idSeccionCurso} value={curso.idSeccionCurso}>
                {curso.nombre} - {curso.seccion}
              </option>
            ))}
          </select>
          
          {cursoSeleccionadoId && (
            <button
              className="btn btn-outline-success"
              onClick={() => setMostrarGrafica(true)}
            >
              <span role="img" aria-label="gráfica">📊</span> gráfica 
            </button>
          )}
        </div>

        {cursoSeleccionadoId && (
          <>
            <div className="mb-3 d-flex align-items-center gap-3">
              <label className="fw-bold mb-0">Fecha:</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="form-control"
                style={{ maxWidth: 180 }}
              />
            </div>
            
            {alumnosParaTomarAsistencia.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle asistencia-table">
                        <thead className="table-primary">
                            <tr>
                                <th>Alumno</th>
                                <th>
                                <span role="img" aria-label="presente">✅</span> Presente
                                </th>
                                <th>
                                <span role="img" aria-label="ausente">❌</span> Ausente
                                </th>
                                <th>
                                <span role="img" aria-label="tardanza">⏰</span> Tardanza
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnosParaTomarAsistencia.map(alumno => (
                                <tr key={alumno.id}>
                                    <td style={{fontWeight:500}}>{alumno.nombre}</td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`asistencia-${alumno.id}`}
                                            checked={asistenciaActual[alumno.id] === "Presente" || !asistenciaActual[alumno.id]}
                                            onChange={() => setAsistenciaActual({ ...asistenciaActual, [alumno.id]: "Presente" })}
                                            style={{width:22, height:22}}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`asistencia-${alumno.id}`}
                                            checked={asistenciaActual[alumno.id] === "Ausente"}
                                            onChange={() => setAsistenciaActual({ ...asistenciaActual, [alumno.id]: "Ausente" })}
                                            style={{width:22, height:22}}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`asistencia-${alumno.id}`}
                                            checked={asistenciaActual[alumno.id] === "Tardanza"}
                                            onChange={() => setAsistenciaActual({ ...asistenciaActual, [alumno.id]: "Tardanza" })}
                                            style={{width:22, height:22}}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="alert alert-info">No hay alumnos matriculados en este curso y sección.</p>
            )}

            {alumnosParaTomarAsistencia.length > 0 && (
                <div style={{display:"flex", justifyContent:"center"}}>
                    <button className="btn btn-success btn-lg mb-4 px-5" onClick={guardarAsistencia}>
                        Guardar asistencia
                    </button>
                </div>
            )}

            {mostrarGrafica && (
              <div className="modal-estadisticas">
                <div className="modal-content">
                  <h4 className="mb-3" style={{color:"#1976d2"}}>Resumen de asistencia del curso</h4>
                  <div className="grafica-asistencia">
                    <Bar
                      data={{
                        labels: ["Presente", "Ausente", "Tardanza"],
                        datasets: [
                          {
                            label: "Cantidad de registros",
                            data: [
                              resumenAsistencia().Presente,
                              resumenAsistencia().Ausente,
                              resumenAsistencia().Tardanza
                            ],
                            backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
                            borderRadius: 8,
                            barPercentage: 0.5,
                            categoryPercentage: 0.5,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false
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
                              precision: 0
                            }
                          }
                        }
                      }}
                      height={260}
                      width={480}
                    />
                  </div>
                  <button className="btn btn-danger btn-sm mt-3" onClick={() => setMostrarGrafica(false)}>
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AsistenciaProfesor;