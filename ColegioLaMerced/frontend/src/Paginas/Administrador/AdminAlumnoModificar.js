// src/components/Modificar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Administrador/AdminAlumnoModificar.css'; // Asegúrate de crear este archivo CSS


const AdminAlumnoModificar = () => {
  const navigate = useNavigate();
  const [dniBuscar, setDniBuscar] = useState('');
  const [alumnoEncontrado, setAlumnoEncontrado] = useState(null);
  const [padres, setPadres] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Estados para el formulario de modificación
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [idPadre, setIdPadre] = useState('');

  // Cargar la lista de padres al cargar el componente
  useEffect(() => {
    const fetchPadres = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/padres');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPadres(data);
      } catch (error) {
        console.error("Error al obtener padres:", error);
        setError("Error al cargar la lista de padres.");
      }
    };
    fetchPadres();
  }, []);

  const handleBuscarAlumno = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setAlumnoEncontrado(null);

    if (!dniBuscar) {
      setError('Por favor, ingresa el DNI del alumno a buscar.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/alumnos`); // Obtener todos los alumnos
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const alumnos = await response.json();
      const foundAlumno = alumnos.find(alumno => alumno.dni === dniBuscar);

      if (foundAlumno) {
        setAlumnoEncontrado(foundAlumno);
        // Rellenar el formulario con los datos del alumno encontrado
        setNombre(foundAlumno.nombre);
        setApellido(foundAlumno.apellido);
        setDni(foundAlumno.dni);
        setCorreo(foundAlumno.correo);
        setContrasena(foundAlumno.contrasena);
        setIdPadre(foundAlumno.idPadre || ''); // Asegúrate de manejar el caso si idPadre es null
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
      idAlumno: alumnoEncontrado.idAlumno, // Mantener el mismo ID
      idPadre: parseInt(idPadre), // Convertir a número entero
      nombre,
      apellido,
      dni,
      correo,
      contrasena,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/alumnos/${alumnoEncontrado.idAlumno}`, {
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
      setAlumnoEncontrado(null); // Limpiar el formulario después de la modificación
      setDniBuscar('');
      setNombre('');
      setApellido('');
      setDni('');
      setCorreo('');
      setContrasena('');
      setIdPadre('');
    } catch (error) {
      console.error("Error al modificar alumno:", error);
      setError(`Error al modificar alumno: ${error.message}`);
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAlumnoModificar;