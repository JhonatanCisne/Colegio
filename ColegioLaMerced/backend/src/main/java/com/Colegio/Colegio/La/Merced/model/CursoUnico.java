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
    private float examen1;

    @Column(name = "Examen2", nullable = true)
    private float examen2;
    
    @Column(name = "Examen3", nullable = true)
    private float examen3;

    @Column(name = "Examen4", nullable = true)
    private float examen4;

    @Column(name = "ExamenFinal", nullable = true)
    private float examenFinal;

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