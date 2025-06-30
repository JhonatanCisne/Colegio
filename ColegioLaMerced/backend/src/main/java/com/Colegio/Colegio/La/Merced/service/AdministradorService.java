package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    private Administrador convertToEntity(AdministradorDTO dto) {
        Administrador administrador = new Administrador();
        administrador.setUsuario(dto.getUsuario());
        administrador.setContrasena(dto.getContrasena());
        return administrador;
    }

    public List<AdministradorDTO> getAllAdministradores() {
        return administradorRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<AdministradorDTO> getAdministradorById(String usuario) {
        return administradorRepository.findById(usuario)
                .map(this::convertToDto);
    }

    public AdministradorDTO createAdministrador(AdministradorDTO administradorDTO) {
        Administrador administrador = convertToEntity(administradorDTO);
        Administrador savedAdministrador = administradorRepository.save(administrador);
        return convertToDto(savedAdministrador);
    }

    public Optional<AdministradorDTO> updateAdministrador(String usuario, AdministradorDTO administradorDTO) {
        return administradorRepository.findById(usuario).map(existingAdministrador -> {
            existingAdministrador.setContrasena(administradorDTO.getContrasena());
            Administrador updatedAdministrador = administradorRepository.save(existingAdministrador);
            return convertToDto(updatedAdministrador);
        });
    }

    public boolean deleteAdministrador(String usuario) {
        if (administradorRepository.existsById(usuario)) {
            administradorRepository.deleteById(usuario);
            return true;
        }
        return false;
    }
}