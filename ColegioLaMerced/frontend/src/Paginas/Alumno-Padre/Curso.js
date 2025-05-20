import React from "react";
import BarraDeNavegacionLateral from "../../Componentes/BarraDeNavegacionLateral";
import "./Curso.css";

function Curso() {
  return (
    <div className="d-flex">
      <BarraDeNavegacionLateral />
      <div className="contenido-principal">
        <h2 className="mb-4">Mis Cursos</h2>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card curso-card">
              <div className="card-body">
                <h5 className="card-title">Matemática</h5>
                <p className="card-text">Profesor: Sr. Gómez</p>
                <a href="#" className="btn btn-primary">Ver contenido</a>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card curso-card">
              <div className="card-body">
                <h5 className="card-title">Comunicación</h5>
                <p className="card-text">Profesor: Sra. Rodríguez</p>
                <a href="#" className="btn btn-primary">Ver contenido</a>
              </div>
            </div>
          </div>
          {/* Agrega más cursos aquí si lo deseas */}
        </div>
      </div>
    </div>
  );
}

export default Curso;
