import React from "react";
import BarraDeNavegacionLateral from "../../Componentes/BarraDeNavegacionLateral";
import "./Inicio.css";

function Inicio() {
  return (
    <div className="d-flex">
      <BarraDeNavegacionLateral />
      <div className="contenido-principal">
        <h2 className="mb-4">Horario de Clases</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Día</th>
                <th>8:00 - 9:00</th>
                <th>9:00 - 10:00</th>
                <th>10:00 - 11:00</th>
                <th>11:00 - 12:00</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lunes</td>
                <td>Matemática</td>
                <td>Comunicación</td>
                <td>Recreo</td>
                <td>Ciencias</td>
              </tr>
              <tr>
                <td>Martes</td>
                <td>Historia</td>
                <td>Matemática</td>
                <td>Recreo</td>
                <td>Educación Física</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="mt-5 mb-4">Anuncios</h2>
        <div className="anuncios-vertical">
          <div className="anuncio-item">
            <img src="https://via.placeholder.com/800x200" alt="Anuncio 1" />
          </div>
          <div className="anuncio-item">
            <img src="https://via.placeholder.com/800x200" alt="Anuncio 2" />
          </div>
          <div className="anuncio-item">
            <img src="https://via.placeholder.com/800x200" alt="Anuncio 3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
