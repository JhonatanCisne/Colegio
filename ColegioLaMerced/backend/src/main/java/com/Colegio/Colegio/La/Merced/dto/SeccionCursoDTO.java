package com.Colegio.Colegio.La.Merced.dto;

public class SeccionCursoDTO {
    private Integer idSeccionCurso;
    private Integer idSeccion;
    private Integer idCurso;
    private Integer idProfesor;

    public SeccionCursoDTO() {}

    public SeccionCursoDTO(Integer idSeccionCurso, Integer idSeccion, Integer idCurso, Integer idProfesor) {
        this.idSeccionCurso = idSeccionCurso;
        this.idSeccion = idSeccion;
        this.idCurso = idCurso;
        this.idProfesor = idProfesor;
    }

    public Integer getIdSeccionCurso() {
        return idSeccionCurso;
    }

    public void setIdSeccionCurso(Integer idSeccionCurso) {
        this.idSeccionCurso = idSeccionCurso;
    }

    public Integer getIdSeccion() {
        return idSeccion;
    }

    public void setIdSeccion(Integer idSeccion) {
        this.idSeccion = idSeccion;
    }

    public Integer getIdCurso() {
        return idCurso;
    }

    public void setIdCurso(Integer idCurso) {
        this.idCurso = idCurso;
    }

    public Integer getIdProfesor() {
        return idProfesor;
    }

    public void setIdProfesor(Integer idProfesor) {
        this.idProfesor = idProfesor;
    }
}
