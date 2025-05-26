package com.Colegio.Colegio.La.Merced.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Colegio.Colegio.La.Merced.model.Examen;

@Repository
public interface ExamenRepository extends JpaRepository<Examen, Integer> {
    
    List<Examen> findByIdAlumnoAndIdSeccionCurso(Integer idAlumno, Integer idSeccionCurso);

    List<Examen> findByIdSeccionCurso(Integer idSeccionCurso);

    List<Examen> findByIdAlumno(Integer idAlumno);

    List<Examen> findByNumExamen(Integer numExamen);
}
