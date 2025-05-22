package com.Colegio.Colegio.La.Merced.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Colegio.Colegio.La.Merced.model.Alumno;
import com.Colegio.Colegio.La.Merced.repository.AlumnoRepository;

@RestController
@RequestMapping("/api/alumnos")
@CrossOrigin(origins = "*")  // Permite llamadas desde cualquier origen (ajusta según necesidad)
public class AlumnoController {

    @Autowired
    private AlumnoRepository alumnoRepository;

    // Login por DNI y contraseña
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> datos) {
        String dni = datos.get("dni");
        String contrasena = datos.get("contrasena");  // Asegúrate que tu JSON use "contrasena" aquí

        // Depuración: imprimir datos recibidos
        System.out.println("DNI recibido: " + dni);
        System.out.println("Contraseña recibida: " + contrasena);

        Alumno alumno = alumnoRepository.findByDniAndContrasena(dni, contrasena);

        if (alumno != null) {
            return ResponseEntity.ok(alumno); // Devuelve el objeto alumno en caso exitoso
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("DNI o contraseña incorrectos");
        }
    }
}

