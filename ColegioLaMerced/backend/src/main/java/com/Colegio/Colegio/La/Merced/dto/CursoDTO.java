package com.Colegio.Colegio.La.Merced.dto;

public class CursoDTO {
    private Integer idCurso;
    private String nombre;

    public CursoDTO() {
    }

    public CursoDTO(Integer idCurso, String nombre) {
        this.idCurso = idCurso;
        this.nombre = nombre;
    }

    public Integer getIdCurso() {
        return idCurso;
    }

    public void setIdCurso(Integer idCurso) {
        this.idCurso = idCurso;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}