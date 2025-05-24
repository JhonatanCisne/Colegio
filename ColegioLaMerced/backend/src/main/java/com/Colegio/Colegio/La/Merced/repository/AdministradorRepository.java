package com.Colegio.Colegio.La.Merced.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tuapp.modelo.Administrador;
import java.util.Optional;

public interface AdministradorRepository extends JpaRepository<Administrador, String> {
    Optional<Administrador> findByUsuario(String usuario);
}
