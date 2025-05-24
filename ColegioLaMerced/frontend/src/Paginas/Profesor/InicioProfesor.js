import React from "react";
import BarraDeNavegacionLateral from "../../Componentes/BarraDeNavegacionLateral";
import "./InicioProfesor.css";

function InicioProfesor() {
  return (
    <div className="d-flex">
      <BarraDeNavegacionLateral />
      <div className="contenido-principal">
        <h2 className="mb-4">Mis Cursos</h2>
        <ul className="list-group mb-5">
          <li className="list-group-item">Matemática - 2° Secundaria</li>
          <li className="list-group-item">Matemática - 3° Secundaria</li>
          <li className="list-group-item">Razonamiento Matemático - 5° Secundaria</li>
        </ul>

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
                <td>2° Sec - Matemática</td>
                <td>3° Sec - Matemática</td>
                <td>Libre</td>
                <td>5° Sec - Razonamiento</td>
              </tr>
              <tr>
                <td>Martes</td>
                <td>3° Sec - Matemática</td>
                <td>Libre</td>
                <td>Libre</td>
                <td>5° Sec - Razonamiento</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="mt-5 mb-4">Anuncios Administrativos</h2>
        <div className="anuncios-vertical">
          <div className="anuncio-item">
            <img src="https://via.placeholder.com/800x200" alt="Reunión Docente" />
          </div>
          <div className="anuncio-item">
            <img src="https://via.placeholder.com/800x200" alt="Entrega de Actas" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InicioProfesor;