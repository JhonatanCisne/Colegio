import React from "react";
import { Link } from "react-router-dom";
import "./EstilosBarraLateral.css";

function BarraDeNavegacionLateralProfesor() {
return (
    <div className="sidebar">
    <h3 className="sidebar-title">Menú Profesor</h3>
    <ul className="nav flex-column">
        <li className="nav-item">
        <Link to="/inicioProfesor" className="nav-link">Inicio</Link>
        </li>
        <li className="nav-item">
        <Link to="/cursosProfesor" className="nav-link">Curso</Link>
        </li>
        <li className="nav-item">
        <Link to="/asistenciaProfesor" className="nav-link">Asistencia</Link>
        </li>
        <li className="nav-item">
        <Link to="/anunciosProfesor" className="nav-link">Anuncios</Link>
        </li>
        <li className="nav-item">
        <Link to="/" className="nav-link">Cerrar sesión</Link>
        </li>
    </ul>
    </div>
);
}

export default BarraDeNavegacionLateralProfesor;