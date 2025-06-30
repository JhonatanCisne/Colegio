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
@Table(name = "Seccion_Curso")
public class SeccionCurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Seccion_Curso")
    private Integer idSeccionCurso;

    @ManyToOne
    @JoinColumn(name = "ID_Seccion", referencedColumnName = "ID_Seccion", nullable=false)
    private Seccion seccion;

    @ManyToOne
    @JoinColumn(name = "ID_Profesor", referencedColumnName = "ID_Profesor", nullable=true)
    private Profesor profesor;

    @ManyToOne
    @JoinColumn(name = "ID_Curso", referencedColumnName = "ID_Curso", nullable=false)
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "ID_Horario", referencedColumnName = "ID_Horario", nullable=true)
    private Horario horario;

    public Integer getIdSeccionCurso() {
        return idSeccionCurso;
    }

    public void setIdSeccionCurso(Integer idSeccionCurso) {
        this.idSeccionCurso = idSeccionCurso;
    }

    public Seccion getSeccion() {
        return seccion;
    }

    public void setSeccion(Seccion seccion) {
        this.seccion = seccion;
    }

    public Profesor getProfesor() {
        return profesor;
    }

    public void setProfesor(Profesor profesor) {
        this.profesor = profesor;
    }

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    public Horario getHorario() {
        return horario;
    }

    public void setHorario(Horario horario) {
        this.horario = horario;
    }
}