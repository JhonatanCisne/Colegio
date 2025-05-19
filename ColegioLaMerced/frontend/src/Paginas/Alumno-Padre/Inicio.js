import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Inicio.css";
import BarraDeNavegaciónLateral from "../../Componentes/BarraDeNavegacionLateral";

function Inicio() {
  return (
    <div className="d-flex">
      <BarraDeNavegaciónLateral />
      <div className="container ms-5 p-4">
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
              {/* Puedes añadir más filas */}
            </tbody>
          </table>
        </div>

        <h2 className="mt-5 mb-4">Anuncios</h2>
        <div id="carouselAnuncios" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="https://via.placeholder.com/800x300" className="d-block w-100" alt="Anuncio 1" />
            </div>
            <div className="carousel-item">
              <img src="https://via.placeholder.com/800x300" className="d-block w-100" alt="Anuncio 2" />
            </div>
            <div className="carousel-item">
              <img src="https://via.placeholder.com/800x300" className="d-block w-100" alt="Anuncio 3" />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselAnuncios" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselAnuncios" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
