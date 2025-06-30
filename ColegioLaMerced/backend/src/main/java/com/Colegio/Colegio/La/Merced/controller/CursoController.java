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

import com.Colegio.Colegio.La.Merced.dto.CursoDTO;
import com.Colegio.Colegio.La.Merced.service.CursoService;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @GetMapping
    public ResponseEntity<List<CursoDTO>> getAllCursos() {
        List<CursoDTO> cursos = cursoService.getAllCursos();
        return new ResponseEntity<>(cursos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoDTO> getCursoById(@PathVariable Integer id) {
        return cursoService.getCursoById(id)
                .map(cursoDTO -> new ResponseEntity<>(cursoDTO, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<CursoDTO> createCurso(@RequestBody CursoDTO cursoDTO) {
        CursoDTO createdCurso = cursoService.createCurso(cursoDTO);
        return new ResponseEntity<>(createdCurso, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CursoDTO> updateCurso(@PathVariable Integer id, @RequestBody CursoDTO cursoDTO) {
        return cursoService.updateCurso(id, cursoDTO)
                .map(updatedCurso -> new ResponseEntity<>(updatedCurso, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCurso(@PathVariable Integer id) {
        if (cursoService.deleteCurso(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}