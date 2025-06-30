package com.Colegio.Colegio.La.Merced.controller;

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

import com.Colegio.Colegio.La.Merced.dto.SeccionCursoDTO;
import com.Colegio.Colegio.La.Merced.service.SeccionCursoService;

@RestController
@RequestMapping("/api/seccioncursos")
public class SeccionCursoController {

    @Autowired
    private SeccionCursoService seccionCursoService;

    @GetMapping
    public ResponseEntity<List<SeccionCursoDTO>> getAllSeccionCursos() {
        List<SeccionCursoDTO> seccionCursos = seccionCursoService.getAllSeccionCursos();
        return new ResponseEntity<>(seccionCursos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeccionCursoDTO> getSeccionCursoById(@PathVariable Integer id) {
        return seccionCursoService.getSeccionCursoById(id)
                .map(seccionCursoDTO -> new ResponseEntity<>(seccionCursoDTO, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Nuevo endpoint para obtener SeccionCursos por ID de Sección
    @GetMapping("/porSeccion/{idSeccion}")
    public ResponseEntity<List<SeccionCursoDTO>> getSeccionCursosBySeccionId(@PathVariable Integer idSeccion) {
        List<SeccionCursoDTO> seccionCursos = seccionCursoService.getSeccionCursosBySeccionId(idSeccion);
        if (seccionCursos.isEmpty()) {
            // Si no se encuentran cursos para la sección, devuelve 204 No Content
            return ResponseEntity.noContent().build();
        }
        return new ResponseEntity<>(seccionCursos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<SeccionCursoDTO> createSeccionCurso(@RequestBody SeccionCursoDTO seccionCursoDTO) {
        SeccionCursoDTO createdSeccionCurso = seccionCursoService.createSeccionCurso(seccionCursoDTO);
        return new ResponseEntity<>(createdSeccionCurso, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeccionCursoDTO> updateSeccionCurso(@PathVariable Integer id, @RequestBody SeccionCursoDTO seccionCursoDTO) {
        return seccionCursoService.updateSeccionCurso(id, seccionCursoDTO)
                .map(updatedSeccionCurso -> new ResponseEntity<>(updatedSeccionCurso, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeccionCurso(@PathVariable Integer id) {
        if (seccionCursoService.deleteSeccionCurso(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}