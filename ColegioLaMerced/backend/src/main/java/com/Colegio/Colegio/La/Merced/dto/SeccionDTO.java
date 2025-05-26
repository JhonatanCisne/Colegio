package com.Colegio.Colegio.La.Merced.dto;

public class SeccionDTO {
    private Integer idSeccion;
    private String grado; 
    private String nombre;

    public SeccionDTO() {}

    public SeccionDTO(Integer idSeccion, String grado, String nombre) {
        this.idSeccion = idSeccion;
        this.grado = grado;
        this.nombre = nombre;
    }

    public Integer getIdSeccion() {
        return idSeccion;
    }

    public void setIdSeccion(Integer idSeccion) {
        this.idSeccion = idSeccion;
    }

    public String getGrado() {
        return grado;
    }

    public void setGrado(String grado) {
        this.grado = grado;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
