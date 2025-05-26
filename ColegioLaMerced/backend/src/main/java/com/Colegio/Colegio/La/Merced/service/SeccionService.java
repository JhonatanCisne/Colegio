package com.Colegio.Colegio.La.Merced.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Colegio.Colegio.La.Merced.dto.SeccionDTO;
import com.Colegio.Colegio.La.Merced.model.Seccion;
import com.Colegio.Colegio.La.Merced.repository.SeccionRepository;

@Service
public class SeccionService {

    @Autowired
    private SeccionRepository seccionRepository;

    private SeccionDTO mapToDTO(Seccion seccion) {
        SeccionDTO dto = new SeccionDTO();
        dto.setIdSeccion(seccion.getIdSeccion());
        dto.setGrado(seccion.getGrado());
        dto.setNombre(seccion.getNombre());
        return dto;
    }

    private Seccion mapToEntity(SeccionDTO dto) {
        Seccion seccion = new Seccion();
        seccion.setIdSeccion(dto.getIdSeccion());
        seccion.setGrado(dto.getGrado());
        seccion.setNombre(dto.getNombre());
        return seccion;
    }

    public List<SeccionDTO> listarSecciones() {
        List<Seccion> secciones = seccionRepository.findAll();
        List<SeccionDTO> dtos = new ArrayList<>();
        for (Seccion seccion : secciones) {
            dtos.add(mapToDTO(seccion));
        }
        return dtos;
    }

    public SeccionDTO obtenerPorId(Integer id) {
        Optional<Seccion> optionalSeccion = seccionRepository.findById(id);
        if (optionalSeccion.isPresent()) {
            return mapToDTO(optionalSeccion.get());
        } else {
            throw new RuntimeException("Sección no encontrada");
        }
    }

    public SeccionDTO crearSeccion(SeccionDTO dto) {
        Seccion seccion = mapToEntity(dto);
        Seccion guardada = seccionRepository.save(seccion);
        return mapToDTO(guardada);
    }

    public SeccionDTO actualizarSeccion(Integer id, SeccionDTO dto) {
        Optional<Seccion> optionalSeccion = seccionRepository.findById(id);
        if (optionalSeccion.isPresent()) {
            Seccion existente = optionalSeccion.get();
            existente.setGrado(dto.getGrado());
            existente.setNombre(dto.getNombre());
            Seccion actualizado = seccionRepository.save(existente);
            return mapToDTO(actualizado);
        } else {
            throw new RuntimeException("Sección no encontrada");
        }
    }

    public boolean eliminarPorId(Integer id) {
        if (seccionRepository.existsById(id)) {
            seccionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
