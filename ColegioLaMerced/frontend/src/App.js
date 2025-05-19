import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
  const esLogin = location.pathname === "/" || location.pathname === "/login";

  return (
    <div className="d-flex">
      {!esLogin && <BarraDeNavegacionLateral />}
      <div className="flex-grow-1 p-3">
        <Routes>
          <Route path="/" element={<Login />} />
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
