package com.Colegio.Colegio.La.Merced.dto;

public class AdministradorDTO {
    private String usuario;
    private String contrasena;

    public AdministradorDTO() {
    }

    public AdministradorDTO(String usuario, String contrasena) {
        this.usuario = usuario;
        this.contrasena = contrasena;
    }

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