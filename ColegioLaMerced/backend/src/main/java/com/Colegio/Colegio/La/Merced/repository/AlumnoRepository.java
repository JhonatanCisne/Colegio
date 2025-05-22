package com.Colegio.Colegio.La.Merced.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Colegio.Colegio.La.Merced.model.Alumno;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Integer> {
    
    // Método para encontrar alumno por DNI y contraseña (login)
    Optional<Alumno> findByDniAndContrasena(String dni, String contrasena);
}
