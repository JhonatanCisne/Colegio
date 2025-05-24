import React, { useState } from "react";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./AsistenciaProfesor.css";

Chart.register(BarElement, CategoryScale, LinearScale);

// Nombres base (igual que en CursoProfesor)
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

// Generador de nombres únicos global
function generarNombresUnicosGlobal(cantidad, usados = new Set()) {
  const nombres = [];
  let idx = 0;
  while (nombres.length < cantidad && idx < nombresBase.length) {
    if (!usados.has(nombresBase[idx])) {
      nombres.push(nombresBase[idx]);
      usados.add(nombresBase[idx]);
    }
    idx++;
  }
  return nombres;
}

// Generador de alumnos únicos
function generarAlumnos(baseId, nombres) {
  return nombres.map((nombre, i) => ({
    id: baseId + i,
    nombre,
    asistencia: [], // {fecha, estado: "Presente"|"Ausente"|"Tardanza"}
  }));
}

function AsistenciaProfesor() {
  // Cursos igual que en CursoProfesor
  const cursosDelProfesor = [
    { id: 1, nombre: "Matemática", seccion: "2° Sec" },
    { id: 2, nombre: "Matemática", seccion: "3° Sec" },
    { id: 3, nombre: "Matemática", seccion: "4° Pri" },
    { id: 4, nombre: "Matemática", seccion: "5° Pri" },
  ];

  // Generar alumnos igual que en CursoProfesor
  const usados = new Set();
  const nombresCurso1 = generarNombresUnicosGlobal(20, usados);
  const nombresCurso2 = generarNombresUnicosGlobal(20, usados);
  const nombresCurso3 = generarNombresUnicosGlobal(20, usados);
  const nombresCurso4 = generarNombresUnicosGlobal(20, usados);

  const [alumnosPorCurso, setAlumnosPorCurso] = useState({
    1: generarAlumnos(1, nombresCurso1),
    2: generarAlumnos(101, nombresCurso2),
    3: generarAlumnos(201, nombresCurso3),
    4: generarAlumnos(301, nombresCurso4),
  });

  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [asistencia, setAsistencia] = useState({}); // {alumnoId: "Presente"|"Ausente"|"Tardanza"}
  const [mostrarGrafica, setMostrarGrafica] = useState(false);

  // Registrar asistencia
  const guardarAsistencia = () => {
    if (!cursoSeleccionado) return;
    const nuevosAlumnos = alumnosPorCurso[cursoSeleccionado].map(alumno => {
      const estado = asistencia[alumno.id] || "Presente";
      return {
        ...alumno,
        asistencia: [
          ...alumno.asistencia,
          { fecha, estado }
        ]
      };
    });
    setAlumnosPorCurso({
      ...alumnosPorCurso,
      [cursoSeleccionado]: nuevosAlumnos
    });
    setAsistencia({});
  };

  // Estadísticas para la gráfica
  const resumenAsistencia = () => {
    if (!cursoSeleccionado) return { Presente: 0, Ausente: 0, Tardanza: 0 };
    const alumnos = alumnosPorCurso[cursoSeleccionado];
    let Presente = 0, Ausente = 0, Tardanza = 0;
    alumnos.forEach(alumno => {
      alumno.asistencia.forEach(reg => {
        if (reg.estado === "Presente") Presente++;
        if (reg.estado === "Ausente") Ausente++;
        if (reg.estado === "Tardanza") Tardanza++;
      });
    });
    return { Presente, Ausente, Tardanza };
  };

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralProfesor />
      <div className="contenido-principal">
        <h2 className="mb-4" style={{fontWeight:700, color:"#1976d2"}}>Registro de Asistencia</h2>

        <div className="mb-4 d-flex gap-2 flex-wrap">
          <label className="fw-bold">Seleccionar curso y sección:</label>
          <select
            className="form-select mt-1"
            value={cursoSeleccionado}
            onChange={(e) => setCursoSeleccionado(e.target.value)}
            style={{maxWidth: 320}}
          >
            <option value="">-- Selecciona un curso --</option>
            {cursosDelProfesor.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre} - {curso.seccion}
              </option>
            ))}
          </select>
          {cursoSeleccionado && (
            <button
              className="btn btn-outline-success"
              style={{height: 38}}
              onClick={() => setMostrarGrafica(true)}
            >
              <span role="img" aria-label="gráfica">📊</span> Ver gráfica de asistencia
            </button>
          )}
        </div>

        {cursoSeleccionado && (
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
                  {alumnosPorCurso[cursoSeleccionado].map(alumno => (
                    <tr key={alumno.id}>
                      <td style={{fontWeight:500}}>{alumno.nombre}</td>
                      <td>
                        <input
                          type="radio"
                          name={`asistencia-${alumno.id}`}
                          checked={asistencia[alumno.id] === "Presente" || !asistencia[alumno.id]}
                          onChange={() => setAsistencia({ ...asistencia, [alumno.id]: "Presente" })}
                          style={{width:22, height:22}}
                        />
                      </td>
                      <td>
                        <input
                          type="radio"
                          name={`asistencia-${alumno.id}`}
                          checked={asistencia[alumno.id] === "Ausente"}
                          onChange={() => setAsistencia({ ...asistencia, [alumno.id]: "Ausente" })}
                          style={{width:22, height:22}}
                        />
                      </td>
                      <td>
                        <input
                          type="radio"
                          name={`asistencia-${alumno.id}`}
                          checked={asistencia[alumno.id] === "Tardanza"}
                          onChange={() => setAsistencia({ ...asistencia, [alumno.id]: "Tardanza" })}
                          style={{width:22, height:22}}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{display:"flex", justifyContent:"center"}}>
              <button className="btn btn-success btn-lg mb-4 px-5" onClick={guardarAsistencia}>
                Guardar asistencia
              </button>
            </div>

            {/* Gráfica en modal */}
            {mostrarGrafica && (
              <div className="modal-estadisticas">
                <div className="modal-content">
                  <h4 className="mb-3" style={{color:"#1976d2"}}>Resumen de asistencia</h4>
                  <div className="grafica-asistencia">
                    <Bar
                      data={{
                        labels: ["Asistencias", "Faltas", "Tardanzas"],
                        datasets: [
                          {
                            label: "Cantidad",
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
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, precision: 0 } },
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