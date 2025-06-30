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

import com.Colegio.Colegio.La.Merced.dto.HorarioDTO;
import com.Colegio.Colegio.La.Merced.service.HorarioService;

@RestController
@RequestMapping("/api/horarios")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    @GetMapping
    public ResponseEntity<List<HorarioDTO>> getAllHorarios() {
        List<HorarioDTO> horarios = horarioService.getAllHorarios();
        return new ResponseEntity<>(horarios, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HorarioDTO> getHorarioById(@PathVariable Integer id) {
        return horarioService.getHorarioById(id)
                .map(horarioDTO -> new ResponseEntity<>(horarioDTO, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<HorarioDTO> createHorario(@RequestBody HorarioDTO horarioDTO) {
        HorarioDTO createdHorario = horarioService.createHorario(horarioDTO);
        return new ResponseEntity<>(createdHorario, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HorarioDTO> updateHorario(@PathVariable Integer id, @RequestBody HorarioDTO horarioDTO) {
        return horarioService.updateHorario(id, horarioDTO)
                .map(updatedHorario -> new ResponseEntity<>(updatedHorario, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHorario(@PathVariable Integer id) {
        if (horarioService.deleteHorario(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}