package com.Colegio.Colegio.La.Merced.controller;

import java.util.ArrayList; // Importar ArrayList
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Colegio.Colegio.La.Merced.dto.CursoUnicoDTO;
import com.Colegio.Colegio.La.Merced.service.CursoUnicoService;

@RestController
@RequestMapping("/api/cursosunicos")
public class CursoUnicoController {

    @Autowired
    private CursoUnicoService cursoUnicoService;

    @GetMapping
    public ResponseEntity<List<CursoUnicoDTO>> getAllCursosUnicos() {
        List<CursoUnicoDTO> cursosUnicos = cursoUnicoService.getAllCursosUnicos();
        return new ResponseEntity<>(cursosUnicos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoUnicoDTO> getCursoUnicoById(@PathVariable Integer id) {
        return cursoUnicoService.getCursoUnicoById(id)
                .map(cursoUnicoDTO -> new ResponseEntity<>(cursoUnicoDTO, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // *** MODIFICACIÓN AQUÍ: Para aceptar una LISTA de CursoUnicoDTOs ***
    @PostMapping
    public ResponseEntity<List<CursoUnicoDTO>> createCursosUnicos(@RequestBody List<CursoUnicoDTO> cursosUnicosDTOList) {
        List<CursoUnicoDTO> createdCursos = new ArrayList<>();
        for (CursoUnicoDTO dto : cursosUnicosDTOList) {
            CursoUnicoDTO created = cursoUnicoService.createCursoUnico(dto); // Llama al servicio para cada DTO
            createdCursos.add(created);
        }
        return new ResponseEntity<>(createdCursos, HttpStatus.CREATED);
    }
    // *******************************************************************

    @PutMapping("/{id}")
    public ResponseEntity<CursoUnicoDTO> updateCursoUnico(@PathVariable Integer id, @RequestBody CursoUnicoDTO cursoUnicoDTO) {
        return cursoUnicoService.updateCursoUnico(id, cursoUnicoDTO)
                .map(updatedCursoUnico -> new ResponseEntity<>(updatedCursoUnico, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCursoUnico(@PathVariable Integer id) {
        if (cursoUnicoService.deleteCursoUnico(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

        @DeleteMapping("/eliminarPorAlumno/{idAlumno}")
    public ResponseEntity<Void> deleteCursosUnicosByAlumnoId(@PathVariable Integer idAlumno) {
        try {
            cursoUnicoService.deleteCursosUnicosByAlumnoId(idAlumno);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } catch (Exception e) {
            System.err.println("Error al eliminar cursos únicos para el alumno " + idAlumno + ": " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
