package com.Colegio.Colegio.La.Merced.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Colegio.Colegio.La.Merced.dto.AdministradorDTO;
import com.Colegio.Colegio.La.Merced.service.AdministradorService;

@RestController
@RequestMapping("/api/auth/administrador")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AdministradorDTO loginRequest) {
        Optional<AdministradorDTO> administrador = administradorService.validarCredenciales(
                loginRequest.getUsuario(),
                loginRequest.getContrasena()
        );

        if (administrador.isPresent()) {
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
            String formattedTime = now.format(formatter);
            return ResponseEntity.ok("Inicio de sesión exitoso para " + administrador.get().getUsuario() + " a las " + formattedTime + " (Hora de Lima)");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas.");
        }
    }
}