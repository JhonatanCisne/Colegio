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

import com.Colegio.Colegio.La.Merced.dto.ExamenDTO;
import com.Colegio.Colegio.La.Merced.service.ExamenService;

@RestController
@RequestMapping("/api/examenes")
@CrossOrigin(origins = "http://localhost:3000")
public class ExamenController {

    @Autowired
    private ExamenService examenService;

    @GetMapping
    public List<ExamenDTO> listarExamenes() {
        return examenService.listarExamenes();
    }

    @GetMapping("/alumno/{idAlumno}/curso/{idSeccionCurso}")
    public List<ExamenDTO> listarExamenesPorAlumnoYCurso(@PathVariable Integer idAlumno, @PathVariable Integer idSeccionCurso) {
        return examenService.listarExamenesPorAlumnoYCurso(idAlumno, idSeccionCurso);
    }

    @PostMapping
    public ResponseEntity<?> crearExamen(@RequestBody ExamenDTO dto) {
        try {
            return ResponseEntity.ok(examenService.crearExamen(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{idExamen}")
    public ResponseEntity<?> actualizarExamen(@PathVariable Integer idExamen, @RequestBody ExamenDTO dto) {
        try {
            return ResponseEntity.ok(examenService.actualizarExamen(idExamen, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{idExamen}")
    public ResponseEntity<?> eliminarExamen(@PathVariable Integer idExamen) {
        boolean eliminado = examenService.eliminarExamen(idExamen);
        if (eliminado) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
