package com.Colegio.Colegio.La.Merced.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "http://localhost:3000")
public class ProfesorController {

    @Autowired
    private ProfesorService profesorService;

    @GetMapping
    public List<ProfesorDTO> listarProfesores() {
        return profesorService.listarProfesores();
    }

    @GetMapping("/{dni}")
    public ResponseEntity<ProfesorDTO> buscarProfesor(@PathVariable String dni) {
        try {
            return ResponseEntity.ok(profesorService.buscarPorDni(dni));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> crearProfesor(@RequestBody ProfesorDTO dto) {
        try {
            return ResponseEntity.ok(profesorService.crearProfesor(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{dni}")
    public ResponseEntity<?> actualizarProfesor(@PathVariable String dni, @RequestBody ProfesorDTO dto) {
        try {
            return ResponseEntity.ok(profesorService.actualizarProfesor(dni, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{dni}")
    public ResponseEntity<?> eliminarProfesor(@PathVariable String dni) {
        boolean eliminado = profesorService.eliminarProfesorPorDni(dni);
        if (eliminado) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginProfesor(@RequestBody ProfesorDTO dto) {
        try {
            ProfesorDTO profesorLogueado = profesorService.loginProfesor(dto.getDni(), dto.getContrasena());
            return ResponseEntity.ok(profesorLogueado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());  
        }
    }

}
