package com.Colegio.Colegio.La.Merced.dto;

public class ProfesorDTO {
    private String dni;
    private String nombre;
    private String apellido;
    private String contrasena;

    public ProfesorDTO() {}

    public ProfesorDTO(String dni, String nombre, String apellido, String contrasena) {
        this.dni = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.contrasena = contrasena;
    }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
}
