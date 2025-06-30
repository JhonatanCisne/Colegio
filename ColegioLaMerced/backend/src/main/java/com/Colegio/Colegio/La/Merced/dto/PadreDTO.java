package com.Colegio.Colegio.La.Merced.dto;

public class PadreDTO {
    private Integer idPadre;
    private String nombre;
    private String apellido;
    private String telefono;
    private String dni;
    private String correo;

    public PadreDTO() {
    }

    public PadreDTO(Integer idPadre, String nombre, String apellido, String telefono, String dni, String correo) {
        this.idPadre = idPadre;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.dni = dni;
        this.correo = correo;
    }

    public Integer getIdPadre() {
        return idPadre;
    }

    public void setIdPadre(Integer idPadre) {
        this.idPadre = idPadre;
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

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }
}