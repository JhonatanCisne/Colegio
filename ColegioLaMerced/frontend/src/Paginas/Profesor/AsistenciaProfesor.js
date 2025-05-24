import React, { useState } from "react";
import BarraDeNavegacionLateral from "../../Componentes/BarraDeNavegacionLateral";
import "./Asistencia.css";

function Asistencia() {
  const cursosDelProfesor = [
    { id: 1, nombre: "Matemática", seccion: "A" },
    { id: 2, nombre: "Comunicación", seccion: "B" },
  ];

  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [nuevoAlumno, setNuevoAlumno] = useState({ nombre: "", cursoId: "" });

  const registrarAsistencia = (id, estado) => {
    setAlumnos((prev) =>
      prev.map((alumno) => {
        if (alumno.id === id) {
          const nuevasFaltas = estado === "Ausente" ? alumno.faltas + 1 : alumno.faltas;
          return {
            ...alumno,
            asistencia: [...alumno.asistencia, { fecha: new Date().toLocaleDateString(), estado }],
            faltas: nuevasFaltas,
          };
        }
        return alumno;
      })
    );
  };

  const reportarFaltas = () => {
    const alumnosReportados = alumnos.filter(
      (a) => a.faltas >= 3 && a.cursoId === cursoSeleccionado
    );
    if (alumnosReportados.length === 0) {
      alert("No hay alumnos con muchas faltas.");
    } else {
      alert(
        "Alumnos con más de 3 faltas:\n" +
          alumnosReportados.map((a) => `${a.nombre} (${a.faltas} faltas)`).join("\n")
      );
    }
  };

  const agregarAlumno = (e) => {
    e.preventDefault();
    if (!nuevoAlumno.nombre || !nuevoAlumno.cursoId) return;

    const nuevoId = alumnos.length + 1;
    setAlumnos([
      ...alumnos,
      {
        id: nuevoId,
        nombre: nuevoAlumno.nombre,
        cursoId: parseInt(nuevoAlumno.cursoId),
        asistencia: [],
        faltas: 0,
      },
    ]);
    setNuevoAlumno({ nombre: "", cursoId: "" });
  };

  const alumnosDelCurso = alumnos.filter((a) => a.cursoId === parseInt(cursoSeleccionado));

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateral />
      <div className="contenido-principal">
        <h2 className="mb-3">Registro de Asistencia - Profesor</h2>

        <div className="mb-4">
          <label>Seleccionar curso y sección: </label>
          <select
            className="form-select mt-1"
            value={cursoSeleccionado}
            onChange={(e) => setCursoSeleccionado(e.target.value)}
          >
            <option value="">-- Selecciona un curso --</option>
            {cursosDelProfesor.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre} - Sección {curso.seccion}
              </option>
            ))}
          </select>
        </div>

        {cursoSeleccionado && (
          <>
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Alumno</th>
                  <th>Acciones</th>
                  <th>Faltas</th>
                </tr>
              </thead>
              <tbody>
                {alumnosDelCurso.map((alumno) => (
                  <tr key={alumno.id}>
                    <td>{alumno.nombre}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => registrarAsistencia(alumno.id, "Presente")}
                      >
                        Presente
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => registrarAsistencia(alumno.id, "Ausente")}
                      >
                        Ausente
                      </button>
                    </td>
                    <td>{alumno.faltas}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="btn btn-warning mt-2" onClick={reportarFaltas}>
              Reportar alumnos con muchas faltas
            </button>

            <hr />

            <h4 className="mt-4">Registrar nuevo alumno</h4>
            <form onSubmit={agregarAlumno} className="row g-3 mt-2">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre del alumno"
                  value={nuevoAlumno.nombre}
                  onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={nuevoAlumno.cursoId}
                  onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, cursoId: e.target.value })}
                >
                  <option value="">Curso</option>
                  {cursosDelProfesor.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nombre} - Sección {curso.seccion}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">
                  Registrar
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Asistencia;