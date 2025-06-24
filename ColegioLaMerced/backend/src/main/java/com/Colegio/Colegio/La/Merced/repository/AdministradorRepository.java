package com.Colegio.Colegio.La.Merced.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Colegio.Colegio.La.Merced.model.Administrador;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, String> {
    Optional<Administrador> findByUsuario(String usuario);
}