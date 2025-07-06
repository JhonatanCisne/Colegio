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

  // Función para exportar a CSV
  const exportToCsv = () => {
    if (alumnos.length === 0) {
      alert('No hay alumnos para exportar.');
      return;
    }

    // Encabezados del CSV
    const headers = [
      'Nombre',
      'Apellido',
      'DNI',
      'Correo',
      'Nombre Padre',
      'Apellido Padre',
      'Grado',
      'Seccion'
    ];

    // Mapea los datos de los alumnos a un formato de fila CSV
    const rows = alumnos.map(alumno => [
      alumno.nombre,
      alumno.apellido,
      alumno.dni,
      alumno.correo,
      alumno.nombrePadre,
      alumno.apellidoPadre,
      alumno.grado,
      alumno.seccionNombre
    ]);

    // Combina encabezados y filas, escapando comas internas y añadiendo comillas si es necesario
    const csvContent = [
      headers.map(header => `"${header}"`).join(','), // Asegura que los encabezados estén entre comillas
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')) // Escapa comillas internas y rodea con comillas
    ].join('\n');

    // Crea un Blob y un enlace para la descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    // Asegura que el navegador soporte el atributo 'download'
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'lista_alumnos.csv'); // Nombre del archivo

      // Simula un clic para descargar el archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Libera el objeto URL
    } else {
      alert('Tu navegador no soporta la descarga de archivos. Intenta con otro navegador.');
    }
  };

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
          <>
            {/* Botón de Exportar a CSV */}
            <button className="export-button" onClick={exportToCsv}>
              Exportar
            </button>

            <div className="alumnos-table-container">
              <table className="alumnos-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
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
                      <td>{alumno.nombre}</td>
                      <td>{alumno.apellido}</td>
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAlumnoVer;