package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Colegio.Colegio.La.Merced.dto.SeccionDTO;
import com.Colegio.Colegio.La.Merced.model.Seccion;
import com.Colegio.Colegio.La.Merced.repository.SeccionRepository;

@Service
public class SeccionService {

    @Autowired
    private SeccionRepository seccionRepository;

    private SeccionDTO convertToDto(Seccion seccion) {
        SeccionDTO dto = new SeccionDTO();
        dto.setIdSeccion(seccion.getIdSeccion());
        dto.setGrado(seccion.getGrado());
        dto.setNombre(seccion.getNombre());
        return dto;
    }

    private Seccion convertToEntity(SeccionDTO dto) {
        Seccion seccion = new Seccion();
        seccion.setIdSeccion(dto.getIdSeccion());
        seccion.setGrado(dto.getGrado());
        seccion.setNombre(dto.getNombre());
        return seccion;
    }

    public List<SeccionDTO> getAllSecciones() {
        return seccionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<SeccionDTO> getSeccionById(Integer id) {
        return seccionRepository.findById(id)
                .map(this::convertToDto);
    }

    public SeccionDTO createSeccion(SeccionDTO seccionDTO) {
        Seccion seccion = convertToEntity(seccionDTO);
        Seccion savedSeccion = seccionRepository.save(seccion);
        return convertToDto(savedSeccion);
    }

    public Optional<SeccionDTO> updateSeccion(Integer id, SeccionDTO seccionDTO) {
        return seccionRepository.findById(id).map(existingSeccion -> {
            existingSeccion.setGrado(seccionDTO.getGrado());
            existingSeccion.setNombre(seccionDTO.getNombre());
            Seccion updatedSeccion = seccionRepository.save(existingSeccion);
            return convertToDto(updatedSeccion);
        });
    }

    public boolean deleteSeccion(Integer id) {
        if (seccionRepository.existsById(id)) {
            seccionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}