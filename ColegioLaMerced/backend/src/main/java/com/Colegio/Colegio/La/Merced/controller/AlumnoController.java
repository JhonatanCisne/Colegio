package com.Colegio.Colegio.La.Merced.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Colegio.Colegio.La.Merced.model.Alumno;
import com.Colegio.Colegio.La.Merced.repository.AlumnoRepository;

@RestController
@RequestMapping("/api/alumno")
@CrossOrigin(origins = "http://localhost:*")  // Permitir CORS desde React (ajusta el puerto si usas otro)
public class AlumnoController {

    @Autowired
    private AlumnoRepository alumnoRepository;

    // DTO para recibir login
    public static class LoginRequest {
        private String dni;
        private String contrasena;

        public String getDni() {
            return dni;
        }

        public void setDni(String dni) {
            this.dni = dni;
        }

        public String getContrasena() {
            return contrasena;
        }

        public void setContrasena(String contrasena) {
            this.contrasena = contrasena;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAlumno(@RequestBody LoginRequest loginRequest) {
        Optional<Alumno> alumnoOpt = alumnoRepository.findByDniAndContrasena(loginRequest.getDni(), loginRequest.getContrasena());

        if (alumnoOpt.isPresent()) {
            // Login exitoso, retorna datos del alumno (puedes filtrar o crear un DTO si quieres)
            return ResponseEntity.ok(alumnoOpt.get());
        } else {
            // Usuario o contraseña incorrectos
            return ResponseEntity.status(401).body("DNI o contraseña incorrectos");
        }
    }
}

