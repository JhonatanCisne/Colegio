package com.Colegio.Colegio.La.Merced.repository;

import com.Colegio.Colegio.La.Merced.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {

}