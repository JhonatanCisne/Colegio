package com.Colegio.Colegio.La.Merced.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.Colegio.Colegio.La.Merced.model.CursoUnico; // Importar List

@Repository
public interface CursoUnicoRepository extends JpaRepository<CursoUnico, Integer> {

    // Método para eliminar todos los registros de CursoUnico asociados a un alumno.
    // Utilizado después de que las asistencias de esos cursos han sido eliminadas.
    @Modifying
    @Transactional // Es crucial para operaciones de DELETE con @Query
    @Query("DELETE FROM CursoUnico cu WHERE cu.alumno.idAlumno = :idAlumno")
    void deleteCursoUnicoByAlumnoId(@Param("idAlumno") Integer idAlumno);

    // **NUEVO MÉTODO AÑADIDO:**
    // Método para encontrar todos los objetos CursoUnico por el ID de su alumno asociado.
    // Esto es necesario para iterar y obtener los IDs de los cursos para eliminar sus asistencias.
    List<CursoUnico> findByAlumnoIdAlumno(Integer idAlumno);
}