import React, { useState } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./CursoProfesor.css";

Chart.register(BarElement, CategoryScale, LinearScale);

// Generador de nombres únicos SIN números y SIN repetir entre cursos
function generarNombresUnicosGlobal(cantidad, usados = new Set()) {
  const nombresBase = [
    "Ana López", "Carlos Pérez", "Lucía Torres", "Pedro Ramos", "Laura Gómez",
    "Marco Torres", "Sofía Díaz", "Juan Castillo", "Valeria Ruiz", "Miguel Soto",
    "Elena Paredes", "Andrés León", "Gabriela Salas", "Diego Vargas", "Camila Medina",
    "Luis Ramos", "Martín Silva", "Paula Ríos", "Javier Cruz", "Rosa Flores",
    "Daniela Vega", "Tomás Herrera", "Natalia Campos", "Emilio Bravo", "Julieta Mora",
    "Samuel Peña", "Victoria Luna", "Esteban Rivas", "Renata Fuentes", "Ignacio Vidal",
    "María Herrera", "Fernando Castro", "Patricia Aguirre", "Raúl Mendoza", "Cecilia Bravo",
    "Oscar Salinas", "Mónica Cárdenas", "Hugo Zamora", "Silvia Guzmán", "Ricardo Ponce",
    "Andrea Cabrera", "Pablo Lozano", "Lorena Espinoza", "Héctor Rojas", "Clara Navarro",
    "Iván Molina", "Teresa Soto", "Fabián Quispe", "Rocío Vargas", "Álvaro Medina",
    "Francisco Morales", "Isabel Castillo", "Santiago Peña", "Marina Duarte", "Felipe Guzmán",
    "Camilo Herrera", "Alicia Romero", "Bruno Cordero", "Patricia León", "Matías Bravo",
    "Antonia Salas", "Sebastián Ríos", "Agustina Paredes", "Cristóbal Soto", "Martina Luna",
    "Emilia Vargas", "Benjamín Torres", "Josefina Ramos", "Tomás Salinas", "Valentina Cruz",
    "Maximiliano Vidal", "Florencia Aguirre", "Ignacio Mendoza", "Catalina Zamora", "Vicente Espinoza",
    "Gabriel Navarro", "Amanda Molina", "Simón Herrera", "Juliana Guzmán", "Lucas Ponce",
    "Manuela Cabrera", "Emilio Lozano", "Paula Cárdenas", "Joaquín Quispe", "Renata Flores",
    "Damián Rivas", "Bianca Fuentes", "Alejandro Campos", "Mía Bravo", "Lautaro Salas",
    "Constanza León", "Facundo Torres", "Milagros Ramos", "Agustín Díaz", "Josefa Medina",
    "Valentín Rojas", "Luciana Paredes", "Franco Salinas", "Camila Herrera", "Sofía Romero"
  ];
  const nombres = [];
  let idx = 0;
  while (nombres.length < cantidad && idx < nombresBase.length) {
    if (!usados.has(nombresBase[idx])) {
      nombres.push(nombresBase[idx]);
      usados.add(nombresBase[idx]);
    }
    idx++;
  }
  // Si no hay suficientes nombres únicos, puedes agregar lógica para generar más nombres o lanzar error
  return nombres;
}

// Generador de alumnos únicos
function generarAlumnos(baseId, nombres) {
  return nombres.map((nombre, i) => ({
    id: baseId + i,
    nombre,
    notas: {
      "Examen 1": Math.floor(Math.random() * 11) + 10, // 10-20
      "Examen 2": Math.random() > 0.5 ? Math.floor(Math.random() * 11) + 10 : undefined,
    }
  }));
}

function Curso() {
  const cursosDelProfesor = [
    { id: 1, nombre: "Matemática", seccion: "2° Sec" },
    { id: 2, nombre: "Matemática", seccion: "3° Sec" },
    { id: 3, nombre: "Matemática", seccion: "4° Pri" },
    { id: 4, nombre: "Matemática", seccion: "5° Pri" }, // <- Aquí está la sección 5° Pri
  ];

  // Generar nombres únicos globalmente para cada curso
  const usados = new Set();
  const nombresCurso1 = generarNombresUnicosGlobal(20, usados);
  const nombresCurso2 = generarNombresUnicosGlobal(20, usados);
  const nombresCurso3 = generarNombresUnicosGlobal(20, usados);
  const nombresCurso4 = generarNombresUnicosGlobal(20, usados); // <- Para 5° Pri

  const [alumnosPorCurso, setAlumnosPorCurso] = useState({
    1: generarAlumnos(1, nombresCurso1),
    2: generarAlumnos(101, nombresCurso2),
    3: generarAlumnos(201, nombresCurso3),
    4: generarAlumnos(301, nombresCurso4), // <- Para 5° Pri
  });

  // Estado para pestañas
  const [tab, setTab] = useState("alumnos");

  // Materiales por curso
  const [materialesPorCurso, setMaterialesPorCurso] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
  });

  // Tareas por curso
  const [tareasPorCurso, setTareasPorCurso] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
  });

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [notaTemporal, setNotaTemporal] = useState("");
  const [examenSeleccionado, setExamenSeleccionado] = useState("Examen 1");
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const [mostrarSubirMaterial, setMostrarSubirMaterial] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [mostrarAgregarTarea, setMostrarAgregarTarea] = useState(false);
  const [tareaTitulo, setTareaTitulo] = useState("");
  const [tareaDescripcion, setTareaDescripcion] = useState("");

  const examenes = ["Examen 1", "Examen 2", "Examen 3", "Examen 4", "Examen 5"];

  const seleccionarCurso = (idCurso) => {
    setCursoSeleccionado(idCurso);
    setModoEdicion(null);
    setTab("alumnos");
  };

  const editarNota = (idAlumno) => {
    setModoEdicion(idAlumno);
    setNotaTemporal("");
    setExamenSeleccionado("Examen 1");
  };

  const guardarNota = (idAlumno) => {
    const nuevosAlumnos = alumnosPorCurso[cursoSeleccionado].map((alumno) => {
      if (alumno.id === idAlumno) {
        const nuevasNotas = {
          ...alumno.notas,
          [examenSeleccionado]: parseFloat(notaTemporal),
        };
        return { ...alumno, notas: nuevasNotas };
      }
      return alumno;
    });

    setAlumnosPorCurso({
      ...alumnosPorCurso,
      [cursoSeleccionado]: nuevosAlumnos,
    });

    setModoEdicion(null);
    setNotaTemporal("");
    setExamenSeleccionado("Examen 1");
  };

  const promedioAlumno = (notas) => {
    const valores = Object.values(notas).filter((n) => !isNaN(n));
    if (valores.length === 0) return "-";
    const suma = valores.reduce((a, b) => a + b, 0);
    return (suma / valores.length).toFixed(2);
  };

  const promedioGeneral = () => {
    if (!cursoSeleccionado) return "-";
    const alumnos = alumnosPorCurso[cursoSeleccionado];
    let total = 0, count = 0;
    alumnos.forEach(alumno => {
      const valores = Object.values(alumno.notas).filter((n) => !isNaN(n));
      valores.forEach(nota => {
        total += nota;
        count++;
      });
    });
    return count > 0 ? (total / count).toFixed(2) : "-";
  };

  // Estadísticas del curso seleccionado
  const estadisticasCurso = () => {
    if (!cursoSeleccionado) return null;
    const alumnos = alumnosPorCurso[cursoSeleccionado];
    const notas = alumnos.flatMap(a => Object.values(a.notas).filter(n => !isNaN(n)));
    const aprobados = notas.filter(n => n >= 11).length;
    const desaprobados = notas.filter(n => n < 11).length;
    const max = notas.length ? Math.max(...notas) : "-";
    const min = notas.length ? Math.min(...notas) : "-";
    return {
      cantidadAlumnos: alumnos.length,
      cantidadNotas: notas.length,
      aprobados,
      desaprobados,
      max,
      min,
      promedio: promedioGeneral()
    };
  };

  // Guardar material subido
  const guardarMaterial = () => {
    if (!archivo || !descripcion) return;
    const nuevoMaterial = {
      nombre: archivo.name,
      descripcion,
      fecha: new Date().toLocaleDateString(),
      url: URL.createObjectURL(archivo)
    };
    setMaterialesPorCurso({
      ...materialesPorCurso,
      [cursoSeleccionado]: [...materialesPorCurso[cursoSeleccionado], nuevoMaterial]
    });
    setMostrarSubirMaterial(false);
    setArchivo(null);
    setDescripcion("");
  };

  // Guardar tarea
  const guardarTarea = () => {
    if (!tareaTitulo) return;
    const nuevaTarea = {
      titulo: tareaTitulo,
      descripcion: tareaDescripcion,
      fecha: new Date().toLocaleDateString()
    };
    setTareasPorCurso({
      ...tareasPorCurso,
      [cursoSeleccionado]: [...tareasPorCurso[cursoSeleccionado], nuevaTarea]
    });
    setMostrarAgregarTarea(false);
    setTareaTitulo("");
    setTareaDescripcion("");
  };

  // Función para descargar la lista de alumnos en CSV
  function descargarListaAlumnos(alumnos, examenes, nombreCurso, seccion) {
    if (!alumnos || alumnos.length === 0) return;
    let sep = ";";
    let csv = `ID${sep}Nombre${sep}${examenes.join(sep)}${sep}Promedio\n`;
    alumnos.forEach(alumno => {
      const notas = examenes.map(examen =>
        alumno.notas[examen] !== undefined ? alumno.notas[examen] : "-"
      );
      const promedio = (() => {
        const valores = Object.values(alumno.notas).filter(n => !isNaN(n));
        if (valores.length === 0) return "-";
        const suma = valores.reduce((a, b) => a + b, 0);
        return (suma / valores.length).toFixed(2);
      })();
      csv += `${alumno.id}${sep}"${alumno.nombre}"${sep}${notas.join(sep)}${sep}${promedio}\n`;
    });

    // Agrega BOM UTF-8 para que Excel muestre bien los acentos
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Lista_${nombreCurso}_${seccion}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

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
              <span role="img" aria-label="libro">📘</span> {curso.nombre}
              <br />
              <span style={{ fontSize: "0.95em", color: "#007bff" }}>{curso.seccion}</span>
            </div>
          ))}
        </div>

        {cursoSeleccionado && (
          <div className="d-flex">
            {/* Pestañas laterales */}
            <div className="tabs-lateral">
              <button
                className={tab === "alumnos" ? "tab-btn active" : "tab-btn"}
                onClick={() => setTab("alumnos")}
              >
                Alumnos
              </button>
              <button
                className={tab === "materiales" ? "tab-btn active" : "tab-btn"}
                onClick={() => setTab("materiales")}
              >
                Materiales
              </button>
              <button
                className={tab === "tareas" ? "tab-btn active" : "tab-btn"}
                onClick={() => setTab("tareas")}
              >
                Tareas
              </button>
            </div>
            {/* Contenido de la pestaña */}
            <div className="tab-content">
              {tab === "alumnos" && (
                <>
                  <div className="mb-3 d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        descargarListaAlumnos(
                          alumnosPorCurso[cursoSeleccionado],
                          examenes,
                          cursosDelProfesor.find(c => c.id === cursoSeleccionado)?.nombre || "Curso",
                          cursosDelProfesor.find(c => c.id === cursoSeleccionado)?.seccion || ""
                        )
                      }
                    >
                      <span role="img" aria-label="descargar">⬇️</span> Descargar lista
                    </button>
                    <button
                      className="btn btn-outline-info"
                      onClick={() => setMostrarSubirMaterial(true)}
                    >
                      <span role="img" aria-label="subir">📤</span> Subir material
                    </button>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => setMostrarEstadisticas(true)}
                    >
                      <span role="img" aria-label="estadísticas">📊</span> Ver estadísticas
                    </button>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => setMostrarAgregarTarea(true)}
                    >
                      <span role="img" aria-label="tarea">📝</span> Agregar tarea
                    </button>
                  </div>
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
                      {alumnosPorCurso[cursoSeleccionado]?.map((alumno) => (
                        <tr key={alumno.id} className={modoEdicion === alumno.id ? "editando" : ""}>
                          <td>{alumno.id}</td>
                          <td>{alumno.nombre}</td>
                          {examenes.map((examen) => (
                            <td key={examen}>
                              {alumno.notas[examen] !== undefined
                                ? alumno.notas[examen]
                                : "-"}
                            </td>
                          ))}
                          <td>
                            {promedioAlumno(alumno.notas)}
                          </td>
                          <td>
                            {modoEdicion === alumno.id ? (
                              <div className="d-flex flex-column">
                                <select
                                  className="form-select mb-1"
                                  value={examenSeleccionado}
                                  onChange={(e) => setExamenSeleccionado(e.target.value)}
                                >
                                  {examenes.map((examen) => (
                                    <option key={examen} value={examen}>
                                      {examen}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  className="form-control mb-1"
                                  value={notaTemporal}
                                  onChange={(e) => setNotaTemporal(e.target.value)}
                                />
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => guardarNota(alumno.id)}
                                >
                                  Guardar
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => editarNota(alumno.id)}
                              >
                                Registrar / Editar Nota
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 stat-box">
                    <b>Promedio general del curso: </b> {promedioGeneral()}
                  </div>
                </>
              )}
              {tab === "materiales" && (
                <div>
                  <h4>Materiales del curso</h4>
                  {materialesPorCurso[cursoSeleccionado].length === 0 ? (
                    <div className="alert alert-info">No hay materiales subidos.</div>
                  ) : (
                    <ul className="material-lista">
                      {materialesPorCurso[cursoSeleccionado].map((mat, idx) => (
                        <li key={idx}>
                          <a href={mat.url} target="_blank" rel="noopener noreferrer">{mat.nombre}</a>
                          <span className="material-desc">{mat.descripcion}</span>
                          <span className="material-fecha">{mat.fecha}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    className="btn btn-outline-info mt-2"
                    onClick={() => setMostrarSubirMaterial(true)}
                  >
                    <span role="img" aria-label="subir">📤</span> Subir material
                  </button>
                </div>
              )}
              {tab === "tareas" && (
                <div>
                  <h4>Tareas del curso</h4>
                  {tareasPorCurso[cursoSeleccionado].length === 0 ? (
                    <div className="alert alert-info">No hay tareas registradas.</div>
                  ) : (
                    <ul className="material-lista">
                      {tareasPorCurso[cursoSeleccionado].map((tarea, idx) => (
                        <li key={idx}>
                          <b>{tarea.titulo}</b>
                          <span className="material-desc">{tarea.descripcion}</span>
                          <span className="material-fecha">{tarea.fecha}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    className="btn btn-outline-warning mt-2"
                    onClick={() => setMostrarAgregarTarea(true)}
                  >
                    <span role="img" aria-label="tarea">📝</span> Agregar tarea
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de estadísticas */}
        {mostrarEstadisticas && (
          <div className="modal-estadisticas">
            <div className="modal-content">
              <h5>Estadísticas del curso</h5>
              <Bar
                data={{
                  labels: ["Aprobados", "Desaprobados", "Promedio", "Máxima", "Mínima"],
                  datasets: [
                    {
                      label: "Notas",
                      data: [
                        estadisticasCurso().aprobados,
                        estadisticasCurso().desaprobados,
                        Number(estadisticasCurso().promedio) || 0,
                        estadisticasCurso().max !== "-" ? estadisticasCurso().max : 0,
                        estadisticasCurso().min !== "-" ? estadisticasCurso().min : 0,
                      ],
                      backgroundColor: [
                        "#4caf50",
                        "#f44336",
                        "#2196f3",
                        "#ff9800",
                        "#9c27b0"
                      ],
                      borderRadius: 8,
                      barPercentage: 0.5,
                      categoryPercentage: 0.5,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          if (context.dataIndex === 2) return `Promedio: ${estadisticasCurso().promedio}`;
                          if (context.dataIndex === 3) return `Máxima: ${estadisticasCurso().max}`;
                          if (context.dataIndex === 4) return `Mínima: ${estadisticasCurso().min}`;
                          return `${context.label}: ${context.parsed.y}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 20,
                      ticks: { stepSize: 1 }
                    }
                  }
                }}
                height={140}
                width={320}
              />
              <ul style={{marginTop: 16, fontSize: "1rem"}}>
                <li><b>Total de alumnos:</b> {estadisticasCurso().cantidadAlumnos}</li>
                <li><b>Total de notas registradas:</b> {estadisticasCurso().cantidadNotas}</li>
                <li><b>Aprobados (≥11):</b> {estadisticasCurso().aprobados}</li>
                <li><b>Desaprobados (&lt;11):</b> {estadisticasCurso().desaprobados}</li>
                <li><b>Promedio general:</b> {estadisticasCurso().promedio}</li>
                <li><b>Nota máxima:</b> {estadisticasCurso().max}</li>
                <li><b>Nota mínima:</b> {estadisticasCurso().min}</li>
              </ul>
              <button className="btn btn-danger btn-sm" onClick={() => setMostrarEstadisticas(false)}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal subir material */}
        {mostrarSubirMaterial && (
          <div className="modal-estadisticas">
            <div className="modal-content">
              <h5>Subir material</h5>
              <input
                type="file"
                className="form-control mb-2"
                onChange={e => setArchivo(e.target.files[0])}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Descripción o nombre del material"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
              />
              <button
                className="btn btn-primary btn-sm mb-2"
                onClick={guardarMaterial}
              >
                Subir
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setMostrarSubirMaterial(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Modal agregar tarea */}
        {mostrarAgregarTarea && (
          <div className="modal-estadisticas">
            <div className="modal-content">
              <h5>Agregar tarea</h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Título de la tarea"
                value={tareaTitulo}
                onChange={e => setTareaTitulo(e.target.value)}
              />
              <textarea
                className="form-control mb-2"
                placeholder="Descripción de la tarea"
                value={tareaDescripcion}
                onChange={e => setTareaDescripcion(e.target.value)}
              />
              <button
                className="btn btn-warning btn-sm mb-2"
                onClick={guardarTarea}
              >
                Guardar tarea
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setMostrarAgregarTarea(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Curso;