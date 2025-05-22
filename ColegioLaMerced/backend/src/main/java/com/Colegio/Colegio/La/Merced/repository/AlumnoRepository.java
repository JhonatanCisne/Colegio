package com.Colegio.Colegio.La.Merced.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Colegio.Colegio.La.Merced.model.Alumno;

public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    Alumno findByDniAndContrasena(String dni, String contrasena);
}
