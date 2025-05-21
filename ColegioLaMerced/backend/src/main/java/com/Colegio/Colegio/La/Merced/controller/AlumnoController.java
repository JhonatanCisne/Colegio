package com.Colegio.Colegio.La.Merced.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Colegio.Colegio.La.Merced.model.Alumno;
import com.Colegio.Colegio.La.Merced.repository.AlumnoRepository;

@RestController
@RequestMapping("/api/alumnos")
@CrossOrigin(origins = "*") // Permitir peticiones desde React (ajusta si lo necesitas)
public class AlumnoController {

    @Autowired
    private AlumnoRepository alumnoRepository;

    // Login por DNI y clave
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> datos) {
        String dni = datos.get("dni");
        String clave = datos.get("clave");

        Alumno alumno = alumnoRepository.findByDniAndClave(dni, clave);

        if (alumno != null) {
            return ResponseEntity.ok(alumno); // Puedes retornar solo el ID si quieres
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("DNI o clave incorrectos");
        }
    }

    // Obtener alumno por ID (opcional, útil para futuras consultas)
    @GetMapping("/{id}")
    public ResponseEntity<Alumno> obtenerAlumno(@PathVariable Long id) {
        return alumnoRepository.findById(id)
                .map(alumno -> ResponseEntity.ok(alumno))
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear nuevo alumno (opcional para pruebas)
    @PostMapping("/crear")
    public Alumno crearAlumno(@RequestBody Alumno alumno) {
        return alumnoRepository.save(alumno);
    }
}

