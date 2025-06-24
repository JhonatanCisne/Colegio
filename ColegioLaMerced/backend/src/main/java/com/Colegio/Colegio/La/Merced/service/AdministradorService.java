package com.Colegio.Colegio.La.Merced.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Colegio.Colegio.La.Merced.dto.AdministradorDTO;
import com.Colegio.Colegio.La.Merced.model.Administrador;
import com.Colegio.Colegio.La.Merced.repository.AdministradorRepository;

@Service
public class AdministradorService {

    @Autowired
    private AdministradorRepository administradorRepository;

    private AdministradorDTO convertToDto(Administrador administrador) {
        AdministradorDTO dto = new AdministradorDTO();
        dto.setUsuario(administrador.getUsuario());
        dto.setContrasena(administrador.getContrasena());
        return dto;
    }

    public Optional<AdministradorDTO> validarCredenciales(String usuario, String contrasena) {
        return administradorRepository.findByUsuario(usuario)
                .filter(admin -> admin.getContrasena().equals(contrasena))
                .map(this::convertToDto);
    }
}