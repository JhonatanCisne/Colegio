package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Examen")
public class Examen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Examen")
    private Integer idExamen;

    @Column(name = "ID_Alumno", nullable = false)
    private Integer idAlumno;

    @Column(name = "ID_Seccion_Curso", nullable = false)
    private Integer idSeccionCurso;

    @Column(name = "Num_Examen", nullable = false)
    private Integer numExamen;

    @Column(name = "Nota", nullable = false)
    private Double nota;

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
