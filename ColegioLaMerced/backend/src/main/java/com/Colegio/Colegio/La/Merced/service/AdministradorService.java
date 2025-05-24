package com.Colegio.Colegio.La.Merced.service;

import com.Colegio.Colegio.La.Merced.model.Administrador;
import com.Colegio.Colegio.La.Merced.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdministradorService {

    @Autowired
    private AdministradorRepository administradorRepository;

    /**
     * Valida las credenciales del administrador.
     * @param usuario usuario ingresado
     * @param contrasena contraseña ingresada
     * @return true si las credenciales son correctas, false si no
     */
    public boolean validarCredenciales(String usuario, String contrasena) {
        Optional<Administrador> adminOpt = administradorRepository.findByUsuario(usuario);
        if (adminOpt.isPresent()) {
            Administrador admin = adminOpt.get();
            return admin.getContrasena().equals(contrasena);
        }
        return false;
    }
}
