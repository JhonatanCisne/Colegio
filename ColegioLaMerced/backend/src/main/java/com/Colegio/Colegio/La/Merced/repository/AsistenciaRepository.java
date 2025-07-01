// src/main/java/com/Colegio/Colegio.La.Merced.repository/AsistenciaRepository.java
package com.Colegio.Colegio.La.Merced.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Asegúrate de importar Param
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional; // Asegúrate de importar Transactional

import com.Colegio.Colegio.La.Merced.model.Asistencia;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Integer> {

    // Este método eliminará todas las asistencias asociadas a un CursoUnico específico.
    // Es crucial para la eliminación en cascada manual.
    @Modifying // Indica que esta consulta va a modificar la base de datos (DELETE).
    @Transactional // Asegura que esta operación se ejecute dentro de una transacción.
    @Query("DELETE FROM Asistencia a WHERE a.cursoUnico.idCursoUnico = :idCursoUnico")
    void deleteByCursoUnicoId(@Param("idCursoUnico") Integer idCursoUnico);
}