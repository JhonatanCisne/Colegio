package com.Colegio.Colegio.La.Merced.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired; // Necesario para los Optional de los métodos get/update
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
        return new ResponseEntity<>(alumnos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlumnoDTO> getAlumnoById(@PathVariable Integer id) {
        return alumnoService.getAlumnoById(id)
                .map(alumnoDTO -> new ResponseEntity<>(alumnoDTO, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<AlumnoDTO> createAlumno(@RequestBody AlumnoDTO alumnoDTO) {
        AlumnoDTO createdAlumno = alumnoService.createAlumno(alumnoDTO);
        return new ResponseEntity<>(createdAlumno, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlumnoDTO> updateAlumno(@PathVariable Integer id, @RequestBody AlumnoDTO alumnoDTO) {
        return alumnoService.updateAlumno(id, alumnoDTO)
                .map(updatedAlumno -> new ResponseEntity<>(updatedAlumno, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlumno(@PathVariable Integer id) {
        if (alumnoService.deleteAlumno(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/dni/{dni}")
    public ResponseEntity<String> eliminarAlumnoPorDni(@PathVariable String dni) {
        try {
            alumnoService.eliminarAlumnoPorDni(dni);
            return new ResponseEntity<>("Alumno con DNI " + dni + " y sus cursos asociados eliminados exitosamente.", HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error interno del servidor al eliminar el alumno: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}