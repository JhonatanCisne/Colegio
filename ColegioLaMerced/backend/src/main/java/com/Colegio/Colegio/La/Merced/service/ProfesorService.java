package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Colegio.Colegio.La.Merced.dto.ProfesorDTO;
import com.Colegio.Colegio.La.Merced.model.Profesor;
import com.Colegio.Colegio.La.Merced.repository.ProfesorRepository;

@Service
public class ProfesorService {

    @Autowired
    private ProfesorRepository profesorRepository;

    private ProfesorDTO convertToDto(Profesor profesor) {
        ProfesorDTO dto = new ProfesorDTO();
        dto.setIdProfesor(profesor.getIdProfesor());
        dto.setDni(profesor.getDni());
        dto.setNombre(profesor.getNombre());
        dto.setApellido(profesor.getApellido());
        dto.setEstado(profesor.getEstado());
        dto.setContrasena(profesor.getContrasena());
        return dto;
    }

    private Profesor convertToEntity(ProfesorDTO dto) {
        Profesor profesor = new Profesor();
        profesor.setIdProfesor(dto.getIdProfesor());
        profesor.setDni(dto.getDni());
        profesor.setNombre(dto.getNombre());
        profesor.setApellido(dto.getApellido());
        profesor.setEstado(dto.getEstado());
        profesor.setContrasena(dto.getContrasena());
        return profesor;
    }

    public List<ProfesorDTO> getAllProfesores() {
        return profesorRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<ProfesorDTO> getProfesorById(Integer id) {
        return profesorRepository.findById(id)
                .map(this::convertToDto);
    }

    public ProfesorDTO createProfesor(ProfesorDTO profesorDTO) {
        Profesor profesor = convertToEntity(profesorDTO);
        Profesor savedProfesor = profesorRepository.save(profesor);
        return convertToDto(savedProfesor);
    }

    public Optional<ProfesorDTO> updateProfesor(Integer id, ProfesorDTO profesorDTO) {
        return profesorRepository.findById(id).map(existingProfesor -> {
            existingProfesor.setDni(profesorDTO.getDni());
            existingProfesor.setNombre(profesorDTO.getNombre());
            existingProfesor.setApellido(profesorDTO.getApellido());
            existingProfesor.setEstado(profesorDTO.getEstado());
            existingProfesor.setContrasena(profesorDTO.getContrasena());
            Profesor updatedProfesor = profesorRepository.save(existingProfesor);
            return convertToDto(updatedProfesor);
        });
    }

    public boolean deleteProfesor(Integer id) {
        if (profesorRepository.existsById(id)) {
            profesorRepository.deleteById(id);
            return true;
        }
        return false;
    }
}