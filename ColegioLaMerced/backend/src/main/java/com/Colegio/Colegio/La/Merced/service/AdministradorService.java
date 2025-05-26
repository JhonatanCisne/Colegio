package com.Colegio.Colegio.La.Merced.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Colegio.Colegio.La.Merced.model.Administrador;
import com.Colegio.Colegio.La.Merced.repository.AdministradorRepository;

@Service
public class AdministradorService {

    @Autowired
    private AdministradorRepository administradorRepository;

    /**
      
      @param usuario 
      @param contrasena 
      @return 
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
