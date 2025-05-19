import React from "react";
import { Link } from "react-router-dom";
import "./EstilosBarraLateral.css";

function BarraDeNavegaciónLateral() {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Menú</h3>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/inicio" className="nav-link">Inicio</Link>
        </li>
        <li className="nav-item">
          <Link to="/curso" className="nav-link">Curso</Link>
        </li>
        <li className="nav-item">
          <Link to="/asistencia" className="nav-link">Asistencia</Link>
        </li>
        <li className="nav-item">
          <Link to="/anuncios" className="nav-link">Anuncios</Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">Cerrar sesión</Link>
        </li>
      </ul>
    </div>
  );
}

export default BarraDeNavegaciónLateral;
