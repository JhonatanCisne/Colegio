package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
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

    private ProfesorDTO mapToDTO(Profesor profesor) {
        return new ProfesorDTO(
            profesor.getDni(),
            profesor.getNombre(),
            profesor.getApellido(),
            profesor.getEspecialidad(),
            profesor.getContrasena()
        );
    }

    private Profesor mapToEntity(ProfesorDTO dto) {
        Profesor profesor = new Profesor();
        profesor.setDni(dto.getDni());
        profesor.setNombre(dto.getNombre());
        profesor.setApellido(dto.getApellido());
        profesor.setEspecialidad(dto.getEspecialidad());
        profesor.setContrasena(dto.getContrasena());
        return profesor;
    }

    public List<ProfesorDTO> listarProfesores() {
        return profesorRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProfesorDTO buscarPorDni(String dni) {
        Profesor profesor = profesorRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));
        return mapToDTO(profesor);
    }

    public ProfesorDTO crearProfesor(ProfesorDTO dto) {
        if (profesorRepository.existsByDni(dto.getDni())) {
            throw new RuntimeException("El DNI ya está registrado");
        }
        Profesor profesor = mapToEntity(dto);
        Profesor guardado = profesorRepository.save(profesor);
        return mapToDTO(guardado);
    }

    public ProfesorDTO actualizarProfesor(String dni, ProfesorDTO dto) {
        Profesor existente = profesorRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));
        existente.setNombre(dto.getNombre());
        existente.setApellido(dto.getApellido());
        existente.setEspecialidad(dto.getEspecialidad());
        existente.setContrasena(dto.getContrasena());
        Profesor actualizado = profesorRepository.save(existente);
        return mapToDTO(actualizado);
    }

    public boolean eliminarProfesorPorDni(String dni) {
        return profesorRepository.findByDni(dni)
            .map(p -> {
                profesorRepository.delete(p);
                return true;
            })
            .orElse(false);
    }
}
