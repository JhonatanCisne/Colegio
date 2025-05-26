import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarraDeNavegacionLateralProfesor from "../../Componentes/BarraDeNavegacionLateralProfesor";
import "./InicioProfesor.css";

const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie"];

// Feriados Perú 2025 con nombre
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

// Horario del profesor (cada sección solo 2 veces por semana, recreo y fin 12:30)
const horario = {
  1: [ // Lunes
    { hora: "8:00-9:00", curso: "2° Sec - Mat" },
    { hora: "9:00-10:00", curso: "3° Sec - Mat" },
    { hora: "10:00-10:30", curso: "Recreo" },
    { hora: "10:30-11:30", curso: "4° Pri - Mat" },
    { hora: "11:30-12:30", curso: "5° Pri - Mat" },
  ],
  2: [ // Martes
    { hora: "8:00-9:00", curso: "2° Sec - Mat" },
    { hora: "9:00-10:00", curso: "4° Pri - Mat" },
    { hora: "10:00-10:30", curso: "Recreo" },
    { hora: "10:30-11:30", curso: "3° Sec - Mat" },
    { hora: "11:30-12:30", curso: "5° Pri - Mat" },
  ],
  3: [ // Miércoles
    { hora: "8:00-9:00", curso: "3° Sec - Mat" },
    { hora: "9:00-10:00", curso: "5° Pri - Mat" },
    { hora: "10:00-10:30", curso: "Recreo" },
    { hora: "10:30-11:30", curso: "4° Pri - Mat" },
    // Libre 11:30-12:30
  ],
  4: [ // Jueves
    { hora: "8:00-9:00", curso: "2° Sec - Mat" },
    { hora: "9:00-10:00", curso: "5° Pri - Mat" },
    { hora: "10:00-10:30", curso: "Recreo" },
    // Libre 10:30-12:30
  ],
  5: [ // Viernes
    { hora: "8:00-9:00", curso: "4° Pri - Mat" },
    { hora: "9:00-10:00", curso: "3° Sec - Mat" },
    { hora: "10:00-10:30", curso: "Recreo" },
    // Libre 10:30-12:30
  ],
};

// Simulación de anuncios importantes
const anunciosImportantes = [
  { titulo: "Reunión de profesores", descripcion: "Miércoles 22, 4:00pm. Aula virtual." },
  { titulo: "Entrega de notas", descripcion: "Recuerda entregar las notas finales antes del viernes." },
];

// Simulación de cumpleaños de alumnos
const cumpleaniosSemana = [
  { nombre: "Ana Torres", fecha: "21/05" },
  { nombre: "Luis Pérez", fecha: "23/05" },
];

// Simulación de estadísticas
const estadisticas = {
  asistencia: 96, // %
  tareasPendientes: 2,
  tareasCorregidas: 18,
};

// Simulación de enlaces útiles
const enlacesUtiles = [
  { nombre: "Reglamento Interno", url: "#" },
  { nombre: "Calendario Escolar", url: "#" },
  { nombre: "Minedu Recursos", url: "https://www.minedu.gob.pe/" },
];

function esFeriado(fechaISO) {
  return feriados.find(f => f.fecha === fechaISO);
}

function getFechaISO(anio, mes, dia) {
  // mes: 0-indexado
  const fecha = new Date(anio, mes, dia);
  return fecha.toISOString().slice(0, 10);
}

function getSemanaActual() {
  const hoy = new Date();
  const diaSemana = hoy.getDay() === 0 ? 7 : hoy.getDay(); // Lunes=1, Domingo=7
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
  const [semana, setSemana] = useState(getSemanaActual());
  const [notaPersonal, setNotaPersonal] = useState(localStorage.getItem("notaPersonal") || "");
  const navigate = useNavigate();

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

  const totalClases = semana.reduce((acc, _, idx) => acc + (horario[idx + 1]?.filter(h => h.curso !== "Recreo").length || 0), 0);
  const clasesPorDia = semana.map((_, idx) => (horario[idx + 1]?.filter(h => h.curso !== "Recreo").length || 0));
  const minClases = Math.min(...clasesPorDia);
  const diasMenosCarga = clasesPorDia
    .map((cant, idx) => (cant === minClases ? diasSemana[idx] : null))
    .filter(Boolean)
    .join(", ");
  const proximoFeriado = getProximoFeriado(semana);

  function guardarNota(e) {
    setNotaPersonal(e.target.value);
    localStorage.setItem("notaPersonal", e.target.value);
  }

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateralProfesor />
      <div className="contenido-principal">
        <h2 className="mb-4" style={{ fontWeight: 700, color: "#1976d2" }}>
          Horario semanal del Profesor
        </h2>

        <div className="calendario-semanal-contenedor">
          <div className="calendario-header d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-outline-secondary" onClick={() => cambiarSemana(-1)}>&lt; Semana anterior</button>
            <div className="text-center w-100">
              <div className="calendario-mes" style={{fontWeight:600, fontSize:"1.2rem"}}>{mesActual}</div>
              <div style={{fontSize:"1rem"}}>{diaInicio} al {diaFin}</div>
            </div>
            <button className="btn btn-outline-secondary" onClick={() => cambiarSemana(1)}>Semana siguiente &gt;</button>
          </div>
          <div className="calendario-semanal-grid">
            {semana.map((fecha, idx) => {
              const fechaISO = fecha.toISOString().slice(0, 10);
              const feriado = esFeriado(fechaISO);
              const horarioDia = horario[idx + 1] || [];
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
                  {!feriado && horarioDia.map((h, i) => (
                    <div
                      key={i}
                      className={`evento mt-2 ${h.curso === "Recreo" ? "evento-recreo" : "evento-horario"}`}
                    >
                      <span role="img" aria-label={h.curso === "Recreo" ? "recreo" : "clase"}>
                        {h.curso === "Recreo" ? "🛝" : "📚"}
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
          <div><b>Día(s) con menos carga:</b> {diasMenosCarga}</div>
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
            className="btn btn-secondary"
            onClick={() => navigate("/cursosProfesor")}
          >
            Subir material
          </button>
          <button
            className="btn btn-info"
            onClick={() => navigate("/anunciosProfesor")}
          >
            Publicar anuncio
          </button>
        </div>

        <div className="estadisticas-rapidas mb-4 d-flex gap-4 flex-wrap">
          <div className="stat-box bg-light p-3 rounded shadow-sm">
            <b>Asistencia</b>
            <div>{estadisticas.asistencia}%</div>
          </div>
          <div className="stat-box bg-light p-3 rounded shadow-sm">
            <b>Tareas corregidas</b>
            <div>{estadisticas.tareasCorregidas}</div>
          </div>
          <div className="stat-box bg-light p-3 rounded shadow-sm">
            <b>Tareas pendientes</b>
            <div>{estadisticas.tareasPendientes}</div>
          </div>
        </div>

        <div className="anuncios-importantes mb-4 p-3 rounded shadow-sm bg-white">
          <h5 className="mb-2">Anuncios importantes</h5>
          <ul>
            {anunciosImportantes.map((a, i) => (
              <li key={i}><b>{a.titulo}:</b> {a.descripcion}</li>
            ))}
          </ul>
        </div>

        <div className="cumpleanios-semana mb-4 p-3 rounded shadow-sm bg-white">
          <h5 className="mb-2">Cumpleaños de alumnos esta semana</h5>
          <ul>
            {cumpleaniosSemana.length === 0
              ? <li>No hay cumpleaños esta semana</li>
              : cumpleaniosSemana.map((c, i) => (
                  <li key={i}>{c.nombre} - {c.fecha}</li>
                ))}
          </ul>
        </div>

        <div className="notas-personales mb-4 p-3 rounded shadow-sm bg-white">
          <h5 className="mb-2">Notas personales</h5>
          <textarea
            className="form-control"
            rows={2}
            value={notaPersonal}
            onChange={guardarNota}
            placeholder="Escribe aquí tus recordatorios personales..."
          />
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