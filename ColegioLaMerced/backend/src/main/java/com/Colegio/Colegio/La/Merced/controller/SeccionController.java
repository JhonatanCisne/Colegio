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

import com.Colegio.Colegio.La.Merced.dto.SeccionDTO;
import com.Colegio.Colegio.La.Merced.service.SeccionService;

@RestController
@RequestMapping("/api/secciones")
@CrossOrigin(origins = "http://localhost:3000")
public class SeccionController {

    @Autowired
    private SeccionService seccionService;

    @GetMapping
    public List<SeccionDTO> listarSecciones() {
        return seccionService.listarSecciones();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeccionDTO> obtenerSeccion(@PathVariable Integer id) {
        try {
            SeccionDTO seccion = seccionService.obtenerPorId(id);
            return ResponseEntity.ok(seccion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> crearSeccion(@RequestBody SeccionDTO dto) {
        try {
            SeccionDTO nuevaSeccion = seccionService.crearSeccion(dto);
            return ResponseEntity.ok(nuevaSeccion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarSeccion(@PathVariable Integer id, @RequestBody SeccionDTO dto) {
        try {
            SeccionDTO seccionActualizada = seccionService.actualizarSeccion(id, dto);
            return ResponseEntity.ok(seccionActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarSeccion(@PathVariable Integer id) {
        boolean eliminado = seccionService.eliminarPorId(id);
        if (eliminado) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}


