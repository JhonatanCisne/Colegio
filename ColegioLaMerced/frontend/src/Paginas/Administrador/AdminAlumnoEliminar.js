import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Administrador/AdminAlumnoEliminar.css';

const AdminAlumnoEliminar = () => {
  const navigate = useNavigate();
  const [dniBuscar, setDniBuscar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [dniParaModal, setDniParaModal] = useState(null); 
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleEliminarAlumno = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setDniParaModal(null);
    setMostrarModal(false);

    if (!dniBuscar) {
      setError('Por favor, ingresa el DNI del alumno a eliminar.');
      return;
    }

    setDniParaModal(dniBuscar);
    setMostrarModal(true);
  };

  const confirmarEliminacion = async () => {
    setMostrarModal(false);
    setMensaje('');
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/alumnos/dni/${dniBuscar}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        setMensaje(`✅ Alumno con DNI ${dniBuscar} y sus cursos asociados eliminados exitosamente.`);
        setDniBuscar('');
        setDniParaModal(null);
      } else if (response.status === 404) {
        const errorMessage = await response.text();
        setError(errorMessage || '❌ No se encontró ningún alumno con ese DNI para eliminar.');
      } else {
        const errorData = await response.text();
        setError(`❌ Error al eliminar alumno: ${errorData || response.statusText}`);
      }
    } catch (err) {
      setError(`❌ Error de conexión al eliminar alumno: ${err.message}`);
    }
  };

  const cancelarEliminacion = () => {
    setMostrarModal(false);
    setMensaje('ℹ️ Eliminación de alumno cancelada.');
    setError('');
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

        {mostrarModal && dniParaModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h2>Confirmar Eliminación</h2>
              <p>¿Estás seguro de que deseas eliminar al alumno con **DNI: {dniParaModal}**?</p>
              <p className="advertencia">⚠️ ¡Advertencia! Esta acción es irreversible y eliminará todos los datos del alumno, incluyendo sus cursos asociados.</p>
              <div className="modal-actions">
                <button onClick={confirmarEliminacion} className="btn-confirmar">Confirmar Eliminación</button>
                <button onClick={cancelarEliminacion} className="btn-cancelar">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAlumnoEliminar;