package com.Colegio.Colegio.La.Merced.dto;

public class CursoUnicoDTO {
    private Integer idCursoUnico;
    private float examen1;
    private float examen2;
    private float examen3;
    private float examen4;
    private float examenFinal;
    private Integer idSeccionCurso; 
    private Integer idAlumno;      
    public CursoUnicoDTO() {
    }

    public CursoUnicoDTO(Integer idCursoUnico, float examen1, float examen2, float examen3, float examen4, float examenFinal, Integer idSeccionCurso, Integer idAlumno) {
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

    public float getExamen1() {
        return examen1;
    }

    public void setExamen1(float examen1) {
        this.examen1 = examen1;
    }

    public float getExamen2() {
        return examen2;
    }

    public void setExamen2(float examen2) {
        this.examen2 = examen2;
    }

    public float getExamen3() {
        return examen3;
    }

    public void setExamen3(float examen3) {
        this.examen3 = examen3;
    }

    public float getExamen4() {
        return examen4;
    }

    public void setExamen4(float examen4) {
        this.examen4 = examen4;
    }

    public float getExamenFinal() {
        return examenFinal;
    }

    public void setExamenFinal(float examenFinal) {
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