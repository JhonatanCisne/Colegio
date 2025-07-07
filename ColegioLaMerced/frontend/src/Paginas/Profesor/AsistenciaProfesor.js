import React, { useState, useEffect, useCallback } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import axios from "axios";
import * as XLSX from 'xlsx';
import "./AsistenciaProfesor.css";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AsistenciaProfesor() {
  const [profesorId, setProfesorId] = useState(null);
  const [cursosDelProfesor, setCursosDelProfesor] = useState([]);
  const [seccionCursosData, setSeccionCursosData] = useState([]);
  const [alumnosData, setAlumnosData] = useState([]);
  const [cursosUnicosData, setCursosUnicosData] = useState([]);
  const [asistenciasGuardadas, setAsistenciasGuardadas] = useState([]);
  
  const [cursoSeleccionadoId, setCursoSeleccionadoId] = useState("");
  const [alumnosParaTomarAsistencia, setAlumnosParaTomarAsistencia] = useState([]);
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [asistenciaActual, setAsistenciaActual] = useState({});
  const [fechaInicio, setFechaInicio] = useState(() => new Date().toISOString().slice(0, 10));
  const [fechaFin, setFechaFin] = useState(() => new Date().toISOString().slice(0, 10));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          cursosUnicosRes,
          asistenciasRes,
        ] = await Promise.all([
          axios.get("http://localhost:8080/api/seccioncursos"),
          axios.get("http://localhost:8080/api/secciones"),
          axios.get("http://localhost:8080/api/cursos"),
          axios.get("http://localhost:8080/api/alumnos"),
          axios.get("http://localhost:8080/api/cursosunicos"), 
          axios.get("http://localhost:8080/api/asistencias"),
        ]);

        setSeccionCursosData(seccionCursosRes.data);
        setAlumnosData(alumnosRes.data);
        setCursosUnicosData(cursosUnicosRes.data); 
        setAsistenciasGuardadas(asistenciasRes.data);

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
          };
        });
        setCursosDelProfesor(cursosParaMostrar);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos del sistema. Intente recargar.");
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const loadAlumnosYAsistencia = useCallback(() => {
    if (!cursoSeleccionadoId || !profesorId) {
      setAlumnosParaTomarAsistencia([]);
      setAsistenciaActual({});
      return;
    }

    const cursosUnicosEnSeccion = cursosUnicosData.filter(
      (cu) => cu.idSeccionCurso === cursoSeleccionadoId
    );

    const alumnosEnEstaSeccion = cursosUnicosEnSeccion.map((cu) => {
      const alumno = alumnosData.find((a) => a.idAlumno === cu.idAlumno);
      return {
        id: cu.idAlumno,
        nombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : "Alumno Desconocido",
        idCursoUnico: cu.idCursoUnico,
      };
    }).sort((a, b) => a.nombre.localeCompare(b.nombre));

    setAlumnosParaTomarAsistencia(alumnosEnEstaSeccion);

    const estadosAsistencia = {};
    asistenciasGuardadas.forEach((asist) => {
      const cuAsistencia = cursosUnicosData.find(cu => cu.idCursoUnico === asist.idCursoUnico);
      if (cuAsistencia && cuAsistencia.idSeccionCurso === cursoSeleccionadoId && asist.fecha === fecha) {
        estadosAsistencia[cuAsistencia.idAlumno] = asist.estado;
      }
    });
    setAsistenciaActual(estadosAsistencia);

  }, [cursoSeleccionadoId, fecha, profesorId, alumnosData, cursosUnicosData, asistenciasGuardadas]);

  useEffect(() => {
    loadAlumnosYAsistencia();
  }, [loadAlumnosYAsistencia]);

  const handleCursoChange = (e) => {
    setCursoSeleccionadoId(parseInt(e.target.value));
  };

  const guardarAsistencia = async () => {
    if (!cursoSeleccionadoId || alumnosParaTomarAsistencia.length === 0) {
      alert("Seleccione un curso y asegúrese de que haya alumnos matriculados.");
      return;
    }

    try {
        for (const alumno of alumnosParaTomarAsistencia) {
            const estado = asistenciaActual[alumno.id] || "Presente";

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
                await axios.put(`http://localhost:8080/api/asistencias/${existingAsistencia.idAsistencia}`, asistenciaData);
            } else {
                await axios.post(`http://localhost:8080/api/asistencias`, asistenciaData);
            }
        }
        
        const updatedAsistenciasRes = await axios.get("http://localhost:8080/api/asistencias");
        setAsistenciasGuardadas(updatedAsistenciasRes.data);
        
        loadAlumnosYAsistencia(); 
        
        alert("Asistencia guardada con éxito.");
    } catch (err) {
      alert("Hubo un error al guardar la asistencia. Intente de nuevo.");
    }
  };

  const resumenAsistencia = (fechaInicio, fechaFin) => {
    if (!cursoSeleccionadoId) return { Presente: 0, Ausente: 0, Tardanza: 0 };

    const idCursosUnicosDeEstaSeccion = cursosUnicosData
      .filter(cu => cu.idSeccionCurso === cursoSeleccionadoId)
      .map(cu => cu.idCursoUnico);

    const asistenciasDelCurso = asistenciasGuardadas.filter(asist => {
        const asistenciaDate = new Date(asist.fecha);
        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);
        
        asistenciaDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        return idCursosUnicosDeEstaSeccion.includes(asist.idCursoUnico) &&
               asistenciaDate >= startDate && asistenciaDate <= endDate;
    });

    let Presente = 0, Ausente = 0, Tardanza = 0;
    asistenciasDelCurso.forEach(reg => {
      if (reg.estado === "Presente") Presente++;
      else if (reg.estado === "Ausente") Ausente++;
      else if (reg.estado === "Tardanza") Tardanza++;
    });
    return { Presente, Ausente, Tardanza };
  };

  const descargarAsistenciaExcel = () => {
    if (!cursoSeleccionadoId || alumnosParaTomarAsistencia.length === 0) {
      alert("Seleccione un curso con alumnos para descargar la asistencia.");
      return;
    }

    const idCursosUnicosDeEstaSeccion = cursosUnicosData
      .filter(cu => cu.idSeccionCurso === cursoSeleccionadoId)
      .map(cu => cu.idCursoUnico);

    const asistenciasDelCurso = asistenciasGuardadas.filter(asist => {
      const asistenciaDate = new Date(asist.fecha);
      const startDate = new Date(fechaInicio);
      const endDate = new Date(fechaFin);
      asistenciaDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return idCursosUnicosDeEstaSeccion.includes(asist.idCursoUnico) &&
             asistenciaDate >= startDate && asistenciaDate <= endDate;
    });

    if (asistenciasDelCurso.length === 0) {
      alert("No hay datos de asistencia para el rango de fechas seleccionado.");
      return;
    }

    const dates = [...new Set(asistenciasDelCurso.map(a => a.fecha))].sort();
    
    const dataParaExcel = alumnosParaTomarAsistencia.map(alumno => {
      const row = { 'Alumno': alumno.nombre };
      
      const asistenciasDelAlumno = asistenciasDelCurso.filter(asist => {
          const cursoUnico = cursosUnicosData.find(cu => cu.idCursoUnico === asist.idCursoUnico);
          return cursoUnico && cursoUnico.idAlumno === alumno.id;
      });

      dates.forEach(date => {
        const registro = asistenciasDelAlumno.find(a => a.fecha === date);
        row[date] = registro ? registro.estado : '-';
      });
      
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencia");
    
    const cursoActual = cursosDelProfesor.find(c => c.idSeccionCurso === cursoSeleccionadoId);
    const cursoNombre = cursoActual ? `${cursoActual.nombre}_${cursoActual.seccion}`.replace(/[^a-zA-Z0-9]/g, '_') : 'Curso';
    const fileName = `Asistencia_${cursoNombre}_${fechaInicio}_a_${fechaFin}.xlsx`;

    XLSX.writeFile(workbook, fileName);
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
          <h2>Registro de Asistencia</h2>
          <p>Selecciona un curso y fecha para registrar la asistencia de los alumnos.</p>
        </header>

        <div className="asistencia-grid">
          <div className="asistencia-main">
            <h3>Registrar Asistencia</h3>
            <div className="d-flex align-items-center gap-3 mb-4">
              <label className="fw-bold mb-0">Curso:</label>
              <select
                className="form-select"
                value={cursoSeleccionadoId || ""}
                onChange={handleCursoChange}
              >
                <option value="">-- Selecciona un curso --</option>
                {cursosDelProfesor.map((curso) => (
                  <option key={curso.idSeccionCurso} value={curso.idSeccionCurso}>
                    {curso.nombre} - {curso.seccion}
                  </option>
                ))}
              </select>
              <label className="fw-bold mb-0">Fecha:</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="form-control"
                style={{ maxWidth: 180 }}
              />
            </div>
            
            {cursoSeleccionadoId && alumnosParaTomarAsistencia.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Alumno</th>
                                <th>Presente</th>
                                <th>Ausente</th>
                                <th>Tardanza</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnosParaTomarAsistencia.map(alumno => (
                                <tr key={alumno.id}>
                                    <td>{alumno.nombre}</td>
                                    <td><input type="radio" name={`asistencia-${alumno.id}`} checked={asistenciaActual[alumno.id] === "Presente" || !asistenciaActual[alumno.id]} onChange={() => setAsistenciaActual({ ...asistenciaActual, [alumno.id]: "Presente" })} /></td>
                                    <td><input type="radio" name={`asistencia-${alumno.id}`} checked={asistenciaActual[alumno.id] === "Ausente"} onChange={() => setAsistenciaActual({ ...asistenciaActual, [alumno.id]: "Ausente" })} /></td>
                                    <td><input type="radio" name={`asistencia-${alumno.id}`} checked={asistenciaActual[alumno.id] === "Tardanza"} onChange={() => setAsistenciaActual({ ...asistenciaActual, [alumno.id]: "Tardanza" })} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="btn btn-primary mt-3" onClick={guardarAsistencia}>Guardar Asistencia</button>
                </div>
            ) : (
                <p className="no-data-message">Selecciona un curso para ver los alumnos.</p>
            )}
          </div>

          <div className="asistencia-sidebar">
            <h3>Resumen de Asistencia</h3>
            {cursoSeleccionadoId ? (
              <>
                <div className="d-flex justify-content-center mb-3">
                  <label className="fw-bold mb-0 me-2">Desde:</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: 180 }}
                  />
                  <label className="fw-bold mb-0 ms-3 me-2">Hasta:</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: 180 }}
                  />
                </div>
                <div className="grafica-container">
                  <Bar
                    data={{
                      labels: ["Presente", "Ausente", "Tardanza"],
                      datasets: [
                        {
                          label: "Cantidad",
                          data: [
                            resumenAsistencia(fechaInicio, fechaFin).Presente,
                            resumenAsistencia(fechaInicio, fechaFin).Ausente,
                            resumenAsistencia(fechaInicio, fechaFin).Tardanza
                          ],
                          backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
                <button className="btn btn-success mt-3" onClick={descargarAsistenciaExcel}>Descargar Excel</button>
              </>
            ) : (
              <p className="no-data-message">Selecciona un curso para ver el resumen.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AsistenciaProfesor;