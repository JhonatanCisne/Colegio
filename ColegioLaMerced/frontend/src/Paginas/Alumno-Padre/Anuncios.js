import React from "react";
import BarraDeNavegacionLateral from "../../Componentes/BarraDeNavegacionLateral";
import "./Anuncios.css";

function Anuncios() {
  return (
    <div className="d-flex">
      <BarraDeNavegacionLateral />
      <div className="contenido-principal">
        <h2 className="mb-4">Anuncios Recientes</h2>
        <div className="anuncios-vertical">
          <div className="anuncio mb-4 p-3">
            <h5>Salida Escolar</h5>
            <p>El próximo viernes habrá una salida educativa al museo de historia. Traer autorización firmada.</p>
          </div>
          <div className="anuncio mb-4 p-3">
            <h5>Entrega de Boletas</h5>
            <p>La entrega de boletas será el lunes 27 en horario de tutoría. Asistencia obligatoria de padres.</p>
          </div>
          <div className="anuncio mb-4 p-3">
            <h5>Reunión de Padres</h5>
            <p>Se convoca a reunión virtual el jueves a las 6:00 p.m. por Zoom para tratar temas del segundo bimestre.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Anuncios;

