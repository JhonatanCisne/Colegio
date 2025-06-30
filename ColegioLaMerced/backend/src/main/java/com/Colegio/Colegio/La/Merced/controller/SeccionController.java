package com.Colegio.Colegio.La.Merced.controller;

import java.util.List;

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

import com.Colegio.Colegio.La.Merced.dto.SeccionDTO;
import com.Colegio.Colegio.La.Merced.service.SeccionService;

@RestController
@RequestMapping("/api/secciones")
public class SeccionController {

    @Autowired
    private SeccionService seccionService;

    @GetMapping
    public ResponseEntity<List<SeccionDTO>> getAllSecciones() {
        List<SeccionDTO> secciones = seccionService.getAllSecciones();
        return new ResponseEntity<>(secciones, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeccionDTO> getSeccionById(@PathVariable Integer id) {
        return seccionService.getSeccionById(id)
                .map(seccionDTO -> new ResponseEntity<>(seccionDTO, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<SeccionDTO> createSeccion(@RequestBody SeccionDTO seccionDTO) {
        SeccionDTO createdSeccion = seccionService.createSeccion(seccionDTO);
        return new ResponseEntity<>(createdSeccion, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeccionDTO> updateSeccion(@PathVariable Integer id, @RequestBody SeccionDTO seccionDTO) {
        return seccionService.updateSeccion(id, seccionDTO)
                .map(updatedSeccion -> new ResponseEntity<>(updatedSeccion, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeccion(@PathVariable Integer id) {
        if (seccionService.deleteSeccion(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}