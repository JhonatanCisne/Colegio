package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Administrador")
public class Administrador {

    @Id
    @Column(name = "Usuario", nullable = false, length = 50)
    private String usuario;

    @Column(name = "Contraseña", nullable = false, length = 255)
    private String contrasena;

    // Constructor vacío requerido por JPA
    public Administrador() {
    }

    // Getters y setters
    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}
