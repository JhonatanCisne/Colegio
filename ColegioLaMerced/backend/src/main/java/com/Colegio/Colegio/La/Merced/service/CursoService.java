package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Colegio.Colegio.La.Merced.dto.CursoDTO;
import com.Colegio.Colegio.La.Merced.model.Curso;
import com.Colegio.Colegio.La.Merced.repository.CursoRepository;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    private CursoDTO convertToDto(Curso curso) {
        CursoDTO dto = new CursoDTO();
        dto.setIdCurso(curso.getIdCurso());
        dto.setNombre(curso.getNombre());
        return dto;
    }

    private Curso convertToEntity(CursoDTO dto) {
        Curso curso = new Curso();
        curso.setIdCurso(dto.getIdCurso());
        curso.setNombre(dto.getNombre());
        return curso;
    }

    public List<CursoDTO> getAllCursos() {
        return cursoRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CursoDTO> getCursoById(Integer id) {
        return cursoRepository.findById(id)
                .map(this::convertToDto);
    }

    public CursoDTO createCurso(CursoDTO cursoDTO) {
        Curso curso = convertToEntity(cursoDTO);
        Curso savedCurso = cursoRepository.save(curso);
        return convertToDto(savedCurso);
    }

    public Optional<CursoDTO> updateCurso(Integer id, CursoDTO cursoDTO) {
        return cursoRepository.findById(id).map(existingCurso -> {
            existingCurso.setNombre(cursoDTO.getNombre());
            Curso updatedCurso = cursoRepository.save(existingCurso);
            return convertToDto(updatedCurso);
        });
    }

    public boolean deleteCurso(Integer id) {
        if (cursoRepository.existsById(id)) {
            cursoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}