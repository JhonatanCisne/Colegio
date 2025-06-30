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

import com.Colegio.Colegio.La.Merced.dto.AdministradorDTO;
import com.Colegio.Colegio.La.Merced.service.AdministradorService;

@RestController
@RequestMapping("/api/administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @GetMapping
    public ResponseEntity<List<AdministradorDTO>> getAllAdministradores() {
        List<AdministradorDTO> administradores = administradorService.getAllAdministradores();
        return new ResponseEntity<>(administradores, HttpStatus.OK);
    }

    @GetMapping("/{usuario}")
    public ResponseEntity<AdministradorDTO> getAdministradorById(@PathVariable String usuario) {
        return administradorService.getAdministradorById(usuario)
                .map(administradorDTO -> new ResponseEntity<>(administradorDTO, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<AdministradorDTO> createAdministrador(@RequestBody AdministradorDTO administradorDTO) {
        AdministradorDTO createdAdministrador = administradorService.createAdministrador(administradorDTO);
        return new ResponseEntity<>(createdAdministrador, HttpStatus.CREATED);
    }

    @PutMapping("/{usuario}")
    public ResponseEntity<AdministradorDTO> updateAdministrador(@PathVariable String usuario, @RequestBody AdministradorDTO administradorDTO) {
        return administradorService.updateAdministrador(usuario, administradorDTO)
                .map(updatedAdministrador -> new ResponseEntity<>(updatedAdministrador, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{usuario}")
    public ResponseEntity<Void> deleteAdministrador(@PathVariable String usuario) {
        if (administradorService.deleteAdministrador(usuario)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}