package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Colegio.Colegio.La.Merced.dto.SeccionCursoDTO;
import com.Colegio.Colegio.La.Merced.model.SeccionCurso;
import com.Colegio.Colegio.La.Merced.repository.CursoRepository;
import com.Colegio.Colegio.La.Merced.repository.HorarioRepository;
import com.Colegio.Colegio.La.Merced.repository.ProfesorRepository;
import com.Colegio.Colegio.La.Merced.repository.SeccionCursoRepository;
import com.Colegio.Colegio.La.Merced.repository.SeccionRepository;

@Service
public class SeccionCursoService {

    @Autowired
    private SeccionCursoRepository seccionCursoRepository;

    @Autowired
    private SeccionRepository seccionRepository;
    @Autowired
    private ProfesorRepository profesorRepository;
    @Autowired
    private CursoRepository cursoRepository;
    @Autowired
    private HorarioRepository horarioRepository;

    private SeccionCursoDTO convertToDto(SeccionCurso seccionCurso) {
        SeccionCursoDTO dto = new SeccionCursoDTO();
        dto.setIdSeccionCurso(seccionCurso.getIdSeccionCurso());

        if (seccionCurso.getSeccion() != null) {
            dto.setIdSeccion(seccionCurso.getSeccion().getIdSeccion());
        }
        if (seccionCurso.getProfesor() != null) {
            dto.setIdProfesor(seccionCurso.getProfesor().getIdProfesor());
        }
        if (seccionCurso.getCurso() != null) {
            dto.setIdCurso(seccionCurso.getCurso().getIdCurso());
        }
        if (seccionCurso.getHorario() != null) {
            dto.setIdHorario(seccionCurso.getHorario().getIdHorario());
        }
        return dto;
    }

    private SeccionCurso convertToEntity(SeccionCursoDTO dto) {
        SeccionCurso seccionCurso = new SeccionCurso();

        if (dto.getIdSeccion() != null) {
            seccionRepository.findById(dto.getIdSeccion())
                .ifPresent(seccionCurso::setSeccion);
        }
        if (dto.getIdProfesor() != null) {
            profesorRepository.findById(dto.getIdProfesor())
                .ifPresent(seccionCurso::setProfesor);
        }
        if (dto.getIdCurso() != null) {
            cursoRepository.findById(dto.getIdCurso())
                .ifPresent(seccionCurso::setCurso);
        }
        if (dto.getIdHorario() != null) {
            horarioRepository.findById(dto.getIdHorario())
                .ifPresent(seccionCurso::setHorario);
        }
        return seccionCurso;
    }

    public List<SeccionCursoDTO> getAllSeccionCursos() {
        return seccionCursoRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<SeccionCursoDTO> getSeccionCursoById(Integer id) {
        return seccionCursoRepository.findById(id)
                .map(this::convertToDto);
    }

    // Nuevo método de servicio para obtener SeccionCursos por ID de Sección
    public List<SeccionCursoDTO> getSeccionCursosBySeccionId(Integer idSeccion) {
        // Usa el método del repositorio que crearemos en el siguiente paso
        return seccionCursoRepository.findBySeccion_IdSeccion(idSeccion)
                                     .stream()
                                     .map(this::convertToDto)
                                     .collect(Collectors.toList());
    }

    public SeccionCursoDTO createSeccionCurso(SeccionCursoDTO seccionCursoDTO) {
        SeccionCurso seccionCurso = convertToEntity(seccionCursoDTO);
        SeccionCurso savedSeccionCurso = seccionCursoRepository.save(seccionCurso);
        return convertToDto(savedSeccionCurso);
    }

    public Optional<SeccionCursoDTO> updateSeccionCurso(Integer id, SeccionCursoDTO seccionCursoDTO) {
        return seccionCursoRepository.findById(id).map(existingSeccionCurso -> {
            if (seccionCursoDTO.getIdSeccion() != null) {
                seccionRepository.findById(seccionCursoDTO.getIdSeccion())
                    .ifPresent(existingSeccionCurso::setSeccion);
            } else {
                existingSeccionCurso.setSeccion(null);
            }

            if (seccionCursoDTO.getIdProfesor() != null) {
                profesorRepository.findById(seccionCursoDTO.getIdProfesor())
                    .ifPresent(existingSeccionCurso::setProfesor);
            } else {
                existingSeccionCurso.setProfesor(null);
            }

            if (seccionCursoDTO.getIdCurso() != null) {
                cursoRepository.findById(seccionCursoDTO.getIdCurso())
                    .ifPresent(existingSeccionCurso::setCurso);
            } else {
                existingSeccionCurso.setCurso(null);
            }

            if (seccionCursoDTO.getIdHorario() != null) {
                horarioRepository.findById(seccionCursoDTO.getIdHorario())
                    .ifPresent(existingSeccionCurso::setHorario);
            } else {
                existingSeccionCurso.setHorario(null);
            }

            SeccionCurso updatedSeccionCurso = seccionCursoRepository.save(existingSeccionCurso);
            return convertToDto(updatedSeccionCurso);
        });
    }

    public boolean deleteSeccionCurso(Integer id) {
        if (seccionCursoRepository.existsById(id)) {
            seccionCursoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}