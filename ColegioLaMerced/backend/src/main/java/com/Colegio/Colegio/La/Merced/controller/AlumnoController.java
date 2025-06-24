package com.Colegio.Colegio.La.Merced.controller;

import java.util.List;
import java.util.Optional;

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

import com.Colegio.Colegio.La.Merced.dto.AlumnoDTO;
import com.Colegio.Colegio.La.Merced.service.AlumnoService;

@RestController
@RequestMapping("/api/alumnos")
public class AlumnoController {

    @Autowired
    private AlumnoService alumnoService;

    @GetMapping
    public ResponseEntity<List<AlumnoDTO>> getAllAlumnos() {
        List<AlumnoDTO> alumnos = alumnoService.getAllAlumnos();
        return ResponseEntity.ok(alumnos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlumnoDTO> getAlumnoById(@PathVariable Integer id) {
        return alumnoService.getAlumnoById(id)
                .map(alumnoDTO -> new ResponseEntity<>(alumnoDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<AlumnoDTO> createAlumno(@RequestBody AlumnoDTO alumnoDTO) {
        try {
            AlumnoDTO createdAlumno = alumnoService.createAlumno(alumnoDTO);
            return new ResponseEntity<>(createdAlumno, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            System.err.println("Error al crear alumno: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlumnoDTO> updateAlumno(@PathVariable Integer id, @RequestBody AlumnoDTO alumnoDTO) {
        try {
            Optional<AlumnoDTO> updatedAlumno = alumnoService.updateAlumno(id, alumnoDTO);
            return updatedAlumno
                    .map(dto -> new ResponseEntity<>(dto, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (IllegalArgumentException e) {
            System.err.println("Error al actualizar alumno: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlumno(@PathVariable Integer id) {
        boolean deleted = alumnoService.deleteAlumno(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}