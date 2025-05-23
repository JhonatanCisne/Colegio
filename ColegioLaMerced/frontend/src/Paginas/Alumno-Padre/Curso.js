import React, { useState } from "react";
import BarraDeNavegacionLateral from "../../Componentes/BarraDeNavegacionLateral";
import "./Curso.css";

function Curso() {
  const cursosDelProfesor = [
    { id: 1, nombre: "Matemática", seccion: "A" },
    { id: 2, nombre: "Comunicación", seccion: "B" },
  ];

  const [alumnosPorCurso, setAlumnosPorCurso] = useState({
    1: [
      { id: 1, nombre: "Ana López", notas: {} },
      { id: 2, nombre: "Carlos Pérez", notas: { "Examen 1": 13 } },
    ],
    2: [
      { id: 3, nombre: "Laura Gómez", notas: {} },
      { id: 4, nombre: "Marco Torres", notas: { "Examen 2": 17 } },
    ],
  });

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(null); // idAlumno
  const [notaTemporal, setNotaTemporal] = useState("");
  const [examenSeleccionado, setExamenSeleccionado] = useState("Examen 1");

  const examenes = ["Examen 1", "Examen 2", "Examen 3", "Examen 4", "Examen 5"];

  const seleccionarCurso = (idCurso) => {
    setCursoSeleccionado(idCurso);
    setModoEdicion(null);
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

  return (
    <div className="d-flex">
      <BarraDeNavegacionLateral />
      <div className="contenido-principal">
        <h2 className="mb-4">Mis Cursos</h2>

        <div className="mb-4">
          {cursosDelProfesor.map((curso) => (
            <button
              key={curso.id}
              className={`btn me-2 mb-2 ${
                cursoSeleccionado === curso.id ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => seleccionarCurso(curso.id)}
            >
              {curso.nombre} - Sección {curso.seccion}
            </button>
          ))}
        </div>

        {cursoSeleccionado && (
          <>
            <h4>Alumnos del curso</h4>
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  {examenes.map((examen) => (
                    <th key={examen}>{examen}</th>
                  ))}
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {alumnosPorCurso[cursoSeleccionado]?.map((alumno) => (
                  <tr key={alumno.id}>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Curso;