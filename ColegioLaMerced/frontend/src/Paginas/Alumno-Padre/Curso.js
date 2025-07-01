import React, { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral";
import "./Curso.css";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Curso() {
  const [cursosInscritos, setCursosInscritos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const examenes = ["examen1", "examen2", "examen3", "examen4", "examenFinal"];
  const examenesLabels = ["Examen 1", "Examen 2", "Examen 3", "Examen 4", "Examen Final"];

  const promedioNotasCurso = (notas) => {
    if (!notas) return 0;
    const valores = examenes.map(examen => notas[examen]).filter((n) => typeof n === 'number');
    if (valores.length === 0) return 0;
    const suma = valores.reduce((a, b) => a + b, 0);
    return parseFloat((suma / valores.length).toFixed(2));
  };

  useEffect(() => {
    const cargarCursosYNotas = async () => {
      const alumnoId = localStorage.getItem('alumnoId');
      if (!alumnoId) {
        setError("No se encontró el ID del alumno. Por favor, inicie sesión.");
        setLoading(false);
        return;
      }

      try {
        const alumnoRes = await axios.get(`http://localhost:8080/api/alumnos/${alumnoId}`);
        setNombreAlumno(`${alumnoRes.data.nombre} ${alumnoRes.data.apellido}`);
        const [cursosUnicosRes, seccionCursosRes, cursosRes, seccionesRes, profesoresRes] = await Promise.all([
          axios.get('http://localhost:8080/api/cursosunicos'),
          axios.get('http://localhost:8080/api/seccioncursos'),
          axios.get('http://localhost:8080/api/cursos'),
          axios.get('http://localhost:8080/api/secciones'),
          axios.get('http://localhost:8080/api/profesores')
        ]);

        const allCursosUnicos = cursosUnicosRes.data;
        const allSeccionCursos = seccionCursosRes.data;
        const allCursos = cursosRes.data;
        const allSecciones = seccionesRes.data;
        const allProfesores = profesoresRes.data;

        const cursosDelAlumno = allCursosUnicos.filter(
          (cu) => cu.idAlumno === parseInt(alumnoId)
        );

        if (cursosDelAlumno.length === 0) {
          setCursosInscritos([]);
          setLoading(false);
          return;
        }

        const cursosFormateados = cursosDelAlumno.map(cursoUnico => {
          const seccionCurso = allSeccionCursos.find(
            (sc) => sc.idSeccionCurso === cursoUnico.idSeccionCurso
          ) || {};
          const cursoInfo = allCursos.find((c) => c.idCurso === seccionCurso.idCurso) || { nombre: 'Curso Desconocido' };
          const seccionInfo = allSecciones.find((s) => s.idSeccion === seccionCurso.idSeccion) || { grado: '', nombre: 'Desconocida' };
          const profesorInfo = allProfesores.find((p) => p.idProfesor === seccionCurso.idProfesor) || { nombre: 'No asignado' };
          
          const notas = {
              examen1: cursoUnico.examen1,
              examen2: cursoUnico.examen2,
              examen3: cursoUnico.examen3,
              examen4: cursoUnico.examen4,
              examenFinal: cursoUnico.examenFinal,
          };

          return {
            id: cursoUnico.idCursoUnico,
            nombre: cursoInfo.nombre,
            seccion: `${seccionInfo.grado}° ${seccionInfo.nombre}`,
            profesor: `${profesorInfo.nombre} ${profesorInfo.apellido}`,
            promedio: promedioNotasCurso(notas),
            notas: notas
          };
        });
        
        setCursosInscritos(cursosFormateados);

        if (cursosFormateados.length > 0) {
          setCursoSeleccionado(cursosFormateados[0]);
        }

      } catch (error) {
        console.error("Error al cargar los datos del estudiante:", error);
        setError("Error al cargar los datos. Intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    cargarCursosYNotas();
  }, []);

  const seleccionarCurso = (curso) => {
    setCursoSeleccionado(curso);
  };

  const notasActuales = cursoSeleccionado ? cursoSeleccionado.notas : null;

  const chartData = {
    labels: examenesLabels,
    datasets: [
      {
        label: 'Calificaciones',
        data: notasActuales ? examenes.map(examen => notasActuales[examen] ?? 0) : [],
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
      title: { display: true, text: 'Rendimiento en el Curso' },
    },
    scales: { y: { beginAtZero: true, max: 20 } },
  };

  if (loading) {
    return (
        <div className="d-flex">
            <BarraDeNavegacionLateralEstudiante nombre={nombreAlumno} />
            <div className="page-content">Cargando cursos...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="d-flex">
            <BarraDeNavegacionLateralEstudiante nombre={nombreAlumno} />
            <div className="page-content">{error}</div>
        </div>
    );
  }

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralEstudiante nombre={nombreAlumno} />
      <div className="page-content">
        <header className="page-header">
          <h2>Mis Cursos y Calificaciones</h2>
          <p>Selecciona un curso para ver tus notas y progreso.</p>
        </header>

        <div className="cursos-selector-grid">
          {cursosInscritos.length > 0 ? cursosInscritos.map((curso) => (
            <div
              key={curso.id}
              className={`curso-selector-card ${cursoSeleccionado?.id === curso.id ? "selected" : ""}`}
              onClick={() => seleccionarCurso(curso)}
            >
              <div className="curso-card-header">
                <h3 className="curso-card-title">{curso.nombre}</h3>
                <p className="curso-card-profesor">{curso.profesor}</p>
              </div>
              <div className="curso-card-body">
                <p className="curso-card-promedio-label">Promedio</p>
                <p className="curso-card-promedio-valor">{curso.promedio}</p>
              </div>
            </div>
          )) : <p>No estás inscrito en ningún curso.</p>}
        </div>

        {cursoSeleccionado && notasActuales && (
          <div className="notas-details-card">
            <h3 className="notas-header">Calificaciones de: {cursoSeleccionado.nombre}</h3>
            <div className="grades-layout">
              <div className="grades-grid">
                {examenes.map((examen, index) => (
                  <div className="grade-card" key={examen}>
                    <h4>{examenesLabels[index]}</h4>
                    <p className={`grade-score ${notasActuales[examen] < 11 ? 'desaprobado' : 'aprobado'}`}>{notasActuales[examen] ?? "-"}</p>
                  </div>
                ))}
                <div className={`grade-card promedio ${cursoSeleccionado.promedio < 11 ? 'desaprobado' : 'aprobado'}`}>
                  <h4>Promedio Final</h4>
                  <p className="grade-score">{cursoSeleccionado.promedio}</p>
                </div>
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

export default Curso;