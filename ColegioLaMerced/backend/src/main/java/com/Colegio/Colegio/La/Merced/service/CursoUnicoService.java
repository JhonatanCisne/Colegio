package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Colegio.Colegio.La.Merced.dto.CursoUnicoDTO;
import com.Colegio.Colegio.La.Merced.model.CursoUnico;
import com.Colegio.Colegio.La.Merced.repository.AlumnoRepository;
import com.Colegio.Colegio.La.Merced.repository.CursoUnicoRepository;
import com.Colegio.Colegio.La.Merced.repository.SeccionCursoRepository;

@Service
public class CursoUnicoService {

    @Autowired
    private CursoUnicoRepository cursoUnicoRepository;

    @Autowired
    private SeccionCursoRepository seccionCursoRepository;
    @Autowired
    private AlumnoRepository alumnoRepository;

    private CursoUnicoDTO convertToDto(CursoUnico cursoUnico) {
        CursoUnicoDTO dto = new CursoUnicoDTO();
        dto.setIdCursoUnico(cursoUnico.getIdCursoUnico());
        dto.setExamen1(cursoUnico.getExamen1());
        dto.setExamen2(cursoUnico.getExamen2());
        dto.setExamen3(cursoUnico.getExamen3());
        dto.setExamen4(cursoUnico.getExamen4());
        dto.setExamenFinal(cursoUnico.getExamenFinal());

        if (cursoUnico.getSeccionCurso() != null) {
            dto.setIdSeccionCurso(cursoUnico.getSeccionCurso().getIdSeccionCurso());
        }
        if (cursoUnico.getAlumno() != null) {
            dto.setIdAlumno(cursoUnico.getAlumno().getIdAlumno());
        }
        return dto;
    }

    private CursoUnico convertToEntity(CursoUnicoDTO dto) {
        CursoUnico cursoUnico = new CursoUnico();

        cursoUnico.setExamen1(dto.getExamen1());
        cursoUnico.setExamen2(dto.getExamen2());
        cursoUnico.setExamen3(dto.getExamen3());
        cursoUnico.setExamen4(dto.getExamen4());
        cursoUnico.setExamenFinal(dto.getExamenFinal());

        if (dto.getIdSeccionCurso() != null) {
            seccionCursoRepository.findById(dto.getIdSeccionCurso())
                .ifPresent(cursoUnico::setSeccionCurso);
        }
        if (dto.getIdAlumno() != null) {
            alumnoRepository.findById(dto.getIdAlumno())
                .ifPresent(cursoUnico::setAlumno);
        }
        return cursoUnico;
    }

    public List<CursoUnicoDTO> getAllCursosUnicos() {
        return cursoUnicoRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CursoUnicoDTO> getCursoUnicoById(Integer id) {
        return cursoUnicoRepository.findById(id)
                .map(this::convertToDto);
    }

    public CursoUnicoDTO createCursoUnico(CursoUnicoDTO cursoUnicoDTO) {
        CursoUnico cursoUnico = convertToEntity(cursoUnicoDTO);
        CursoUnico savedCursoUnico = cursoUnicoRepository.save(cursoUnico);
        return convertToDto(savedCursoUnico);
    }

    public Optional<CursoUnicoDTO> updateCursoUnico(Integer id, CursoUnicoDTO cursoUnicoDTO) {
        return cursoUnicoRepository.findById(id).map(existingCursoUnico -> {
            existingCursoUnico.setExamen1(cursoUnicoDTO.getExamen1());
            existingCursoUnico.setExamen2(cursoUnicoDTO.getExamen2());
            existingCursoUnico.setExamen3(cursoUnicoDTO.getExamen3());
            existingCursoUnico.setExamen4(cursoUnicoDTO.getExamen4());
            existingCursoUnico.setExamenFinal(cursoUnicoDTO.getExamenFinal());

            if (cursoUnicoDTO.getIdSeccionCurso() != null) {
                seccionCursoRepository.findById(cursoUnicoDTO.getIdSeccionCurso())
                    .ifPresent(existingCursoUnico::setSeccionCurso);
            } else {
                existingCursoUnico.setSeccionCurso(null);
            }

            if (cursoUnicoDTO.getIdAlumno() != null) {
                alumnoRepository.findById(cursoUnicoDTO.getIdAlumno())
                    .ifPresent(existingCursoUnico::setAlumno);
            } else {
                existingCursoUnico.setAlumno(null);
            }

            CursoUnico updatedCursoUnico = cursoUnicoRepository.save(existingCursoUnico);
            return convertToDto(updatedCursoUnico);
        });
    }

    public boolean deleteCursoUnico(Integer id) {
        if (cursoUnicoRepository.existsById(id)) {
            cursoUnicoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}