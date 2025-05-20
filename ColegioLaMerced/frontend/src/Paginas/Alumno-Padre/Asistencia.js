import React from "react";
import BarraDeNavegacionLateral from "../../Componentes/BarraDeNavegacionLateral";
import "./Asistencia.css";

function Asistencia() {
  return (
    <div className="d-flex">
      <BarraDeNavegacionLateral />
      <div className="contenido-principal">
        <h2 className="mb-4">Registro de Asistencia</h2>
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Fecha</th>
              <th>Curso</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-05-15</td>
              <td>Matemática</td>
              <td>Presente</td>
            </tr>
            <tr>
              <td>2025-05-14</td>
              <td>Comunicación</td>
              <td>Ausente</td>
            </tr>
            {/* Más registros aquí si lo deseas */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Asistencia;
