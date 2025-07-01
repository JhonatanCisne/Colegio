package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Curso_Unico") 
public class CursoUnico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Curso_Unico")
    private Integer idCursoUnico;

    @Column(name = "Examen1", nullable = true)
    private Float examen1;

    @Column(name = "Examen2", nullable = true)
    private Float examen2;
    
    @Column(name = "Examen3", nullable = true)
    private Float examen3;

    @Column(name = "Examen4", nullable = true)
    private Float examen4;

    @Column(name = "Examenfinal", nullable = true)
    private Float examenFinal;

    @ManyToOne 
    @JoinColumn(name = "ID_Seccion_Curso", referencedColumnName = "ID_Seccion_Curso", nullable=false)
    private SeccionCurso seccionCurso;

    @ManyToOne 
    @JoinColumn(name = "ID_Alumno", referencedColumnName = "ID_Alumno", nullable=false)
    private Alumno alumno;

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

    public SeccionCurso getSeccionCurso() {
        return seccionCurso;
    }

    public void setSeccionCurso(SeccionCurso seccionCurso) {
        this.seccionCurso = seccionCurso;
    }

    public Alumno getAlumno() {
        return alumno;
    }

    public void setAlumno(Alumno alumno) {
        this.alumno = alumno;
    }
}