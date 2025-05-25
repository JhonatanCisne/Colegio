package com.Colegio.Colegio.La.Merced.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Colegio.Colegio.La.Merced.model.Alumno;

public interface AlumnoRepository extends JpaRepository<Alumno, Integer> {
    Optional<Alumno> findByDni(String dni);
    void deleteByDni(String dni);
    boolean existsByDni(String dni);
}

