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

import com.Colegio.Colegio.La.Merced.dto.SeccionCursoDTO;
import com.Colegio.Colegio.La.Merced.service.SeccionCursoService;

@RestController
@RequestMapping("/api/seccioncurso")
@CrossOrigin(origins = "http://localhost:3000")
public class SeccionCursoController {

    @Autowired
    private SeccionCursoService seccionCursoService;

    @GetMapping
    public List<SeccionCursoDTO> listarTodos() {
        return seccionCursoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeccionCursoDTO> obtenerPorId(@PathVariable Integer id) {
        try {
            SeccionCursoDTO dto = seccionCursoService.obtenerPorId(id);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody SeccionCursoDTO dto) {
        try {
            SeccionCursoDTO creado = seccionCursoService.crearSeccionCurso(dto);
            return ResponseEntity.ok(creado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody SeccionCursoDTO dto) {
        try {
            SeccionCursoDTO actualizado = seccionCursoService.actualizarSeccionCurso(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        boolean eliminado = seccionCursoService.eliminarPorId(id);
        if (eliminado) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

