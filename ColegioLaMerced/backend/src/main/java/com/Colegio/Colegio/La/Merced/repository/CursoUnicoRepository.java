package com.Colegio.Colegio.La.Merced.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.Colegio.Colegio.La.Merced.model.CursoUnico;

@Repository
public interface CursoUnicoRepository extends JpaRepository<CursoUnico, Integer> {

    @Modifying
    @Transactional
    @Query("DELETE FROM CursoUnico cu WHERE cu.alumno.idAlumno = :idAlumno")
    void deleteCursoUnicoByAlumnoId(@Param("idAlumno") Integer idAlumno);

    List<CursoUnico> findByAlumnoIdAlumno(Integer idAlumno);
}