package com.Colegio.Colegio.La.Merced.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Colegio.Colegio.La.Merced.model.Padre;

@Repository
public interface PadreRepository extends JpaRepository<Padre, Integer> {

}