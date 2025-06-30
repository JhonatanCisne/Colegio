package com.Colegio.Colegio.La.Merced.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Colegio.Colegio.La.Merced.model.Seccion;

@Repository
public interface SeccionRepository extends JpaRepository<Seccion, Integer> {

}