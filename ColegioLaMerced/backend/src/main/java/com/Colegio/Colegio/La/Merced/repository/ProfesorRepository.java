package com.Colegio.Colegio.La.Merced.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Colegio.Colegio.La.Merced.model.Profesor;

@Repository
public interface ProfesorRepository extends JpaRepository<Profesor, Integer> {

}