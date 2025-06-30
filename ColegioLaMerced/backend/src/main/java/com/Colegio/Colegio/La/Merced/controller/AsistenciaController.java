package com.Colegio.Colegio.La.Merced.controller;

import com.Colegio.Colegio.La.Merced.dto.AsistenciaDTO;
import com.Colegio.Colegio.La.Merced.service.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    @Autowired
    private AsistenciaService asistenciaService;

    @GetMapping
    public ResponseEntity<List<AsistenciaDTO>> getAllAsistencias() {
        List<AsistenciaDTO> asistencias = asistenciaService.getAllAsistencias();
        return new ResponseEntity<>(asistencias, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsistenciaDTO> getAsistenciaById(@PathVariable Integer id) {
        return asistenciaService.getAsistenciaById(id)
                .map(asistenciaDTO -> new ResponseEntity<>(asistenciaDTO, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<AsistenciaDTO> createAsistencia(@RequestBody AsistenciaDTO asistenciaDTO) {
        AsistenciaDTO createdAsistencia = asistenciaService.createAsistencia(asistenciaDTO);
        return new ResponseEntity<>(createdAsistencia, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsistenciaDTO> updateAsistencia(@PathVariable Integer id, @RequestBody AsistenciaDTO asistenciaDTO) {
        return asistenciaService.updateAsistencia(id, asistenciaDTO)
                .map(updatedAsistencia -> new ResponseEntity<>(updatedAsistencia, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsistencia(@PathVariable Integer id) {
        if (asistenciaService.deleteAsistencia(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}