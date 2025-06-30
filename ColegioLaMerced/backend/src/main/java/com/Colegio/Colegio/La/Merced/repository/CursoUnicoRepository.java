package com.Colegio.Colegio.La.Merced.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional; // Importar Transactional

import com.Colegio.Colegio.La.Merced.model.CursoUnico;

@Repository
public interface CursoUnicoRepository extends JpaRepository<CursoUnico, Integer> {

    // Cambiado 'cu.idAlumno' a 'cu.alumno.idAlumno'
    @Modifying
    @Transactional // Es crucial para operaciones de DELETE con @Query
    @Query("DELETE FROM CursoUnico cu WHERE cu.alumno.idAlumno = :idAlumno")
    void deleteCursoUnicoByAlumnoId(@Param("idAlumno") Integer idAlumno);
}