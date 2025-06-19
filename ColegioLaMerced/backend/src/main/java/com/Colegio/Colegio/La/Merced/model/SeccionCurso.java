package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Seccion_Curso")
public class SeccionCurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Seccion_Curso")
    private Integer idSeccionCurso;

    @OneToOne
    @JoinColumn(name = "ID_Curso", referencedColumnName = "ID_Curso", nullable=false)
    private Curso curso;

    @OneToOne
    @JoinColumn(name="ID_Profesor", referencedColumnName = "ID_Profesor", nullable=false)
    private Profesor profesor;

    @OneToOne
    @JoinColumn(name = "ID_Seccion", referencedColumnName = "ID_Seccion", nullable=false)
    private Seccion seccion;

    public Integer getIdSeccionCurso(){
        return idSeccionCurso;
    }

    public void setIdSeccionCurso(Integer idSeccionCurso) {
        this.idSeccionCurso = idSeccionCurso;
    }

    public Curso getIdCurso() {
        return curso;
    }

    public void setIdCurso(Curso curso) {
        this.curso = curso;
    }

    public Profesor getIdProfesor() {
        return profesor;
    }

    public void setIdProfesor(Profesor profesor) {
        this.profesor = profesor;
    }

    public Seccion getIdSeccion() {
        return seccion;
    }

    public void setIdSeccion(Seccion seccion) {
        this.seccion = seccion;
    }

    @Override
    public String toString() {
        return "SeccionCurso{" +
                "idSeccionCurso=" + idSeccionCurso +
                ", idCurso=" + curso +
                ", idProfesor=" + profesor +
                ", idSeccion=" + seccion +
                '}';
    }

}
