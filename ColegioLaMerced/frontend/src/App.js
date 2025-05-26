import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import LaMerced from "./Paginas/LaMerced/LaMerced";
import Inicio from "./Paginas/Alumno-Padre/Inicio";
import Curso from "./Paginas/Alumno-Padre/Curso";
import Asistencia from "./Paginas/Alumno-Padre/Asistencia";
import Anuncios from "./Paginas/Alumno-Padre/Anuncios";
import Login from "./Paginas/Login/Login";
import LoginAlumno from "./Paginas/LoginAlumno/LoginAlumno";
import LoginAdmin from "./Paginas/Administrador/LoginAdmin";
import AdminAlumnos from "./Paginas/Administrador/AdminAlumnos";
import AdminProfesores from "./Paginas/Administrador/AdminProfesores";

import InicioProfesor from "./Paginas/Profesor/InicioProfesor";
import CursoProfesor from "./Paginas/Profesor/CursoProfesor";
import AsistenciaProfesor from "./Paginas/Profesor/AsistenciaProfesor";
import AnunciosProfesor from "./Paginas/Profesor/AnunciosProfesor";

import BarraDeNavegacionLateral from "./Componentes/BarraDeNavegacionLateral";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function Layout() {
  const location = useLocation();
  console.log("Ruta actual:", location.pathname); 

  const ocultarBarraLateral = ["/", "/login", "/loginAlumno"].some(ruta =>
    location.pathname.startsWith(ruta)
  );

  return (
    <div className="d-flex">
      {!ocultarBarraLateral && <BarraDeNavegacionLateral />}
      <div className="flex-grow-1 p-3">
        <Routes>
          <Route path="/" element={<LaMerced />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loginAlumno" element={<LoginAlumno />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/cursos" element={<Curso />} />
          <Route path="/asistencia" element={<Asistencia />} />
          <Route path="/anuncios" element={<Anuncios />} />
          <Route path="/LoginAdmin" element={<LoginAdmin />} />   
          <Route path="/AdminAlumnos" element={<AdminAlumnos />} /> 
          <Route path="/AdminProfesores" element={<AdminProfesores />} />   
          <Route path="/inicioProfesor" element={<InicioProfesor />} />
          <Route path="/cursosProfesor" element={<CursoProfesor />} />
          <Route path="/asistenciaProfesor" element={<AsistenciaProfesor />} />
          <Route path="/anunciosProfesor" element={<AnunciosProfesor />} />

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