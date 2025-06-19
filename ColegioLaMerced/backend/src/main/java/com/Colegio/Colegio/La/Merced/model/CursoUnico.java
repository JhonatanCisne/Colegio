package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
    private float  examen3;

    @Column(name = "Examen4", nullable = true)
    private float examen4;

    @Column(name = "Examen_FInal", nullable = true)
    private float examenFinal;

    @ManyToOne 
    @JoinColumn(name = "ID_Seccion_Curso", referencedColumnName = "ID_Seccion_Curso", nullable=false)
    private Integer idSeccionCurso;

    @OneToOne 
    @JoinColumn(name = "ID_Alumno", referencedColumnName = "ID_Alumno", nullable=false)
    private Integer idAlumno;

    @ManyToOne 
    @JoinColumn(name = "ID_Horario", referencedColumnName = "ID_Horario", nullable=false)
    private Integer idHorario;
    
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

    public Integer getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Integer idHorario) {
        this.idHorario = idHorario;
    }

    @Override
    public String toString() {
        return "CursoUnico{" +
                "idCursoUnico=" + idCursoUnico +
                ", examen1=" + examen1 +
                ", examen2=" + examen2 +
                ", examen3=" + examen3 +
                ", examen4=" + examen4 +
                ", examenFinal=" + examenFinal +
                ", idSeccionCurso=" + idSeccionCurso +
                ", idAlumno=" + idAlumno +
                ", idHorario=" + idHorario +
                '}';
    }
}