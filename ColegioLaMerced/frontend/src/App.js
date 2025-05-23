import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import LaMerced from "./Paginas/LaMerced/LaMerced";
import Inicio from "./Paginas/Alumno-Padre/Inicio";
import Curso from "./Paginas/Alumno-Padre/Curso";
import Asistencia from "./Paginas/Alumno-Padre/Asistencia";
import Anuncios from "./Paginas/Alumno-Padre/Anuncios";
import Login from "./Paginas/Login/Login";

import BarraDeNavegacionLateral from "./Componentes/BarraDeNavegacionLateral";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function Layout() {
  const location = useLocation();

  // No mostrar la barra lateral si estamos en LaMerced ("/") o en Login ("/login")
  const ocultarBarraLateral = location.pathname === "/" || location.pathname === "/login";

  return (
    <div className="d-flex">
      {!ocultarBarraLateral && <BarraDeNavegacionLateral />}
      <div className="flex-grow-1 p-3">
        <Routes>
          <Route path="/" element={<LaMerced />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/cursos" element={<Curso />} />
          <Route path="/asistencia" element={<Asistencia />} />
          <Route path="/anuncios" element={<Anuncios />} />
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;