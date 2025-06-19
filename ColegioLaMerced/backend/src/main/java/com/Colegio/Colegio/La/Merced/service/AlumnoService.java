package com.Colegio.Colegio.La.Merced.service;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Colegio.Colegio.La.Merced.dto.AlumnoDTO;
import com.Colegio.Colegio.La.Merced.model.Alumno;
import com.Colegio.Colegio.La.Merced.repository.AlumnoRepository;

@Service
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired


    public List<AlumnoDTO> listarAlumnos() {
        return alumnoRepository.findAll().stream()
                .map(this::convertirEntidadADTO)
                .collect(Collectors.toList());
    }

    public AlumnoDTO buscarPorDni(String dni) {
        Alumno alumno = alumnoRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
        return convertirEntidadADTO(alumno);
    }

    @Transactional
    public AlumnoDTO crearAlumno(AlumnoDTO dto) {
        if (alumnoRepository.existsByDni(dto.getDni())) {
            throw new RuntimeException("El DNI ya está registrado");
        }

        Alumno alumno = new Alumno();
        alumno.setNombre(dto.getNombre());
        alumno.setApellido(dto.getApellido());
        alumno.setDni(dto.getDni());
        alumno.setContrasena(null); 

        Alumno guardado = alumnoRepository.save(alumno);
        return convertirEntidadADTO(guardado);
    }

    @Transactional
    public AlumnoDTO actualizarAlumno(String dni, AlumnoDTO dto) {
        Alumno alumno = alumnoRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
        alumno.setNombre(dto.getNombre());
        alumno.setApellido(dto.getApellido());
        Alumno actualizado = alumnoRepository.save(alumno);
        return convertirEntidadADTO(actualizado);
    }

    @Transactional
    public void eliminarAlumno(String dni) {
        Alumno alumno = alumnoRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
        alumnoRepository.delete(alumno);
    }

    private AlumnoDTO convertirEntidadADTO(Alumno alumno) {
        AlumnoDTO dto = new AlumnoDTO();
        dto.setNombre(alumno.getNombre());
        dto.setApellido(alumno.getApellido());
        dto.setDni(alumno.getDni());

        return dto;
    }
}
