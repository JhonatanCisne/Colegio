package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Colegio.Colegio.La.Merced.dto.ExamenDTO;
import com.Colegio.Colegio.La.Merced.model.Examen;
import com.Colegio.Colegio.La.Merced.repository.ExamenRepository;

@Service
public class ExamenService {

    @Autowired
    private ExamenRepository examenRepository;

    private ExamenDTO mapToDTO(Examen examen) {
        return new ExamenDTO(
            examen.getIdExamen(),
            examen.getIdAlumno(),
            examen.getIdSeccionCurso(),
            examen.getNumExamen(),
            examen.getNota().doubleValue()
        );
    }

    private Examen mapToEntity(ExamenDTO dto) {
        Examen examen = new Examen();
        examen.setIdExamen(dto.getIdExamen());
        examen.setIdAlumno(dto.getIdAlumno());
        examen.setIdSeccionCurso(dto.getIdSeccionCurso());
        examen.setNumExamen(dto.getNumExamen());
        examen.setNota(dto.getNota());
        return examen;
    }

    public List<ExamenDTO> listarExamenes() {
        return examenRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ExamenDTO> listarExamenesPorAlumnoYCurso(Integer idAlumno, Integer idSeccionCurso) {
        return examenRepository.findByIdAlumnoAndIdSeccionCurso(idAlumno, idSeccionCurso)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ExamenDTO crearExamen(ExamenDTO dto) {
        Examen examen = mapToEntity(dto);
        Examen guardado = examenRepository.save(examen);
        return mapToDTO(guardado);
    }

    public ExamenDTO actualizarExamen(Integer idExamen, ExamenDTO dto) {
        Examen existente = examenRepository.findById(idExamen)
                .orElseThrow(() -> new RuntimeException("Examen no encontrado"));
        existente.setIdAlumno(dto.getIdAlumno());
        existente.setIdSeccionCurso(dto.getIdSeccionCurso());
        existente.setNumExamen(dto.getNumExamen());
        existente.setNota(dto.getNota());
        Examen actualizado = examenRepository.save(existente);
        return mapToDTO(actualizado);
    }

    public boolean eliminarExamen(Integer idExamen) {
        return examenRepository.findById(idExamen)
                .map(e -> {
                    examenRepository.delete(e);
                    return true;
                })
                .orElse(false);
    }
}
