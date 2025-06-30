package com.Colegio.Colegio.La.Merced.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Colegio.Colegio.La.Merced.model.SeccionCurso; // Importar List

@Repository
public interface SeccionCursoRepository extends JpaRepository<SeccionCurso, Integer> {

    // Nuevo método para buscar SeccionCurso por el ID de la Sección relacionada
    List<SeccionCurso> findBySeccion_IdSeccion(Integer idSeccion);
    
}