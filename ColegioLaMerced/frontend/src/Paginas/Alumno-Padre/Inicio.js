import React, { useState, useEffect } from "react";
import BarraDeNavegacionLateralEstudiante from "../../Componentes/BarraDeNavegacionLateral";
import "./Inicio.css";

function Inicio() {
  const [datosEstudiante, setDatosEstudiante] = useState({
    nombre: "",
    grado: "",
    seccion: "",
    horario: [],
    ultimosAnuncios: [
      { id: 1, titulo: "Cambio de horario de Educación Física", fecha: "2025-05-20", contenido: "El curso de Educación Física de los viernes se ha movido al jueves." },
      { id: 2, titulo: "Recordatorio: Pago de pensiones", fecha: "2025-05-18", contenido: "Se recuerda a los padres de familia que la fecha límite para el pago de pensiones es el 30 de mayo." },
      { id: 3, titulo: "Excursión al museo", fecha: "2025-05-15", contenido: "La excursión al museo de ciencias será el 10 de junio. Consultar detalles en el aula virtual." },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosInicio = async () => {
      const alumnoId = localStorage.getItem('alumnoId');
      if (!alumnoId) {
        setError("No se encontró el ID del alumno en localStorage. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const resAlumnos = await fetch('http://localhost:8080/api/alumnos');
        if (!resAlumnos.ok) throw new Error('Error al cargar datos de alumnos.');
        const allAlumnos = await resAlumnos.json();
        const alumnoLogueado = allAlumnos.find(alumno => alumno.idAlumno === parseInt(alumnoId));

        if (!alumnoLogueado) {
          setError("No se encontró información para el alumno logueado.");
          setLoading(false);
          return;
        }


        const [
          resHorarios,
          resSecciones,
          resProfesores,
          resCursosUnicos, 
          resSeccionCursos,
          resCursos 
        ] = await Promise.all([
          fetch('http://localhost:8080/api/horarios'),
          fetch('http://localhost:8080/api/secciones'),
          fetch('http://localhost:8080/api/profesores'),
          fetch('http://localhost:8080/api/cursosunicos'),
          fetch('http://localhost:8080/api/seccioncursos'),
          fetch('http://localhost:8080/api/cursos')
        ]);

        if (!resHorarios.ok || !resSecciones.ok || !resProfesores.ok || !resCursosUnicos.ok || !resSeccionCursos.ok || !resCursos.ok) {
          throw new Error('Error al cargar datos del horario o entidades relacionadas.');
        }

        const allHorarios = await resHorarios.json();
        const allSecciones = await resSecciones.json();
        const allProfesores = await resProfesores.json();
        const allCursosUnicos = await resCursosUnicos.json();
        const allSeccionCursos = await resSeccionCursos.json();
        const allCursos = await resCursos.json();

        const cursosUnicosDelAlumno = allCursosUnicos.filter(cu => cu.idAlumno === parseInt(alumnoId));
        const idSeccionCursosDelAlumno = cursosUnicosDelAlumno.map(cu => cu.idSeccionCurso);

        let gradoEstudiante = "Desconocido";
        let seccionEstudiante = "Desconocida";
        if (cursosUnicosDelAlumno.length > 0) {
            const primerCursoUnico = cursosUnicosDelAlumno[0];
            const seccionCursoRelacionada = allSeccionCursos.find(sc => sc.idSeccionCurso === primerCursoUnico.idSeccionCurso);
            if (seccionCursoRelacionada) {
                const seccionInfo = allSecciones.find(s => s.idSeccion === seccionCursoRelacionada.idSeccion);
                if (seccionInfo) {
                    gradoEstudiante = seccionInfo.grado;
                    seccionEstudiante = seccionInfo.nombre;
                }
            }
        }


        const horarioAlumno = [];
        const horariosFiltrados = allHorarios.filter(h =>
            idSeccionCursosDelAlumno.includes(
                allSeccionCursos.find(sc => sc.idSeccion === h.idSeccion && sc.idProfesor === h.idProfesor && allCursos.some(c => c.idCurso === sc.idCurso))?.idSeccionCurso
            )
        );

        horariosFiltrados.forEach(horario => {
            const seccionCurso = allSeccionCursos.find(sc => 
                sc.idSeccion === horario.idSeccion && sc.idProfesor === horario.idProfesor
            );
            
            if (seccionCurso) {
                const curso = allCursos.find(c => c.idCurso === seccionCurso.idCurso);
                const profesor = allProfesores.find(p => p.idProfesor === horario.idProfesor);

                horarioAlumno.push({
                    dia: horario.dia,
                    hora: horario.hora,
                    curso: curso ? curso.nombre : 'Curso Desconocido',
                    profesor: profesor ? `${profesor.nombre} ${profesor.apellido}` : 'Profesor Desconocido',
                });
            }
        });

        setDatosEstudiante(prev => ({
          ...prev,
          nombre: `${alumnoLogueado.nombre} ${alumnoLogueado.apellido}`,
          grado: gradoEstudiante,
          seccion: seccionEstudiante,
          horario: horarioAlumno,
        }));
        setLoading(false);

      } catch (err) {
        console.error("Error al cargar los datos de inicio:", err);
        setError("No se pudieron cargar los datos. Inténtalo de nuevo más tarde.");
        setLoading(false);
      }
    };

    cargarDatosInicio();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-danger" role="status">
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
      <BarraDeNavegacionLateralEstudiante />
      <div className="contenido-principal-inicio-estudiante">
        <h2 className="mb-4" style={{ fontWeight: 700, color: "#8B0000" }}>
          Bienvenido, {datosEstudiante.nombre}!
        </h2>

        <div className="info-grado-card mb-4">
          <h3>Tu Grado y Sección</h3>
          <p>Estás en **{datosEstudiante.grado}**</p>
          <p>Sección: **{datosEstudiante.seccion}**</p>
        </div>

        <div className="seccion-inicio-estudiante">
          <h3 className="mb-3">Tu Horario</h3>
          <div className="horario-container">
            {Object.entries(datosEstudiante.horario.reduce((acc, item) => {
              (acc[item.dia] = acc[item.dia] || []).push(item);
              return acc;
            }, {})).map(([dia, clases]) => (
              <div key={dia} className="horario-dia-card">
                <h5>{dia}</h5>
                <ul>
                  {clases.map((clase, index) => (
                    <li key={index}>
                      <span>{clase.hora}</span> - **{clase.curso}** ({clase.profesor})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {datosEstudiante.horario.length === 0 && (
                <div className="alert alert-info">No hay horario disponible.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Inicio;