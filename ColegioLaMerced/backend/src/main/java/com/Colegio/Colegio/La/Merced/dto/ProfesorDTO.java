package com.Colegio.Colegio.La.Merced.dto;

public class ProfesorDTO {
    private Integer idProfesor;
    private String dni;
    private String nombre;
    private String apellido;
    private String estado;
    private String contrasena;

    public ProfesorDTO() {
    }

    public ProfesorDTO(Integer idProfesor, String dni, String nombre, String apellido, String estado, String contrasena) {
        this.idProfesor = idProfesor;
        this.dni = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.estado = estado;
        this.contrasena = contrasena;
    }

    public Integer getIdProfesor() {
        return idProfesor;
    }

    public void setIdProfesor(Integer idProfesor) {
        this.idProfesor = idProfesor;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}