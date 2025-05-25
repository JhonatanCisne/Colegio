package com.Colegio.Colegio.La.Merced.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Colegio.Colegio.La.Merced.model.Seccion;

public interface SeccionRepository extends JpaRepository<Seccion, Integer> {
    Optional<Seccion> findByGradoAndNombre(String grado, String nombre);
}

