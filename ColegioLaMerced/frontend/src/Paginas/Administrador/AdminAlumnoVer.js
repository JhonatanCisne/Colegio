import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Administrador/AdminAlumnoVer.css'; // Importa el archivo CSS

const AdminAlumnoVer = () => {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumnosData = async () => {
      try {
        const alumnosResponse = await fetch('http://localhost:8080/api/alumnos');
        if (!alumnosResponse.ok) {
          throw new Error('Error al cargar la lista de alumnos');
        }
        const alumnosData = await alumnosResponse.json();

        const padresResponse = await fetch('http://localhost:8080/api/padres');
        if (!padresResponse.ok) {
          throw new Error('Error al cargar la lista de padres');
        }
        const padresData = await padresResponse.json();
        const padresMap = new Map(padresData.map(padre => [padre.idPadre, padre]));

        const cursosUnicosResponse = await fetch('http://localhost:8080/api/cursosunicos');
        if (!cursosUnicosResponse.ok) {
          throw new Error('Error al cargar los cursos únicos');
        }
        const cursosUnicosData = await cursosUnicosResponse.json();

        const seccionCursosResponse = await fetch('http://localhost:8080/api/seccioncursos');
        if (!seccionCursosResponse.ok) {
          throw new Error('Error al cargar las secciones de cursos');
        }
        const seccionCursosData = await seccionCursosResponse.json();
        const seccionCursosMap = new Map(seccionCursosData.map(sc => [sc.idSeccionCurso, sc]));

        const seccionesResponse = await fetch('http://localhost:8080/api/secciones');
        if (!seccionesResponse.ok) {
          throw new Error('Error al cargar las secciones');
        }
        const seccionesData = await seccionesResponse.json();
        const seccionesMap = new Map(seccionesData.map(seccion => [seccion.idSeccion, seccion]));

        const alumnosConDetalles = alumnosData.map(alumno => {
          const padre = padresMap.get(alumno.idPadre);

          const cursoUnicoDelAlumno = cursosUnicosData.find(cu => cu.idAlumno === alumno.idAlumno);
          let grado = 'N/A';
          let seccionNombre = 'N/A';

          if (cursoUnicoDelAlumno) {
            const seccionCurso = seccionCursosMap.get(cursoUnicoDelAlumno.idSeccionCurso);
            if (seccionCurso) {
              const seccion = seccionesMap.get(seccionCurso.idSeccion);
              if (seccion) {
                grado = seccion.grado;
                seccionNombre = seccion.nombre;
              }
            }
          }

          return {
            ...alumno,
            nombrePadre: padre ? padre.nombre : 'N/A',
            apellidoPadre: padre ? padre.apellido : 'N/A',
            grado,
            seccionNombre,
          };
        });

        setAlumnos(alumnosConDetalles);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError(`Error al cargar los datos de los alumnos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumnosData();
  }, []);

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h2>Panel de Administración</h2>
        <ul>
          <li><button onClick={() => navigate('/AdminAlumnos')}>Regresar a Admin Alumno</button></li>
          <li><button onClick={() => navigate('/AdminAlumnoEliminar')}>Eliminar Alumno</button></li>
          <li><button onClick={() => navigate('/AdminAlumnoVer')}>Ver Alumnos</button></li>
          <li><button onClick={() => navigate('/AdminAlumnoModificar')}>Modificar Alumno</button></li>
        </ul>
      </div>
      <div className="content">
        <h1>Ver Alumnos</h1>

        {loading && <p>Cargando datos de alumnos...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && alumnos.length === 0 && (
          <p>No hay alumnos registrados.</p>
        )}

        {!loading && !error && alumnos.length > 0 && (
          <div className="alumnos-table-container">
            <table className="alumnos-table">
              <thead>
                <tr>
                  <th>Nombre</th> {/* Reincorporado */}
                  <th>Apellido</th> {/* Reincorporado */}
                  <th>DNI</th>
                  <th>Correo</th>
                  <th>Padre</th>
                  <th>Grado</th>
                  <th>Sección</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map((alumno) => (
                  <tr key={alumno.idAlumno}>
                    <td>{alumno.nombre}</td> {/* Reincorporado */}
                    <td>{alumno.apellido}</td> {/* Reincorporado */}
                    <td>{alumno.dni}</td>
                    <td>{alumno.correo}</td>
                    <td>{`${alumno.nombrePadre} ${alumno.apellidoPadre}`}</td>
                    <td>{alumno.grado}</td>
                    <td>{alumno.seccionNombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAlumnoVer;