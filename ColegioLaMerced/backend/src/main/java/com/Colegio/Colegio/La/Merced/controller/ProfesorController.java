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

import com.Colegio.Colegio.La.Merced.dto.ProfesorDTO;
import com.Colegio.Colegio.La.Merced.service.ProfesorService;

@RestController
@RequestMapping("/api/profesores")
public class ProfesorController {

    @Autowired
    private ProfesorService profesorService;
    
    @GetMapping
    public ResponseEntity<List<ProfesorDTO>> getAllProfesores() {
        List<ProfesorDTO> profesores = profesorService.getAllProfesores();
        return new ResponseEntity<>(profesores, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfesorDTO> getProfesorById(@PathVariable Integer id) {
        return profesorService.getProfesorById(id)
                .map(profesorDTO -> new ResponseEntity<>(profesorDTO, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<ProfesorDTO> createProfesor(@RequestBody ProfesorDTO profesorDTO) {
        ProfesorDTO createdProfesor = profesorService.createProfesor(profesorDTO);
        return new ResponseEntity<>(createdProfesor, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfesorDTO> updateProfesor(@PathVariable Integer id, @RequestBody ProfesorDTO profesorDTO) {
        return profesorService.updateProfesor(id, profesorDTO)
                .map(updatedProfesor -> new ResponseEntity<>(updatedProfesor, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesor(@PathVariable Integer id) {
        if (profesorService.deleteProfesor(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}