package com.Colegio.Colegio.La.Merced.dto;

public class SeccionCursoDTO {
    private Integer idSeccionCurso;
    private Integer idSeccion;
    private Integer idProfesor;
    private Integer idCurso;
    private Integer idHorario; // Nuevo campo para el ID del horario

    public SeccionCursoDTO() {
    }

    public SeccionCursoDTO(Integer idSeccionCurso, Integer idSeccion, Integer idProfesor, Integer idCurso, Integer idHorario) {
        this.idSeccionCurso = idSeccionCurso;
        this.idSeccion = idSeccion;
        this.idProfesor = idProfesor;
        this.idCurso = idCurso;
        this.idHorario = idHorario;
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

    public Integer getIdProfesor() {
        return idProfesor;
    }

    public void setIdProfesor(Integer idProfesor) {
        this.idProfesor = idProfesor;
    }

    public Integer getIdCurso() {
        return idCurso;
    }

    public void setIdCurso(Integer idCurso) {
        this.idCurso = idCurso;
    }

    public Integer getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Integer idHorario) {
        this.idHorario = idHorario;
    }
}