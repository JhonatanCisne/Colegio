package com.Colegio.Colegio.La.Merced.dto;

public class AlumnoDTO {
    private Integer idAlumno;
    private Integer idPadre; // ID del Padre para la relación
    private String nombre;
    private String apellido;
    private String dni;
    private String correo;
    private String contrasena;

    public AlumnoDTO() {
    }

    public AlumnoDTO(Integer idAlumno, Integer idPadre, String nombre, String apellido, String dni, String correo, String contrasena) {
        this.idAlumno = idAlumno;
        this.idPadre = idPadre;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.correo = correo;
        this.contrasena = contrasena;
    }

    public Integer getIdAlumno() {
        return idAlumno;
    }

    public void setIdAlumno(Integer idAlumno) {
        this.idAlumno = idAlumno;
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

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}