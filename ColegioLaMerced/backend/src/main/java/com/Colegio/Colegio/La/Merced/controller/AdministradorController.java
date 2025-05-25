package com.Colegio.Colegio.La.Merced.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Colegio.Colegio.La.Merced.service.AdministradorService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "3000") // Cambia el origen si quieres restringir el acceso
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    /**
     * Endpoint para validar login del administrador.
     * Recibe JSON con "usuario" y "contrasena".
     */
    @PostMapping("/login")
    public boolean loginAdministrador(@RequestBody Map<String, String> loginData) {
        String usuario = loginData.get("usuario");
        String contrasena = loginData.get("contrasena");
        return administradorService.validarCredenciales(usuario, contrasena);
    }
}
