package com.Colegio.Colegio.La.Merced.dto;

public class CursoUnicoDTO {
    private Integer idCursoUnico;
    private Float examen1;
    private Float examen2;
    private Float examen3;
    private Float examen4;
    private Float examenFinal;
    private Integer idSeccionCurso; 
    private Integer idAlumno;      
    public CursoUnicoDTO() {
    }

    public CursoUnicoDTO(Integer idCursoUnico, Float examen1, Float examen2, Float examen3, Float examen4, Float examenFinal, Integer idSeccionCurso, Integer idAlumno) {
        this.idCursoUnico = idCursoUnico;
        this.examen1 = examen1;
        this.examen2 = examen2;
        this.examen3 = examen3;
        this.examen4 = examen4;
        this.examenFinal = examenFinal;
        this.idSeccionCurso = idSeccionCurso;
        this.idAlumno = idAlumno;
    }

    public Integer getIdCursoUnico() {
        return idCursoUnico;
    }

    public void setIdCursoUnico(Integer idCursoUnico) {
        this.idCursoUnico = idCursoUnico;
    }

    public Float getExamen1() {
        return examen1;
    }

    public void setExamen1(Float examen1) {
        this.examen1 = examen1;
    }

    public Float getExamen2() {
        return examen2;
    }

    public void setExamen2(Float examen2) {
        this.examen2 = examen2;
    }

    public Float getExamen3() {
        return examen3;
    }

    public void setExamen3(Float examen3) {
        this.examen3 = examen3;
    }

    public Float getExamen4() {
        return examen4;
    }

    public void setExamen4(Float examen4) {
        this.examen4 = examen4;
    }

    public Float getExamenFinal() {
        return examenFinal;
    }

    public void setExamenFinal(Float examenFinal) {
        this.examenFinal = examenFinal;
    }

    public Integer getIdSeccionCurso() {
        return idSeccionCurso;
    }

    public void setIdSeccionCurso(Integer idSeccionCurso) {
        this.idSeccionCurso = idSeccionCurso;
    }

    public Integer getIdAlumno() {
        return idAlumno;
    }

    public void setIdAlumno(Integer idAlumno) {
        this.idAlumno = idAlumno;
    }

}