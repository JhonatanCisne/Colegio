import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Administrador/AdminAlumnoEliminar.css';

const AdminAlumnoEliminar = () => {
  const navigate = useNavigate();
  const [dniBuscar, setDniBuscar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleEliminarAlumno = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!dniBuscar) {
      setError('Por favor, ingresa el DNI del alumno a eliminar.');
      return;
    }

    try {
      // Llamada directa al nuevo endpoint de eliminación por DNI
      const response = await fetch(`http://localhost:8080/api/alumnos/dni/${dniBuscar}`, {
        method: 'DELETE',
      });

      if (response.status === 204) { // HttpStatus.NO_CONTENT
        setMensaje(`Alumno con DNI ${dniBuscar} y sus cursos asociados eliminados exitosamente.`);
        setDniBuscar('');
      } else if (response.status === 404) { // HttpStatus.NOT_FOUND
        const errorMessage = await response.text();
        setError(errorMessage || 'No se encontró ningún alumno con ese DNI.');
      } else {
        // Para otros códigos de error (ej. 500 Internal Server Error)
        const errorData = await response.text();
        setError(`Error al eliminar alumno: ${errorData || response.statusText}`);
      }
    } catch (err) {
      console.error("Error en la solicitud de eliminación:", err);
      setError(`Error de conexión al eliminar alumno: ${err.message}`);
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
        <h1>Eliminar Alumno</h1>

        <form onSubmit={handleEliminarAlumno} className="eliminar-form">
          <label htmlFor="dniBuscar">DNI del Alumno a Eliminar:</label>
          <input
            type="text"
            id="dniBuscar"
            value={dniBuscar}
            onChange={(e) => setDniBuscar(e.target.value)}
            required
            placeholder="Ej: 12345678"
          />
          <button type="submit">Eliminar Alumno</button>
        </form>

        {mensaje && <p className="success-message">{mensaje}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default AdminAlumnoEliminar;