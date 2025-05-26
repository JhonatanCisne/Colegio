package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Colegio.Colegio.La.Merced.dto.SeccionCursoDTO;
import com.Colegio.Colegio.La.Merced.model.SeccionCurso;
import com.Colegio.Colegio.La.Merced.repository.SeccionCursoRepository;

@Service
public class SeccionCursoService {

    @Autowired
    private SeccionCursoRepository seccionCursoRepository;

    private SeccionCursoDTO mapToDTO(SeccionCurso entity) {
        return new SeccionCursoDTO(
            entity.getIdSeccionCurso(),
            entity.getIdSeccion(),
            entity.getIdCurso(),
            entity.getIdProfesor()
        );
    }

    private SeccionCurso mapToEntity(SeccionCursoDTO dto) {
        SeccionCurso entity = new SeccionCurso();
        entity.setIdSeccionCurso(dto.getIdSeccionCurso());
        entity.setIdSeccion(dto.getIdSeccion());
        entity.setIdCurso(dto.getIdCurso());
        entity.setIdProfesor(dto.getIdProfesor());
        return entity;
    }

    public List<SeccionCursoDTO> listarTodos() {
        return seccionCursoRepository.findAll()
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public SeccionCursoDTO obtenerPorId(Integer id) {
        return seccionCursoRepository.findById(id)
            .map(this::mapToDTO)
            .orElseThrow(() -> new RuntimeException("SeccionCurso no encontrada"));
    }

    public SeccionCursoDTO crearSeccionCurso(SeccionCursoDTO dto) {
        SeccionCurso entidad = mapToEntity(dto);
        SeccionCurso guardado = seccionCursoRepository.save(entidad);
        return mapToDTO(guardado);
    }

    public SeccionCursoDTO actualizarSeccionCurso(Integer id, SeccionCursoDTO dto) {
        SeccionCurso existente = seccionCursoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("SeccionCurso no encontrada"));

        existente.setIdSeccion(dto.getIdSeccion());
        existente.setIdCurso(dto.getIdCurso());
        existente.setIdProfesor(dto.getIdProfesor());

        SeccionCurso actualizado = seccionCursoRepository.save(existente);
        return mapToDTO(actualizado);
    }

    public boolean eliminarPorId(Integer id) {
        if(seccionCursoRepository.existsById(id)) {
            seccionCursoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
