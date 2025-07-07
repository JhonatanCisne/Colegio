import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Administrador/AdminAlumnoModificar.css';

const API_BASE_ALUMNOS = "http://localhost:8080/api/alumnos";
const API_BASE_PADRES = "http://localhost:8080/api/padres";
const API_BASE_SECCIONES = "http://localhost:8080/api/secciones";
const API_BASE_CURSOS_UNICOS = "http://localhost:8080/api/cursosunicos";
const API_BASE_SECCION_CURSOS = "http://localhost:8080/api/seccioncursos";

const AdminAlumnoModificar = () => {
  const navigate = useNavigate();
  const [dniBuscar, setDniBuscar] = useState('');
  const [alumnoEncontrado, setAlumnoEncontrado] = useState(null);
  const [padres, setPadres] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [idPadre, setIdPadre] = useState('');

  const [mostrarCambiarSeccionModal, setMostrarCambiarSeccionModal] = useState(false);
  const [seccionActualAlumno, setSeccionActualAlumno] = useState('');
  const [nuevaSeccionSeleccionada, setNuevaSeccionSeleccionada] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [padresResponse, seccionesResponse] = await Promise.all([
          fetch(API_BASE_PADRES),
          fetch(API_BASE_SECCIONES)
        ]);

        if (!padresResponse.ok) throw new Error(`HTTP error! status: ${padresResponse.status} al cargar padres.`);
        const padresData = await padresResponse.json();
        setPadres(padresData);

        if (!seccionesResponse.ok) throw new Error(`HTTP error! status: ${seccionesResponse.status} al cargar secciones.`);
        const seccionesData = await seccionesResponse.json();
        setSecciones(seccionesData);

      } catch (error) {
        console.error("Error al obtener datos iniciales:", error);
        setError(`Error al cargar datos: ${error.message}`);
      }
    };
    fetchData();
  }, []);

  const handleBuscarAlumno = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setAlumnoEncontrado(null);
    setSeccionActualAlumno('');

    if (!dniBuscar) {
      setError('Por favor, ingresa el DNI del alumno a buscar.');
      return;
    }

    try {
      const [alumnosResponse, cursosUnicosResponse, seccionCursosResponse] = await Promise.all([
        fetch(`${API_BASE_ALUMNOS}`),
        fetch(`${API_BASE_CURSOS_UNICOS}`), // Obtener todos los cursos únicos
        fetch(`${API_BASE_SECCION_CURSOS}`) // Obtener todas las relaciones sección-curso
      ]);

      if (!alumnosResponse.ok) throw new Error(`HTTP error! status: ${alumnosResponse.status} al cargar alumnos.`);
      if (!cursosUnicosResponse.ok) throw new Error(`HTTP error! status: ${cursosUnicosResponse.status} al cargar cursos únicos.`);
      if (!seccionCursosResponse.ok) throw new Error(`HTTP error! status: ${seccionCursosResponse.status} al cargar relaciones sección-curso.`);

      const alumnos = await alumnosResponse.json();
      const cursosUnicos = await cursosUnicosResponse.json();
      const seccionCursos = await seccionCursosResponse.json();

      const foundAlumno = alumnos.find(alumno => alumno.dni === dniBuscar);

      if (foundAlumno) {
        setAlumnoEncontrado(foundAlumno);
        setNombre(foundAlumno.nombre);
        setApellido(foundAlumno.apellido);
        setDni(foundAlumno.dni);
        setCorreo(foundAlumno.correo);
        setContrasena(foundAlumno.contrasena);
        setIdPadre(foundAlumno.idPadre || '');

        // Lógica para determinar la sección actual del alumno
        const alumnoCursoUnico = cursosUnicos.find(cu => cu.idAlumno === foundAlumno.idAlumno);

        let seccionAsignada = 'No asignado';
        let idSeccionAsignada = '';

        if (alumnoCursoUnico) {
          const seccionCursoRelacion = seccionCursos.find(sc => sc.idSeccionCurso === alumnoCursoUnico.idSeccionCurso);
          if (seccionCursoRelacion) {
            const seccionObj = secciones.find(s => s.idSeccion === seccionCursoRelacion.idSeccion);
            if (seccionObj) {
              seccionAsignada = `${seccionObj.grado} "${seccionObj.nombre}"`;
              idSeccionAsignada = seccionObj.idSeccion;
            }
          }
        }
        setSeccionActualAlumno(seccionAsignada);
        setNuevaSeccionSeleccionada(idSeccionAsignada);


        setMensaje('Alumno encontrado. Ahora puedes modificar sus datos.');
      } else {
        setError('No se encontró ningún alumno con ese DNI.');
      }
    } catch (error) {
      console.error("Error al buscar alumno:", error);
      setError(`Error al buscar alumno: ${error.message}`);
    }
  };

  const handleModificarAlumno = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!alumnoEncontrado) {
      setError('Primero busca un alumno para modificar.');
      return;
    }

    if (!nombre || !apellido || !dni || !correo || !contrasena || !idPadre) {
      setError('Por favor, completa todos los campos del formulario.');
      return;
    }

    const alumnoActualizado = {
      idAlumno: alumnoEncontrado.idAlumno,
      idPadre: parseInt(idPadre),
      nombre,
      apellido,
      dni,
      correo,
      contrasena,
    };

    try {
      const response = await fetch(`${API_BASE_ALUMNOS}/${alumnoEncontrado.idAlumno}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alumnoActualizado),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
      }

      setMensaje('Alumno modificado exitosamente.');
    } catch (error) {
      console.error("Error al modificar alumno:", error);
      setError(`Error al modificar alumno: ${error.message}`);
    }
  };

  const handleAbrirCambiarSeccionModal = () => {
    if (!alumnoEncontrado) {
      setError('Primero busca un alumno para cambiar su sección.');
      return;
    }
    setMostrarCambiarSeccionModal(true);
  };

  const handleCambiarSeccion = async () => {
    setMensaje('');
    setError('');

    if (!alumnoEncontrado || !nuevaSeccionSeleccionada) {
      setError('Selecciona una nueva sección para el alumno.');
      return;
    }

    try {
      // Eliminar Cursos Únicos existentes para el alumno
      const eliminarCursosResponse = await fetch(`${API_BASE_CURSOS_UNICOS}/eliminarPorAlumno/${alumnoEncontrado.idAlumno}`, {
        method: 'DELETE',
      });

      // Se maneja el 404 porque podría no tener cursos asignados previamente.
      if (!eliminarCursosResponse.ok && eliminarCursosResponse.status !== 404) {
        const errorData = await eliminarCursosResponse.json();
        throw new Error(`Error al eliminar cursos únicos existentes: ${errorData.message || eliminarCursosResponse.statusText}`);
      }

      // Obtener los SeccionCursos de la nueva sección
      const respSeccionCursos = await fetch(`${API_BASE_SECCION_CURSOS}/porSeccion/${nuevaSeccionSeleccionada}`);
      if (!respSeccionCursos.ok) {
        const errorData = await respSeccionCursos.json();
        throw new Error(errorData.message || "Error al obtener los cursos de la nueva sección.");
      }
      const seccionCursosDeNuevaSeccion = await respSeccionCursos.json();

      if (seccionCursosDeNuevaSeccion.length === 0) {
        alert("No se encontraron cursos para esta nueva sección. No se generarán Cursos Únicos.");
        setMostrarCambiarSeccionModal(false);
        setMensaje('Sección actualizada, pero no se generaron nuevos cursos únicos (sección sin cursos).');
        // Aún así, actualiza el estado de la sección visualmente aunque no haya cursos únicos nuevos.
        const nuevaSeccionObj = secciones.find(s => s.idSeccion === parseInt(nuevaSeccionSeleccionada));
        if (nuevaSeccionObj) {
          setSeccionActualAlumno(nuevaSeccionObj.grado + " \"" + nuevaSeccionObj.nombre + "\"");
        } else {
          setSeccionActualAlumno('No asignado');
        }
        return;
      }

      // Crear nuevos Cursos Únicos para el alumno en la nueva sección
      const cursosUnicosParaCrear = seccionCursosDeNuevaSeccion.map(sc => ({
        idAlumno: alumnoEncontrado.idAlumno,
        idSeccionCurso: sc.idSeccionCurso,
        examen1: 0.0,
        examen2: 0.0,
        examen3: 0.0,
        examen4: 0.0,
        examenFinal: 0.0
      }));

      const respCursosUnicos = await fetch(API_BASE_CURSOS_UNICOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cursosUnicosParaCrear),
      });

      if (!respCursosUnicos.ok) {
        const errorData = await respCursosUnicos.json();
        throw new Error(errorData.message || `Error al crear los nuevos cursos únicos. Estado: ${respCursosUnicos.status}`);
      }

      alert("Sección del alumno cambiada y nuevos cursos únicos generados exitosamente!");
      setMensaje('Sección del alumno cambiada y nuevos cursos únicos generados exitosamente!');
      setMostrarCambiarSeccionModal(false);

      // Actualizar la sección actual mostrada después del cambio SIN una llamada adicional al backend
      const nuevaSeccionObj = secciones.find(s => s.idSeccion === parseInt(nuevaSeccionSeleccionada));
      if (nuevaSeccionObj) {
        setSeccionActualAlumno(nuevaSeccionObj.grado + " \"" + nuevaSeccionObj.nombre + "\"");
      }

    } catch (error) {
      console.error("Error al cambiar la sección del alumno:", error);
      setError(`Error al cambiar la sección del alumno: ${error.message}`);
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
          <li><button onClick={() => navigate('/AdminAlumnos')}>Añadir Alumno</button></li>
        </ul>
      </div>
      <div className="content">
        <h1>Modificar Alumno</h1>

        <form onSubmit={handleBuscarAlumno} className="buscar-form">
          <label htmlFor="dniBuscar">DNI del Alumno a Modificar:</label>
          <input
            type="text"
            id="dniBuscar"
            value={dniBuscar}
            onChange={(e) => setDniBuscar(e.target.value)}
            required
          />
          <button type="submit">Buscar Alumno</button>
        </form>

        {mensaje && <p className="success-message">{mensaje}</p>}
        {error && <p className="error-message">{error}</p>}

        {alumnoEncontrado && (
          <div className="modificar-form-container">
            <h2>Datos del Alumno</h2>
            <form onSubmit={handleModificarAlumno}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dni">DNI:</label>
                <input
                  type="text"
                  id="dni"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="correo">Correo:</label>
                <input
                  type="email"
                  id="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contrasena">Contraseña:</label>
                <input
                  type="password"
                  id="contrasena"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="idPadre">Padre:</label>
                <select
                  id="idPadre"
                  value={idPadre}
                  onChange={(e) => setIdPadre(e.target.value)}
                  required
                >
                  <option value="">Selecciona un padre</option>
                  {padres.map((padre) => (
                    <option key={padre.idPadre} value={padre.idPadre}>
                      {padre.nombre} {padre.apellido} (DNI: {padre.dni})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Guardar Cambios</button>
            </form>

            <div className="seccion-actual">
              <h3>Sección Actual: {seccionActualAlumno}</h3>
              <button onClick={handleAbrirCambiarSeccionModal} className="btn-cambiar-seccion">
                Cambiar Sección
              </button>
            </div>
          </div>
        )}
      </div>

      {mostrarCambiarSeccionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cambiar Sección de {alumnoEncontrado?.nombre} {alumnoEncontrado?.apellido}</h3>
            <p>Sección Actual: <strong>{seccionActualAlumno}</strong></p>

            <div className="form-group">
              <label htmlFor="nuevaSeccion">Selecciona la Nueva Sección:</label>
              <select
                id="nuevaSeccion"
                value={nuevaSeccionSeleccionada}
                onChange={(e) => setNuevaSeccionSeleccionada(e.target.value)}
                required
              >
                <option value="">Selecciona...</option>
                {secciones.map((seccion) => (
                  <option key={seccion.idSeccion} value={seccion.idSeccion}>
                    {seccion.grado} "{seccion.nombre}"
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-acciones">
              <button
                onClick={handleCambiarSeccion}
                disabled={!nuevaSeccionSeleccionada || (secciones.find(s => s.idSeccion === parseInt(nuevaSeccionSeleccionada))?.grado + " \"" + secciones.find(s => s.idSeccion === parseInt(nuevaSeccionSeleccionada))?.nombre + "\"" === seccionActualAlumno)}
              >
                Confirmar Cambio de Sección
              </button>
              <button onClick={() => setMostrarCambiarSeccionModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAlumnoModificar;