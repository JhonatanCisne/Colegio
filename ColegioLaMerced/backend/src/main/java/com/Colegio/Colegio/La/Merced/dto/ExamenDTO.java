package com.Colegio.Colegio.La.Merced.dto;

public class ExamenDTO {
    private Integer idExamen;
    private Integer idAlumno;
    private Integer idSeccionCurso;
    private Integer numExamen;
    private Double nota;

    public ExamenDTO() {}

    public ExamenDTO(Integer idExamen, Integer idAlumno, Integer idSeccionCurso, Integer numExamen, Double nota) {
        this.idExamen = idExamen;
        this.idAlumno = idAlumno;
        this.idSeccionCurso = idSeccionCurso;
        this.numExamen = numExamen;
        this.nota = nota;
    }

    public Integer getIdExamen() {
        return idExamen;
    }

    public void setIdExamen(Integer idExamen) {
        this.idExamen = idExamen;
    }

    public Integer getIdAlumno() {
        return idAlumno;
    }

    public void setIdAlumno(Integer idAlumno) {
        this.idAlumno = idAlumno;
    }

    public Integer getIdSeccionCurso() {
        return idSeccionCurso;
    }

    public void setIdSeccionCurso(Integer idSeccionCurso) {
        this.idSeccionCurso = idSeccionCurso;
    }

    public Integer getNumExamen() {
        return numExamen;
    }

    public void setNumExamen(Integer numExamen) {
        this.numExamen = numExamen;
    }

    public Double getNota() {
        return nota;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }
}
