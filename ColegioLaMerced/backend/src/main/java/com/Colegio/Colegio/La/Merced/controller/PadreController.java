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

import com.Colegio.Colegio.La.Merced.dto.PadreDTO;
import com.Colegio.Colegio.La.Merced.service.PadreService;

@RestController
@RequestMapping("/api/padres")
public class PadreController {

    @Autowired
    private PadreService padreService;

    @GetMapping
    public ResponseEntity<List<PadreDTO>> getAllPadres() {
        List<PadreDTO> padres = padreService.getAllPadres();
        return new ResponseEntity<>(padres, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PadreDTO> getPadreById(@PathVariable Integer id) {
        return padreService.getPadreById(id)
                .map(padreDTO -> new ResponseEntity<>(padreDTO, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<PadreDTO> createPadre(@RequestBody PadreDTO padreDTO) {
        PadreDTO createdPadre = padreService.createPadre(padreDTO);
        return new ResponseEntity<>(createdPadre, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PadreDTO> updatePadre(@PathVariable Integer id, @RequestBody PadreDTO padreDTO) {
        return padreService.updatePadre(id, padreDTO)
                .map(updatedPadre -> new ResponseEntity<>(updatedPadre, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePadre(@PathVariable Integer id) {
        if (padreService.deletePadre(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}