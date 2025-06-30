import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import "./InicioProfesor.css";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const feriados = [
  { fecha: "2025-01-01", nombre: "Año Nuevo" },
  { fecha: "2025-03-20", nombre: "Jueves Santo" },
  { fecha: "2025-03-21", nombre: "Viernes Santo" },
  { fecha: "2025-05-01", nombre: "Día del Trabajo" },
  { fecha: "2025-06-29", nombre: "San Pedro y San Pablo" },
  { fecha: "2025-07-28", nombre: "Fiestas Patrias" },
  { fecha: "2025-07-29", nombre: "Fiestas Patrias" },
  { fecha: "2025-08-30", nombre: "Santa Rosa de Lima" },
  { fecha: "2025-10-08", nombre: "Combate de Angamos" },
  { fecha: "2025-11-01", nombre: "Todos los Santos" },
  { fecha: "2025-12-08", nombre: "Inmaculada Concepción" },
  { fecha: "2025-12-25", nombre: "Navidad" },
];

const anunciosImportantes = [
  { titulo: "Reunión de profesores", descripcion: "Miércoles 22, 4:00pm. Aula virtual." },
  { titulo: "Entrega de notas", descripcion: "Recuerda entregar las notas finales antes del viernes." },
];

const cumpleaniosSemana = [
  { nombre: "Ana Torres", fecha: "21/05" },
  { nombre: "Luis Pérez", fecha: "23/05" },
];

const estadisticas = {
  asistencia: 96,
  tareasPendientes: 2,
  tareasCorregidas: 18,
};

const enlacesUtiles = [
  { nombre: "Reglamento Interno", url: "#" },
  { nombre: "Calendario Escolar", url: "#" },
  { nombre: "Minedu Recursos", url: "https://www.minedu.gob.pe/" },
];

function esFeriado(fechaISO) {
  return feriados.find(f => f.fecha === fechaISO);
}

function getSemanaActual() {
  const hoy = new Date();
  const diaSemana = hoy.getDay() === 0 ? 7 : hoy.getDay();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - (diaSemana - 1));
  return Array.from({ length: 5 }).map((_, i) => {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    return fecha;
  });
}

function getProximoFeriado(semana) {
  for (let fecha of semana) {
    const feriado = feriados.find(f => f.fecha === fecha.toISOString().slice(0, 10));
    if (feriado) return feriado;
  }
  return null;
}

function InicioProfesor() {
  const [profesorNombre, setProfesorNombre] = useState("Profesor");
  const [horarioProfesor, setHorarioProfesor] = useState({});
  const [semana, setSemana] = useState(getSemanaActual());
  const [notaPersonal, setNotaPersonal] = useState(localStorage.getItem("notaPersonal") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatosProfesor = async () => {
      setLoading(true);
      setError(null);

      const profesorData = localStorage.getItem('profesorLogged');
      if (!profesorData) {
        setError("No se encontró información del profesor. Por favor, inicie sesión.");
        setLoading(false);
        return;
      }

      const profesor = JSON.parse(profesorData);
      setProfesorNombre(`${profesor.nombre} ${profesor.apellido}`);
      const profesorId = profesor.idProfesor;

      try {
        const resHorarios = await axios.get('http://localhost:8080/api/horarios');
        const allHorarios = resHorarios.data;

        const resSeccionCursos = await axios.get('http://localhost:8080/api/seccioncursos');
        const allSeccionCursos = resSeccionCursos.data;
        
        const resSecciones = await axios.get('http://localhost:8080/api/secciones');
        const allSecciones = resSecciones.data;

        const resCursos = await axios.get('http://localhost:8080/api/cursos');
        const allCursos = resCursos.data;

        const horarioParaEstado = {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        };

        const horariosDelProfesor = allHorarios.filter(h => h.idProfesor === profesorId);

        horariosDelProfesor.forEach(h => {
            const seccionCursoRelacionada = allSeccionCursos.find(sc => 
                sc.idSeccion === h.idSeccion && sc.idProfesor === profesorId
            );

            if (seccionCursoRelacionada) {
                const curso = allCursos.find(c => c.idCurso === seccionCursoRelacionada.idCurso);
                const seccion = allSecciones.find(s => s.idSeccion === h.idSeccion);

                if (curso && seccion) {
                    const diaIndex = diasSemana.indexOf(h.dia);
                    const diaKey = diaIndex + 1; 

                    if (horarioParaEstado[diaKey]) {
                        horarioParaEstado[diaKey].push({
                            hora: h.hora,
                            curso: `${seccion.grado} ${seccion.nombre} - ${curso.nombre}`
                        });
                    }
                }
            }
        });

        Object.keys(horarioParaEstado).forEach(diaKey => {
            horarioParaEstado[diaKey].sort((a, b) => {
                const [h1, m1] = a.hora.split('-')[0].split(':').map(Number);
                const [h2, m2] = b.hora.split('-')[0].split(':').map(Number);
                if (h1 !== h2) return h1 - h2;
                return m1 - m2;
            });
        });

        setHorarioProfesor(horarioParaEstado);
        setLoading(false);

      } catch (err) {
        console.error("Error al cargar los datos del profesor o horario:", err);
        setError("No se pudo cargar el horario. Inténtalo de nuevo más tarde.");
        setLoading(false);
      }
    };

    cargarDatosProfesor();
  }, []);

  function cambiarSemana(offset) {
    const nuevaSemana = semana.map(fecha => {
      const nueva = new Date(fecha);
      nueva.setDate(nueva.getDate() + offset * 7);
      return nueva;
    });
    setSemana(nuevaSemana);
  }

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const mesActual = meses[semana[0].getMonth()];
  const diaInicio = semana[0].getDate();
  const diaFin = semana[4].getDate();

  const totalClases = Object.values(horarioProfesor).reduce((acc, clasesDia) => 
    acc + (clasesDia?.filter(h => !h.curso.includes("Recreo")).length || 0), 0
  );
  
  const clasesPorDia = Object.values(horarioProfesor).map(clasesDia => 
    clasesDia?.filter(h => !h.curso.includes("Recreo")).length || 0
  );
  const minClases = clasesPorDia.length > 0 ? Math.min(...clasesPorDia) : 0;
  const diasMenosCarga = clasesPorDia
    .map((cant, idx) => (cant === minClases && minClases > 0 ? diasSemana[idx] : null))
    .filter(Boolean)
    .join(", ");

  const proximoFeriado = getProximoFeriado(semana);

  function guardarNota(e) {
    setNotaPersonal(e.target.value);
    localStorage.setItem("notaPersonal", e.target.value);
  }

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
        <h2 className="mb-4">
          Bienvenido, {profesorNombre}!
        </h2>

        <div className="calendario-semanal-contenedor">
          <div className="calendario-header d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-outline-secondary" onClick={() => cambiarSemana(-1)}>&lt; Semana anterior</button>
            <div className="text-center w-100">
              <div className="calendario-mes">{mesActual}</div>
              <div>{diaInicio} al {diaFin}</div>
            </div>
            <button className="btn btn-outline-secondary" onClick={() => cambiarSemana(1)}>Semana siguiente &gt;</button>
          </div>
          <div className="calendario-semanal-grid">
            {semana.map((fecha, idx) => {
              const fechaISO = fecha.toISOString().slice(0, 10);
              const feriado = esFeriado(fechaISO);
              const horarioDia = horarioProfesor[idx + 1] || []; 
              return (
                <div key={fechaISO} className="calendario-dia-semanal">
                  <div className="calendario-dia-semanal-header">
                    <strong>{diasSemana[idx]}</strong>
                    <span className="calendario-dia-semanal-fecha">{fecha.getDate()}/{fecha.getMonth() + 1}</span>
                  </div>
                  {feriado && (
                    <div className="evento evento-feriado mt-2">
                      🇵🇪 {feriado.nombre}
                    </div>
                  )}
                  {!feriado && horarioDia.length === 0 && (
                      <div className="mt-2 text-muted">No hay clases</div>
                  )}
                  {!feriado && horarioDia.map((h, i) => (
                    <div
                      key={i}
                      className={`evento mt-2 ${h.curso.includes("Recreo") ? "evento-recreo" : "evento-horario"}`}
                    >
                      <span role="img" aria-label={h.curso.includes("Recreo") ? "recreo" : "clase"}>
                        {h.curso.includes("Recreo") ? "🛝" : "📚"}
                      </span>{" "}
                      {h.hora}
                      <div className="evento-curso">{h.curso}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="calendario-leyenda mt-3">
            <span className="leyenda leyenda-horario">📚 Clase</span>
            <span className="leyenda leyenda-feriado">🇵🇪 Feriado Perú</span>
          </div>
        </div>

        <div className="resumen-semana mb-4 p-3 rounded shadow-sm bg-white">
          <h5 className="mb-2">Resumen de la semana</h5>
          <div><b>Total de clases programadas:</b> {totalClases}</div>
          <div>
            <b>Día(s) con menos carga:</b> {diasMenosCarga || "Todos los días tienen carga similar o no hay clases"}
          </div>
          <div>
            <b>Próximo feriado:</b>{" "}
            {proximoFeriado
              ? `${proximoFeriado.nombre} (${new Date(proximoFeriado.fecha).toLocaleDateString()})`
              : "Ninguno esta semana"}
          </div>
        </div>

        <div className="acceso-rapido mb-4 d-flex gap-3 flex-wrap">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/asistenciaProfesor")}
          >
            Registrar asistencia
          </button>
          <button
            className="btn btn-info"
            onClick={() => navigate("/anunciosProfesor")}
          >
            Publicar anuncio
          </button>
        </div>

        <div className="enlaces-utiles mb-4 p-3 rounded shadow-sm bg-white">
          <h5 className="mb-2">Enlaces útiles</h5>
          <ul>
            {enlacesUtiles.map((e, i) => (
              <li key={i}>
                <a href={e.url} target="_blank" rel="noopener noreferrer">{e.nombre}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InicioProfesor;